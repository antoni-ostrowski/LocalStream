import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import TrackTable from "@/components/track-table/track-table"
import { queries } from "@/src/api/queries"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/track/all")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(queries.tracks.listAll())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isPending, error } = useQuery(queries.tracks.listAll())
  if (error)
    return (
      <FullScreenError
        errorMessage="Something went wrong"
        errorDetail={error.message}
      />
    )
  if (isPending) return <FullScreenLoading loadingMessage="Loading tracks" />
  if (!data)
    return <FullScreenError type="warning" errorMessage="No tracks found" />

  return (
    <PageTitleWrapper title={`All Tracks`}>
      <TrackTable tracks={data} />
    </PageTitleWrapper>
  )
}
