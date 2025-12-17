import {
  GetCurrentTrack,
  GetDefaultPreferences,
  GetPlaybackState,
  GetPreferences,
  GetTrackArtwork,
  ListAllTracks,
  ListFavTracks,
  ListQueue
} from "@/wailsjs/go/main/App"
import { sqlcDb } from "@/wailsjs/go/models"
import { Array, Effect, pipe } from "effect"
import { wailsCall } from "./effect-utils"
import {
  GenericError,
  GetCurrentTrackError,
  GetTrackArtworkError,
  ListQueueError,
  ListTracksError,
  NoTracksFound
} from "./errors"

export class Queries extends Effect.Service<Queries>()("Queries", {
  effect: Effect.gen(function* () {
    return {
      listAllTracks: getListOfTracks(ListAllTracks),
      listFavTracks: getListOfTracks(ListFavTracks),
      getTrackArtwork: Effect.fn((track: sqlcDb.Track) =>
        wailsCall(() => GetTrackArtwork(track), GetTrackArtworkError)
      ),
      listQueue: getListOfTracks(ListQueue).pipe(
        Effect.catchTag("ListTracksError", () =>
          Effect.fail(new ListQueueError({}))
        )
      ),
      getCurrentPlayingTrack: wailsCall(
        () => GetCurrentTrack(),
        GetCurrentTrackError
      ),
      getSettings: wailsCall(() => GetPreferences(), GenericError),
      getDefaultSettings: wailsCall(
        () => GetDefaultPreferences(),
        GenericError
      ),
      getPlaybackState: wailsCall(() => GetPlaybackState(), GenericError)
    }
  })
}) {}

const getListOfTracks = Effect.fn(function* (
  trackGetter: () => Promise<Array<sqlcDb.Track>>
) {
  return yield* pipe(
    Effect.tryPromise({
      try: async () => await trackGetter(),
      catch: (cause) =>
        new ListTracksError({
          cause
        })
    }),
    Effect.andThen((tracks) =>
      Effect.if(Array.isEmptyArray(tracks), {
        onTrue: () => new NoTracksFound({}),
        onFalse: () => Effect.succeed(tracks)
      })
    ),
    Effect.tapBoth({
      onSuccess: (tracks) => Effect.logInfo(tracks),
      onFailure: (error) => Effect.logError(error)
    })
  )
})
