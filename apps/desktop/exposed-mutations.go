package main

import (
	"database/sql"
	"errors"
	"fmt"
	"localStream/internal/config"
	"localStream/sqlcDb"
	"time"

	"github.com/google/uuid"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) UpdatePreferences(newPrefs config.Preferences) error {
	runtime.LogDebugf(a.ctx, "prefs from client - %v", newPrefs)
	err := a.config.UpdatePreferences(a.ctx, newPrefs)

	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to update runtime preferences: %v", err)
		return err
	}

	a.ReloadAppResources()

	return nil
}

func (a *App) CreateSourceDir() error {
	selectedDir, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select directory with your music.",
	})

	if selectedDir == "" {
		return errors.New("No directory provided!")
	}

	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to select file from dialog: %v", err)
		return err
	}

	runtime.LogDebugf(a.ctx, "selected dir from dialog - %v", selectedDir)
	currentPrefs := a.config.Preferences
	newPrefs := currentPrefs
	newSourceDirs := append([]string{}, currentPrefs.SourceDirs...)
	for _, existingDir := range newSourceDirs {
		if existingDir == selectedDir {
			runtime.LogWarningf(a.ctx, "Directory already added: %s", selectedDir)
			return errors.New("music source directory already exists")
		}
	}
	newSourceDirs = append(newSourceDirs, selectedDir)
	newPrefs.SourceDirs = newSourceDirs

	err = a.config.UpdatePreferences(a.ctx, newPrefs)

	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to update runtime preferences: %v", err)
		return err
	}

	a.ReloadAppResources()

	return nil
}

func (a *App) ReloadAppResources() error {
	err := a.initAppResources()
	if err != nil {
		a.handleAppResourceFailure()
		return err
	}
	return nil
}

func (a *App) StarTrack(track sqlcDb.Track) error {
	if track.Starred.Valid {
		err := a.db.Queries.UnStarTrack(a.ctx, track.ID)
		if err != nil {
			return fmt.Errorf("Failed to un star track: %v", err)
		}
		return nil
	} else {
		err := a.db.Queries.StarTrack(a.ctx, track.ID)
		if err != nil {
			return fmt.Errorf("Failed to star track: %v", err)
		}
		return nil
	}
}

func (a *App) SelectPlaylistCoverFile() (string, error) {
	path, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{Title: "select playlist img", Filters: []runtime.FileFilter{
		{
			DisplayName: "Image Files (*.jpg, *.png, *.webp)",
			Pattern:     "*.jpg;*.jpeg;*.png;*.webp",
		},
	}})
	if err != nil {
		return "", fmt.Errorf("Failed to select playlist cover %v", err)
	}

	return path, nil

}

func (a *App) CreatePlaylist(name string, coverPath string) (sqlcDb.Playlist, error) {
	runtime.LogInfo(a.ctx, "trying to create playlist")
	createdPlaylist, err := a.db.Queries.CreatePlaylist(a.ctx, sqlcDb.CreatePlaylistParams{
		CreatedAt: time.Now().Unix(),
		Name:      name,
		CoverPath: sql.NullString{String: coverPath, Valid: len(coverPath) > 0},
		ID:        uuid.NewString(),
	})
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to create playlist %v", err)
		return sqlcDb.Playlist{}, fmt.Errorf("Failed to create playlist %v", err)
	}
	return createdPlaylist, nil
}

func (a *App) StarPlaylist(playlistId string) (sqlcDb.Playlist, error) {
	playlist, err := a.db.Queries.GetPlaylist(a.ctx, playlistId)
	if err != nil {
		return sqlcDb.Playlist{}, fmt.Errorf("Failed to get the playlist %v", err)
	}
	runtime.LogInfo(a.ctx, "trying to star playlist")
	var newStarredValue sql.NullInt64

	runtime.LogInfof(a.ctx, "current %v", playlist.Starred)
	if playlist.Starred.Valid {
		newStarredValue = sql.NullInt64{Int64: 0, Valid: false}
	} else {
		newStarredValue = sql.NullInt64{Int64: time.Now().Unix(), Valid: true}
	}

	runtime.LogInfof(a.ctx, "new %v", newStarredValue)

	newPlaylistState, err := a.db.Queries.EditPlaylist(a.ctx, sqlcDb.EditPlaylistParams{ID: playlistId, Name: playlist.Name, CoverPath: playlist.CoverPath, Starred: newStarredValue})
	if err != nil {
		return sqlcDb.Playlist{}, fmt.Errorf("Failed to update playlist data %v", err)
	}
	return newPlaylistState, nil

}
func (a *App) DeletePlaylist(playlistId string) error {
	err := a.db.Queries.DeletePlaylist(a.ctx, playlistId)
	if err != nil {
		return fmt.Errorf("Failed to delete playlist %v", err)
	}
	return nil
}

func (a *App) AddTrackToPlaylist(trackId string, playlistId string) error {
	err := a.db.Queries.AddTrackToPlaylist(a.ctx, sqlcDb.AddTrackToPlaylistParams{
		ID:         uuid.NewString(),
		CreatedAt:  time.Now().Unix(),
		TrackID:    trackId,
		PlaylistID: playlistId,
	})
	if err != nil {
		return fmt.Errorf("Failed to add to playlist %v", err)
	}
	return nil
}

func (a *App) DeleteTrackFromPlaylist(trackId string, playlistId string) error {
	err := a.db.Queries.RemoveTrackFromPlaylist(a.ctx, sqlcDb.RemoveTrackFromPlaylistParams{
		TrackID:    trackId,
		PlaylistID: playlistId,
	})
	if err != nil {
		return fmt.Errorf("Failed to remove from playlist %v", err)
	}
	return nil
}
