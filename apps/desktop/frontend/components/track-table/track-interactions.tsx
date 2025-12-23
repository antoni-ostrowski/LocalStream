import {
  pauseResumeAtom,
  playNowAtom
} from "@/src/api/atoms/playback-state-atom"
import { sqlcDb } from "@/wailsjs/go/models"
import { useAtom } from "@effect-atom/atom-react"
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react"
import { Button } from "../ui/button"
import StarTrack from "./star-track"
import TrackContextMenu from "./track-context-menu"

export default function TrackInteractions({
  track,
  showPlayNow = true
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
  const [, playNow] = useAtom(playNowAtom)
  const [, pauseResume] = useAtom(pauseResumeAtom)
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          console.log("pause rems")
          pauseResume({})
        }}
      >
        <IconPlayerPause className="cursor-pointer" size={15} />
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          playNow(track)
        }}
      >
        <IconPlayerPlay className="cursor-pointer" size={15} />
      </Button>
    </>
  )
}
