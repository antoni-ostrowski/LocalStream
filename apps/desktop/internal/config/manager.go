package config

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type RuntimeConfigManager struct {
	mutex          sync.RWMutex
	Preferences    Preferences
	ConfigDirPath  string
	ConfigFilePath string
}

var configInstance *RuntimeConfigManager
var once sync.Once

func GetConfigInstance(ctx context.Context) *RuntimeConfigManager {
	once.Do(func() { initConfig((ctx)) })
	return configInstance
}

func initConfig(ctx context.Context) {
	configInstance = &RuntimeConfigManager{}
	runtime.LogInfo(ctx, "In-memory config Initialized successfully")
}

func (c *RuntimeConfigManager) LoadConfig(ctx context.Context) (Preferences, error) {
	configDirPath, configFilePath, err := GetConfigFilePath(ctx)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to load config at config file path: %v", err)
		return Preferences{}, err
	}

	prefs, err := GetPreferencesFromConfigFile(ctx, configFilePath)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to load config at getting preferences: %v", err)
		return Preferences{}, err
	}

	runtime.LogInfo(ctx, "Successfully loaded config from file")

	c.mutex.Lock()
	defer c.mutex.Unlock()
	c.ConfigFilePath = configFilePath
	c.ConfigDirPath = configDirPath
	c.Preferences = prefs

	return prefs, nil
}

func (c *RuntimeConfigManager) UpdatePreferences(ctx context.Context, newPrefs Preferences) error {
	c.mutex.Lock()
	defer c.mutex.Unlock()

	newPrefsJson, err := json.MarshalIndent(newPrefs, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal new preferences: %w", err)
	}

	runtime.LogInfof(ctx, "config file path - %v", c.ConfigFilePath)
	err = os.WriteFile(c.ConfigFilePath, newPrefsJson, 0644)
	if err != nil {
		return fmt.Errorf("failed to write new config to file: %w", err)
	}

	c.Preferences = newPrefs
	runtime.LogInfof(ctx, "new prefs %v", newPrefs)

	return nil
}
