import { Button } from "../../../../components/ui/button"

export default function FavArtist() {
  //   {
  //   artistName,
  //   isFav,
  // }: {
  //   artistName: string
  //   isFav: number | null | undefined
  // }
  // const { mutateAsync } = useMutation(
  //   trpc.metadata.starArtist.mutationOptions(),
  // )
  return (
    <Button
      variant={"ghost"}
      onClick={async (e) => {
        // e.preventDefault()
        // e.stopPropagation()
        // await mutateAsync({ artist: artistName })
      }}
    >
      {/* {false ? <IconStar fill="yellow" color="yellow" /> : <IconStar />} */}
    </Button>
  )
}
