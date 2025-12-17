import { sqlcDb } from "@/wailsjs/go/models"
import { Atom, Registry, Result } from "@effect-atom/atom-react"
import { Data, Effect, Option } from "effect"
import { atomRuntime } from "../make-runtime"
import { Mutations } from "../mutations"
import { Queries } from "../queries"
import { playbackStateAtom } from "./playback-state-atom"

const remoteCurrentPlayingAtom = atomRuntime.atom(
  Effect.fn(function* () {
    const q = yield* Queries
    const currentPlaying = yield* q.getCurrentPlayingTrack
    const trackOption: Option.Option<sqlcDb.Track> = Option.some(currentPlaying)
    return yield* Effect.succeed(trackOption)
  })
)

type Action = Data.TaggedEnum<{
  UpdateCurrentPlaying: { readonly newCurrentPlaying: sqlcDb.Track }
  UpdateCurrentPlayingState: {
    readonly newCurrentPlayingState: sqlcDb.Track
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
              if (currentPlaying.id === newCurrentPlayingState.id) {
                return Option.some(newCurrentPlayingState)
              } else {
                return Option.some(currentPlaying)
              }
            }
          })
        }
      })

      ctx.setSelf(Result.success(update))
    }
  ),
  { remote: remoteCurrentPlayingAtom }
)

export const updateCurrentPlayingAtom = atomRuntime.fn(
  Effect.fn(function* (track: sqlcDb.Track) {
    const registry = yield* Registry.AtomRegistry
    registry.set(
      currentPlayingAtom,
      CurrentPlayingAtomAction.UpdateCurrentPlaying({
        newCurrentPlaying: track
      })
    )
  })
)

export const updateCurrentPlayingStateAtom = atomRuntime.fn(
  Effect.fn(function* (newState: sqlcDb.Track) {
    const registry = yield* Registry.AtomRegistry
    registry.set(
      currentPlayingAtom,
      CurrentPlayingAtomAction.UpdateCurrentPlayingState({
        newCurrentPlayingState: newState
      })
    )
    registry.refresh(playbackStateAtom.remote)
  })
)

export const playNowAtom = atomRuntime.fn(
  Effect.fn(function* (track: sqlcDb.Track) {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations

    yield* m.playbackControls.playNow(track)
    yield* Effect.logDebug("Play now successfully!")

    registry.set(
      currentPlayingAtom,
      CurrentPlayingAtomAction.UpdateCurrentPlaying({
        newCurrentPlaying: track
      })
    )
    registry.refresh(currentPlayingAtom.remote)
    registry.refresh(playbackStateAtom.remote)
  })
)

export const pauseResumeAtom = atomRuntime.fn(
  Effect.fn(function* () {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations

    yield* m.playbackControls.pauseResume
    yield* Effect.logDebug("Paused/Resumed successfully!")

    registry.refresh(currentPlayingAtom.remote)
    registry.refresh(playbackStateAtom.remote)
  })
)
