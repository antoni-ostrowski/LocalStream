package main

import (
	"bytes"
	"embed"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"go.senan.xyz/taglib"
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
	// 1. Get the MP3 path from the URL (stripping "/artwork/")
	audioPath := r.URL.Path[9:]

	// 1. Try to read the image
	imageBytes, err := taglib.ReadImage(audioPath)

	// 2. If error or no bytes, redirect or serve the placeholder
	if err != nil || imageBytes == nil {
		// 1. Manually load the placeholder from your embedded assets
		// Make sure the path matches your embed structure exactly
		placeholder, err := assets.ReadFile("frontend/dist/placeholder.webp")
		if err != nil {
			http.Error(w, "Placeholder missing", 404)
			return
		}

		// 2. Set the correct headers so WebKit knows it's an image
		w.Header().Set("Content-Type", "image/webp")
		w.Header().Set("Cache-Control", "public, max-age=3600")
		w.Write(placeholder)
		return
	}

	// 3. Serve the content
	// We use time.Now() for ModTime because the artwork is dynamic/embedded.
	// http.ServeContent automatically detects the mime-type (image/jpeg, etc)
	// from the byte signature.
	http.ServeContent(w, r, "artwork.jpg", time.Now(), bytes.NewReader(imageBytes))
}
