import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import TrackTable from "@/components/track-table/track-table"
import { queries } from "@/src/api/queries"
import { Result, useAtomValue } from "@effect-atom/atom-react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/track/all")({
  component: RouteComponent,
})

function RouteComponent() {
  const tracksAtom = useAtomValue(queries.tracks.listAllTracksAtom)

  return (
    <PageTitleWrapper title={`All Tracks`}>
      <>
        {Result.builder(tracksAtom)
          .onInitialOrWaiting(() => (
            <FullScreenLoading loadingMessage="Loading tracks" />
          ))
          .onErrorTag("NotFound", () => (
            <FullScreenError type="warning" errorMessage="No tracks found" />
          ))
          .onError((error) => (
            <FullScreenError type="error" errorDetail={error.message} />
          ))
          .onSuccess((tracks) => <TrackTable tracks={tracks} />)
          .orNull()}
      </>
    </PageTitleWrapper>
  )
}
