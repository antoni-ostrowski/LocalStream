package playback

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/gopxl/beep"
	"github.com/gopxl/beep/effects"
	"github.com/gopxl/beep/flac"
	"github.com/gopxl/beep/generators"
	"github.com/gopxl/beep/mp3"
	"github.com/gopxl/beep/speaker"
	"github.com/gopxl/beep/wav"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// enforce that LocalPlayer implements Player
var _ Player = (*LocalPlayer)(nil)

type PlayerCommand struct {
	Playable    *Playable
	CommandType string
}

type LocalPlayer struct {
	// Focus on controllling this
	currentStreamer beep.StreamSeeker
	currentPlayable *Playable
	queue           []*Playable
	cmdChan         chan PlayerCommand
	quitChan        chan struct{}
}

// this just controls whatever streamer I gave it
var globalCtrl *beep.Ctrl
var globalVolume *effects.Volume

func (p *LocalPlayer) Init(ctx context.Context) {
	runtime.LogInfo(ctx, "Initing local player")

	// init chan for communication
	p.cmdChan = make(chan PlayerCommand)
	p.quitChan = make(chan struct{})

	// init speaker
	sr := beep.SampleRate(44100)
	speaker.Init(sr, sr.N(time.Second/10))

	// initially stream silence forever
	// this is the input for the global streaming
	globalVolume = &effects.Volume{
		Streamer: generators.Silence(-1),
		Base:     2,
		Volume:   0,
		Silent:   false,
	}
	globalCtrl = &beep.Ctrl{Streamer: globalVolume, Paused: false}
	speaker.Play(globalCtrl)
	// kick of the orchestrator routine
	go p.PlayerLoop(ctx)

	runtime.LogInfo(ctx, "Queue and speaker intialized successfully, should be streaming silence")
}

func (p *LocalPlayer) createPlayableFromTrack(ctx context.Context, trackId string, trackPath string) (*Playable, error) {
	streamer, format, err := p.decodeFile(trackPath)
	if err != nil {
		runtime.LogErrorf(ctx, "Failed to decode file - %v", err)
		return &Playable{}, fmt.Errorf("Failed to decode file - %v\n", err)
	}

	playable := NewPlayable(streamer, format.SampleRate, trackId, format)
	return playable, nil
}

func (p *LocalPlayer) decodeFile(path string) (beep.StreamSeeker, beep.Format, error) {
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
