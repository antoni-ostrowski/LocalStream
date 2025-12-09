package playback

import (
	"fmt"
	"localStream/sqlcDb"

	"github.com/gopxl/beep/speaker"
)

func (p *LocalPlayer) GetCurrent() (Playable, error) {
	speaker.Lock()
	defer speaker.Unlock()

	if len(p.queue.streamers) == 0 {
		return Playable{}, fmt.Errorf("Nothing playing right now")
	}
	currentPlayable := p.queue.streamers[0] // Get the pointer

	// CRITICAL FIX: Check if the retrieved pointer is nil
	if currentPlayable == nil {
		// You should investigate why a nil pointer was added, but this prevents the crash
		return Playable{}, fmt.Errorf("Queue contains a nil playable item")
	}

	fmt.Printf("now playing - %v\n", *currentPlayable)

	return *currentPlayable, nil

	return *p.queue.streamers[0], nil
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

func (p *LocalPlayer) AddToQueue(track sqlcDb.Track) error {
	playable, err := p.createPlayableFromTrack(track)
	if err != nil {
		return err
	}
	speaker.Lock()
	defer speaker.Unlock()
	p.queue.streamers = append(p.queue.streamers, playable)
	return nil
}

func (p *LocalPlayer) ListQueue() ([]sqlcDb.Track, error) {
	speaker.Lock()
	defer speaker.Unlock()

	queue := p.queue.streamers
	var tracks []sqlcDb.Track

	for _, playable := range queue {
		tracks = append(tracks, playable.Track)
	}

	return tracks, nil
}
