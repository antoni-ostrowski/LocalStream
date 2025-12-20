import {
  AppendToQueue,
  ChangeVolume,
  CreateSourceDir,
  DeleteFromQueue,
  PauseResume,
  PlayTrack,
  PrependToQueue,
  ReloadAppResources,
  SkipTrack,
  StarTrack,
  UpdatePreferences
} from "@/wailsjs/go/main/App"
import { config, sqlcDb } from "@/wailsjs/go/models"
import { Effect } from "effect"
import { wailsCall } from "./effect-utils"
import { GenericError, StarTrackError } from "./errors"

export class Mutations extends Effect.Service<Mutations>()("Mutations", {
  effect: Effect.gen(function* () {
    return {
      starTrack: Effect.fn((track: sqlcDb.Track) =>
        wailsCall(() => StarTrack(track), StarTrackError)
      ),
      playbackControls: {
        playNow: Effect.fn((track: sqlcDb.Track) =>
          wailsCall(() => PlayTrack(track), GenericError)
        ),
        pauseResume: wailsCall(() => PauseResume(), GenericError),
        skipTrack: wailsCall(() => SkipTrack(), GenericError),
        appendToQueue: Effect.fn((track: sqlcDb.Track) =>
          wailsCall(() => AppendToQueue(track), GenericError)
        ),
        prependToQueue: Effect.fn((track: sqlcDb.Track) =>
          wailsCall(() => PrependToQueue(track), GenericError)
        ),
        deleteFromQueue: Effect.fn((index: number) =>
          wailsCall(() => DeleteFromQueue(index), GenericError)
        ),
        changeVolume: Effect.fn((newVolume: number) =>
          wailsCall(() => ChangeVolume(newVolume), GenericError)
        )
      },
      settings: {
        reloadAppResources: wailsCall(() => ReloadAppResources(), GenericError),

        createSourceDir: wailsCall(() => CreateSourceDir(), GenericError),

        updatePreferences: Effect.fn((newPrefs: config.Preferences) =>
          wailsCall(() => UpdatePreferences(newPrefs), GenericError)
        )
      }
    }
  })
}) {}
