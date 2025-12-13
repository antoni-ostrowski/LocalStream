package playback

import (
	"localStream/sqlcDb"

	"context"
)

type Player interface {
	Play(track sqlcDb.Track) (Playable, error)
	PauseResume() Playable
	ListQueue(ctx context.Context) ([]sqlcDb.Track, error)
	AppendToQueue(ctx context.Context, track sqlcDb.Track) error
	PrependToQueue(ctx context.Context, track sqlcDb.Track) error
}
