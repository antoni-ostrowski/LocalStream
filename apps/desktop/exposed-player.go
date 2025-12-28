package main

import (
	"fmt"
	"localStream/internal/playback"
	"localStream/sqlcDb"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) GetCurrentTrack() (sqlcDb.Track, error) {
	currentTrackId := a.localPlayer.GetCurrentTrackId(a.ctx)

	currentTrack, err := a.db.Queries.GetTrackFromId(a.ctx, currentTrackId)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Failed to get current track: %v", err)
		return sqlcDb.Track{}, fmt.Errorf("Failed to get current track: %v", err)
	}

	return currentTrack, nil
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

func (a *App) DeleteFromQueue(index int) error {
	err := a.localPlayer.DeleteFromQueue(a.ctx, index)
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

func (a *App) GetPlaybackState() (playback.PlaybackState, error) {
	playbackState := a.localPlayer.GetPlaybackState(a.ctx)
	track, err := a.db.Queries.GetTrackFromId(a.ctx, playbackState.PlayingTrackId)

	if err != nil {
		return playback.PlaybackState{}, fmt.Errorf("Failed to get track for current playback state - %v", err)
	}
	return playback.PlaybackState{
		IsPlaying:      playbackState.IsPlaying,
		PlayingTrackId: playbackState.PlayingTrackId,
		Length:         playbackState.Length,
		PlayingTrack:   track}, nil

}

func (a *App) Seek(seekTo int) {
	a.localPlayer.Seek(a.ctx, seekTo)
}

func (a *App) SkipTrack() {
	a.localPlayer.SkipTrack(a.ctx)
}

func (a *App) ChangeVolume(volume float64) {
	a.localPlayer.ChangeVolume(a.ctx, float64(volume))
}

func (a *App) SkipBackwards() {
	runtime.LogInfo(a.ctx, "trying to skip backwards")
	a.localPlayer.SkipBackwards(a.ctx)
}
