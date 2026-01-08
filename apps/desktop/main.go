package main

import (
	"bytes"
	"crypto/md5"
	"embed"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/dhowden/tag"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	err := wails.Run(&options.App{
		Title:  "localStream",
		Width:  1324,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
			Middleware: func(next http.Handler) http.Handler {
				return &MyHandler{NextHandler: next}
			},
		},
		Linux: &linux.Options{
			WindowIsTranslucent: true,
		},
		Windows: &windows.Options{
			WindowIsTranslucent:  true,
			WebviewIsTransparent: true,
			BackdropType:         windows.Tabbed,
			Theme:                windows.Dark,
		},
		Mac: &mac.Options{
			WindowIsTranslucent:  true,
			WebviewIsTransparent: true,
			Appearance:           mac.NSAppearanceNameAccessibilityHighContrastVibrantDark,
		},
		OnStartup: app.onStartup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

type MyHandler struct {
	NextHandler http.Handler
}

// this could handle all types of request, i just care about accessing users files
func (h *MyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	reqPath := r.URL.Path

	if strings.HasPrefix(reqPath, "/files/") {
		getHandler(w, r)
		return
	}

	if strings.HasPrefix(reqPath, "/artwork/") {
		artworkHandler(w, r)
		return
	}

	h.NextHandler.ServeHTTP(w, r)
}

func getHandler(w http.ResponseWriter, r *http.Request) {
	// 1. Get the path from the URL.
	// If the URL is "/files/C:/Users/Me/Desktop/image.png"
	// This strips "/files/" (7 characters)
	filePath := r.URL.Path[7:]

	// 2. Open the file
	file, err := os.Open(filePath)
	if err != nil {
		http.Error(w, "File not found", 404)
		return
	}
	defer file.Close()

	// 3. Get file stats (needed for ServeContent)
	stats, err := file.Stat()
	if err != nil {
		http.Error(w, "Could not get file info", 500)
		return
	}

	// 4. THE MAGIC: http.ServeContent
	// This handles the Reader/Writer plumbing, streaming,
	// and mime-types automatically.
	http.ServeContent(w, r, filePath, stats.ModTime(), file)
}

func artworkHandler(w http.ResponseWriter, r *http.Request) {
	audioPath := r.URL.Path[9:]

	hash := fmt.Sprintf("%x", md5.Sum([]byte(audioPath)))
	cacheDir, cacheDirErr := os.UserCacheDir()

	if cacheDirErr != nil {
		servePlaceholder(w)
		return
	}

	cachePath := filepath.Join(cacheDir, "localStream", "art", hash)

	if info, err := os.Stat(cachePath); err == nil {
		f, err := os.Open(cachePath)
		if err != nil {
			servePlaceholder(w)
			return
		}
		defer f.Close()

		http.ServeContent(w, r, "cover", info.ModTime(), f)
		return
	}

	f, err := os.Open(audioPath)
	if err != nil {
		servePlaceholder(w)
		return
	}
	defer f.Close()
	m, err := tag.ReadFrom(f)
	if err != nil || m == nil || m.Picture() == nil {
		servePlaceholder(w)
		return
	}
	imageBytes := m.Picture().Data
	if len(imageBytes) == 0 {
		servePlaceholder(w)
		return
	}

	os.MkdirAll(filepath.Dir(cachePath), 0755)
	os.WriteFile(cachePath, m.Picture().Data, 0644)

	w.Header().Set("Content-type", m.Picture().MIMEType)
	http.ServeContent(w, r, "", time.Now(), bytes.NewReader(imageBytes))
}

func servePlaceholder(w http.ResponseWriter) {
	placeholder, err := assets.ReadFile("frontend/dist/placeholder.webp")
	if err != nil {
		http.Error(w, "Placeholder missing", 404)
		return
	}

	w.Header().Set("Content-Type", "image/webp")
	w.Header().Set("Cache-Control", "public, max-age=3600")
	w.Write(placeholder)
}
