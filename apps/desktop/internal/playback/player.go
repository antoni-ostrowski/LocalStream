package playback

import "localStream/sqlcDb"

type Player interface {
	Play(track sqlcDb.Track) error
}
