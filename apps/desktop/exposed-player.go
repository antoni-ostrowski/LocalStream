package main

import "localStream/sqlcDb"

func (a *App) PlayTrack(track sqlcDb.Track) {
	a.localPlayer.Play(track)

}

func (a *App) PauseResume() {
	a.localPlayer.PauseResume()
}
