import { useStarTrack } from "@/src/api/mutations"
import { sqlcDb } from "@/wailsjs/go/models"
import { Star } from "lucide-react"
import { Button } from "../ui/button"

export default function StarTrack({ track }: { track: sqlcDb.Track }) {
  const { mutate } = useStarTrack()
  return (
    <Button
      variant="ghost"
      onClick={() => {
        mutate(track)
      }}
    >
      <Star
        size={15}
        className="cursor-pointer"
        fill={track.starred.Valid && track.starred.Int64 ? "yellow" : ""}
        color={track.starred.Valid && track.starred.Int64 ? "yellow" : "white"}
      />
    </Button>
  )
}
