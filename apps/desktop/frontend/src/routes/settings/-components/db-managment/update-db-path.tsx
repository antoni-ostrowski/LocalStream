import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useAppForm } from "@/lib/app-form/app-form"
import {
  defaultPreferencesAtom,
  settingsAtom,
  updatePrefsAtom
} from "@/src/api/atoms/settings-atom"
import { config } from "@/wailsjs/go/models"
import { Result, useAtom, useAtomValue } from "@effect-atom/atom-react"
import { IconPencilOff, IconRefresh } from "@tabler/icons-react"
import { toast } from "sonner"
import z from "zod"

const formSchema = z.object({
  newDatabasePath: z.string().min(1, "Empty file path!")
})

type FormData = z.infer<typeof formSchema>

export default function UpdateDbPath() {
  const settings = useAtomValue(settingsAtom)
  const defaultSettings = useAtomValue(defaultPreferencesAtom)

  return (
    <>
      {Result.builder(settings)
        .onInitialOrWaiting(() => <Spinner />)
        .onSuccess((settings) => (
          <>
            {Result.builder(defaultSettings)
              .onError((error) => <p>Failed to load data: {error.message}</p>)
              .onSuccess((defaults) => (
                <DoUpdating
                  preferences={settings}
                  defaultPreferences={defaults}
                />
              ))
              .orNull()}
          </>
        ))
        .orNull()}
    </>
  )
}

function DoUpdating({
  preferences,
  defaultPreferences
}: {
  preferences: config.Preferences
  defaultPreferences: config.Preferences
}) {
  const [, updatePrefs] = useAtom(updatePrefsAtom)
  const form = useAppForm({
    defaultValues: {
      newDatabasePath: preferences.databasePath
    } satisfies FormData as FormData,
    validators: {
      onSubmit: formSchema
    },
    onSubmit: async ({ value }) => {
      const newPrefs = {
        databasePath: value.newDatabasePath,
        sourceDirs: preferences.sourceDirs
      } as config.Preferences
      updatePrefs(newPrefs)
      toast.success("Succesfully changed the database path.", {
        description: "Please reopen the app to load new database."
      })
    }
  })

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        await form.handleSubmit()
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
            variant={"destructive"}
            onClick={() => {
              form.state.values.newDatabasePath =
                defaultPreferences.databasePath
            }}
          >
            {form.state.isSubmitting ? (
              <Spinner />
            ) : (
              <>
                <IconPencilOff /> Reset to default
              </>
            )}
          </Button>
          <Button type="submit">
            {form.state.isSubmitting ? (
              <Spinner />
            ) : (
              <>
                <IconRefresh /> Update
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
