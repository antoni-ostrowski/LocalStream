import PageTitleWrapper from "@/components/page-title-wrapper"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/track/all")({
  // loader: async ({ context: { queryClient, trpc } }) => {
  //   await queryClient.prefetchQuery(trpc.track.listAllTracks.queryOptions())
  // },
  component: RouteComponent,
})

function RouteComponent() {
  // const { data, isPending, error } = useQuery(
  //   trpc.track.listAllTracks.queryOptions(),
  // )
  // if (error)
  //   return (
  //     <FullScreenError
  //       errorMessage="Something went wrong"
  //       errorDetail={error.message}
  //     />
  //   )
  // if (isPending) return <Spinner />
  // if (data.length === 0 && !isPending)
  //   return <FullScreenError type="warning" errorMessage="No tracks found" />
  return (
    <PageTitleWrapper title={`All Tracks`}>
      <div>track table</div>
      {/* {data && <TrackTable tracks={data} />} */}
    </PageTitleWrapper>
  )
}
