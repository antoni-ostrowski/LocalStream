import {
  currentPlayingAtom,
  pauseResumeAtom,
  playNowAtom,
} from "@/src/api/atoms/current-playing-atom"
import { sqlcDb } from "@/wailsjs/go/models"
import { Result, useAtom, useAtomValue } from "@effect-atom/atom-react"
import { Option } from "effect"
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
  const currentPlaying = useAtomValue(currentPlayingAtom)
  const [_, playNow] = useAtom(playNowAtom)
  const [__, pauseResume] = useAtom(pauseResumeAtom)
  console.log({ currentPlaying })
  return (
    <>
      {Result.builder(currentPlaying)
        .onError(() => (
          <>
            <Button variant={"ghost"} onClick={() => playNow(track)}>
              <PlayIcon className="cursor-pointer" size={15} />
            </Button>
          </>
        ))
        .onSuccess((currentTrackOption) =>
          Option.match(currentTrackOption, {
            onSome: (currentTrack) => {
              const isThisTrackPlayingRightNow =
                !currentTrack.Ctrl?.Paused && currentTrack.Track.id === track.id

              return (
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (isThisTrackPlayingRightNow) {
                      pauseResume()
                      console.log("shoould pause resume")
                    } else {
                      playNow(track)
                    }
                  }}
                >
                  {isThisTrackPlayingRightNow ? (
                    <PauseIcon className="cursor-pointer" size={17} />
                  ) : (
                    <PlayIcon className="cursor-pointer" size={15} />
                  )}
                </Button>
              )
            },
            onNone: () => (
              <>
                <Button>jfklds</Button>
              </>
            ),
          }),
        )
        .orNull()}
    </>
  )
}
