import {
  AppendToQueue,
  CreateSourceDir,
  DeleteFromQueue,
  PauseResume,
  PlayTrack,
  PrependToQueue,
  ReloadAppResources,
  StarTrack,
  UpdatePreferences,
} from "@/wailsjs/go/main/App"
import { config, sqlcDb } from "@/wailsjs/go/models"
import { Effect } from "effect"
import { GenericError } from "./errors"

export class Mutations extends Effect.Service<Mutations>()("Mutations", {
  effect: Effect.gen(function* () {
    const starTrack = Effect.fn(function* (track: sqlcDb.Track) {
      return yield* Effect.tryPromise({
        try: async () => await StarTrack(track),
        catch: () => new GenericError({ message: "Failed to star track" }),
      })
    })

    const playbackControls = {
      playNow: Effect.fn(function* (track: sqlcDb.Track) {
        return yield* Effect.tryPromise({
          try: async () => await PlayTrack(track),
          catch: () => new GenericError({ message: "Failed to play track" }),
        })
      }),

      pauseResume: Effect.tryPromise({
        try: async () => await PauseResume(),
        catch: () =>
          new GenericError({ message: "Failed to play pause resume" }),
      }),

      appendToQueue: Effect.fn(function* (track: sqlcDb.Track) {
        return yield* Effect.tryPromise({
          try: async () => await AppendToQueue(track),
          catch: () => new GenericError({ message: "Failed to add to queue" }),
        })
      }),

      prependToQueue: Effect.fn(function* (track: sqlcDb.Track) {
        return yield* Effect.tryPromise({
          try: async () => await PrependToQueue(track),
          catch: () => new GenericError({ message: "Failed to add to queue" }),
        })
      }),

      deleteFromQueue: Effect.fn(function* (track: sqlcDb.Track) {
        return yield* Effect.tryPromise({
          try: async () => await DeleteFromQueue(track),
          catch: () =>
            new GenericError({ message: "Failed to delete from queue" }),
        })
      }),
    }

    const settings = {
      reloadAppResources: Effect.tryPromise({
        try: async () => ReloadAppResources(),
        catch: () => new GenericError({ message: "Failed to reload settings" }),
      }),
      createSourceDir: Effect.tryPromise({
        try: async () => await CreateSourceDir(),
        catch: () =>
          new GenericError({
            message: "Failed to create new source directory",
          }),
      }),
      updatePreferences: Effect.fn(function* (newPrefs: config.Preferences) {
        return yield* Effect.tryPromise({
          try: async () => await UpdatePreferences(newPrefs),
          catch: () =>
            new GenericError({ message: "Failed to update preferences" }),
        })
      }),
      triggerTrackSync: Effect.try({
        try: () => ReloadAppResources(),
        catch: () => new GenericError({ message: "Failed to sync track" }),
      }),
    }

    return {
      starTrack,
      playbackControls,
      settings,
    }
  }),
}) {}
