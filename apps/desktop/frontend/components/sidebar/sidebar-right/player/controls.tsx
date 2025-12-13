import { Button } from "@/components/ui/button"
import { pauseResumeAtom } from "@/src/api/atoms/current-playing-atom"
import { sqlcDb } from "@/wailsjs/go/models"
import { useAtom } from "@effect-atom/atom-react"
import { SkipBack, SkipForward } from "lucide-react"

export default function Controls({
  currentTrack
}: {
  currentTrack: sqlcDb.Track
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
        maybe pause
        {/* {currentTrack.Ctrl?.Paused ? <Play /> : <Pause />} */}
      </Button>
      <Button variant={"outline"} className="w-min cursor-pointer">
        <SkipForward />
      </Button>
    </div>
  )
}
