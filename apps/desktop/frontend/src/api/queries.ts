import {
  GetCurrentTrack,
  GetDefaultPreferences,
  GetPlaybackState,
  GetPreferences,
  GetTrackArtwork,
  GetTrackById,
  ListAllPlaylists,
  ListAllTracks,
  ListFavPlaylists,
  ListFavTracks,
  ListQueue
} from "@/wailsjs/go/main/App"
import { sqlcDb } from "@/wailsjs/go/models"
import { Effect } from "effect"
import { listFetcher, wailsCall } from "./effect-utils"
import {
  GenericError,
  GetCurrentTrackError,
  GetTrackArtworkError,
  ListQueueError
} from "./errors"

export class Queries extends Effect.Service<Queries>()("Queries", {
  effect: Effect.gen(function* () {
    return {
      listAllTracks: listFetcher(ListAllTracks, GenericError),
      listFavTracks: listFetcher(ListFavTracks, GenericError),
      getTrackArtwork: Effect.fn((track: sqlcDb.Track) =>
        wailsCall(() => GetTrackArtwork(track), GetTrackArtworkError)
      ),
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
      listFavPlaylists: listFetcher(ListFavPlaylists, GenericError)
    }
  })
}) {}
