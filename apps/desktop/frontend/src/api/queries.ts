import {
  GetCurrentTrack,
  GetTrackArtwork,
  ListAllTracks,
  ListFavTracks,
  ListQueue,
} from "@/wailsjs/go/main/App"
import { sqlcDb } from "@/wailsjs/go/models"
import { Array, Effect } from "effect"
import { GenericError, NotFound } from "./errors"

export class Queries extends Effect.Service<Queries>()("Queries", {
  effect: Effect.gen(function* () {
    const listAllTracks = Effect.flatMap(
      Effect.tryPromise({
        try: async () => await ListAllTracks(),
        catch: () => new GenericError({ message: "Failed to list all tracks" }),
      }),
      (tracks) =>
        Effect.if(Array.isEmptyArray(tracks), {
          onTrue: () => new NotFound({ message: "Not tracks found" }),
          onFalse: () => Effect.succeed(tracks),
        }),
    )

    const listFavTracks = Effect.flatMap(
      Effect.tryPromise({
        try: async () => await ListFavTracks(),
        catch: () => new GenericError({ message: "Failed to list fav tracks" }),
      }),
      (tracks) =>
        Effect.if(Array.isEmptyArray(tracks), {
          onTrue: () =>
            Effect.fail(new NotFound({ message: "No fav tracks found" })),
          onFalse: () =>
            Effect.succeed(tracks).pipe(
              Effect.tap((value) =>
                Effect.logInfo(`Found ${value.length} fav tracks`),
              ),
            ),
        }),
    )

    const getTrackArtwork = (track: sqlcDb.Track) =>
      Effect.flatMap(
        Effect.tryPromise({
          try: async () => await GetTrackArtwork(track),
          catch: () => new GenericError({ message: "Failed to get artwork" }),
        }),
        (artwork) => Effect.succeed(artwork),
      )

    const listQueue = Effect.flatMap(
      Effect.tryPromise({
        try: async () => await ListQueue(),
        catch: () => new GenericError({ message: "Failed to list queue" }),
      }),
      (queueTracks) =>
        Effect.if(Array.isEmptyArray(queueTracks), {
          onTrue: () =>
            Effect.fail(new NotFound({ message: "No queue list found" })),
          onFalse: () =>
            Effect.succeed(queueTracks).pipe(
              Effect.tap((value) =>
                Effect.logInfo(`Found ${value.length} fav tracks`),
              ),
            ),
        }),
    )

    const getCurrentPlayingTrack = Effect.flatMap(
      Effect.tryPromise({
        try: async () => await GetCurrentTrack(),
        catch: () =>
          new GenericError({ message: "Failed to get current playing track" }),
      }),
      (currentPlaying) => Effect.succeed(currentPlaying),
    )

    return {
      listAllTracks,
      listFavTracks,
      getTrackArtwork,
      listQueue,
      getCurrentPlayingTrack,
    }
  }),
}) {}
