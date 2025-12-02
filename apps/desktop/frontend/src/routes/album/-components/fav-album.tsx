import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function FavAlbum() {
  // {
  //     album
  //   }: {
  //       album: AlbumType
  // },
  // const { mutateAsync } = useMutation(trpc.album.starAlbum.mutationOptions())

  return (
    <Button
      variant={"ghost"}
      onClick={async (e) => {
        // e.preventDefault()
        // e.stopPropagation()
        // await mutateAsync({
        //   albumName: album.albumName,
        //   albumId: album.id,
        //   currentStarStatus: album.starred,
        // })
      }}
    >
      {false ? <Star fill="yellow" color="yellow" /> : <Star />}
    </Button>
  )
}
