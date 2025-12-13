import { sqlcDb } from "@/wailsjs/go/models"
import { Atom, Registry, Result } from "@effect-atom/atom-react"
import { Array, Data, Effect } from "effect"
import { atomRuntime } from "../atom-runtime"
import { Mutations } from "../mutations"
import { Queries } from "../queries"
import { currentPlayingAtom } from "./current-playing-atom"

const remoteQueueAtom = atomRuntime.atom(
  Effect.fn(function* () {
    const q = yield* Queries
    const queue = yield* q.listQueue
    return yield* Effect.succeed(queue)
  }),
)

type Action = Data.TaggedEnum<{
  AppendToQueue: { readonly newQueueTrack: sqlcDb.Track }
  PrependToQueue: { readonly newQueueTrack: sqlcDb.Track }
  DeleteFromQueue: { readonly queueTrackIndex: number }
}>

export const QueueAtomAction = Data.taggedEnum<Action>()

export const queueAtom = Object.assign(
  Atom.writable(
    (get: Atom.Context) => get(remoteQueueAtom),
    (ctx, action: Action) => {
      const currentState = ctx.get(queueAtom)
      if (!Result.isSuccess(currentState)) return

      const update = QueueAtomAction.$match(action, {
        AppendToQueue: ({ newQueueTrack }) =>
          Array.append(currentState.value, newQueueTrack),
        PrependToQueue: ({ newQueueTrack }) =>
          Array.prepend(currentState.value, newQueueTrack),
        DeleteFromQueue: ({ queueTrackIndex }) =>
          currentState.value.filter((_, index) => index !== queueTrackIndex),
      })

      ctx.setSelf(Result.success(update))
    },
  ),
  { remote: remoteQueueAtom },
)

export const appendToQueueAtom = atomRuntime.fn(
  Effect.fn(function* (track: sqlcDb.Track) {
    const registry = yield* Registry.AtomRegistry

    const m = yield* Mutations
    yield* m.playbackControls.appendToQueue(track)

    registry.set(
      queueAtom,
      QueueAtomAction.AppendToQueue({ newQueueTrack: track }),
    )

    registry.refresh(currentPlayingAtom)
    registry.refresh(queueAtom.remote)
  }),
)

export const prependToQueueAtom = atomRuntime.fn(
  Effect.fn(function* (track: sqlcDb.Track) {
    const registry = yield* Registry.AtomRegistry

    const m = yield* Mutations
    yield* m.playbackControls.prependToQueue(track)

    registry.set(
      queueAtom,
      QueueAtomAction.PrependToQueue({ newQueueTrack: track }),
    )

    registry.refresh(currentPlayingAtom.remote)
    registry.refresh(queueAtom.remote)
  }),
)

export const deleteFromQueueAtom = atomRuntime.fn(
  Effect.fn(function* (trackIndex: number) {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations
    yield* m.playbackControls.deleteFromQueue(trackIndex)

    registry.set(
      queueAtom,
      QueueAtomAction.DeleteFromQueue({ queueTrackIndex: trackIndex }),
    )

    registry.refresh(currentPlayingAtom.remote)
    registry.refresh(queueAtom.remote)
  }),
)
