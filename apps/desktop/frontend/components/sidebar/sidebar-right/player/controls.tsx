import { Button } from "@/components/ui/button"
import { pauseResumeAtom } from "@/src/api/atoms/playback-state-atom"
import { useAtom } from "@effect-atom/atom-react"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"
import { useState } from "react"

export default function Controls({
  remoteIsPlaying
}: {
  remoteIsPlaying: boolean
}) {
  const [isPlaying, setIsPlaying] = useState(remoteIsPlaying)
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
          pauseResume(!remoteIsPlaying)
          // setIsPlaying((prev) => {
          //   pauseResume(!prev)
          //   return !prev
          // })
        }}
      >
        {remoteIsPlaying ? <Play /> : <Pause />}
      </Button>
      <Button variant={"outline"} className="w-min cursor-pointer">
        <SkipForward />
      </Button>
    </div>
  )
}
