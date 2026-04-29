import TrackInteractions from "@/components/track-table/track-interactions"
import { createArtworkLink } from "@/lib/utils"
import { sqlcDb } from "@/wailsjs/go/models"

export default function Metadata({
  currentTrack
}: {
  currentTrack: sqlcDb.Track
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <img src={createArtworkLink(currentTrack.path) ?? "/placeholder.webp"} />
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex w-full flex-col items-start justify-start">
          <h1 className="text-xl font-bold">{currentTrack.title}</h1>
          <div className="flex flex-row items-center justify-center gap-1">
            <h2 className="text-muted-foreground">{currentTrack.artist}</h2>
            <h2 className="text-muted-foreground">-</h2>
            <h2 className="text-muted-foreground">{currentTrack.album}</h2>
          </div>
        </div>
        <TrackInteractions {...{ track: currentTrack }} />
      </div>
    </div>
  )
}
