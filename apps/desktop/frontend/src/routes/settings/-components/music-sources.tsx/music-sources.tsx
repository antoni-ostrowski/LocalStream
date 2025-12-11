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
import { useCreateNewSource, useUpdatePreferences } from "@/src/api/mutations"
import { queries } from "@/src/api/queries"
import { config } from "@/wailsjs/go/models"
import { Result, useAtomValue } from "@effect-atom/atom-react"
import { FolderOpen, Music, Plus, Trash } from "lucide-react"

export default function MusicSources() {
  const preferencesAtom = useAtomValue(queries.me.preferences)

  const { mutate: createNewSource, isPending: isMutating } =
    useCreateNewSource()

  return (
    <>
      {Result.builder(preferencesAtom)
        .onInitialOrWaiting(() => <p>loading</p>)
        .onError((error) => (
          <div className="text-destructive">
            Error fetching preferences, {error.message}
          </div>
        ))
        .onSuccess((preferences) => (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen />
                <h1>Music Sources</h1>
              </CardTitle>
              <CardDescription>
                <p>
                  Add directories containing your music files. These will be
                  scanned for tracks.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h1>Add New Source</h1>
                  </CardTitle>
                  <CardDescription>
                    <p className="text-muted-foreground text-sm">
                      Make sure the directory path is accessible and contains
                      music files.
                    </p>
                  </CardDescription>
                </CardHeader>

                <CardFooter>
                  <Button
                    variant={"outline"}
                    type="submit"
                    className="flex items-center gap-2"
                    onClick={() => {
                      createNewSource()
                    }}
                  >
                    {isMutating ? (
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
              <CardFooter className="w-full px-0">
                {preferences.sourceDirs.length > 0 && (
                  <ActiveSources
                    sourceDirs={preferences.sourceDirs}
                    prefs={preferences}
                  />
                )}
              </CardFooter>
            </CardContent>
          </Card>
        ))
        .orNull()}
    </>
  )
}

function ActiveSources({
  sourceDirs,
  prefs,
}: {
  sourceDirs: string[]
  prefs: config.Preferences
}) {
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
        {sourceDirs.map((source) => (
          <Source key={crypto.randomUUID()} {...{ prefs, source }} />
        ))}
      </CardContent>
    </Card>
  )
}
function Source({
  source,
  prefs,
}: {
  source: string
  prefs: config.Preferences
}) {
  const { mutate: updatePrefs, isPending: isMutating } = useUpdatePreferences()

  function handleUpdate() {
    if (!prefs) return
    const newPrefs = {
      databasePath: prefs.databasePath,
      sourceDirs: prefs.sourceDirs.filter((a) => a !== source),
    } as config.Preferences

    updatePrefs(newPrefs)
  }

  return (
    <>
      <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
        <Music className="text-muted-foreground h-4 w-4 shrink-0" />
        <span className="flex-1 truncate font-mono text-sm">{source}</span>
        <Badge>Active</Badge>
        <Button variant={"destructive"} onClick={handleUpdate}>
          {isMutating ? <Spinner /> : <Trash />}
        </Button>
      </div>
    </>
  )
}
