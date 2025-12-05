import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper, {
  pageTitleIconSize,
} from "@/components/page-title-wrapper"
import TrackTable from "@/components/track-table/track-table"
import { queries } from "@/src/api/queries"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Star } from "lucide-react"

export const Route = createFileRoute("/track/favourites")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(queries.tracks.listFav())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isPending, error } = useQuery(queries.tracks.listFav())
  if (error)
    return (
      <FullScreenError
        errorMessage="Failed to load favourite tracks"
        errorDetail={error.message}
      />
    )
  if (isPending)
    return <FullScreenLoading loadingMessage="Loading favourite tracks" />

  if (!data)
    return (
      <FullScreenError
        type="warning"
        errorMessage="No favourite tracks found"
      />
    )

  return (
    <PageTitleWrapper
      title="Favourite Tracks"
      icon={<Star className={pageTitleIconSize} color="yellow" fill="yellow" />}
    >
      <TrackTable tracks={data} />
    </PageTitleWrapper>
  )
}
