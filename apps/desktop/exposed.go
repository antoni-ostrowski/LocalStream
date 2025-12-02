package main

import (
	"localStream/internal/config"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) UpdatePreferences(newPrefs config.Preferences) error {
	err := a.config.UpdatePreferences(a.ctx, newPrefs)

	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to update runtime preferences: %v", err)
		return err
	}

	return nil
}
