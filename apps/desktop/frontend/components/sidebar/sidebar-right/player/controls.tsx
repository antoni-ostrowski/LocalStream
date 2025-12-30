import { Button } from "@/components/ui/button"
import {
  pauseResumeAtom,
  skipBackwardsAtom,
  skipTrackAtom
} from "@/src/api/atoms/playback-state-atom"
import { useAtom } from "@effect-atom/atom-react"
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward
} from "@tabler/icons-react"

export default function Controls({
  remoteIsPlaying
}: {
  remoteIsPlaying: boolean
}) {
  const [, skipTrack] = useAtom(skipTrackAtom)
  const [, pauseResume] = useAtom(pauseResumeAtom)
  const [, skipBackwards] = useAtom(skipBackwardsAtom)

  return (
    <div className="flex w-full flex-row items-center justify-center gap-4">
      <Button
        variant={"outline"}
        className="w-min cursor-pointer"
        onClick={() => skipBackwards()}
        size={"lg"}
      >
        <IconPlayerSkipBack />
      </Button>
      <Button
        variant={"outline"}
        className="w-min cursor-pointer"
        onClick={() => pauseResume({})}
        size={"lg"}
      >
        {remoteIsPlaying ? <IconPlayerPlay /> : <IconPlayerPause />}
      </Button>
      <Button
        variant={"outline"}
        className="w-min cursor-pointer"
        onClick={() => skipTrack()}
        size={"lg"}
      >
        <IconPlayerSkipForward />
      </Button>
    </div>
  )
}
