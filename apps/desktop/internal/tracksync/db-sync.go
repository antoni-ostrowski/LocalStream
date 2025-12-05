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

	fmt.Printf("\n this is the stuff to add to db \n %v", toInsert)
	for i := 0; i < len(toInsert); i++ {
		itemToInsert := toInsert[i]
		fmt.Printf("attemtping to insert %v", itemToInsert.Title)
		qtx.InsertTrack(ctx, sqlcDb.InsertTrackParams(itemToInsert))
	}

	fmt.Printf("\n this is the stuff to modify db \n %v", toUpdate)

	for i := 0; i < len(toUpdate); i++ {
		itemToUpdate := toUpdate[i]
		fmt.Printf("attemtping to update %v", itemToUpdate.Title)
		qtx.UpdateTrack(ctx, sqlcDb.UpdateTrackParams{
			ID:           itemToUpdate.ID,
			Title:        itemToUpdate.Title,
			Artist:       itemToUpdate.Artist,
			Year:         itemToUpdate.Year,
			Album:        itemToUpdate.Album,
			DurationInMs: itemToUpdate.DurationInMs,
			Genre:        itemToUpdate.Genre,
			IsMissing:    itemToUpdate.IsMissing,
		})
	}

	fmt.Printf("\n this is the stuff to to mark missing db \n %v", toMarkMissing)

	for i := 0; i < len(toMarkMissing); i++ {
		itemToMark := toMarkMissing[i]
		fmt.Printf("\nattemtping to mark as missing %v\n", itemToMark.Title)
		qtx.UpdateTrack(ctx, sqlcDb.UpdateTrackParams{
			ID:           itemToMark.ID,
			Title:        itemToMark.Title,
			Artist:       itemToMark.Artist,
			Year:         itemToMark.Year,
			Album:        itemToMark.Album,
			DurationInMs: itemToMark.DurationInMs,
			Genre:        itemToMark.Genre,
			IsMissing:    sql.NullBool{Bool: true, Valid: true},
		})
	}

	err = tx.Commit()
	if err != nil {
		fmt.Errorf("Failed to commit tx - %v", err)
		return err
	}
	return nil
}

func (s *TrackSyncMangaer) compareTracksAndGenerateActions(dbTracks []sqlcDb.Track, localTracks []sqlcDb.Track) (toInsert, toUpdate, toMarkMissing []sqlcDb.Track) {

	dbTrackMap := make(map[string]sqlcDb.Track, len(dbTracks))
	for _, track := range dbTracks {
		dbTrackMap[track.Path] = track
	}

	fmt.Printf("\nDb tracks  - \n %v", dbTracks)
	fmt.Printf("\n Local  tracks  - \n %v", localTracks)

	for _, localTrack := range localTracks {
		dbTrack, existsInDB := dbTrackMap[localTrack.Path]

		if !existsInDB {
			// A. INSERT: Local track is not in the DB
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
