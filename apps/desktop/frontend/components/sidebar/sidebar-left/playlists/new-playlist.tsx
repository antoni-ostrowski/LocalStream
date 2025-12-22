import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAppForm } from "@/lib/app-form/app-form"
import {
  GenericPlaylistListAction,
  genericPlaylistListAtom
} from "@/src/api/atoms/playlist-list-atom"
import { withToast } from "@/src/api/effect-utils"
import { atomRuntime } from "@/src/api/make-runtime"
import { Mutations } from "@/src/api/mutations"
import { GetImageFromPath } from "@/wailsjs/go/main/App"
import { Registry, Result, useAtom } from "@effect-atom/atom-react"
import { Effect, Schema } from "effect"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { sidebarIconSize } from "../sidebar-left"

export const playlistFormSchema = Schema.standardSchemaV1(
  Schema.Struct({
    name: Schema.NonEmptyString.pipe(
      Schema.annotations({
        message: () => "Provide playlist name"
      })
    ),
    coverPath: Schema.String.pipe()
  })
)

export type CreatePlaylistFormData = Schema.Schema.Type<
  typeof playlistFormSchema
>

const submitNewPlaylistAtom = atomRuntime.fn(
  Effect.fn(function* (input: CreatePlaylistFormData) {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations
    const newPlaylist = yield* m.createPlaylist(input)

    registry.set(
      genericPlaylistListAtom,
      GenericPlaylistListAction.AddNewPlaylist({ newPlaylist })
    )
  })
)

export function NewPlaylist() {
  const [state, submit] = useAtom(submitNewPlaylistAtom)
  const [isOpen, setIsOpen] = useState(false)
  const [coverPreviewString, setCoverPreviewString] = useState("")
  console.log({ state })
  const form = useAppForm({
    defaultValues: {
      name: "New playlist",
      coverPath: ""
    } satisfies CreatePlaylistFormData as CreatePlaylistFormData,
    validators: {
      onSubmit: playlistFormSchema
    },
    onSubmit: async ({ value }) => {
      submit(value)

      form.reset()
      setIsOpen(false)
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
              e.stopPropagation()
              await form.handleSubmit()
            }}
          >
            <FieldSet className="gap-2">
              <form.AppField name="coverPath">
                {(field) => {
                  return (
                    <Field>
                      <FieldLabel>Playlist cover art</FieldLabel>
                      <FieldDescription>
                        Optional playlist cover image.
                      </FieldDescription>
                      <div className="flex flex-row justify-between gap-2">
                        <Input
                          className="w-3/4"
                          value={field.state.value}
                          onChange={() => null}
                        />
                        <SelectPlaylistCoverBtn
                          {...{
                            updater: (newPath, previewString) => {
                              field.handleChange(newPath)
                              setCoverPreviewString(previewString)
                            }
                          }}
                        />
                      </div>
                      <img src={coverPreviewString} className="rounded-2xl" />
                    </Field>
                  )
                }}
              </form.AppField>

              <form.AppField name="name">
                {(field) => <field.InputField label="Playlist name" />}
              </form.AppField>
              <Button variant={"outline"} type="submit" className="w-full">
                {form.state.isSubmitting ? "Creating..." : "Create Playlist"}
              </Button>
            </FieldSet>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

const selectPlaylistCoverAtom = atomRuntime.fn(
  Effect.fn(function* () {
    const m = yield* Mutations
    return yield* m.selectPlaylistCoverFile.pipe(
      withToast({
        onFailure: "Failed to select playlist cover",
        onSuccess: (a) => a
      })
    )
  })
)

function SelectPlaylistCoverBtn({
  updater
}: {
  updater: (newPath: string, previewString: string) => void
}) {
  const [state, select] = useAtom(selectPlaylistCoverAtom)

  useEffect(() => {
    Result.builder(state).onSuccess(async (value) => {
      const previewString = await GetImageFromPath(value)
      updater(value, previewString)
    })
  }, [state, updater])

  return (
    <Button
      className="w-1/4"
      variant={"outline"}
      onClick={() => {
        select()
      }}
    >
      Select file
    </Button>
  )
}
