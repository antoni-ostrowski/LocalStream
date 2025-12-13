import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import TrackTable from "@/components/track-table/track-table"
import {
  genericTrackListAtom,
  GenericTrackListAtomAction,
} from "@/src/api/atoms/generic-track-list-atom"
import { atomRuntime } from "@/src/api/make-runtime"
import { Queries } from "@/src/api/queries"
import {
  Registry,
  Result,
  useAtomSet,
  useAtomValue,
} from "@effect-atom/atom-react"
import { createFileRoute } from "@tanstack/react-router"
import { Effect } from "effect"
import { useEffect } from "react"

export const Route = createFileRoute("/track/favourites")({
  component: RouteComponent,
})

const setGenericTracksToFavTracks = atomRuntime.fn(
  Effect.fn(function* () {
    const registry = yield* Registry.AtomRegistry
    const q = yield* Queries
    const favTracks = yield* q.listFavTracks

    registry.set(
      genericTrackListAtom,
      GenericTrackListAtomAction.UpdateTrackList({
        newTrackList: favTracks,
      }),
    )
  }),
)

function RouteComponent() {
  const genericTrackListResult = useAtomValue(genericTrackListAtom)
  const updateGenericTrackList = useAtomSet(setGenericTracksToFavTracks)
  console.log({ genericTrackListResult })

  useEffect(() => {
    updateGenericTrackList()
  }, [updateGenericTrackList])

  return (
    <PageTitleWrapper title={`Favourite Tracks`}>
      <>
        {Result.builder(genericTrackListResult)
          .onInitialOrWaiting(() => <FullScreenLoading />)
          .onSuccess((tracks) => <TrackTable tracks={tracks} />)
          .orElse(() => (
            <p>no data found</p>
          ))}
      </>
    </PageTitleWrapper>
  )
}
