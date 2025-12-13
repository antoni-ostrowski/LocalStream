package playback

import (
	"localStream/sqlcDb"

	"context"
)

type Player interface {
	PlayNow(ctx context.Context, trackId string, trackPath string) (Playable, error)
	PauseResume()
	ListQueue(ctx context.Context) []*Playable
	AppendToQueue(ctx context.Context, track sqlcDb.Track) error
	PrependToQueue(ctx context.Context, track sqlcDb.Track) error
	DeleteFromQueue(ctx context.Context, track sqlcDb.Track) error
}
