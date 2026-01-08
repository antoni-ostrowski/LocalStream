import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/artists/$artist")({
  // loader: async ({ context: { queryClient, trpc }, params: { artist } }) => {
  //   await queryClient.prefetchQuery(
  //     trpc.track.getTracksFromArtist.queryOptions({ artist })
  //   )
  // },
  component: RouteComponent,
  pendingComponent: () => <FullScreenLoading />,
  errorComponent: ({ error }) => <FullScreenError errorDetail={error.message} />
})

function RouteComponent() {
  // const { artist } = useParams({ from: "/artist/$artist" })
  // const { data } = useSuspenseQuery(
  //   trpc.track.getTracksFromArtist.queryOptions({ artist }),
  // )
  //
  // if (data.length === 0)
  //   return <FullScreenError errorMessage="No tracks found" type="warning" />
  //
  return (
    <PageTitleWrapper title={`artist - Tracks`}>
      <div>here track tbale for artist</div>
      {/* <TrackTable tracks={data} /> */}
    </PageTitleWrapper>
  )
}
