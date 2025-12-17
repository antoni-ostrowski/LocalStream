package playback

import (
	"github.com/gopxl/beep"
)

type Playable struct {
	Streamer         beep.StreamSeeker
	format           beep.Format
	CallbackStreamer beep.Streamer
	TrackFinished    chan struct{}
	TrackId          string
}

func NewPlayable(initialStreamer beep.StreamSeeker, trackSampleRate beep.SampleRate, trackId string, format beep.Format) *Playable {
	finished := make(chan struct{}, 1)

	sr := beep.SampleRate(44100)
	finalStreamer := beep.Resample(4, trackSampleRate, sr, initialStreamer)

	callbackStreamer := beep.Seq(finalStreamer, beep.Callback(func() {
		select {
		case finished <- struct{}{}:
		default:
		}
	}))

	return &Playable{
		Streamer:         initialStreamer,
		format:           format,
		CallbackStreamer: callbackStreamer,
		TrackId:          trackId,
		TrackFinished:    finished,
	}
}
