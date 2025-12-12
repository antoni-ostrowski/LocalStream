import { getCurrentEpoch } from "@/lib/utils"
import { atomRuntime } from "@/src/api/atom-runtime"
import {
  genericTrackListAtom,
  GenericTrackListAtomAction,
} from "@/src/api/atoms/generic-track-list-atom"
import { Mutations } from "@/src/api/mutations"
import { sql, sqlcDb } from "@/wailsjs/go/models"
import { Registry, Result, useAtom } from "@effect-atom/atom-react"
import { Duration, Effect } from "effect"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { Button } from "../ui/button"

const starTrackAtom = atomRuntime.fn(
  Effect.fn(function* (track: sqlcDb.Track) {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations
    yield* m.starTrack(track)

    const isTrackCurrentlyStarred =
      track.starred.Valid && track.starred.Int64 > 0

    const currentSecondsEpoch = Math.floor(
      yield* getCurrentEpoch.pipe(
        Effect.map((millisEpoch) => Duration.toSeconds(millisEpoch)),
      ),
    )

    const newStarredValue = (() => {
      if (isTrackCurrentlyStarred) {
        return new sql.NullInt64({ Valid: false, Int64: 0 })
      } else {
        return new sql.NullInt64({ Valid: true, Int64: currentSecondsEpoch })
      }
    })()

    const newTrack = sqlcDb.Track.createFrom({
      ...track,
      starred: newStarredValue,
    })

    registry.set(
      genericTrackListAtom,
      GenericTrackListAtomAction.UpdateTrackData({
        newTrackData: newTrack,
      }),
    )
  }),
)

export default function StarTrack({ track }: { track: sqlcDb.Track }) {
  const [state, starTrack] = useAtom(starTrackAtom)
  return (
    <Button
      variant="ghost"
      onClick={() => {
        starTrack(track)
        Result.builder(state).onError((err) =>
          toast.error(`Error: ${err.message}`),
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
