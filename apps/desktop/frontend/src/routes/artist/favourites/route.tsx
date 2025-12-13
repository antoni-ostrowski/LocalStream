import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import GridWrapper from "@/components/grid-wrapper"
import PageTitleWrapper from "@/components/page-title-wrapper"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/artist/favourites")({
  // loader: async ({ context: { queryClient, trpc } }) => {
  //   await queryClient.prefetchQuery(
  //     trpc.metadata.listArtists.queryOptions({ favsOnly: true })
  //   )
  // },
  component: RouteComponent,
  pendingComponent: () => <FullScreenLoading />,
  errorComponent: ({ error }) => <FullScreenError errorDetail={error.message} />
})

function RouteComponent() {
  // const { data } = useSuspenseQuery(
  //   trpc.metadata.listArtists.queryOptions({ favsOnly: true }),
  // )
  //
  // if (data.length === 0)
  //   return (
  //     <FullScreenError
  //       errorDetail="No favourite artists found."
  //       type="warning"
  //     />
  //   )

  return (
    <PageTitleWrapper title="Favourite Artists">
      <GridWrapper>
        <>
          fav artist list
          {/* {data.map((item) => ( */}
          {/*   <ArtistGridItem key={crypto.randomUUID()} item={item} /> */}
          {/* ))} */}
        </>
      </GridWrapper>
    </PageTitleWrapper>
  )
}
