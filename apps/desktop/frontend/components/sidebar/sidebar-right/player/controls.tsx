import { Button } from "@/components/ui/button"
import { pauseResumeAtom } from "@/src/api/atoms/current-playing-atom"
import { playback } from "@/wailsjs/go/models"
import { useAtom } from "@effect-atom/atom-react"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"

export default function Controls({
  currentTrack,
}: {
  currentTrack: playback.Playable
}) {
  const [_, pauseResume] = useAtom(pauseResumeAtom)

  return (
    <div className="flex flex-row gap-4">
      <Button variant={"outline"} className="w-min cursor-pointer">
        <SkipBack />
      </Button>
      <Button
        variant={"outline"}
        className="w-min cursor-pointer"
        onClick={() => {
          pauseResume()
        }}
      >
        {currentTrack.Ctrl?.Paused ? <Play /> : <Pause />}
      </Button>
      <Button variant={"outline"} className="w-min cursor-pointer">
        <SkipForward />
      </Button>
    </div>
  )
}
