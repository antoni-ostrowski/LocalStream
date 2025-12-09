import { queries } from "@/src/api/queries"
import { useQuery } from "@tanstack/react-query"
import { type RefObject } from "react"
import Controls from "./controls"
import Metadata from "./metadata"
import VolumeControls from "./volume"
export type AudioRefType = RefObject<HTMLVideoElement | null>
export type ProgressBarRefType = RefObject<HTMLInputElement | null>

export default function Player() {
  const { data: currentTrack } = useQuery(queries.player.getCurrentPlaying())
  if (!currentTrack) return null
  console.log({ currentTrack })
  return (
    <div className="flex flex-col gap-2 p-4">
      <Metadata {...{ currentTrack }} />
      <div className="flex w-full flex-col items-center justify-center gap-5">
        {/* <ProgressBar */}
        {/*   {...{ */}
        {/*     currentTrack, */}
        {/*     audioRef, */}
        {/*     handlePause, */}
        {/*     handlePlay, */}
        {/*     progressBarRef, */}
        {/*     currentTime, */}
        {/*     setCurrentTime, */}
        {/*   }} */}
        {/* /> */}

        <VolumeControls {...{ currentTrack }} />
        <Controls {...{ currentTrack }} />
      </div>
    </div>
  )
}
