import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useAppForm } from "@/lib/app-form/app-form"
import { tryCatch } from "@/lib/utils"
import { FolderOpen, Music, Plus, TrashIcon } from "lucide-react"
import { toast } from "sonner"
import z from "zod"

const formSchema = z.object({
  newMusicSource: z.string().min(1, "Empty file path!"),
})

type FormData = z.infer<typeof formSchema>

export default function MusicSources() {
  // const { data, error, isPending } = useQuery(
  //   trpc.user.getPreferences.queryOptions(),
  // )
  //
  // const { mutateAsync: addSourceFunc } = useMutation(
  //   trpc.user.addSource.mutationOptions(),
  // )

  const form = useAppForm({
    defaultValues: {
      newMusicSource: "",
    } satisfies FormData as FormData,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const [, err] = await tryCatch(
        (async () => {
          // return await addSourceFunc({ source: value.newMusicSource })
        })(),
      )

      if (err) {
        toast.error("Failed to add music source.")
        return
      }

      toast.success("Created new music source.")

      form.reset()
    },
  })
  // if (isPending) return null
  // if (error || !data) {
  //   return <div className="text-destructive">Error fetching preferences</div>
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen />
          <h1>Music Sources</h1>
        </CardTitle>
        <CardDescription>
          <p>
            Add directories containing your music files. These will be scanned
            for tracks.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            // await form.handleSubmit()
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                <h1>Add New Source</h1>
              </CardTitle>
              <CardDescription>
                <p className="text-muted-foreground text-sm">
                  Make sure the directory path is accessible and contains music
                  files.
                </p>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form.AppField name="newMusicSource">
                {(field) => <field.InputField label="New music source" />}
              </form.AppField>
            </CardContent>
            <CardFooter>
              <Button
                variant={"outline"}
                type="submit"
                className="flex items-center gap-2"
              >
                {form.state.isSubmitting ? (
                  <>
                    <Spinner />
                    <p>Adding...</p>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <p>Add Source</p>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
        <CardFooter className="w-full px-0">
          {true && <ActiveSources sourceUrls={["test/url/ifdjlk"]} />}
        </CardFooter>
      </CardContent>
    </Card>
  )
}

function ActiveSources({ sourceUrls }: { sourceUrls: string[] }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <h4>Active Sources</h4>
        </CardTitle>
        <CardDescription>
          <p>Your music sources.</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {sourceUrls.map((source) => (
          <Source source={source} key={`source-${crypto.randomUUID()}`} />
        ))}
      </CardContent>
    </Card>
  )
}
function Source({ source }: { source: string }) {
  // const { mutateAsync: deleteSource, isPending } = useMutation(
  //   trpc.user.deleteSource.mutationOptions()
  // )
  return (
    <>
      <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
        <Music className="text-muted-foreground h-4 w-4 shrink-0" />
        <span className="flex-1 truncate font-mono text-sm">{source}</span>
        <Badge>Active</Badge>
        <Button
          variant={"destructive"}
          onClick={async () => {
            // await deleteSource({ source })
          }}
        >
          {/* {isPending ? <Spinner /> : <Trash />} */}
          <TrashIcon />
        </Button>
      </div>
    </>
  )
}
