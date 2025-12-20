package playback

import (
	"context"
	"fmt"
	"time"

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
				toEmit := p.GetCurrentStreamerProgress()
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
			toEmit := p.GetCurrentStreamerProgress()
			runtime.EventsEmit(ctx, "progress", toEmit)
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
		for index, x := range p.queue {
			if index != cmd.IndexToDelete {
				p.queue[n] = x
				n++
			}
		}
		p.queue = p.queue[:n]
		runtime.LogInfof(ctx, "New queue after deletion - %v", len(p.queue))
		return
	}

	if cmd.CommandType == "SEEK" && cmd.SeekTo != 0 {
		runtime.LogInfof(ctx, "trying to seek")
		seekTime := time.Duration(cmd.SeekTo) * time.Second
		runtime.LogInfof(ctx, "seek time - %v", seekTime)
		samples := p.currentPlayable.format.SampleRate.N(seekTime)
		p.currentStreamer.Seek(samples)
		runtime.LogInfof(ctx, "after seek - %v", p.currentStreamer.Position())
		toEmit := p.GetCurrentStreamerProgress()
		runtime.EventsEmit(ctx, "progress", toEmit)
		return
	}

	if cmd.CommandType == "SKIP" {
		p.handleTrackEnd(ctx)
		return
	}

	if cmd.CommandType == "CHANGE_VOLUME" && cmd.NewVolume != 0 {
		val := cmd.NewVolume

		if val <= 0.02 {
			globalVolume.Silent = true
			return
		}

		globalVolume.Silent = false

		// 3. Map Linear Slider to Exponential Volume
		// Formula: (Slider - 1.0) * Sensitivity
		// If val is 1.0 -> Volume is 0   (2^0 = 100%)
		// If val is 0.5 -> Volume is -2.5 (Much quieter)
		// If val is 0.0 -> Volume is -5.0 (Near silent)
		globalVolume.Volume = (val - 1.0) * 5

		runtime.LogInfof(ctx, "Slider: %v -> Internal Volume: %v", val, globalVolume.Volume)
		return
	}

}

func (p *LocalPlayer) handleTrackEnd(ctx context.Context) {
	runtime.LogInfo(ctx, "Track end signal received")

	if len(p.queue) > 0 {
		nextTrack := p.queue[0]
		p.queue = p.queue[1:]

		runtime.LogInfof(ctx, "Transitioning to next track: %v", nextTrack.TrackId)

		p.setCurrent(ctx, nextTrack)
		length := p.GetCurrentStreamerLength()

		runtime.EventsEmit(ctx, "playback", nextTrack.TrackId, length)
	} else {
		runtime.LogInfo(ctx, "Queue empty, stopping playback")
		p.currentPlayable = nil
		p.currentStreamer = nil

		globalMixer.Clear()

	}
}

func (p *LocalPlayer) setCurrent(ctx context.Context, playable *Playable) {
	runtime.LogDebug(ctx, "Set current playable invoked")

	p.currentPlayable = playable
	p.currentStreamer = playable.Streamer

	globalMixer.Clear()

	globalMixer.Add(playable.CallbackStreamer)

	globalCtrl.Paused = false
}

func (p *LocalPlayer) StopAndCloseCurrent() {
	globalMixer.Clear()

	if p.currentPlayable != nil && p.currentPlayable.Closer != nil {
		err := p.currentPlayable.Closer.Close()
		if err != nil {
			fmt.Printf("Error closing file: %v\n", err)
		}
	}
}
