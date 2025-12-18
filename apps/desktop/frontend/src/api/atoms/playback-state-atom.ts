import { sqlcDb } from "@/wailsjs/go/models"
import { Atom, Registry, Result } from "@effect-atom/atom-react"
import { Data, Effect } from "effect"
import { atomRuntime } from "../make-runtime"
import { Mutations } from "../mutations"
import { Queries } from "../queries"

const remotePlaybackStateAtom = atomRuntime.atom(
  Effect.fn(function* () {
    const q = yield* Queries
    const playbackState = yield* q.getPlaybackState
    // remove the stupid converValue method that makes
    // life harder for no reason
    const { convertValues, ...state } = playbackState
    return yield* Effect.succeed(state)
  })
)

type Action = Data.TaggedEnum<{
  UpdateIsPlaying: { readonly a: string }
  UpdatePlayingTrack: { readonly newPlayingTrack: sqlcDb.Track }
  UpdatePlayingTrackLength: { readonly newLegth: number }
}>

export const PlaybackStateAtomAction = Data.taggedEnum<Action>()

export const playbackStateAtom = Object.assign(
  Atom.writable(
    (get: Atom.Context) => get(remotePlaybackStateAtom),
    (ctx, action: Action) => {
      const currentState = ctx.get(playbackStateAtom)
      if (!Result.isSuccess(currentState)) return
      Effect.runSync(Effect.logInfo("inside the atom func run"))
      const update = PlaybackStateAtomAction.$match(action, {
        UpdateIsPlaying: () => ({
          ...currentState.value,
          isPlaying: !currentState.value.isPlaying
        }),
        UpdatePlayingTrack: ({ newPlayingTrack }) => ({
          ...currentState.value,
          playingTrack: newPlayingTrack,
          PlayingTrackId: newPlayingTrack.id
        }),
        UpdatePlayingTrackLength: ({ newLegth }) => ({
          ...currentState.value,
          length: newLegth
        })
      })

      ctx.setSelf(Result.success(update))
    }
  ),
  { remote: remotePlaybackStateAtom }
)

export const pauseResumeAtom = atomRuntime.fn(
  Effect.fn(function* () {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations

    yield* m.playbackControls.pauseResume
    yield* Effect.logInfo("Paused/Resumed successfully!")

    registry.set(
      playbackStateAtom,
      PlaybackStateAtomAction.UpdateIsPlaying({ a: "jasdk" })
    )
  })
)

export const playNowAtom = atomRuntime.fn(
  Effect.fn(function* (newPlayingTrack: sqlcDb.Track) {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations

    yield* m.playbackControls.playNow(newPlayingTrack)
    yield* Effect.logDebug("Play now successfully!")

    registry.set(
      playbackStateAtom,
      PlaybackStateAtomAction.UpdatePlayingTrack({
        newPlayingTrack
      })
    )

    registry.set(
      playbackStateAtom,
      PlaybackStateAtomAction.UpdateIsPlaying({ a: "fd" })
    )

    registry.refresh(playbackStateAtom.remote)
  })
)
