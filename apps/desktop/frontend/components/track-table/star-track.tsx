import { useStarTrack } from "@/src/api/mutations"
import { sqlcDb } from "@/wailsjs/go/models"
import { useQueryClient } from "@tanstack/react-query"
import { Star } from "lucide-react"
import { Button } from "../ui/button"

export default function StarTrack({ track }: { track: sqlcDb.Track }) {
  const qc = useQueryClient()
  const { mutateAsync } = useStarTrack()
  // const update = useAtomSet(updateListAllTracks)
  return (
    <Button
      variant="ghost"
      onClick={async () => {
        await mutateAsync(track)
        // update()
        await qc.invalidateQueries({ queryKey: ["test"] })
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
