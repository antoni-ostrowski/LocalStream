package config

import (
	"context"
	"localStream/preferences"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type RuntimeConfigManager struct {
	mutex       sync.RWMutex
	Preferences preferences.Preferences
}

var configInstance *RuntimeConfigManager
var once sync.Once

func GetConfigInstance(ctx context.Context) *RuntimeConfigManager {
	once.Do(func() { initConfig((ctx)) })
	return configInstance
}

func initConfig(ctx context.Context) {
	configInstance = &RuntimeConfigManager{}
	runtime.LogPrint(ctx, "In-memory config Initialized successfully")
}

func (c *RuntimeConfigManager) LoadConfig(ctx context.Context) (preferences.Preferences, error) {
	configFilePath, err := preferences.GetConfigFilePath(ctx)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to load config at config file path: %v", err)
		return preferences.Preferences{}, err
	}

	prefs, err := preferences.GetPreferencesFromConfigFile(ctx, configFilePath)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to load config at getting preferences: %v", err)
		return preferences.Preferences{}, err
	}

	runtime.LogInfo(ctx, "Successfully loaded config from file")

	c.Preferences = prefs

	return prefs, nil
}
