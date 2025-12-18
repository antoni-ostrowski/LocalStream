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

func (a *App) GetDefaultPreferences() (config.Preferences, error) {
	_, configFilePath, err := config.GetConfigFilePath(a.ctx)
	if err != nil {
		return config.Preferences{}, fmt.Errorf("Failed to get default preferences")
	}
	defaultPreferences := config.CreateDefaultPreferences(configFilePath)
	return defaultPreferences, nil
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

func (a *App) GetTrackById(trackId string) (sqlcDb.Track, error) {
	track, err := a.db.Queries.GetTrackFromId(a.ctx, trackId)
	if err != nil {
		return sqlcDb.Track{}, fmt.Errorf("Failed to find track with that id %v %v", trackId, err)
	}
	return track, nil
}
