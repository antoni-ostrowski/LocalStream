import { sqlcDb } from "@/wailsjs/go/models"
import { Atom, Registry, Result } from "@effect-atom/atom-react"
import { Data, Effect } from "effect"
import { atomRuntime } from "../atom-runtime"

// immutable atom,
// cant modify the cache of this atom
// everything needs to be derived
// dictates real source of truth ON THE server
// generic atom to store the currenlty viewed track list
const remoteGenericTrackListAtom = atomRuntime.atom(
  Effect.fn(function* () {
    const arr: sqlcDb.Track[] = []
    // const arrr = yield* Effect.promise(async () => await ListAllTracks())
    return yield* Effect.succeed(arr)
  }),
)

// here we define all possible actions (mutations) on writable atom
// the action will modify the writable atom state and before that its caller (some public atom.fn) should update the server state
type Action = Data.TaggedEnum<{
  UpdateTrackData: { readonly newTrackData: sqlcDb.Track }
  UpdateTrackList: { readonly newTrackList: sqlcDb.Track[] }
}>

export const GenericTrackListAtomAction = Data.taggedEnum<Action>()
// this atom subscribes to the state of the remote atom
// has its own cache
// we will be writing to this atom, NOT the remote one
// this is a derived atom from remoteAtom
// this is our modifyable cache
export const genericTrackListAtom = Object.assign(
  Atom.writable(
    (get: Atom.Context) => get(remoteGenericTrackListAtom),
    (ctx, action: Action) => {
      const currentState = ctx.get(genericTrackListAtom)
      if (!Result.isSuccess(currentState)) return

      // every func in this needs to return new state (implementation of the Action enums)
      const update = GenericTrackListAtomAction.$match(action, {
        UpdateTrackData: ({ newTrackData }) => {
          return currentState.value.map((track) => {
            if (track.id === newTrackData.id) {
              return {
                ...newTrackData,
              } as sqlcDb.Track
            }
            return track
          })
        },
        UpdateTrackList: ({ newTrackList }) => {
          return newTrackList
        },
      })

      // here we updating actual state of the writable atom
      ctx.setSelf(Result.success(update))
    },
  ),
  //  expose remote atom if its needed somewhere in the future
  { remote: remoteGenericTrackListAtom },
)

export const updateGenericTrackListAtom = atomRuntime.fn(
  Effect.fn(function* (tracks: sqlcDb.Track[]) {
    const registry = yield* Registry.AtomRegistry
    registry.set(
      genericTrackListAtom,
      GenericTrackListAtomAction.UpdateTrackList({ newTrackList: tracks }),
    )
  }),
)

export const updateTrackInGenericTrackListAtom = atomRuntime.fn(
  Effect.fn(function* (track: sqlcDb.Track) {
    const registry = yield* Registry.AtomRegistry
    registry.set(
      genericTrackListAtom,
      GenericTrackListAtomAction.UpdateTrackData({ newTrackData: track }),
    )
  }),
)
