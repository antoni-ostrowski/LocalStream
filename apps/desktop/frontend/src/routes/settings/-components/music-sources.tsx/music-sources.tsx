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
import { useUpdatePreferences } from "@/src/api/mutations"
import { queries } from "@/src/api/queries"
import { CreateSourceUrl } from "@/wailsjs/go/main/App"
import { config } from "@/wailsjs/go/models"
import { useQuery } from "@tanstack/react-query"
import { FolderOpen, Music, Plus, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function MusicSources() {
  const {
    data: preferences,
    error,
    isPending,
  } = useQuery(queries.me.preferences())

  const [isMutating, setIsMutating] = useState(false)

  if (isPending) return null

  if (error) {
    console.error(error)
    return (
      <div className="text-destructive">
        Error fetching preferences, {error.message}
      </div>
    )
  }

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

          <CardFooter>
            <Button
              variant={"outline"}
              type="submit"
              className="flex items-center gap-2"
              onClick={async () => {
                setIsMutating(true)
                try {
                  await CreateSourceUrl()
                } catch (e) {
                  toast.error("Failed to add new source!", {
                    description: e.message,
                  })
                }
                setIsMutating(false)
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
          {preferences.sourceUrls.length > 0 && (
            <ActiveSources sourceUrls={preferences.sourceUrls} />
          )}
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
  const { data: preferences } = useQuery(queries.me.preferences())
  const { mutate: updatePrefs, isPending: isMutating } = useUpdatePreferences()

  function handleUpdate() {
    if (!preferences) return
    const newPrefs = {
      databasePath: preferences.databasePath,
      sourceUrls: preferences.sourceUrls.filter((a) => a !== source),
    } as config.Preferences
    console.log({ newPrefs })

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
