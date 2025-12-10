package playback

import (
	"context"
	"fmt"
	"localStream/sqlcDb"

	"github.com/gopxl/beep/speaker"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (p *LocalPlayer) GetCurrent(ctx context.Context) (Playable, error) {
	runtime.LogInfof(ctx, "Trying to get current playing")
	speaker.Lock()
	defer speaker.Unlock()

	runtime.LogInfof(ctx, "Trying if streamers arr is empty")
	if len(p.queue.streamers) == 0 {
		runtime.LogWarningf(ctx, "Queue is empty in get current func")
		return Playable{}, fmt.Errorf("Nothing playing right now")
	}

	runtime.LogInfof(ctx, "Trying to access the 0 index of queue")
	currentPlayable := p.queue.streamers[0]
	runtime.LogInfof(ctx, "After access to 0 index, now checking if pointer is a nil pointer")
	if currentPlayable == nil {
		return Playable{}, fmt.Errorf("queue contains a nil playable item")
	}

	runtime.LogInfof(ctx, "0 indexed pointer shouldn't be nil or not exist, returning it")
	fmt.Printf("now playing - %v\n", currentPlayable.Track.Title)

	return *currentPlayable, nil

}

func (p *LocalPlayer) Play(track sqlcDb.Track) error {
	playable, err := p.createPlayableFromTrack(track)
	if err != nil {
		return err
	}

	speaker.Lock()
	defer speaker.Unlock()

	if len(p.queue.streamers) > 0 {
		p.queue.streamers[0] = playable
	} else {
		p.queue.streamers = append(p.queue.streamers, playable)
	}

	return nil
}

func (p *LocalPlayer) PauseResume() {
	speaker.Lock()
	defer speaker.Unlock()
	if len(p.queue.streamers) > 0 {
		p.queue.streamers[0].Ctrl.Paused = !p.queue.streamers[0].Ctrl.Paused
	}
}

func (p *LocalPlayer) AddToQueue(ctx context.Context, track sqlcDb.Track) error {
	runtime.LogInfo(ctx, "Trying to add to queue")
	playable, err := p.createPlayableFromTrack(track)
	runtime.LogInfo(ctx, "created playable")
	if err != nil {
		return err
	}
	speaker.Lock()
	defer speaker.Unlock()
	runtime.LogInfo(ctx, "attemtping to append playable")
	p.queue.streamers = append(p.queue.streamers, playable)
	runtime.LogInfo(ctx, "appended to queue correclty")
	runtime.LogInfof(ctx, "queue after addition - %v", len(p.queue.streamers))
	return nil
}

func (p *LocalPlayer) ListQueue(ctx context.Context) ([]sqlcDb.Track, error) {
	speaker.Lock()
	defer speaker.Unlock()

	queue := p.queue.streamers
	runtime.LogInfof(ctx, "trying to read queue - %v", len(queue))
	var tracks []sqlcDb.Track

	for _, playable := range queue {
		tracks = append(tracks, playable.Track)
	}

	return tracks, nil
}
