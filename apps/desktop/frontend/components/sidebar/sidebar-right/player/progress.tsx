import { formatSongLength } from "@/lib/utils"
import { Seek } from "@/wailsjs/go/main/App"
import { sqlcDb } from "@/wailsjs/go/models"
import { EventsOn } from "@/wailsjs/runtime/runtime"
import { useEffect, useRef, useState } from "react"

export default function ProgressBar({
  currentTrack,
  length
}: {
  currentTrack: sqlcDb.Track
  length: number
}) {
  const progressBarInputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    EventsOn("progress", (newProgressInt) => {
      console.log({ newProgressInt })
      setProgress(newProgressInt)
    })
  }, [currentTrack])

  function handleSliderChange() {
    if (progressBarInputRef.current) {
      const newTime = parseInt(progressBarInputRef.current.value)
      console.log({ newTime })
      setProgress(newTime)
      void (async () => {
        await Seek(newTime)
      })()
      console.log({ progress })
    }
  }

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <input
          className="w-full bg-gray-300"
          ref={progressBarInputRef}
          type="range"
          step={0.001}
          value={progress}
          max={length}
          min={0}
          onChange={handleSliderChange}
        />
        <div className="flex w-full justify-between">
          <p>{formatSongLength(progress)}</p>
          <p>{formatSongLength(length)}</p>
        </div>
      </div>
    </>
  )
}
