package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	"localStream/internal/playback"
	"localStream/sqlcDb"

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
		fmt.Println("Error decoding image to find format:", err)
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
	playable, err := a.localPlayer.GetCurrent()
	if err != nil {
		return playback.Playable{}, fmt.Errorf("Failed to get current track: %v", err)
	}
	return playable, nil
}

func (a *App) PlayTrack(track sqlcDb.Track) error {
	err := a.localPlayer.Play(track)
	if err != nil {
		return fmt.Errorf("Failed to start playback: %v", err)
	}
	return nil
}

func (a *App) PauseResume() {
	a.localPlayer.PauseResume()
}

func (a *App) AddToQueue(track sqlcDb.Track) error {

	err := a.localPlayer.AddToQueue(track)
	if err != nil {
		return fmt.Errorf("Failed to add to queue: %v", err)
	}
	return nil
}

func (a *App) ListQueue() ([]sqlcDb.Track, error) {
	queueTracks, err := a.localPlayer.ListQueue()
	if err != nil {
		return []sqlcDb.Track{}, fmt.Errorf("Failed to list queue: %v", err)
	}
	queueWithoutCurrent := queueTracks[1:]
	return queueWithoutCurrent, nil
}
