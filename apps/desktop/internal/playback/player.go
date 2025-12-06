package playback

import "localStream/sqlcDb"

type Player interface {
	Play(track sqlcDb.Track) error
	PauseResume()
	ListQueue() ([]sqlcDb.Track, error)
	AddToQueue(track sqlcDb.Track) error
}
