import TrackInteractions from "@/components/track-table/track-interactions"
import { useTrackArtwork } from "@/lib/hooks"
import { playback } from "@/wailsjs/go/models"
import { Dot } from "lucide-react"

export default function Metadata({
  currentTrack,
}: {
  currentTrack: playback.Playable
}) {
  const { renderArtworkOrFallback } = useTrackArtwork(currentTrack.Track)

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {renderArtworkOrFallback()}
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex w-full flex-col items-start justify-start">
          <h1 className="text-xl font-bold">{currentTrack.Track.title}</h1>
          <div className="flex flex-row items-center justify-center gap-0">
            <h2 className="text-muted-foreground">
              {currentTrack.Track.artist}
            </h2>
            <Dot className="text-muted-foreground" />
            <h2 className="text-muted-foreground">
              {currentTrack.Track.album}
            </h2>
          </div>
        </div>
        <TrackInteractions
          {...{ track: currentTrack.Track, showPlayNow: false }}
        />
      </div>
    </div>
  )
}
