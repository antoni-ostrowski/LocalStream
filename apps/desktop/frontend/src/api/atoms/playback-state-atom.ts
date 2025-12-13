import { sqlcDb } from "@/wailsjs/go/models"
import { Atom, Registry, Result } from "@effect-atom/atom-react"
import { Data, Effect, Option } from "effect"
import { atomRuntime } from "../make-runtime"
import { Queries } from "../queries"

const remotePlaybackStateAtom = atomRuntime.atom(
  Effect.fn(function* () {
    const q = yield* Queries
    const currentPlaying = yield* q.getCurrentPlayingTrack
    const trackOption: Option.Option<sqlcDb.Track> = Option.some(currentPlaying)
    return yield* Effect.succeed(trackOption)
  })
)

type Action = Data.TaggedEnum<{
  UpdateCurrentPlaying: { readonly newCurrentPlaying: sqlcDb.Track }
}>

export const playbackStateAtomAction = Data.taggedEnum<Action>()

export const playbackStateAtom = Object.assign(
  Atom.writable(
    (get: Atom.Context) => get(remotePlaybackStateAtom),
    (ctx, action: Action) => {
      const currentState = ctx.get(playbackStateAtom)
      if (!Result.isSuccess(currentState)) return

      const update = playbackStateAtomAction.$match(action, {
        UpdateCurrentPlaying: ({ newCurrentPlaying }) => {
          return Option.some(newCurrentPlaying)
        }
      })

      ctx.setSelf(Result.success(update))
    }
  ),
  { remote: remotePlaybackStateAtom }
)

export const updateCurrentPlayingAtom = atomRuntime.fn(
  Effect.fn(function* (track: sqlcDb.Track) {
    const registry = yield* Registry.AtomRegistry
    registry.set(
      playbackStateAtom,
      playbackStateAtomAction.UpdateCurrentPlaying({
        newCurrentPlaying: track
      })
    )
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
