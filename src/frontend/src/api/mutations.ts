import { CreatePlaylistFormData } from "@/components/sidebar/sidebar-left/playlists/new-playlist"
import {
  AddTrackToPlaylist,
  AppendToQueue,
  ChangeVolume,
  CreatePlaylist,
  CreateSourceDir,
  DeleteFromQueue,
  DeletePlaylist,
  DeleteTrackFromPlaylist,
  PauseResume,
  PlayTrack,
  PrependToQueue,
  ReloadAppResources,
  SelectPlaylistCoverFile,
  SkipBackwards,
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
        ),
        skipBackwards: wailsCall(() => SkipBackwards(), GenericError)
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

      addTrackToPlaylist: Effect.fn((trackId: string, playlistId: string) =>
        wailsCall(() => AddTrackToPlaylist(trackId, playlistId), GenericError)
      ),

      DeleteTrackFromPlaylist: Effect.fn(
        (trackId: string, playlistId: string) =>
          wailsCall(
            () => DeleteTrackFromPlaylist(trackId, playlistId),
            GenericError
          )
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
