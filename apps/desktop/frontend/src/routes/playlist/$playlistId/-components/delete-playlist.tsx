import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Trash } from "lucide-react"
import { useState } from "react"

export function DeletePlaylist(
  {
    // currentPlaylistState,
  }: {
    // currentPlaylistState: PlaylistType
  }
) {
  // const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  // const { mutate: updatePlaylist, isPending } = useMutation({
  //   ...trpc.playlist.deletePlaylist.mutationOptions(),
  //   onSuccess: () => {
  //     setIsOpen(false)
  //   },
  // })

  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button variant={"destructive"}>
            <Trash />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col justify-start gap-4">
            <DialogTitle>
              {/* Delete Playlist - {currentPlaylistState.name} */}
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <Button>delete </Button>
          {/* <Button */}
          {/*   variant={"destructive"} */}
          {/*   onClick={async () => { */}
          {/*     updatePlaylist({ playlistId: currentPlaylistState.id }) */}
          {/*     setIsOpen(false) */}
          {/*     await navigate({ to: "/" }) */}
          {/*   }} */}
          {/* > */}
          {/*   {isPending ? ( */}
          {/*     <Spinner /> */}
          {/*   ) : ( */}
          {/*     <> */}
          {/*       <Trash /> */}
          {/*       Delete */}
          {/*     </> */}
          {/*   )} */}
          {/* </Button> */}
        </DialogContent>
      </Dialog>
    </>
  )
}
