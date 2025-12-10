package tracksync

import (
	"context"
	"database/sql"
	"fmt"
	"localStream/sqlcDb"
)

func (s *TrackSyncMangaer) SyncTracksWithDb(ctx context.Context, tracks []sqlcDb.Track) error {
	allDbTracks, err := s.Db.Queries.ListAllTracks(ctx)
	if err != nil {
		return fmt.Errorf("Failed to query %v", err)
	}

	toInsert, toUpdate, toMarkMissing := s.compareTracksAndGenerateActions(allDbTracks, tracks)

	tx, err := s.Db.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	qtx := s.Db.Queries.WithTx(tx)

	insertErr := s.handleInserts(ctx, toInsert, qtx)
	if insertErr != nil {
		return insertErr
	}

	updateErr := s.handleUpdates(ctx, toUpdate, qtx)
	if updateErr != nil {
		return updateErr
	}

	markingErr := s.handleMarkingMisses(ctx, toMarkMissing, qtx)
	if markingErr != nil {
		return markingErr
	}

	txCommitErr := tx.Commit()
	if txCommitErr != nil {
		return fmt.Errorf("Failed to commit tx - %v", txCommitErr)
	}

	return nil
}

func (s *TrackSyncMangaer) compareTracksAndGenerateActions(dbTracks []sqlcDb.Track, localTracks []sqlcDb.Track) (toInsert, toUpdate, toMarkMissing []sqlcDb.Track) {

	dbTrackMap := make(map[string]sqlcDb.Track, len(dbTracks))
	for _, track := range dbTracks {
		dbTrackMap[track.Path] = track
	}

	// fmt.Printf("\nDb tracks  - \n %v", dbTracks)
	// fmt.Printf("\n Local  tracks  - \n %v", localTracks)

	for _, localTrack := range localTracks {
		dbTrack, existsInDB := dbTrackMap[localTrack.Path]

		if !existsInDB {
			toInsert = append(toInsert, localTrack)
		} else {
			metadataChanged := dbTrack.Title != localTrack.Title
			wasMissing := dbTrack.IsMissing.Valid && dbTrack.IsMissing.Bool == true

			if metadataChanged || wasMissing {
				localTrack.ID = dbTrack.ID

				localTrack.IsMissing = sql.NullBool{Bool: false, Valid: true}

				toUpdate = append(toUpdate, localTrack)
			}

			delete(dbTrackMap, localTrack.Path)
		}
	}
	for _, missingTrack := range dbTrackMap {
		if !missingTrack.IsMissing.Valid || !missingTrack.IsMissing.Bool {
			toMarkMissing = append(toMarkMissing, missingTrack)
		}
	}

	return toInsert, toUpdate, toMarkMissing
}

func (s *TrackSyncMangaer) handleInserts(ctx context.Context, toInsert []sqlcDb.Track, qtx *sqlcDb.Queries) error {
	for _, itemToInsert := range toInsert {
		fmt.Printf("attemtping to insert %v", itemToInsert.Title)
		err := qtx.InsertTrack(ctx, sqlcDb.InsertTrackParams(itemToInsert))
		if err != nil {
			return fmt.Errorf("Failed to insert track - %s, %v", itemToInsert.Title, err)
		}
	}
	return nil
}

func (s *TrackSyncMangaer) handleUpdates(ctx context.Context, toUpdate []sqlcDb.Track, qtx *sqlcDb.Queries) error {
	for _, itemToUpdate := range toUpdate {
		fmt.Printf("attemtping to update %v", itemToUpdate.Title)
		err := qtx.UpdateTrack(ctx, sqlcDb.UpdateTrackParams{
			ID:           itemToUpdate.ID,
			Title:        itemToUpdate.Title,
			Artist:       itemToUpdate.Artist,
			Year:         itemToUpdate.Year,
			Album:        itemToUpdate.Album,
			DurationInMs: itemToUpdate.DurationInMs,
			Genre:        itemToUpdate.Genre,
			IsMissing:    itemToUpdate.IsMissing,
		})

		if err != nil {
			return fmt.Errorf("Failed to update track - %s, %v", itemToUpdate.Title, err)
		}
	}
	return nil
}

func (s *TrackSyncMangaer) handleMarkingMisses(ctx context.Context, toMark []sqlcDb.Track, qtx *sqlcDb.Queries) error {

	for _, itemToMark := range toMark {
		err := qtx.UpdateTrack(ctx, sqlcDb.UpdateTrackParams{
			ID:           itemToMark.ID,
			Title:        itemToMark.Title,
			Artist:       itemToMark.Artist,
			Year:         itemToMark.Year,
			Album:        itemToMark.Album,
			DurationInMs: itemToMark.DurationInMs,
			Genre:        itemToMark.Genre,
			IsMissing:    sql.NullBool{Bool: true, Valid: true},
		})

		if err != nil {
			return fmt.Errorf("Failed to mark track track - %s, %v", itemToMark.Title, err)
		}
	}
	return nil
}
