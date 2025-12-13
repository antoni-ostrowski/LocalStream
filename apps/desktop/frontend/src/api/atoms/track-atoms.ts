import { getCurrentTimeEpoch } from "@/lib/utils"
import { sql, sqlcDb } from "@/wailsjs/go/models"
import { Atom, Registry } from "@effect-atom/atom-react"
import { Duration, Effect } from "effect"
import { withToast } from "../effect-utils"
import { GenericError } from "../errors"
import { atomRuntime } from "../make-runtime"
import { Mutations } from "../mutations"
import { Queries } from "../queries"
import { currentPlayingAtom } from "./current-playing-atom"
import {
  genericTrackListAtom,
  GenericTrackListAtomAction
} from "./generic-track-list-atom"
import { queueAtom } from "./queue-atom"

export const starTrackAtom = atomRuntime.fn(
  Effect.fn(
    function* (track: sqlcDb.Track) {
      const registry = yield* Registry.AtomRegistry
      const m = yield* Mutations
      yield* m.starTrack(track).pipe(
        Effect.tapError((error) =>
          Effect.logError(error, { trackId: track.id })
        ),
        Effect.andThen(() => ({
          isTrackCurrentlyStarred:
            track.starred.Valid && track.starred.Int64 > 0,
          currentSecondsEpoch: Math.floor(
            Duration.toSeconds(getCurrentTimeEpoch)
          )
        })),
        Effect.andThen(({ currentSecondsEpoch, isTrackCurrentlyStarred }) => {
          if (isTrackCurrentlyStarred) {
            return new sql.NullInt64({ Valid: false, Int64: 0 })
          } else {
            return new sql.NullInt64({
              Valid: true,
              Int64: currentSecondsEpoch
            })
          }
        }),
        Effect.map((newStarredValue) =>
          sqlcDb.Track.createFrom({
            ...track,
            starred: newStarredValue
          })
        ),
        Effect.andThen((newTrack) => {
          registry.set(
            genericTrackListAtom,
            GenericTrackListAtomAction.UpdateTrackData({
              newTrackData: newTrack
            })
          )
          registry.refresh(currentPlayingAtom.remote)
          registry.refresh(queueAtom.remote)
        })
      )
    },
    withToast({
      onWaiting: () => "Loading...",
      onSuccess: () => "Starred track!",
      onFailure: () => "Failed to star track!"
    })
  )
)

export const artworkAtom = Atom.family((track: sqlcDb.Track | null) =>
  atomRuntime.atom(
    Effect.gen(function* () {
      if (!track)
        return yield* new GenericError({ message: "no track provided" })
      const q = yield* Queries
      const a = yield* q.getTrackArtwork(track)
      return a
    })
  )
)
