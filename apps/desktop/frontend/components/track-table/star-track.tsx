import { useStarTrack } from "@/src/api/mutations"
import { sqlcDb } from "@/wailsjs/go/models"
import { Star } from "lucide-react"

export default function StarTrack({ track }: { track: sqlcDb.Track }) {
  const { mutate } = useStarTrack()
  return (
    <Star
      size={15}
      onClick={() => {
        mutate(track)
      }}
      className="cursor-pointer"
      fill={track.starred.Valid && track.starred.Int64 ? "yellow" : ""}
      color={track.starred.Valid && track.starred.Int64 ? "yellow" : "white"}
    />
  )
}
