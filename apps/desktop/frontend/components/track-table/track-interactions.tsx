import { usePlaybackControls } from "@/src/api/mutations"
import { queries } from "@/src/api/queries"
import { sqlcDb } from "@/wailsjs/go/models"
import { useQuery } from "@tanstack/react-query"
import { PauseIcon, PlayIcon } from "lucide-react"
import { Button } from "../ui/button"
import StarTrack from "./star-track"
import TrackContextMenu from "./track-context-menu"

export default function TrackInteractions({
  track,
  showPlayNow = true,
}: {
  track: sqlcDb.Track
  showPlayNow?: boolean
}) {
  return (
    <div className="flex flex-row items-center justify-start gap-1">
      {showPlayNow && <PlayNowBtn {...{ track }} />}
      <StarTrack {...{ track }} />
      <TrackContextMenu {...{ track }} />
    </div>
  )
}

function PlayNowBtn({ track }: { track: sqlcDb.Track }) {
  const { data: currentPlaying } = useQuery(queries.player.getCurrentPlaying())
  const isPaused = currentPlaying?.Ctrl?.Paused
  const { playNow } = usePlaybackControls()
  return (
    <Button variant="ghost" onClick={() => playNow.mutate(track)}>
      {track.id === currentPlaying?.Track.id && !isPaused ? (
        <PauseIcon className="cursor-pointer" size={15} />
      ) : (
        <PlayIcon className="cursor-pointer" size={15} />
      )}
    </Button>
  )
}
