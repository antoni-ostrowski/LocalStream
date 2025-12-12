import {
  GetCurrent,
  GetPreferences,
  GetTrackArtwork,
  ListAllTracks,
  ListFavTracks,
  ListQueue,
} from "@/wailsjs/go/main/App"
import { sqlcDb } from "@/wailsjs/go/models"
import { Atom } from "@effect-atom/atom-react"
import { Array, Effect, Layer } from "effect"
import { GenericError, NotFound } from "./errors"

const me = {
  preferences: Atom.make(
    Effect.tryPromise({
      try: async () => await GetPreferences(),
      catch: () => new GenericError({ message: "Failed to get preferences" }),
    }),
  ),
}

const runtimeAtom = Atom.runtime(Layer.empty)

export const updateListAllTracks = runtimeAtom.fn(
  Effect.fn(function* () {
    yield* Effect.log("mutating list all tracks")
  }),
  { reactivityKeys: ["listAllTracks"], concurrent: true },
)

const tracks = {
  listAllTracksAtom: Atom.make(
    Effect.flatMap(
      Effect.tryPromise({
        try: async () => await ListAllTracks(),
        catch: () => new GenericError({ message: "Failed to list tracks" }),
      }),
      (tracks) =>
        Effect.if(Array.isEmptyArray(tracks), {
          onTrue: () =>
            Effect.fail(new NotFound({ message: "No tracks found" })),
          onFalse: () =>
            Effect.succeed(tracks).pipe(
              Effect.tap((value) =>
                Effect.logInfo(`Found ${value.length} tracks`),
              ),
            ),
        }),
    ),
  ).pipe(Atom.withReactivity(["listAllTracks"])),
  makeGetTrackArtworkAtom: (track: sqlcDb.Track) =>
    Atom.make(
      Effect.flatMap(
        Effect.tryPromise({
          try: async () => await GetTrackArtwork(track),
          catch: () => new GenericError({ message: "Failed to get artwork" }),
        }),
        (artwork) => Effect.succeed(artwork),
      ),
    ),

  listFavTracks: Atom.make(
    Effect.flatMap(
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
    ),
  ),
}

const player = {
  listQueue: Atom.make(
    Effect.flatMap(
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
    ),
  ),
  getCurrentPlaying: Atom.make(
    Effect.flatMap(
      Effect.tryPromise({
        try: async () => await GetCurrent(),
        catch: () =>
          new GenericError({ message: "Failed to get current playing track" }),
      }),
      (currentPlaying) => Effect.succeed(currentPlaying),
    ),
  ),
}

export const queries = {
  me,
  tracks,
  player,
}
