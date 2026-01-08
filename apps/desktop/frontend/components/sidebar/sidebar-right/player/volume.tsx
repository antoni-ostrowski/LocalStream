import { changeVolumeAtom } from "@/src/api/atoms/playback-state-atom"
import { useAtom } from "@effect-atom/atom-react"
import { IconVolume, IconVolumeOff } from "@tabler/icons-react"
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
      <IconVolumeOff size={15} />
      <input
        className="w-[90%] cursor-pointer accent-black"
        type="range"
        max={1}
        min={0}
        step={0.01}
        value={volume}
        onChange={handleVolumeChange}
      />
      <IconVolume size={15} />
    </div>
  )
}
