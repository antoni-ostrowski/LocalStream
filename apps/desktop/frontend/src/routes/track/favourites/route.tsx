import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper, {
  pageTitleIconSize,
} from "@/components/page-title-wrapper"
import TrackTable from "@/components/track-table/track-table"
import { queries } from "@/src/api/queries"
import { Result, useAtomValue } from "@effect-atom/atom-react"
import { createFileRoute } from "@tanstack/react-router"
import { Star } from "lucide-react"

export const Route = createFileRoute("/track/favourites")({
  component: RouteComponent,
})

function RouteComponent() {
  const favTracksAtom = useAtomValue(queries.tracks.listFavTracks)

  return (
    <PageTitleWrapper
      title="Favourite Tracks"
      icon={<Star className={pageTitleIconSize} color="yellow" fill="yellow" />}
    >
      <>
        {Result.builder(favTracksAtom)
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
