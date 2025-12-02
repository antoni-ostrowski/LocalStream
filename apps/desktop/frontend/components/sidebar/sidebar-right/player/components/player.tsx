import { Card } from "@/components/ui/card"
import PlayerAudioHandler from "./player/player-audio-handler"
import Queue from "./queue/queue"

export default function Player() {
  return (
    <>
      <Card className="border-0 bg-transparent p-4">
        <PlayerAudioHandler />
        <Queue />
      </Card>
    </>
  )
}
