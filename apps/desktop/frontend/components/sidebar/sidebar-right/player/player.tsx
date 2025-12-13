import { useTrackArtwork } from "@/lib/hooks/get-artwork"
import { currentPlayingAtom } from "@/src/api/atoms/current-playing-atom"
import { Result, useAtomValue } from "@effect-atom/atom-react"
import { Option } from "effect"
import { Star } from "lucide-react"
import { type RefObject } from "react"
import Controls from "./controls"
import Metadata from "./metadata"
import VolumeControls from "./volume"
export type AudioRefType = RefObject<HTMLVideoElement | null>
export type ProgressBarRefType = RefObject<HTMLInputElement | null>

// the mock needs to be fully 1;1 to real inferface, make the real UI ?mockable?
// using mock UI prevents from flashes and enables to jsut refresh the atoms which makes stuff simpler
// and we dont loose the UX
export default function Player() {
  const currentPlaying = useAtomValue(currentPlayingAtom)
  console.log({ currentPlaying })
  return (
    <>
      {Result.builder(currentPlaying)
        .onInitialOrWaiting(() => <Mock />)
        .onError(() => <Mock />)
        .onSuccess((currentTrack) => (
          <>
            {Option.match(currentTrack, {
              onNone: () => <p>nic</p>,
              onSome: (currentTrack) => (
                <div className="flex flex-col gap-2 p-4">
                  <Metadata {...{ currentTrack }} />

                  <Star
                    size={15}
                    className="cursor-pointer"
                    fill={
                      currentTrack.Track.starred.Valid &&
                      currentTrack.Track.starred.Int64
                        ? "yellow"
                        : ""
                    }
                    color={
                      currentTrack.Track.starred.Valid &&
                      currentTrack.Track.starred.Int64
                        ? "yellow"
                        : "white"
                    }
                  />
                  <div className="flex w-full flex-col items-center justify-center gap-5">
                    <VolumeControls {...{ currentTrack }} />
                    <Controls {...{ currentTrack }} />
                  </div>
                </div>
              ),
            })}
          </>
        ))
        .orNull()}
    </>
  )
}
function Mock() {
  const { renderArtworkOrFallback } = useTrackArtwork(null)
  return (
    <div className="flex flex-col gap-2 p-4">
      {renderArtworkOrFallback()}
      <div className="flex w-full flex-col items-center justify-center gap-5"></div>
    </div>
  )
}
