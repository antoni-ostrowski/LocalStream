import { useState } from "react"

export function EditPlaylist() {
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
  return <>kjfldsa</>
}
