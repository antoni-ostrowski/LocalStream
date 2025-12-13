package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"localStream/sqlcDb"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.senan.xyz/taglib"
)

func (a *App) GetTrackArtwork(track sqlcDb.Track) (string, error) {
	imageBytes, err := taglib.ReadImage(track.Path)
	if err != nil {
		return "", fmt.Errorf("Failed to read image: %v", err)
	}
	if imageBytes == nil {
		return "", fmt.Errorf("Failed to read image: %v", err)
	}

	_, format, err := image.Decode(bytes.NewReader(imageBytes))
	if err != nil {
		runtime.LogErrorf(a.ctx, "Error decoding image to find format: %v", err)
		format = "jpeg"
	}

	mimeType := fmt.Sprintf("image/%s", format)
	if format == "gif" {
		mimeType = "image/gif"
	} else if format == "jpeg" || format == "jpg" {
		mimeType = "image/jpeg"
	}

	base64String := base64.StdEncoding.EncodeToString(imageBytes)

	dataURI := fmt.Sprintf("data:%s;base64,%s", mimeType, base64String)

	return dataURI, nil
}

func (a *App) GetCurrentTrack() (sqlcDb.Track, error) {
	currentTrackId := a.localPlayer.GetCurrentTrackId(a.ctx)

	currentTrack, err := a.db.Queries.GetTrackFromId(a.ctx, currentTrackId)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to get current track: %v", err)
		return sqlcDb.Track{}, fmt.Errorf("Failed to get current track: %v", err)
	}

	return currentTrack, nil
}

func (a *App) GetPlaybackState() error {
	// if err != nil {
	// 	runtime.LogErrorf(a.ctx, "Failed to get current track: %v", err)
	// 	return sqlcDb.Track{}, fmt.Errorf("Failed to get current track: %v", err)
	// }

	return nil
}

func (a *App) PlayTrack(track sqlcDb.Track) error {
	runtime.LogInfof(a.ctx, "Trying to play track - %v", track.Title)
	_, err := a.localPlayer.PlayNow(a.ctx, track.ID, track.Path)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to start playback: %v", err)
		return fmt.Errorf("Failed to start playback: %v", err)
	}

	return nil
}

func (a *App) PauseResume() {
	runtime.LogInfof(a.ctx, "Trying to pause resume")
	a.localPlayer.PauseResume()
}

func (a *App) AppendToQueue(track sqlcDb.Track) error {
	runtime.LogInfo(a.ctx, "Adding to queue")
	err := a.localPlayer.AppendToQueue(a.ctx, track)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to add to queue: %v", err)
		return fmt.Errorf("Failed to add to queue: %v", err)
	}

	return nil
}

func (a *App) PrependToQueue(track sqlcDb.Track) error {
	runtime.LogInfo(a.ctx, "prepenign to queue")
	err := a.localPlayer.PrependToQueue(a.ctx, track)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to add to queue: %v", err)
		return fmt.Errorf("Failed to add to queue: %v", err)
	}

	return nil
}

func (a *App) DeleteFromQueue(track sqlcDb.Track) error {
	err := a.localPlayer.DeleteFromQueue(a.ctx, track)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to delete from queue: %v", err)
		return fmt.Errorf("Failed to delete from queue: %v", err)
	}

	return nil
}

func (a *App) ListQueue() ([]sqlcDb.Track, error) {
	currentQueuePlayables := a.localPlayer.ListQueue(a.ctx)
	currentQueueTracks := make([]sqlcDb.Track, 0, len(currentQueuePlayables))

	for _, value := range currentQueuePlayables {
		track, err := a.db.Queries.GetTrackFromId(a.ctx, value.TrackId)
		if err != nil {
			return currentQueueTracks, fmt.Errorf("Failed to get track - %v", err)
		}
		currentQueueTracks = append(currentQueueTracks, track)
	}

	return currentQueueTracks, nil
}
