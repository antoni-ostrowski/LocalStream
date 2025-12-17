import { playback, sqlcDb } from "@/wailsjs/go/models"
import { Atom, Registry, Result } from "@effect-atom/atom-react"
import { Data, Effect } from "effect"
import { atomRuntime } from "../make-runtime"
import { Queries } from "../queries"

const remotePlaybackStateAtom = atomRuntime.atom(
  Effect.fn(function* () {
    const q = yield* Queries
    const playbackState = yield* q.getPlaybackState
    return yield* Effect.succeed(playbackState)
  })
)

type Action = Data.TaggedEnum<{
  UpdatePlaybackState: { readonly newPlaybackState: playback.PlaybackState }
}>

export const playbackStateAtomAction = Data.taggedEnum<Action>()

export const playbackStateAtom = Object.assign(
  Atom.writable(
    (get: Atom.Context) => get(remotePlaybackStateAtom),
    (ctx, action: Action) => {
      const currentState = ctx.get(playbackStateAtom)
      if (!Result.isSuccess(currentState)) return

      // ctx.setSelf(Result.success(update))
    }
  ),
  { remote: remotePlaybackStateAtom }
)

export const updatePlaybackStateAtom = atomRuntime.fn(
  Effect.fn(function* (track: sqlcDb.Track) {
    const registry = yield* Registry.AtomRegistry
  })
)

// export const updateCurrentPlayingStateAtom = atomRuntime.fn(
//   Effect.fn(function* (newState: sqlcDb.Track) {
//     const registry = yield* Registry.AtomRegistry
//     registry.set(
//       playbackStateAtom,
//       playbackStateAtomAction.UpdateCurrentPlayingState({
//         newCurrentPlayingState: newState,
//       }),
//     )
//   }),
// )
