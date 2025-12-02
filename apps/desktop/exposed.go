package main

import (
	"errors"
	"localStream/internal/config"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) GetPreferences() (config.Preferences, error) {
	return a.config.Preferences, nil
}

func (a *App) UpdatePreferences(newPrefs config.Preferences) error {
	runtime.LogDebugf(a.ctx, "prefs from client - %v", newPrefs)
	err := a.config.UpdatePreferences(a.ctx, newPrefs)

	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to update runtime preferences: %v", err)
		return err
	}

	return nil
}

func (a *App) CreateSourceUrl() error {
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
	newSourceUrls := append([]string{}, currentPrefs.SourceUrls...)
	for _, existingDir := range newSourceUrls {
		if existingDir == selectedDir {
			runtime.LogWarningf(a.ctx, "Directory already added: %s", selectedDir)
			return errors.New("music source directory already exists")
		}
	}
	newSourceUrls = append(newSourceUrls, selectedDir)
	newPrefs.SourceUrls = newSourceUrls

	err = a.config.UpdatePreferences(a.ctx, newPrefs)

	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to update runtime preferences: %v", err)
		return err
	}

	return nil
}
