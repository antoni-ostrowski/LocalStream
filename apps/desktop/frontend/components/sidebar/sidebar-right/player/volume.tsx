import { changeVolumeAtom } from "@/src/api/atoms/playback-state-atom"
import { useAtom } from "@effect-atom/atom-react"
import { Volume2, VolumeOff } from "lucide-react"
import { useState } from "react"

export default function VolumeControls() {
  const [, changeVolume] = useAtom(changeVolumeAtom)
  const [volume, setVolume] = useState(0.7)

  function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value)
    setVolume(parseFloat(event.target.value))
    changeVolume(parseFloat(event.target.value))
  }
  return (
    <div className="flex w-full flex-row items-center justify-center gap-2">
      <VolumeOff size={15} />
      <input
        className="w-[90%] bg-gray-300"
        type="range"
        max={1}
        min={0}
        step={0.01}
        value={volume}
        onChange={handleVolumeChange}
      />
      <Volume2 size={15} />
    </div>
  )
}
