package main

import (
	"fmt"
	"localStream/internal/playback"
	"localStream/sqlcDb"
)

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
