import { formatSongLength } from '@/lib/utils'
import type { TrackType } from '@/server/db/schema'
import type { AudioRefType, ProgressBarRefType } from './player-audio-handler'

export default function ProgressBar({
  progressBarRef,
  audioRef,
  currentTrack,
  handlePause,
  handlePlay,
  currentTime,
  setCurrentTime,
}: {
  progressBarRef: ProgressBarRefType
  audioRef: AudioRefType
  currentTrack: TrackType
  handlePause: () => void
  handlePlay: () => void
  currentTime: number
  setCurrentTime: (time: number) => void
}) {
  function handleSliderChange() {
    // console.log(progressBarRef.current?.value)
    if (audioRef.current && progressBarRef.current) {
      const newTime = Number(progressBarRef.current.value)
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <input
          className="w-full bg-gray-300"
          ref={progressBarRef}
          type="range"
          step={0.001}
          max={currentTrack.durationInMs! / 1000}
          value={currentTime}
          onChange={handleSliderChange}
          onMouseDown={handlePause}
          onMouseUp={handlePlay}
        />
        <div className="flex w-full justify-between">
          <p>{formatSongLength(currentTime)}</p>
          {currentTrack.durationInMs && (
            <p>{formatSongLength(currentTrack.durationInMs)}</p>
          )}
        </div>
      </div>
    </>
  )
}
