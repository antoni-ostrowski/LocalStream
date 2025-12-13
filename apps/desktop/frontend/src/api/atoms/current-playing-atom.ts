import { playback, sqlcDb } from "@/wailsjs/go/models"
import { Atom, Registry, Result } from "@effect-atom/atom-react"
import { Data, Effect, Option } from "effect"
import { atomRuntime } from "../atom-runtime"
import { Mutations } from "../mutations"
import { Queries } from "../queries"

const remoteCurrentPlayingAtom = atomRuntime.atom(
  Effect.fn(function* () {
    const q = yield* Queries
    const currentPlaying = yield* q.getCurrentPlaying
    const trackOption: Option.Option<playback.Playable> =
      Option.some(currentPlaying)
    return yield* Effect.succeed(trackOption)
  }),
)

type Action = Data.TaggedEnum<{
  UpdateCurrentPlaying: { readonly newCurrentPlaying: playback.Playable }
  UpdateCurrentPlayingState: {
    readonly newCurrentPlayingState: playback.Playable
  }
}>

export const CurrentPlayingAtomAction = Data.taggedEnum<Action>()

export const currentPlayingAtom = Object.assign(
  Atom.writable(
    (get: Atom.Context) => get(remoteCurrentPlayingAtom),
    (ctx, action: Action) => {
      const currentState = ctx.get(currentPlayingAtom)
      if (!Result.isSuccess(currentState)) return

      const update = CurrentPlayingAtomAction.$match(action, {
        UpdateCurrentPlaying: ({ newCurrentPlaying }) => {
          return Option.some(newCurrentPlaying)
        },
        UpdateCurrentPlayingState: ({ newCurrentPlayingState }) => {
          return Option.match(currentState.value, {
            onNone: () => Option.none(),
            onSome: (currentPlaying) => {
              if (currentPlaying.Track.id === newCurrentPlayingState.Track.id) {
                return Option.some(newCurrentPlayingState)
              } else {
                return Option.some(currentPlaying)
              }
            },
          })
        },
      })

      ctx.setSelf(Result.success(update))
    },
  ),
  { remote: remoteCurrentPlayingAtom },
)

export const updateCurrentPlayingAtom = atomRuntime.fn(
  Effect.fn(function* (track: playback.Playable) {
    const registry = yield* Registry.AtomRegistry
    registry.set(
      currentPlayingAtom,
      CurrentPlayingAtomAction.UpdateCurrentPlaying({
        newCurrentPlaying: track,
      }),
    )
  }),
)

export const updateCurrentPlayingStateAtom = atomRuntime.fn(
  Effect.fn(function* (newState: playback.Playable) {
    const registry = yield* Registry.AtomRegistry
    registry.set(
      currentPlayingAtom,
      CurrentPlayingAtomAction.UpdateCurrentPlayingState({
        newCurrentPlayingState: newState,
      }),
    )
  }),
)

export const playNowAtom = atomRuntime.fn(
  Effect.fn(function* (track: sqlcDb.Track) {
    const registery = yield* Registry.AtomRegistry
    const m = yield* Mutations

    yield* m.playbackControls.playNow(track)
    yield* Effect.logDebug("Play now successfully!")

    registery.refresh(currentPlayingAtom.remote)
  }),
)

export const pauseResumeAtom = atomRuntime.fn(
  Effect.fn(function* () {
    const registery = yield* Registry.AtomRegistry
    const m = yield* Mutations

    yield* m.playbackControls.pauseResume
    yield* Effect.logDebug("Paused/Resumed successfully!")

    registery.refresh(currentPlayingAtom.remote)
  }),
)
