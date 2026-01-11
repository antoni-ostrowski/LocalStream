import { Atom, Result } from "@effect-atom/atom-react"
import { Data, Effect } from "effect"
import { atomRuntime } from "../make-runtime"
import { Queries } from "../queries"

const remoteAlbums = atomRuntime.atom(
  Effect.fn(function* () {
    const q = yield* Queries
    const arr = yield* q.listAlbums
    return yield* Effect.succeed(arr)
  })
)

type Action = Data.TaggedEnum<{
  UpdatePlaylistList: { readonly newPlaylistList: string[] }
}>

export const AlbumsAction = Data.taggedEnum<Action>()

export const albumsAtom = Object.assign(
  Atom.writable(
    (get: Atom.Context) => get(remoteAlbums),
    (ctx, action: Action) => {
      const currentState = ctx.get(albumsAtom)
      if (!Result.isSuccess(currentState)) return

      const update = AlbumsAction.$match(action, {
        UpdatePlaylistList: ({ newPlaylistList }) => {
          return newPlaylistList
        }
      })

      ctx.setSelf(Result.success(update))
    }
  ),
  { remote: remoteAlbums }
)
