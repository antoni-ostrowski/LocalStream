import { formatSongLength } from "@/lib/utils"
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
  // function handleSliderChange() {
  //   // console.log(progressBarRef.current?.value)
  //   if (audioRef.current && progressBarRef.current) {
  //     const newTime = Number(progressBarRef.current.value)
  //     audioRef.current.currentTime = newTime
  //     setCurrentTime(newTime)
  //   }
  // }
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <input
          className="w-full bg-gray-300"
          ref={progressBarInputRef}
          type="range"
          step={0.001}
        />
        <div className="flex w-full justify-between">
          <p>{progress}</p>
          <p>{formatSongLength(length)}</p>
        </div>
      </div>
    </>
  )
}

{
  /* max={currentTrack.durationInMs! / 1000} */
}
{
  /* value={currentTime} */
}
{
  /* onChange={handleSliderChange} */
}
{
  /* onMouseDown={handlePause} */
}
{
  /* onMouseUp={handlePlay} */
}
