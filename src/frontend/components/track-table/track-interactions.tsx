import { playNowAtom } from "@/src/api/atoms/playback-state-atom"
import { sqlcDb } from "@/wailsjs/go/models"
import { useAtom } from "@effect-atom/atom-react"
import { IconPlayerPlay } from "@tabler/icons-react"
import { Button } from "../ui/button"
import StarTrack from "./star-track"
import TrackContextMenu from "./track-context-menu"

export default function TrackInteractions({
  track
}: {
  track: sqlcDb.Track
  showPlayNow?: boolean
}) {
  return (
    <div className="flex flex-row items-center justify-start gap-0.5">
      <StarTrack {...{ track }} />
      {track.is_missing.Valid && !track.is_missing.Bool && (
        <TrackContextMenu {...{ track }} />
      )}
    </div>
  )
}

export function PlayNowBtn({ track }: { track: sqlcDb.Track }) {
  const [, playNow] = useAtom(playNowAtom)
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          if (track.is_missing.Bool && track.is_missing.Valid) {
            return
          }
          playNow(track)
        }}
      >
        <IconPlayerPlay className="cursor-pointer" size={15} />
      </Button>
    </>
  )
}
