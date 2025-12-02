import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import GridWrapper from "@/components/grid-wrapper"
import PageTitleWrapper from "@/components/page-title-wrapper"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/artist/all")({
  // loader: async ({ context: { queryClient, trpc } }) => {
  //   await queryClient.prefetchQuery(trpc.metadata.listArtists.queryOptions({}))
  // },
  component: RouteComponent,
  pendingComponent: () => <FullScreenLoading />,
  errorComponent: ({ error }) => (
    <FullScreenError errorDetail={error.message} />
  ),
})

function RouteComponent() {
  // const { data } = useSuspenseQuery(trpc.metadata.listArtists.queryOptions({}))
  //
  // if (data.length === 0)
  //   return <FullScreenError errorMessage="No artists found." type="warning" />

  return (
    <PageTitleWrapper title="Artists">
      <GridWrapper>
        <>
          all artist list
          {/* {data.map((item) => ( */}
          {/*   <ArtistGridItem key={crypto.randomUUID()} item={item} /> */}
          {/* ))} */}
        </>
      </GridWrapper>
    </PageTitleWrapper>
  )
}
