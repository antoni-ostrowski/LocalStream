import {
  GetAlbumsTracks,
  GetArtist,
  GetCurrentTrack,
  GetDefaultPreferences,
  GetPlaybackState,
  GetPlaylist,
  GetPreferences,
  GetTrackById,
  ListAlbums,
  ListAllPlaylists,
  ListAllTracks,
  ListArtists,
  ListFavPlaylists,
  ListFavTracks,
  ListPlaylistsForTrack,
  ListQueue
} from "@/wailsjs/go/main/App"
import { Effect } from "effect"
import { listFetcher, wailsCall } from "./effect-utils"
import { GenericError, GetCurrentTrackError, ListQueueError } from "./errors"

export class Queries extends Effect.Service<Queries>()("Queries", {
  effect: Effect.gen(function* () {
    return {
      listAllTracks: listFetcher(ListAllTracks, GenericError),
      listFavTracks: listFetcher(ListFavTracks, GenericError),
      listQueue: listFetcher(ListQueue, ListQueueError),
      getCurrentPlayingTrack: wailsCall(
        () => GetCurrentTrack(),
        GetCurrentTrackError
      ),
      getSettings: wailsCall(() => GetPreferences(), GenericError),
      getDefaultSettings: wailsCall(
        () => GetDefaultPreferences(),
        GenericError
      ),
      getPlaybackState: wailsCall(() => GetPlaybackState(), GenericError),
      getTrackById: Effect.fn((trackId: string) =>
        wailsCall(() => GetTrackById(trackId), GenericError)
      ),
      listAllPlaylists: listFetcher(ListAllPlaylists, GenericError),
      listFavPlaylists: listFetcher(ListFavPlaylists, GenericError),
      listPlaylistsForTrack: (trackId: string) =>
        listFetcher(() => ListPlaylistsForTrack(trackId), GenericError),
      getPlaylist: Effect.fn((playlistId: string) =>
        wailsCall(() => GetPlaylist(playlistId), GenericError)
      ),
      listAlbums: wailsCall(() => ListAlbums(), GenericError),
      getAlbumsTracks: (album: string) =>
        listFetcher(() => GetAlbumsTracks(album), GenericError),
      listArtists: listFetcher(ListArtists, GenericError),
      getArtist: Effect.fn((artist: string) =>
        wailsCall(() => GetArtist(artist), GenericError)
      )
    }
  })
}) {}

export type SearchTracksOpts = {
  query: string
  filter: "album" | "artist" | "playlist" | ""
  filterValue: string
}
