package main

import (
	"fmt"
	"localStream/internal/config"
	"localStream/sqlcDb"
)

func (a *App) GetPreferences() (config.Preferences, error) {
	return a.config.Preferences, nil
}

func (a *App) ListAllTracks() ([]sqlcDb.Track, error) {
	tracks, err := a.db.Queries.ListAllTracks(a.ctx)
	if err != nil {
		return []sqlcDb.Track{}, fmt.Errorf("Failed to get tracks: %v", err)
	}

	return tracks, nil
}

func (a *App) ListFavTracks() ([]sqlcDb.Track, error) {
	favTracks, err := a.db.Queries.ListFavTracks(a.ctx)
	if err != nil {
		return []sqlcDb.Track{}, fmt.Errorf("Failed to get favourite tracks: %v", err)
	}

	return favTracks, nil
}
