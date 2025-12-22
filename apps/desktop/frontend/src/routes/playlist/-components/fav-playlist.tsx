import { Button } from "@/components/ui/button"
import {
  GenericPlaylistListAction,
  genericPlaylistListAtom
} from "@/src/api/atoms/playlist-list-atom"
import { atomRuntime } from "@/src/api/make-runtime"
import { Mutations } from "@/src/api/mutations"
import { sqlcDb } from "@/wailsjs/go/models"
import { Registry, useAtom } from "@effect-atom/atom-react"
import { Effect } from "effect"
import { Star } from "lucide-react"

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
      <Button onClick={() => starPlaylist(playlist.id)}>
        {playlist.starred?.Valid ? (
          <Star color="yellow" fill="yellow" />
        ) : (
          <Star />
        )}
      </Button>
    </>
  )
}

//   variant={"ghost"}
//   onClick={async (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     await mutateAsync({
//       playlistId: playlist.id,
//       currentStarStatus: playlist.starred,
//     })
//   }}
// >
//   <>{playlist.starred ? <Star fill="yellow" color="yellow" /> : <Star />}</>
// </Button>
