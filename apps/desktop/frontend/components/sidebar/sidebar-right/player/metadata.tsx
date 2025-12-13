import TrackInteractions from "@/components/track-table/track-interactions"
import { useTrackArtwork } from "@/lib/hooks/get-artwork"
import { sqlcDb } from "@/wailsjs/go/models"
import { Dot } from "lucide-react"

export default function Metadata({
  currentTrack
}: {
  currentTrack: sqlcDb.Track
}) {
  const { renderArtworkOrFallback } = useTrackArtwork(currentTrack)

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {renderArtworkOrFallback()}
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex w-full flex-col items-start justify-start">
          <h1 className="text-xl font-bold">{currentTrack.title}</h1>
          <div className="flex flex-row items-center justify-center gap-0">
            <h2 className="text-muted-foreground">{currentTrack.artist}</h2>
            <Dot className="text-muted-foreground" />
            <h2 className="text-muted-foreground">{currentTrack.album}</h2>
          </div>
        </div>
        <TrackInteractions {...{ track: currentTrack, showPlayNow: false }} />
      </div>
    </div>
  )
}
