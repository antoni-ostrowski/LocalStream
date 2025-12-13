import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { triggerTrackSyncAtom } from "@/src/api/atoms/settings-atom"
import { useAtom } from "@effect-atom/atom-react"
import { RefreshCw } from "lucide-react"

export default function ManualTracksSync() {
  const [trackSyncState, triggerTrackSync] = useAtom(triggerTrackSyncAtom)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1>Sync your library</h1>
        </CardTitle>
        <CardDescription>
          <p>
            This will scan all your music sources and update the database with
            any new or changed tracks.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant={"outline"}
          onClick={() => triggerTrackSync()}
          size="lg"
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${trackSyncState.waiting ? "animate-spin" : ""}`}
          />
          {trackSyncState.waiting
            ? "Syncing Tracks..."
            : "Sync Tracks Manually"}
        </Button>
      </CardContent>
    </Card>
  )
}
