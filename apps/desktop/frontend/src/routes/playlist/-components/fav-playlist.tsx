import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function FavPlaylist() {
  //   {
  //     // playlist
  //   }: {
  //     // playlist: PlaylistType
  //   },
  // const { mutateAsync } = useMutation(
  //   trpc.playlist.starPlaylist.mutationOptions()
  // )

  return (
    <Button>
      <Star />
    </Button>
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
