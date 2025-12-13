package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"localStream/internal/playback"
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

func (a *App) GetCurrent() (playback.Playable, error) {
	playable, err := a.localPlayer.GetCurrent(a.ctx)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to get current track: %v", err)
		return playback.Playable{}, fmt.Errorf("Failed to get current track: %v", err)
	}

	return playable, nil
}

func (a *App) PlayTrack(track sqlcDb.Track) (playback.Playable, error) {
	playable, err := a.localPlayer.Play(track)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to start playback: %v", err)
		return playback.Playable{}, fmt.Errorf("Failed to start playback: %v", err)
	}

	return playable, nil
}

func (a *App) PauseResume() playback.Playable {
	playable := a.localPlayer.PauseResume()
	return playable
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

func (a *App) DeleteFromQueue(trackIndex int) error {
	err := a.localPlayer.DeleteFromQueue(a.ctx, trackIndex)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to delete from queue: %v", err)
		return fmt.Errorf("Failed to delete from queue: %v", err)
	}

	return nil
}

func (a *App) ListQueue() ([]sqlcDb.Track, error) {
	queueTracks, err := a.localPlayer.ListQueue(a.ctx)
	if err != nil {
		return []sqlcDb.Track{}, fmt.Errorf("Failed to list queue: %v", err)
	}
	queueWithoutCurrent := queueTracks[1:]
	return queueWithoutCurrent, nil
}
