import { Button } from "@/components/ui/button"
import {
  pauseResumeAtom,
  skipTrackAtom
} from "@/src/api/atoms/playback-state-atom"
import { useAtom } from "@effect-atom/atom-react"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"

export default function Controls({
  remoteIsPlaying
}: {
  remoteIsPlaying: boolean
}) {
  const [, skipTrack] = useAtom(skipTrackAtom)
  const [_, pauseResume] = useAtom(pauseResumeAtom)

  return (
    <div className="flex w-full flex-row items-center justify-center gap-4">
      <Button variant={"ghost"} className="w-min cursor-pointer">
        <SkipBack />
      </Button>
      <Button
        variant={"ghost"}
        className="w-min cursor-pointer"
        onClick={() => pauseResume({})}
      >
        {remoteIsPlaying ? <Play /> : <Pause />}
      </Button>
      <Button
        variant={"ghost"}
        className="w-min cursor-pointer"
        onClick={() => skipTrack()}
      >
        <SkipForward />
      </Button>
    </div>
  )
}
