package main

import (
	"database/sql"
	"fmt"
	"localStream/internal/config"
	"localStream/sqlcDb"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) GetPreferences() (config.Preferences, error) {
	return a.config.Preferences, nil
}

func (a *App) ListAllTracks() ([]sqlcDb.Track, error) {
	runtime.LogInfo(a.ctx, "trying list all tracks")
	tracks, err := a.db.Queries.ListAllTracks(a.ctx)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Printf("No tracks in list all tracks")
			return []sqlcDb.Track{}, nil
		}
		return []sqlcDb.Track{}, fmt.Errorf("Failed to get tracks: %v", err)
	}

	return tracks, nil
}

func (a *App) ListFavTracks() ([]sqlcDb.Track, error) {
	runtime.LogInfo(a.ctx, "trying list fav tracks")
	favTracks, err := a.db.Queries.ListFavTracks(a.ctx)
	if err != nil {
		return []sqlcDb.Track{}, fmt.Errorf("Failed to get favourite tracks: %v", err)
	}

	return favTracks, nil
}
