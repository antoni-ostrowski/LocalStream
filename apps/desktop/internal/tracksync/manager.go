package tracksync

import (
	"context"
	"localStream/internal/config"
	"localStream/internal/database"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type TrackSyncMangaer struct {
	Config *config.RuntimeConfigManager
	Db     *database.DBManager
}

func (s *TrackSyncMangaer) StartSync(ctx context.Context) error {
	start := time.Now()
	runtime.LogInfo(ctx, "Starting track collection process")
	tracksStart := time.Now()
	tracks, err := s.collectTracks(ctx, s.Db)
	if err != nil {
		runtime.LogErrorf(ctx, "Tracks collector failed %v", err)
		return err
	}
	tracksDuration := time.Since(tracksStart)

	runtime.LogInfo(ctx, "Starting track db sync")
	dbStart := time.Now()
	err = s.SyncTracksWithDb(ctx, tracks)
	if err != nil {
		runtime.LogErrorf(ctx, "Tracks collector failed %v", err)
		return err
	}

	dbDuration := time.Since(dbStart)

	duration := time.Since(start)
	runtime.LogInfof(ctx, "COLLECTING TRACKS TOOK %v seconds (%v minutes)", tracksDuration.Seconds(), tracksDuration.Minutes())
	runtime.LogInfof(ctx, "DATABASE SYNC TOOK %v seconds (%v minutes)", dbDuration.Seconds(), dbDuration.Minutes())
	runtime.LogInfof(ctx, "HANDLING TRACKES TOOK %v seconds (%v minutes)", duration.Seconds(), duration.Minutes())

	return nil
}
