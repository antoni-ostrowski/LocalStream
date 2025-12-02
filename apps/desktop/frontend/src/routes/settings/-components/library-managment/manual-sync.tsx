import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

export default function ManualTracksSync() {
  // const { mutateAsync: manualSync } = useMutation(
  //   trpc.track.syncTracks.mutationOptions()
  // )
  // const [isSyncing, setIsSyncing] = useState(false)
  async function handleSyncTrigger() {
    // setIsSyncing(true)
    // await manualSync()
    // setIsSyncing(false)
  }
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
          onClick={async () => await handleSyncTrigger()}
          size="lg"
          className="flex items-center gap-2"
        >
          {/* <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} /> */}
          <RefreshCw />
          {/* {isSyncing ? "Syncing Tracks..." : "Sync Tracks Manually"} */}
          sycn tracks
        </Button>
      </CardContent>
    </Card>
  )
}
