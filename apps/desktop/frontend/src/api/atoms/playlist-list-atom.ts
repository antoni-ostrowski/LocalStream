import { sqlcDb } from "@/wailsjs/go/models"
import { Atom, Result } from "@effect-atom/atom-react"
import { Data, Effect } from "effect"
import { atomRuntime } from "../make-runtime"
import { Queries } from "../queries"

const remoteGenericPlaylistList = atomRuntime.atom(
  Effect.fn(function* () {
    const q = yield* Queries
    const arr = yield* q.listAllPlaylists
    return yield* Effect.succeed(arr)
  })
)

type Action = Data.TaggedEnum<{
  UpdatePlaylistList: { readonly newPlaylistList: sqlcDb.Playlist[] }
  AddNewPlaylist: { readonly newPlaylist: sqlcDb.Playlist }
  UpdatePlaylist: { readonly updatedPlaylist: sqlcDb.Playlist }
  DeletePlaylist: { readonly playlistToDelete: sqlcDb.Playlist }
}>

export const GenericPlaylistListAction = Data.taggedEnum<Action>()

export const genericPlaylistListAtom = Object.assign(
  Atom.writable(
    (get: Atom.Context) => get(remoteGenericPlaylistList),
    (ctx, action: Action) => {
      const currentState = ctx.get(genericPlaylistListAtom)
      if (!Result.isSuccess(currentState)) return

      const update = GenericPlaylistListAction.$match(action, {
        UpdatePlaylistList: ({ newPlaylistList }) => {
          return newPlaylistList
        },
        AddNewPlaylist: ({ newPlaylist }) => {
          return [newPlaylist, ...currentState.value]
        },
        UpdatePlaylist: ({ updatedPlaylist }) => {
          return currentState.value.map((item) => {
            if (item.id === updatedPlaylist.id) {
              return {
                ...updatedPlaylist
              } as sqlcDb.Playlist
            }
            return item
          })
        },
        DeletePlaylist: ({ playlistToDelete }) => {
          return currentState.value.filter((p) => p.id !== playlistToDelete.id)
        }
      })

      ctx.setSelf(Result.success(update))
    }
  ),
  { remote: remoteGenericPlaylistList }
)
