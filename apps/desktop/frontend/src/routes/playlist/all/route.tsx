import GridWrapper from "@/components/grid-wrapper"
import PageTitleWrapper from "@/components/page-title-wrapper"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/playlist/all")({
  // loader: async ({ context: { queryClient, trpc } }) => {
  //   await queryClient.prefetchQuery(trpc.playlist.listPlaylists.queryOptions())
  // },
  component: RouteComponent
})

function RouteComponent() {
  // const { data, isPending, isError, error } = useQuery(
  //   trpc.playlist.listPlaylists.queryOptions(),
  // )
  // if (isError)
  //   return (
  //     <FullScreenError
  //       errorMessage={"Failed to load playlists"}
  //       errorDetail={error.message}
  //     />
  //   )
  // if (isPending) return <FullScreenLoading loadingMessage="Loading playlists" />
  // if (data?.length === 0 && !isPending)
  //   return <FullScreenError errorMessage="No playlists found" />
  return (
    <PageTitleWrapper title="Your Playlists">
      <GridWrapper>
        playlists
        {/* {data.map((playlist) => ( */}
        {/*   <PlaylistGridItem key={crypto.randomUUID()} {...{ playlist }} /> */}
        {/* ))} */}
      </GridWrapper>
    </PageTitleWrapper>
  )
}
