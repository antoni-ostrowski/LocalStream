package preferences

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Preferences struct {
	DatabasePath string `json:"databasePath"`
}

const AppName = "localStream"
const ConfigFileName = "config.json"

func GetConfigFilePath(ctx context.Context) (string, error) {
	var configBaseDir string
	xdgConfigHome := os.Getenv("XDG_CONFIG_HOME")

	if xdgConfigHome != "" {
		configBaseDir = xdgConfigHome
		runtime.LogInfof(ctx, "Using XDG_CONFIG_HOME: %s", configBaseDir)
	} else {
		// 2. Fall back to the default XDG location: $HOME/.config
		homeDir, err := os.UserHomeDir()
		if err != nil {
			runtime.LogErrorf(ctx, "Failed to find user home dir: %v", err)
			return "", err
		}

		configBaseDir = filepath.Join(homeDir, ".config")
		runtime.LogInfof(ctx, "Using default XDG config path: %s", configBaseDir)
	}

	appConfigDir := filepath.Join(configBaseDir, AppName)

	_, err := os.Stat(appConfigDir)

	if err != nil {
		if os.IsNotExist(err) {
			runtime.LogInfof(ctx, "App config dir not found, creating...: %s", appConfigDir)
			if err := os.MkdirAll(appConfigDir, 0755); err != nil {
				runtime.LogErrorf(ctx, "Failed to create application config directory: %v", err)
				return "", err
			}
		} else {
			runtime.LogErrorf(ctx, "Failed to resolve config directory: %v", err)
			return "", err
		}

	}

	configFilePath := filepath.Join(appConfigDir, ConfigFileName)
	runtime.LogInfof(ctx, "Resolved config file path: %s", configFilePath)

	return configFilePath, nil
}

func GetPreferencesFromConfigFile(ctx context.Context, configFilePath string) (Preferences, error) {
	var preferences Preferences
	fileContent, err := os.ReadFile(configFilePath)

	if err != nil {
		if os.IsNotExist(err) {
			runtime.LogErrorf(ctx, "Config file not found, creating config file...: %v", err)
			return handleCreatingDefaultConfig(ctx, configFilePath)
		}

		runtime.LogErrorf(ctx, "Failed to read config file: %v", err)
		return Preferences{}, err
	}

	err = json.Unmarshal(fileContent, &preferences)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to parse config file: %v", err)
		return Preferences{}, err
	}

	runtime.LogInfof(ctx, "Successfully loaded config. DatabasePath: %s", preferences.DatabasePath)

	return preferences, nil
}

func handleCreatingDefaultConfig(ctx context.Context, configFilePath string) (Preferences, error) {
	defaultPreferencesStruct := createDefaultPreferences(configFilePath)
	if err := writeDefaultPreferencesToConfigFile(ctx, configFilePath, defaultPreferencesStruct); err != nil {
		runtime.LogErrorf(ctx, "Failed to create config file: %v", err)
		return Preferences{}, err
	}
	runtime.LogInfo(ctx, "Successfully created default config file")
	return defaultPreferencesStruct, nil
}

func createDefaultPreferences(configFilePath string) Preferences {
	defaultDBPath := filepath.Join(filepath.Dir(configFilePath), "localStream.sqlite")

	return Preferences{
		DatabasePath: defaultDBPath,
	}
}

func writeDefaultPreferencesToConfigFile(ctx context.Context, configFilePath string, defaultPreferencesStruct Preferences) error {
	jsonContent, err := json.MarshalIndent(defaultPreferencesStruct, "", "  ")
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to marshal default preferences to JSON: %v", err)
		return err
	}

	jsonContent = append(jsonContent, '\n')

	err = os.WriteFile(configFilePath, jsonContent, 0644)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to create default config file: %v", err)
		return err
	}

	return nil
}
