import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useAppForm } from "@/lib/app-form/app-form"
import { PenOff, RefreshCcw } from "lucide-react"
import z from "zod"

const formSchema = z.object({
  newDatabasePath: z.string().min(1, "Empty file path!"),
})

type FormData = z.infer<typeof formSchema>

export default function UpdateDbPath() {
  // const { data: preferences, isPending } = useQuery(
  //   trpc.user.getPreferences.queryOptions()
  // )

  // const { data: defaultPreferences, isPending: isDefaultPreferencesPending } =
  //   useQuery(trpc.user.getDefaultPreferences.queryOptions())

  // if (isPending || isDefaultPreferencesPending) return <Spinner />
  // if (!preferences || !defaultPreferences)
  //   return <div>Failed to load preferences</div>
  //
  return <DoUpdating />
}

function DoUpdating() {
  //   {
  //   preferences,
  //   defaultPreferences,
  // }: {
  //   preferences: Preferences
  //   defaultPreferences: Preferences
  // }
  // const { mutateAsync } = useMutation({
  //   ...trpc.user.updateDbPath.mutationOptions(),
  // })

  const form = useAppForm({
    defaultValues: {
      newDatabasePath: "test path",
    } satisfies FormData as FormData,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      // const [, err] = await tryCatch(
      //   (async () => {
      //     return await mutateAsync({ newPath: value.newDatabasePath })
      //   })(),
      // )
      // if (err) {
      //   toast.error("Failed to update database file path.")
      //   return
      // }
      //
      toast.success("Succesfully changed the database path.", {
        description: "Please reopen the app to load new database.",
      })
    },
  })

  return (
    <form
      onSubmit={async (e) => {
        // e.preventDefault()
        // await form.handleSubmit()
      }}
    >
      <Card>
        <CardContent className="flex flex-col">
          <form.AppField name="newDatabasePath">
            {(field) => <field.InputField label="New sqlite file path" />}
          </form.AppField>
        </CardContent>

        <CardFooter className="flex-row gap-2">
          <Button
            type="submit"
            variant={"outline"}
            onClick={() => {
              // form.state.values.newDatabasePath =
              //   defaultPreferences.databasePath
            }}
          >
            {form.state.isSubmitting ? (
              <Spinner />
            ) : (
              <>
                <PenOff /> Reset to default
              </>
            )}
          </Button>
          <Button type="submit">
            {form.state.isSubmitting ? (
              <Spinner />
            ) : (
              <>
                <RefreshCcw /> Update
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
