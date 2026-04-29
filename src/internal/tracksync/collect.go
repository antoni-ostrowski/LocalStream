package tracksync

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"io/fs"
	"localStream/internal/database"
	"localStream/sqlcDb"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/google/uuid"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
	"go.senan.xyz/taglib"
)

func (s *TrackSyncMangaer) collectTracks(ctx context.Context, db *database.DBManager) ([]*sqlcDb.Track, error) {

	workersCount := 10

	wailsRuntime.LogInfof(ctx, "Starting track sync with %v workers", workersCount)

	sourceDirs := s.Config.Preferences.SourceDirs

	filePathCh := make(chan string)
	tracksCh := make(chan *sqlcDb.Track)
	errorCh := make(chan error, 1)

	var processWg sync.WaitGroup
	var collectWg sync.WaitGroup
	var allNewTracks []*sqlcDb.Track

	// consumer of incoming tracks from trackChn
	collectWg.Add(1)
	go func() {
		defer collectWg.Done()
		// keeps reading the chn
		for track := range tracksCh {
			allNewTracks = append(allNewTracks, track)
			wailsRuntime.EventsEmit(ctx, "tracksync", len(allNewTracks))
		}
	}()

	s.startWorkers(ctx, workersCount, filePathCh, tracksCh, errorCh, &processWg, db)

	s.startScanners(ctx, sourceDirs, filePathCh, errorCh, &processWg)

	// Dedicated goroutine to wait for all processing components to finish and close tracksCh
	go func() {
		processWg.Wait() // Wait for Scanners and Workers
		close(tracksCh)  // This unblocks the Collector
	}()

	// Monitor and Wait for Completion or Error (blocking)
	// any <- someCh, means wait for a value to be received from the specified channel
	// whole select statement blocks waiting for any case being ready
	// (if we dont specify default, if we do then select doesnt wait and runs the default and function continues)
	select {
	// here we wait for any error that is sent to the err chan, if we get it the case runs
	case err := <-errorCh:
		// unrecoverable error occurred, we can return immediately
		return nil, err
		// is simply waiting for that specific channel to be closed, which signals that the work should stop.
		// the ctx.Done read only channel will send a mess if there is a cencellation or timeout
	case <-ctx.Done():
		// Context cancelled or timeout, wait for the collector to finish draining
		// safely wait for any routines that were actively processing tracks and let them die safely
		for range tracksCh {
		}
		return allNewTracks, ctx.Err()
	//this is IIEF, runs immediately, created temp chan,
	// sets of a routine that blocks waiting for collecting routine to finish and closes temp chan
	// (the collector will only finish if after the tracksCh is closed so every track was processed) [end of the whole pipeline]
	// closing the done chan makes the 'case' ready unblocking the the main 'select', so this will hang/block here until the collector is done
	case <-func() chan struct{} {
		done := make(chan struct{})
		go func() {
			collectWg.Wait() // Wait for the Collector to finish (now unblocked by close(tracksCh))
			close(done)
		}()
		return done
	}():
		// this runs when the anon func unblocks (so when all tracks were processed without fatal err or ctx.Err)
		// just returns the results from thig whole func
		return allNewTracks, nil
	}
}

// startWorkers initializes and launches the worker pool (consumers).
func (s *TrackSyncMangaer) startWorkers(
	ctx context.Context,
	workersCount int,
	filePathCh <-chan string,
	tracksCh chan<- *sqlcDb.Track,
	errorCh chan<- error,
	processWg *sync.WaitGroup,
	db *database.DBManager,
) {
	for i := 0; i < workersCount; i++ {
		processWg.Add(1)
		// set of a processing routine
		go func(id int) {
			defer processWg.Done()
			// keep reading filePaths from chan and process them if theres no cancellations or timeouts
			for filePath := range filePathCh {
				select {
				// this checks for cancellation (can be anything, e.g tiemout)
				case <-ctx.Done():
					return
					// this starts the file processing
				default:
					track, err := s.processFile(ctx, filePath, db)
					if err != nil {
						// if its a 'light' err we contrinue to next filePath
						if os.IsNotExist(err) {
							continue
						}
						// if err is something fatal we stop whole pipeline
						select {
						case errorCh <- fmt.Errorf("worker %d fatal error processing %s: %w", id, filePath, err):
						default:
						}
						return
					}
					// if no errors processing the file, send the track obj to the channel
					tracksCh <- track

				}

			}
			fmt.Printf("\n worker %v is idle", id)

		}(i)

	}
}

//	fires source scanners (one routine for one source url, gets every possible tracks from source url)
//
// startScanners initializes and launches the source directory scanners (producers).
func (s *TrackSyncMangaer) startScanners(
	ctx context.Context,
	sourceDirs []string,
	filePathCh chan<- string,
	errorCh chan<- error,
	processWg *sync.WaitGroup,
) {
	// scanner parent routine will manage scanners and close the filePathCh if they are all done sending to the filePathCh
	processWg.Add(1)
	go func() {
		defer close(filePathCh) // Crucial: signals workers that no more paths are coming
		defer processWg.Done()

		// scanner wg keeps tracks of scanner routines
		scanWg := &sync.WaitGroup{}
		for _, dir := range sourceDirs {
			scanWg.Add(1)
			go func(dirPath string) {
				// start := time.Now()
				defer scanWg.Done()
				// 			// scans whole tree of files from the dirPath
				if err := s.scanSourceDirForFiles(ctx, dirPath, filePathCh); err != nil {
					select {
					case errorCh <- fmt.Errorf("scanner error for %s: %w", dirPath, err):
					default:
					}
					// duration := time.Since(start)
					// fmt.Printf("\n Scanned dir %v for %v", dirPath, duration)
				}
			}(dir)
			// passing explitly args to anon func ensuers
			// every routines starts with correct data
		}
		scanWg.Wait() // Wait for all individual scanners to finish
	}()
}

func (s *TrackSyncMangaer) scanSourceDirForFiles(ctx context.Context, root string, filePathChn chan<- string) error {
	isMusicFile := func(path string) bool {
		ext := filepath.Ext(path)
		return ext == ".mp3" || ext == ".flac" || ext == ".ogg"
	}

	// fmt.Printf("scan for  %s \n", root)
	if _, err := os.Stat(root); os.IsNotExist(err) {
		wailsRuntime.LogErrorf(ctx, "Root source dir doesnt exist %v", err)
		return fmt.Errorf("Root source dir doesnt exist")
	}

	// send a path to a filePathChn only if the file is music file and theres no errs
	err := filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		// fmt.Printf("walk over %s \n", path)
		if err != nil {
			wailsRuntime.LogErrorf(ctx, "Error accessing path %s: %v. Skipping \n", path, err)
			return nil
		}

		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		if !d.IsDir() && isMusicFile(path) {
			// fmt.Print("found a music file, sending to chan \n")
			filePathChn <- path
		}

		return nil
	})

	return err
}

func (s *TrackSyncMangaer) processFile(ctx context.Context, path string, db *database.DBManager) (*sqlcDb.Track, error) {
	track, err := db.Queries.GetTrackFromPath(ctx, path)

	if err == nil {
		// return track early if it already exists in db
		return &track, nil
	} else if errors.Is(err, sql.ErrNoRows) {
		tags, err := taglib.ReadTags(path)
		properties, err2 := taglib.ReadProperties(path)

		if err != nil || err2 != nil {
			return &sqlcDb.Track{}, fmt.Errorf("failed to get metadata %v", err)
		}

		return &sqlcDb.Track{
			Title:           GetFirstOr(tags[taglib.Title], "no title"),
			Album:           GetFirstOr(tags[taglib.Album], "no album"),
			Genre:           sql.NullString{String: GetFirstOr(tags[taglib.Genre], "no genre"), Valid: true},
			DurationSeconds: sql.NullInt64{Int64: int64(properties.Length.Seconds()), Valid: true},
			CreatedAt:       time.Now().Unix(),
			ID:              uuid.NewString(),
			Path:            path,
			Artist:          GetFirstOr(tags[taglib.Artist], "no artist"),
			Starred:         sql.NullInt64{},
			IsMissing:       sql.NullBool{Bool: false, Valid: true},
		}, nil

	} else {
		return &sqlcDb.Track{}, err
	}

}

// unwrap the first item from array or return fallback
func GetFirstOr[T any](values []T, defaultValue T) T {
	if len(values) > 0 {
		return values[0]
	}
	return defaultValue
}
