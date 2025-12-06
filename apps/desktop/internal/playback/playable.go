package playback

import (
	"localStream/sqlcDb"

	"github.com/gopxl/beep"
	"github.com/gopxl/beep/effects"
)

type Playable struct {
	Streamer beep.Streamer
	Ctrl     *beep.Ctrl
	Volume   *effects.Volume
	Track    sqlcDb.Track
}

func NewPlayable(initialStreamer beep.Streamer, trackSampleRate beep.SampleRate, track sqlcDb.Track) *Playable {

	ctrl := &beep.Ctrl{Streamer: initialStreamer, Paused: false}

	volume := &effects.Volume{
		Streamer: ctrl,
		Base:     2,
		Volume:   0,
		Silent:   false,
	}

	sr := beep.SampleRate(44100)
	finalStreamer := beep.Resample(4, trackSampleRate, sr, volume)

	return &Playable{
		Ctrl:     ctrl,
		Volume:   volume,
		Streamer: finalStreamer,
		Track:    track,
	}
}
