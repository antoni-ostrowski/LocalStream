import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Edit } from "lucide-react"
import { useState } from "react"

export function EditPlaylist(
  {
    // currentPlaylistState,
  }: {
    // currentPlaylistState: PlaylistType
  }
) {
  const [isOpen, setIsOpen] = useState(false)
  // const { mutateAsync: updatePlaylist, isPending } = useMutation({
  //   ...trpc.playlist.editPlaylist.mutationOptions(),
  //   onSuccess: () => {
  //     setIsOpen(false)
  //   },
  // })
  // const form = useAppForm({
  //   defaultValues: {
  //     name: currentPlaylistState.name,
  //     coverPath: currentPlaylistState.coverPath,
  //   } as PlaylistFormData,
  //   validators: {
  //     onSubmit: playlistFormSchema,
  //   },
  //   onSubmit: async ({ value }) => {
  //     const [, err] = await tryCatch(
  //       updatePlaylist({
  //         newState: value,
  //         playlistId: currentPlaylistState.id,
  //       }),
  //     )
  //
  //     if (err) {
  //       console.error("Failed to edit playlist - ", err)
  //       toast.error("Failed to edit playlist")
  //       return
  //     }
  //   },
  // })
  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button variant={"outline"}>
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-4">
            <DialogTitle>Edit Playlist</DialogTitle>
          </DialogHeader>
          <Button>edit</Button>
          {/* <form */}
          {/*   onSubmit={async (e) => { */}
          {/*     e.preventDefault() */}
          {/*     await form.handleSubmit() */}
          {/*   }} */}
          {/* > */}
          {/*   <div className="space-y-4"> */}
          {/*     <form.AppField name="name"> */}
          {/*       {(field) => <field.InputField label="Playlist name" />} */}
          {/*     </form.AppField> */}
          {/**/}
          {/*     <form.AppField name="coverPath"> */}
          {/*       {(field) => <field.InputField label="Cover path" />} */}
          {/*     </form.AppField> */}
          {/**/}
          {/*     <Button variant={"outline"} type="submit" className="w-full"> */}
          {/*       {isPending ? "Editing..." : "Edit Playlist"} */}
          {/*     </Button> */}
          {/*   </div> */}
          {/* </form> */}
        </DialogContent>
      </Dialog>
    </>
  )
}
