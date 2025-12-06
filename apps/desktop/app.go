package main

import (
	"context"
	_ "embed"
	"localStream/internal/config"
	"localStream/internal/database"
	"localStream/internal/playback"
	"localStream/internal/tracksync"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx         context.Context
	config      *config.RuntimeConfigManager
	db          *database.DBManager
	localPlayer *playback.LocalPlayer
}

func NewApp() *App {
	return &App{}
}

func (a *App) onDomReady(ctx context.Context) {
	a.ctx = ctx
	err := a.initAppResources()
	player := &playback.LocalPlayer{}
	player.Init()
	a.localPlayer = player
	if err != nil {
		a.handleAppResourceFailure()
		return
	}
	runtime.LogPrintf(a.ctx, "Prefs %v", a.config.Preferences)
}

//go:embed schema.sql
var ddl string

func (a *App) initAppResources() error {
	configManager := config.GetConfigInstance(a.ctx)
	if _, err := configManager.LoadConfig(a.ctx); err != nil {
		runtime.LogErrorf(a.ctx, "Failed to init app resources at config: %v", err)
		return err
	}

	a.config = configManager

	dbManager, err := database.NewDBManager(a.ctx, a.config.Preferences.DatabasePath)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to init app resources at db manager: %v", err)
		return err
	}

	if err := dbManager.InitSchema(a.ctx, ddl); err != nil {
		runtime.LogErrorf(a.ctx, "Failed to init app resources at db manager: %v", err)
		return err
	}

	a.db = dbManager

	trackSyncManager := &tracksync.TrackSyncMangaer{
		Config: a.config,
		Db:     a.db,
	}
	err = trackSyncManager.StartSync(a.ctx)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to init app resources at track sync %v", err)
		return err
	}

	runtime.LogInfo(a.ctx, "Successfully initialized app resources")
	return nil
}
func (a *App) handleAppResourceFailure() {
	runtime.MessageDialog(a.ctx,
		runtime.MessageDialogOptions{Message: "app failed to init. try clearing the config directory and restarting the app", Type: runtime.ErrorDialog, Title: "app failed to init",
			DefaultButton: "close app"})
	runtime.Quit(a.ctx)
}
