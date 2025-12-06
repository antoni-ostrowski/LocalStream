package playback

import (
	"fmt"
	"localStream/sqlcDb"
	"os"
	"time"

	"github.com/gopxl/beep"
	"github.com/gopxl/beep/flac"
	"github.com/gopxl/beep/mp3"
	"github.com/gopxl/beep/speaker"
	"github.com/gopxl/beep/wav"
)

// enforce that LocalPlayer implements Player
var _ Player = (*LocalPlayer)(nil)

type LocalPlayer struct {
	queue Queue
}

func (p *LocalPlayer) Init() {
	fmt.Print("initing player")
	sr := beep.SampleRate(44100)
	speaker.Init(sr, sr.N(time.Second/10))
	speaker.Play(&p.queue)
	fmt.Print("queue initialized correclty")
}

func (p *LocalPlayer) Play(track sqlcDb.Track) error {

	playable, err := p.createPlayableFromTrack(track)
	if err != nil {
		return err
	}

	speaker.Lock()
	p.queue.Add(playable)
	speaker.Unlock()
	return nil
}

func (p *LocalPlayer) PauseResume() {
	p.queue.streamers[0].Ctrl.Paused = !p.queue.streamers[0].Ctrl.Paused
}

func (p *LocalPlayer) createPlayableFromTrack(track sqlcDb.Track) (*Playable, error) {
	streamer, format, err := p.decodeFile(track.Path)
	if err != nil {
		return &Playable{}, fmt.Errorf("Failed to decode file - %v\n", err)
	}

	playable := NewPlayable(streamer, format.SampleRate, track)
	return playable, nil
}

func (p *LocalPlayer) decodeFile(path string) (beep.Streamer, beep.Format, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, beep.Format{}, fmt.Errorf("failed to open file: %w", err)
	}

	streamer, format, err := mp3.Decode(f)
	if err == nil {
		return streamer, format, nil
	}
	f.Close()

	f, err = os.Open(path)
	if err != nil {
		return nil, beep.Format{}, fmt.Errorf("failed to re-open file for WAV check: %w", err)
	}

	streamer, format, err = wav.Decode(f)
	if err == nil {
		return streamer, format, nil
	}
	f.Close()

	f, err = os.Open(path)
	if err != nil {
		return nil, beep.Format{}, fmt.Errorf("failed to re-open file for flac check: %w", err)
	}

	streamer, format, err = flac.Decode(f)
	if err == nil {
		return streamer, format, nil
	}

	f.Close()

	return nil, beep.Format{}, fmt.Errorf("could not decode audio file (tried mp3, wav, etc.): %s", path)
}
