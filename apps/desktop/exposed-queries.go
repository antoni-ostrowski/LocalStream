package main

import (
	"database/sql"
	"encoding/base64"
	"fmt"
	"localStream/internal/config"
	"localStream/sqlcDb"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) GetPreferences() (config.Preferences, error) {
	return a.config.Preferences, nil
}

func (a *App) GetDefaultPreferences() (config.Preferences, error) {
	_, configFilePath, err := config.GetConfigFilePath(a.ctx)
	if err != nil {
		return config.Preferences{}, fmt.Errorf("Failed to get default preferences")
	}
	defaultPreferences := config.CreateDefaultPreferences(configFilePath)
	return defaultPreferences, nil
}

func (a *App) ListAllTracks() ([]sqlcDb.Track, error) {
	runtime.LogInfo(a.ctx, "trying list all tracks")
	tracks, err := a.db.Queries.ListAllTracks(a.ctx)
	if err != nil {
		if err == sql.ErrNoRows {
			runtime.LogInfof(a.ctx, "No tracks in list all tracks")
			return []sqlcDb.Track{}, nil
		}
		return []sqlcDb.Track{}, fmt.Errorf("Failed to get tracks: %v", err)
	}

	return tracks, nil
}

func (a *App) ListFavTracks() ([]sqlcDb.Track, error) {
	runtime.LogInfo(a.ctx, "trying list fav tracks")
	favTracks, err := a.db.Queries.ListFavTracks(a.ctx)
	if err != nil {
		return []sqlcDb.Track{}, fmt.Errorf("Failed to get favourite tracks: %v", err)
	}

	return favTracks, nil
}

func (a *App) GetTrackById(trackId string) (sqlcDb.Track, error) {
	track, err := a.db.Queries.GetTrackFromId(a.ctx, trackId)
	if err != nil {
		return sqlcDb.Track{}, fmt.Errorf("Failed to find track with that id %v %v", trackId, err)
	}
	return track, nil
}

func (a *App) ListAllPlaylists() ([]sqlcDb.Playlist, error) {
	runtime.LogInfo(a.ctx, "trying to list all playlists")
	playlists, err := a.db.Queries.ListPlaylists(a.ctx)
	if err != nil {
		if err == sql.ErrNoRows {
			runtime.LogErrorf(a.ctx, "no playlists found ")
			return []sqlcDb.Playlist{}, nil
		}

		return []sqlcDb.Playlist{}, fmt.Errorf("Failed to list all playlists %v", err)
	}

	return playlists, nil
}

func (a *App) GetImageFromPath(path string) (string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("data:image/png;base64,%s", base64.StdEncoding.EncodeToString(data)), nil
}

func (a *App) ListFavPlaylists() ([]sqlcDb.Playlist, error) {
	playlists, err := a.db.Queries.ListFavPlaylists(a.ctx)
	if err != nil {
		if err == sql.ErrNoRows {
			runtime.LogErrorf(a.ctx, "no fav playlists found ")
			return []sqlcDb.Playlist{}, nil
		}
		return []sqlcDb.Playlist{}, fmt.Errorf("Failed to get fav playlists %vl", err)
	}
	return playlists, nil
}

func (a *App) ListPlaylistsForTrack(trackId string) ([]sqlcDb.ListPlaylistsForTrackRow, error) {
	runtime.LogInfo(a.ctx, "trying to get playlists for track")
	playlistList, err := a.db.Queries.ListPlaylistsForTrack(a.ctx, trackId)
	if err != nil {
		if err == sql.ErrNoRows {
			runtime.LogErrorf(a.ctx, "no playlists for track found")
			return []sqlcDb.ListPlaylistsForTrackRow{}, nil
		}
		return []sqlcDb.ListPlaylistsForTrackRow{}, fmt.Errorf("Failed to list playlists for track %v", err)
	}
	return playlistList, nil
}

type PlaylistWithTracks struct {
	Tracks   []sqlcDb.Track  `json:"tracks"`
	Playlist sqlcDb.Playlist `json:"playlist"`
}

func (a *App) GetPlaylist(playlistId string) (PlaylistWithTracks, error) {
	playlist, err := a.db.Queries.GetPlaylist(a.ctx, playlistId)
	if err != nil {
		return PlaylistWithTracks{}, fmt.Errorf("Failed to get playlist %v", err)
	}
	tracks, err := a.db.Queries.ListTracksByPlaylist(a.ctx, playlistId)
	if err != nil {
		return PlaylistWithTracks{}, fmt.Errorf("Failed to get tracks for playlists %v", err)
	}

	return PlaylistWithTracks{
		Tracks:   tracks,
		Playlist: playlist,
	}, nil
}

func (a *App) ListAlbums() ([]string, error) {
	albums, err := a.db.Queries.ListDistinctAlbums(a.ctx)
	if err != nil {
		return []string{}, fmt.Errorf("failed to query albums %v", err)
	}
	return albums, nil

}

func (a *App) GetAlbumsTracks(album string) ([]sqlcDb.Track, error) {
	tracks, err := a.db.Queries.GetAlbumsTracks(a.ctx, album)

	if err != nil {

		if err == sql.ErrNoRows {
			runtime.LogErrorf(a.ctx, "no fav playlists found ")
			return []sqlcDb.Track{}, nil
		}

		runtime.LogErrorf(a.ctx, "failed to get tracks for album")

		return []sqlcDb.Track{}, fmt.Errorf("failed to query albums %v", err)
	}

	return tracks, nil

}

func (a *App) ListArtists() ([]sqlcDb.ListArtistsRow, error) {
	artists, err := a.db.Queries.ListArtists(a.ctx)
	if err != nil {
		return []sqlcDb.ListArtistsRow{}, fmt.Errorf("failed to query list artists %v", err)
	}

	return artists, nil

}

func (a *App) GetArtist(artist string) ([]sqlcDb.Track, error) {
	tracks, err := a.db.Queries.ListTracksByArtist(a.ctx, artist)
	if err != nil {
		return []sqlcDb.Track{}, fmt.Errorf("failed to query list artists %v", err)
	}

	return tracks, nil

}

func (a *App) SearchTracks(query string, filter string, filterValue string) ([]sqlcDb.Track, error) {

	var tracks []sqlcDb.Track
	var err error

	switch filter {
	case "album":
		runtime.LogInfo(a.ctx, "searching with album filter")
		tracks, err = a.db.Queries.SearchTracksWithinAlbum(a.ctx, sqlcDb.SearchTracksWithinAlbumParams{Album: filterValue, Searchquery: query})
	case "artist":
		runtime.LogInfo(a.ctx, "searching with artist filter")
		tracks, err = a.db.Queries.SearchTracksWithinArtist(a.ctx, sqlcDb.SearchTracksWithinArtistParams{Artist: filterValue, Searchquery: query})
	case "playlist":
		runtime.LogInfo(a.ctx, "searching with playlist filter")
		tracks, err = a.db.Queries.SearchTracksWithinPlaylist(a.ctx, sqlcDb.SearchTracksWithinPlaylistParams{Playlistid: filterValue, Searchquery: query})
	default:
		runtime.LogInfo(a.ctx, "searching with all tracks")
		tracks, err = a.db.Queries.SearchTracks(a.ctx, query)
	}

	if err != nil {
		runtime.LogErrorf(a.ctx, "failed to search tracks %v", err)
		return []sqlcDb.Track{}, fmt.Errorf("failed to search tracks %v", err)
	}

	return tracks, nil
}
