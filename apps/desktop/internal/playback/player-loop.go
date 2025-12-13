package playback

import (
	"context"

	"github.com/gopxl/beep/generators"
	"github.com/gopxl/beep/speaker"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (p *LocalPlayer) PlayerLoop(ctx context.Context) {
	var trackFinishedChan <-chan struct{}

	for {
		// set the channel to listen on (?)
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
			p.currentPlayable.Ctrl.Paused = !p.currentPlayable.Ctrl.Paused
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
		globalCtrl.Streamer = generators.Silence(-1)

	}
}

func (p *LocalPlayer) setCurrent(ctx context.Context, playable *Playable) {
	runtime.LogDebug(ctx, "Set current playable invoked")
	p.currentPlayable = playable
	globalCtrl.Streamer = playable.Streamer
}
