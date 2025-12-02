import { Volume2, VolumeOff } from 'lucide-react'
import type { AudioRefType } from './player-audio-handler'

export default function VolumeControls({
  audioRef,
}: {
  audioRef: AudioRefType
}) {
  function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!audioRef.current) return
    const volume = parseFloat(event.target.value)
    audioRef.current.volume = volume
  }
  return (
    <div className="flex w-full flex-row items-center justify-center gap-2">
      <VolumeOff size={15} />
      <input
        className="w-[90%] bg-gray-300"
        type="range"
        max={1}
        min={0}
        step={0.001}
        disabled={audioRef.current?.muted}
        onChange={handleVolumeChange}
      />
      <Volume2 size={15} />
    </div>
  )
}
