import { Button } from "@/components/ui/button"
import { IconStar } from "@tabler/icons-react"

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
      {false ? <IconStar fill="yellow" color="yellow" /> : <IconStar />}
    </Button>
  )
}
