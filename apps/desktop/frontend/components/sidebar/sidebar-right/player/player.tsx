import {
  playbackStateAtom,
  PlaybackStateAtomAction
} from "@/src/api/atoms/playback-state-atom"
import { queueAtom } from "@/src/api/atoms/queue-atom"
import { atomRuntime } from "@/src/api/make-runtime"
import { Queries } from "@/src/api/queries"
import { EventsOn } from "@/wailsjs/runtime/runtime"
import {
  Registry,
  Result,
  useAtom,
  useAtomValue
} from "@effect-atom/atom-react"
import { Effect } from "effect"
import { useEffect, type RefObject } from "react"
import Controls from "./controls"
import Metadata from "./metadata"
import ProgressBar from "./progress"
import VolumeControls from "./volume"
export type AudioRefType = RefObject<HTMLVideoElement | null>
export type ProgressBarRefType = RefObject<HTMLInputElement | null>

export const updatePlayingTrack = atomRuntime.fn(
  Effect.fn(function* (args: { trackId: string; newLength: number }) {
    const registry = yield* Registry.AtomRegistry
    const q = yield* Queries
    const track = yield* q.getTrackById(args.trackId)
    registry.set(
      playbackStateAtom,
      PlaybackStateAtomAction.UpdatePlayingTrack({ newPlayingTrack: track })
    )
    registry.set(
      playbackStateAtom,
      PlaybackStateAtomAction.UpdatePlayingTrackLength({
        newLegth: args.newLength
      })
    )
    registry.refresh(queueAtom.remote)
  })
)

export default function Player() {
  const playbackState = useAtomValue(playbackStateAtom)
  const [, update] = useAtom(updatePlayingTrack)

  useEffect(() => {
    EventsOn("playback", (trackId: string, newTrackLength: number) => {
      update({ trackId: trackId, newLength: newTrackLength })
    })
  }, [])

  return (
    <>
      {Result.builder(playbackState)
        .onInitialOrWaiting(() => <Mock />)
        .onError(() => <Mock />)
        .onSuccess(({ length, playingTrack, isPlaying }) => (
          <>
            <div className="flex flex-col gap-2 p-4">
              <Metadata {...{ currentTrack: playingTrack }} />

              <ProgressBar {...{ length, currentTrack: playingTrack }} />
              <div className="flex w-full flex-col items-center justify-center gap-8">
                <Controls {...{ remoteIsPlaying: isPlaying }} />
                <VolumeControls />
              </div>
            </div>
          </>
        ))
        .orElse(() => (
          <Mock />
        ))}
    </>
  )
}

function Mock() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <img src="/placeholder.webp" />
      <div className="flex w-full flex-col items-center justify-center gap-5"></div>
    </div>
  )
}
