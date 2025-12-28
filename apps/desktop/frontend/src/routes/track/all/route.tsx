import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import TrackTable from "@/components/track-table/track-table"
import {
  genericTrackListAtom,
  GenericTrackListAtomAction
} from "@/src/api/atoms/generic-track-list-atom"
import { atomRuntime } from "@/src/api/make-runtime"
import { Queries } from "@/src/api/queries"
import {
  Registry,
  Result,
  useAtomSet,
  useAtomValue
} from "@effect-atom/atom-react"
import { createFileRoute } from "@tanstack/react-router"
import { Effect } from "effect"
import { useEffect } from "react"

export const Route = createFileRoute("/track/all")({
  component: RouteComponent
})

// a func to set specific list of tracks as the current one
// this could be abstacted to some hook probably,
// the whole flow of running a set func on genericTrackList
const setGenericTracksToAllTracks = atomRuntime.fn(
  Effect.fn(function* () {
    const registry = yield* Registry.AtomRegistry
    const q = yield* Queries
    const newTrackList = yield* q.listAllTracks

    Effect.logInfo("running atom to update to all tracks")
    registry.set(
      genericTrackListAtom,
      GenericTrackListAtomAction.UpdateTrackList({
        newTrackList: newTrackList
      })
    )
  })
)

function RouteComponent() {
  console.log("track all route")
  const genericTrackListResult = useAtomValue(genericTrackListAtom)
  const updateGenericTrackList = useAtomSet(setGenericTracksToAllTracks)

  useEffect(() => {
    console.log("track all use effect")
    updateGenericTrackList()
  }, [])

  return (
    <PageTitleWrapper title={`All Tracks`}>
      <>
        {Result.builder(genericTrackListResult)
          .onInitialOrWaiting(() => <FullScreenLoading />)
          .onSuccess((tracks) => <TrackTable tracks={tracks ?? []} />)
          .orNull()}
      </>
    </PageTitleWrapper>
  )
}
