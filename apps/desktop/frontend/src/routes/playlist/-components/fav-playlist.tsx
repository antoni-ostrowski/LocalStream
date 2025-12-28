import { Button } from "@/components/ui/button"
import {
  GenericPlaylistListAction,
  genericPlaylistListAtom
} from "@/src/api/atoms/playlist-list-atom"
import { atomRuntime } from "@/src/api/make-runtime"
import { Mutations } from "@/src/api/mutations"
import { sqlcDb } from "@/wailsjs/go/models"
import { Registry, useAtom } from "@effect-atom/atom-react"
import { IconStar } from "@tabler/icons-react"
import { Effect } from "effect"
import { getPlaylistAtom } from "../$playlistId/route"

const starPlaylistAtom = atomRuntime.fn(
  Effect.fn(function* (playlistId: string) {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations
    const newPlaylistState = yield* m.starPlaylist(playlistId)

    registry.set(
      genericPlaylistListAtom,
      GenericPlaylistListAction.UpdatePlaylist({
        updatedPlaylist: newPlaylistState
      })
    )
    registry.refresh(getPlaylistAtom(playlistId))
  })
)

export default function FavPlaylist({
  playlist
}: {
  playlist: sqlcDb.Playlist
}) {
  console.log({ playlist })
  const [state, starPlaylist] = useAtom(starPlaylistAtom)
  console.log({ state })
  return (
    <>
      <Button onClick={() => starPlaylist(playlist.id)} variant={"ghost"}>
        {playlist.starred?.Valid ? (
          <IconStar color="yellow" fill="yellow" />
        ) : (
          <IconStar />
        )}
      </Button>
    </>
  )
}
