import {
  GetCurrentTrack,
  GetDefaultPreferences,
  GetPlaybackState,
  GetPreferences,
  GetTrackById,
  ListAllPlaylists,
  ListAllTracks,
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
        listFetcher(() => ListPlaylistsForTrack(trackId), GenericError)
    }
  })
}) {}
