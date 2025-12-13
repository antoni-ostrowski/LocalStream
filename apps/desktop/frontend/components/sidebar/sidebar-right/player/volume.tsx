import { sqlcDb } from "@/wailsjs/go/models"
import { Volume2, VolumeOff } from "lucide-react"

export default function VolumeControls({
  currentTrack,
}: {
  currentTrack: sqlcDb.Track
}) {
  function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value)
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
        onChange={handleVolumeChange}
      />
      <Volume2 size={15} />
    </div>
  )
}
