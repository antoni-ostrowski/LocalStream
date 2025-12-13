import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useAppForm } from "@/lib/app-form/app-form"
import { Plus } from "lucide-react"
import { useState } from "react"
import z from "zod"
import { sidebarIconSize } from "../sidebar-left"

export const playlistFormSchema = z.object({
  name: z.string().min(1, "Provide playlist name"),
  coverPath: z
    .string()
    .nullable()
    .or(z.literal(""))
    .transform((e) => (e === "" ? null : e))
})

export type PlaylistFormData = z.infer<typeof playlistFormSchema>

export function NewPlaylist() {
  const [isOpen, setIsOpen] = useState(false)
  // const { mutateAsync: createNewPlaylist, isPending } = useMutation({
  //   ...trpc.playlist.createPlaylist.mutationOptions(),
  //   onSuccess: () => {
  //     setIsOpen(false)
  //   },
  // })

  const form = useAppForm({
    defaultValues: {
      name: "",
      coverPath: ""
    } satisfies PlaylistFormData as PlaylistFormData,
    validators: {
      onSubmit: playlistFormSchema
    },
    onSubmit: async ({ value }) => {
      // const [, err] = await tryCatch(
      //   createNewPlaylist({ name: value.name, coverPath: value.coverPath }),
      // )
      // if (err) {
      //   console.error("Failed to create playlist - ", err)
      //   toast.error("Failed to create playlist")
      //   return
      // }
    }
  })
  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger className="w-full" asChild>
          <Button
            className="flex w-full items-center justify-start"
            variant={"ghost"}
          >
            <Plus size={sidebarIconSize} />
            New Playlist
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-4">
            <DialogTitle>Create new playlist</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              await form.handleSubmit()
            }}
          >
            <div className="space-y-4">
              <form.AppField name="name">
                {(field) => <field.InputField label="Playlist name" />}
              </form.AppField>

              <form.AppField name="coverPath">
                {(field) => <field.InputField label="Playlist cover path" />}
              </form.AppField>

              <Button variant={"outline"} type="submit" className="w-full">
                {/* {isPending ? "Creating..." : "Create Playlist"} */}
                create playst
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
