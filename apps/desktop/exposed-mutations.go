package main

import (
	"errors"
	"fmt"
	"localStream/internal/config"
	"localStream/sqlcDb"

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
		// go events.EmitQueueUpdated(a.ctx)
		// go events.EmitCurrentPlayingUpdated(a.ctx)
		// go events.EmitAnyTrackInfoUpdated(a.ctx)
		return nil
	} else {
		err := a.db.Queries.StarTrack(a.ctx, track.ID)
		if err != nil {
			return fmt.Errorf("Failed to star track: %v", err)
		}
		// go events.EmitQueueUpdated(a.ctx)
		// go events.EmitCurrentPlayingUpdated(a.ctx)
		// go events.EmitAnyTrackInfoUpdated(a.ctx)
		return nil
	}
}
