import { useTrackArtwork } from "@/lib/hooks/get-artwork"
import { playbackStateAtom } from "@/src/api/atoms/playback-state-atom"
import { Result, useAtomValue } from "@effect-atom/atom-react"
import { type RefObject } from "react"
import Controls from "./controls"
import Metadata from "./metadata"
import ProgressBar from "./progress"
import VolumeControls from "./volume"
export type AudioRefType = RefObject<HTMLVideoElement | null>
export type ProgressBarRefType = RefObject<HTMLInputElement | null>

// the mock needs to be fully 1;1 to real inferface, make the real UI ?mockable?
// using mock UI prevents from flashes and enables to jsut refresh the atoms which makes stuff simpler
// and we dont loose the UX
export default function Player() {
  const playbackState = useAtomValue(playbackStateAtom)
  return (
    <>
      {Result.builder(playbackState)
        .onInitialOrWaiting(() => <Mock />)
        .onError(() => <Mock />)
        .onSuccess(({ length, playingTrack }) => (
          <>
            full length: {length}
            <div className="flex flex-col gap-2 p-4">
              <Metadata {...{ currentTrack: playingTrack }} />
              <ProgressBar {...{ length, currentTrack: playingTrack }} />

              <div className="flex w-full flex-col items-center justify-center gap-5">
                <VolumeControls {...{ currentTrack: playingTrack }} />
                <Controls {...{ currentTrack: playingTrack }} />
              </div>
            </div>
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
