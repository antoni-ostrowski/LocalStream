package playback

import (
	"context"
	"fmt"
	"localStream/sqlcDb"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (p *LocalPlayer) GetCurrentTrackId(ctx context.Context) string {
	return p.currentPlayable.TrackId
}

func (p *LocalPlayer) PlayNow(ctx context.Context, trackId string, trackPath string) (Playable, error) {
	playable, err := p.createPlayableFromTrack(ctx, trackId, trackPath)

	if err != nil {
		return Playable{}, fmt.Errorf("Failed to create playable in order to play now - %v", err)
	}

	p.cmdChan <- PlayerCommand{CommandType: "PLAY_NOW", Playable: playable}

	return *playable, nil

}

func (p *LocalPlayer) PauseResume() {
	p.cmdChan <- PlayerCommand{CommandType: "PAUSE_RESUME", Playable: &Playable{}}
}

func (p *LocalPlayer) AppendToQueue(ctx context.Context, track sqlcDb.Track) error {
	runtime.LogInfo(ctx, "Trying to append to queue")
	newPlayable, err := p.createPlayableFromTrack(ctx, track.ID, track.Path)
	if err != nil {
		return fmt.Errorf("Failed to create new playable - %v", err)
	}
	p.cmdChan <- PlayerCommand{CommandType: "APPEND_TO_QUEUE", Playable: newPlayable}
	runtime.LogInfo(ctx, "appended to queue correclty")
	return nil
}

func (p *LocalPlayer) PrependToQueue(ctx context.Context, track sqlcDb.Track) error {
	runtime.LogInfo(ctx, "Trying to prepend to queue")
	newPlayable, err := p.createPlayableFromTrack(ctx, track.ID, track.Path)
	if err != nil {
		return fmt.Errorf("Failed to create new playable - %v", err)
	}
	p.cmdChan <- PlayerCommand{CommandType: "PREPEND_TO_QUEUE", Playable: newPlayable}
	runtime.LogInfo(ctx, "prepended to queue correclty")
	return nil
}

func (p *LocalPlayer) DeleteFromQueue(ctx context.Context, track sqlcDb.Track) error {
	runtime.LogInfo(ctx, "Trying to delete from queue")
	p.cmdChan <- PlayerCommand{CommandType: "DELETE_FROM_QUEUE", Playable: &Playable{TrackId: track.ID}}
	runtime.LogInfo(ctx, "delete from queue correclty")
	return nil
}

func (p *LocalPlayer) ListQueue(ctx context.Context) []*Playable {
	return p.queue
}

func (p *LocalPlayer) GetPlaybackState(ctx context.Context) PlaybackState {
	isPlaying := globalCtrl.Paused
	length := p.GetCurrentStreamerLength()
	return PlaybackState{
		PlayingTrackId: p.currentPlayable.TrackId,
		Length:         length,
		IsPlaying:      isPlaying}
}

func (p *LocalPlayer) Seek(ctx context.Context, seekTo int) {
	p.cmdChan <- PlayerCommand{CommandType: "SEEK", SeekTo: seekTo}
}
