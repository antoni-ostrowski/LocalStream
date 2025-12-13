import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import GridWrapper from "@/components/grid-wrapper"
import PageTitleWrapper from "@/components/page-title-wrapper"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/playlist/favourites")({
  // loader: async ({ context: { queryClient, trpc } }) => {
  //   await queryClient.prefetchQuery(
  //     trpc.playlist.listFavPlaylists.queryOptions()
  //   )
  // },
  component: RouteComponent,
  pendingComponent: () => <FullScreenLoading />,
  errorComponent: ({ error }) => <FullScreenError errorDetail={error.message} />
})

function RouteComponent() {
  // const { data } = useSuspenseQuery(
  //   trpc.playlist.listFavPlaylists.queryOptions(),
  // )

  // if (data.length === 0)
  //   return (
  //     <FullScreenError
  //       errorMessage="No favourite playlists found."
  //       type="warning"
  //     />
  //   )
  //
  return (
    <PageTitleWrapper title="Favourite Playlists">
      <GridWrapper>
        <>
          playlist list
          {/* {data.map((item) => ( */}
          {/*   <PlaylistGridItem key={crypto.randomUUID()} playlist={item} /> */}
          {/* ))} */}
        </>
      </GridWrapper>
    </PageTitleWrapper>
  )
}
