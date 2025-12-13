package playback

import (
	"github.com/gopxl/beep"
	"github.com/gopxl/beep/effects"
)

type Playable struct {
	Streamer      beep.Streamer
	Ctrl          *beep.Ctrl
	Volume        *effects.Volume
	TrackFinished chan struct{}
	TrackId       string
}

func NewPlayable(initialStreamer beep.Streamer, trackSampleRate beep.SampleRate, trackId string) *Playable {

	ctrl := &beep.Ctrl{Streamer: initialStreamer, Paused: false}

	volume := &effects.Volume{
		Streamer: ctrl,
		Base:     2,
		Volume:   0,
		Silent:   false,
	}

	finished := make(chan struct{}, 1)

	sr := beep.SampleRate(44100)
	finalStreamer := beep.Resample(4, trackSampleRate, sr, volume)

	callbackStreamer := beep.Seq(finalStreamer, beep.Callback(func() {
		select {
		case finished <- struct{}{}:
		default:
		}
	}))

	return &Playable{
		Ctrl:          ctrl,
		Volume:        volume,
		Streamer:      callbackStreamer,
		TrackId:       trackId,
		TrackFinished: finished,
	}
}
