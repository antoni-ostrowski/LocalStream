package main

import (
	"context"
	"localStream/config"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Greet(someNum int) string {
	runtime.LogPrint(a.ctx, "testing log print")
	return "fdjskl"
}

func (a *App) InitAppResources() error {
	config.GetConfigInstance(a.ctx)
	preferences, err := a.LoadConfig()
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to init app resources: %v", err)
		return err
	}
	config.SetConfigsPreferences(a.ctx, preferences)

	runtime.LogInfo(a.ctx, "Successfully initialized app resources")
	runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{Message: "App loaded config successfully"})

	return nil
}

func (a *App) LoadConfig() (config.Preferences, error) {
	configFilePath, err := config.GetConfigFilePath(a.ctx)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to load config at config file path: %v", err)
		return config.Preferences{}, err
	}

	preferences, err := config.GetPreferencesFromConfigFile(a.ctx, configFilePath)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to load config at getting preferences: %v", err)
		return config.Preferences{}, err
	}

	runtime.LogInfo(a.ctx, "Successfully loaded config from file")

	return preferences, nil
}
