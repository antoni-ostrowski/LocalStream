import { Button } from "@/components/ui/button"
import {
  GenericPlaylistListAction,
  genericPlaylistListAtom
} from "@/src/api/atoms/playlist-list-atom"
import { atomRuntime } from "@/src/api/make-runtime"
import { Mutations } from "@/src/api/mutations"
import { sqlcDb } from "@/wailsjs/go/models"
import { Registry, useAtom } from "@effect-atom/atom-react"
import { IconTrash } from "@tabler/icons-react"
import { Effect } from "effect"

const deletePlaylistAtom = atomRuntime.fn(
  Effect.fn(function* (playlist: sqlcDb.Playlist) {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations
    yield* m.deletePlaylist(playlist.id)
    registry.set(
      genericPlaylistListAtom,
      GenericPlaylistListAction.DeletePlaylist({ playlistToDelete: playlist })
    )
  })
)

export default function DeletePlaylist({
  playlist
}: {
  playlist: sqlcDb.Playlist
}) {
  const [, deletePlaylist] = useAtom(deletePlaylistAtom)
  return (
    <>
      <Button variant={"destructive"} onClick={() => deletePlaylist(playlist)}>
        <IconTrash />
      </Button>
    </>
  )
}
