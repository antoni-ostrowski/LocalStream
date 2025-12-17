package playback

import (
	"context"
	"fmt"
	"time"

	"github.com/gopxl/beep/generators"
	"github.com/gopxl/beep/speaker"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (p *LocalPlayer) PlayerLoop(ctx context.Context) {
	var trackFinishedChan <-chan struct{}
	ticker := time.NewTicker(250 * time.Millisecond)
	defer ticker.Stop()
	// the for loop is controling everything, but the select is actually blocking
	// and listening for events, when the select executes anything, we start the next iteration
	// which always checks for the channel to listen on for the track finished
	for {
		// set the channel to listen on, if something is playing this gets set too
		// playing track finished channel, if nothing is playing its set to nil which
		// go will block forever on
		if p.currentPlayable != nil {
			trackFinishedChan = p.currentPlayable.TrackFinished
		} else {
			trackFinishedChan = nil
		}

		select {
		// handle incoming commands
		case cmd := <-p.cmdChan:
			runtime.LogDebug(ctx, "New cmd came in")
			speaker.Lock()
			p.handleCmd(ctx, cmd)
			speaker.Unlock()

			// handle track end
		case <-trackFinishedChan:
			runtime.LogDebug(ctx, "track finished came up")
			speaker.Lock()
			p.handleTrackEnd(ctx)
			speaker.Unlock()

		case <-p.quitChan:
			runtime.LogDebug(ctx, "quiz chn came up")
			speaker.Close()
			return
		case <-ticker.C:
			isAnythingPlaying := p.currentStreamer != nil && !globalCtrl.Paused
			if isAnythingPlaying {
				speaker.Lock()
				// fmt.Println(format.SampleRate.D(streamer.Position()).Round(time.Second))
				toEmit := int(p.currentPlayable.format.SampleRate.D(p.currentStreamer.Position()).Round(time.Second).Seconds())
				runtime.EventsEmit(ctx, "progress", toEmit)
				fmt.Printf("p.currentStreamer.Position(): %v\n", toEmit)
				speaker.Unlock()
			}
		}

	}
}

func (p *LocalPlayer) handleCmd(ctx context.Context, cmd PlayerCommand) {
	if cmd.CommandType == "PLAY_NOW" {
		p.setCurrent(ctx, cmd.Playable)
		return
	}

	if cmd.CommandType == "PAUSE_RESUME" {
		if p.currentPlayable != nil {
			globalCtrl.Paused = !globalCtrl.Paused
			// p.currentPlayable.Ctrl.Paused = !p.currentPlayable.Ctrl.Paused
		} else {
			globalCtrl.Paused = !globalCtrl.Paused
		}
		return
	}

	if cmd.CommandType == "APPEND_TO_QUEUE" {
		p.queue = append(p.queue, cmd.Playable)
		runtime.LogInfof(ctx, "New queue after append - %v", len(p.queue))
		return
	}

	if cmd.CommandType == "PREPEND_TO_QUEUE" {
		p.queue = append([]*Playable{cmd.Playable}, p.queue...)
		runtime.LogInfof(ctx, "New queue after prepend - %v", len(p.queue))
		return
	}

	if cmd.CommandType == "DELETE_FROM_QUEUE" {

		n := 0
		for _, x := range p.queue {
			if x.TrackId != cmd.Playable.TrackId {
				p.queue[n] = x
				n++
			}
		}
		p.queue = p.queue[:n]
		runtime.LogInfof(ctx, "New queue after deletion - %v", len(p.queue))
		return
	}

}

func (p *LocalPlayer) handleTrackEnd(ctx context.Context) {
	runtime.LogInfo(ctx, "Track end signal")

	p.currentPlayable = nil

	if len(p.queue) > 0 {
		// load next track

		nextTrack := p.queue[0]

		p.queue = p.queue[1:]

		p.setCurrent(ctx, nextTrack)

	} else {
		// if no tracks in queue, stream silence
		p.currentStreamer = nil
		globalVolume.Streamer = generators.Silence(-1)
	}
}

func (p *LocalPlayer) setCurrent(ctx context.Context, playable *Playable) {
	runtime.LogDebug(ctx, "Set current playable invoked")
	p.currentPlayable = playable
	// streamer is the seeker one the parent
	p.currentStreamer = playable.Streamer
	// the global is streaming a callback streamer that is based on the seeker
	globalVolume.Streamer = playable.CallbackStreamer

	// when i update the seeker the callback streamer should update too (maybe)
}
