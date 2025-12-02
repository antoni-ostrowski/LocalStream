import PageTitleWrapper, {
  pageTitleIconSize,
} from "@/components/page-title-wrapper"
import { createFileRoute } from "@tanstack/react-router"
import { Star } from "lucide-react"

export const Route = createFileRoute("/track/favourites")({
  // loader: async ({ context: { queryClient, trpc } }) => {
  //   await queryClient.prefetchQuery(trpc.track.getFavTracks.queryOptions())
  // },
  component: RouteComponent,
})

function RouteComponent() {
  // const { data, isPending, isError, error } = useQuery(
  //   trpc.track.getFavTracks.queryOptions(),
  // )
  // if (isError)
  //   return (
  //     <FullScreenError
  //       errorMessage="Failed to load favourite tracks"
  //       errorDetail={error.message}
  //     />
  //   )
  // if (isPending)
  //   return <FullScreenLoading loadingMessage="Loading favourite tracks" />
  // if (data.length === 0 && !isPending)
  //   return <FullScreenError type="warning" errorMessage="No tracks found" />
  return (
    <PageTitleWrapper
      title="Favourite Tracks"
      icon={<Star className={pageTitleIconSize} color="yellow" fill="yellow" />}
    >
      <div>track fav table</div>
      {/* <TrackTable tracks={data} /> */}
    </PageTitleWrapper>
  )
}
