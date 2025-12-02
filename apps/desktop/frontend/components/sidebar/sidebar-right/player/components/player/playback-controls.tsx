import { Button } from '@/components/ui/button'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'

export default function PlaybackControls({
  isPlaying,
  handlePause,
  handlePlay,
  handleSkipForward,
}: {
  isPlaying: boolean
  handlePause: () => void
  handlePlay: () => void
  handleSkipForward: () => void
}) {
  return (
    <div className="flex flex-row gap-4">
      <Button variant={'outline'} className="w-min cursor-pointer">
        <SkipBack />
      </Button>
      <Button
        variant={'outline'}
        className="w-min cursor-pointer"
        onClick={() => {
          if (isPlaying) handlePause()
          else handlePlay()
        }}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <Button
        variant={'outline'}
        className="w-min cursor-pointer"
        onClick={handleSkipForward}
      >
        <SkipForward />
      </Button>
    </div>
  )
}
