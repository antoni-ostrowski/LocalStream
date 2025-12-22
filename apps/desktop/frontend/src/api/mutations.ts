import { CreatePlaylistFormData } from "@/components/sidebar/sidebar-left/playlists/new-playlist"
import {
  AppendToQueue,
  ChangeVolume,
  CreatePlaylist,
  CreateSourceDir,
  DeleteFromQueue,
  DeletePlaylist,
  PauseResume,
  PlayTrack,
  PrependToQueue,
  ReloadAppResources,
  SelectPlaylistCoverFile,
  SkipTrack,
  StarPlaylist,
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

      createPlaylist: Effect.fn((input: CreatePlaylistFormData) =>
        wailsCall(
          () => CreatePlaylist(input.name, input.coverPath),
          GenericError
        )
      ),
      selectPlaylistCoverFile: wailsCall(
        () => SelectPlaylistCoverFile(),
        GenericError
      ),
      starPlaylist: Effect.fn((playlistId: string) =>
        wailsCall(() => StarPlaylist(playlistId), GenericError)
      ),

      deletePlaylist: Effect.fn((playlistId: string) =>
        wailsCall(() => DeletePlaylist(playlistId), GenericError)
      ),

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
