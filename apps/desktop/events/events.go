package events

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type EventName string

type EventsStruct struct {
	QueueUpdated          EventName `json:"QueueUpdated"`
	CurrentPlayingUpdated EventName `json:"CurrentPlayingUpdated"`
	AnyTrackInfoUpdated   EventName `json:"AnyTrackInfoUpdated"`
}

var Events = EventsStruct{
	QueueUpdated:          "QueueUpdated",
	CurrentPlayingUpdated: "CurrentPlayingUpdated",
	AnyTrackInfoUpdated:   "AnyTrackInfoUpdated",
}

func EmitQueueUpdated(ctx context.Context) {
	runtime.EventsEmit(ctx, string(Events.QueueUpdated))
}

func EmitCurrentPlayingUpdated(ctx context.Context) {
	runtime.EventsEmit(ctx, string(Events.CurrentPlayingUpdated))
}

func EmitAnyTrackInfoUpdated(ctx context.Context) {
	runtime.EventsEmit(ctx, string(Events.AnyTrackInfoUpdated))
}
