import { starTrackAtom } from "@/src/api/atoms/track-atoms"
import { sqlcDb } from "@/wailsjs/go/models"
import { Result, useAtom } from "@effect-atom/atom-react"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { Button } from "../ui/button"

export default function StarTrack({ track }: { track: sqlcDb.Track }) {
  const [state, starTrack] = useAtom(starTrackAtom)
  return (
    <Button
      variant="ghost"
      onClick={() => {
        starTrack(track)
        Result.builder(state).onError((err) =>
          toast.error(`Error: ${err.message}`)
        )
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
