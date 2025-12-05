import { sqlcDb } from "@/wailsjs/go/models"
import StarTrack from "./star-track"
import TrackContextMenu from "./track-context-menu"

export default function TrackInteractions({ track }: { track: sqlcDb.Track }) {
  return (
    <div className="flex flex-row items-center justify-start gap-2">
      <StarTrack {...{ track }} />
      <TrackContextMenu track={track} />
    </div>
  )
}
