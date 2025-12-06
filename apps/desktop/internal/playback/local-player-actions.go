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
	fmt.Printf("now playing - %v\n", *p.queue.streamers[0])

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
