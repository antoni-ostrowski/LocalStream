import { Atom, Result } from "@effect-atom/atom-react"
import { Data, Effect } from "effect"
import { atomRuntime } from "../make-runtime"
import { Queries } from "../queries"

const remoteArtists = atomRuntime.atom(
  Effect.fn(function* () {
    const q = yield* Queries
    const arr = yield* q.listArtists
    return yield* Effect.succeed(arr)
  })
)

// ignore
type Action = Data.TaggedEnum<{
  UpdatePlaylistList: { readonly newPlaylistList: string[] }
}>

export const ArtistAction = Data.taggedEnum<Action>()

export const artistsAtom = Object.assign(
  Atom.writable(
    (get: Atom.Context) => get(remoteArtists),
    (ctx, _action: Action) => {
      const currentState = ctx.get(artistsAtom)
      if (!Result.isSuccess(currentState)) return

      // const update = ArtistAction.$match(action, {
      //   UpdatePlaylistList: ({ newPlaylistList }) => {
      //     return newPlaylistList
      //   }
      // })
    }
  ),
  { remote: remoteArtists }
)
