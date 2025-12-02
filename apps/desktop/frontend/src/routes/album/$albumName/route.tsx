import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/album/$albumName")({
  // loader: async ({ context: { queryClient, trpc }, params: { albumName } }) => {
  //   await queryClient.prefetchQuery(
  //     trpc.album.getAlbum.queryOptions({ albumName })
  //   )
  // },
  component: RouteComponent,
  pendingComponent: () => <FullScreenLoading />,
  errorComponent: ({ error }) => (
    <FullScreenError errorDetail={error.message} />
  ),
})

function RouteComponent() {
  // const { albumName } = Route.useParams()
  // const { data: album } = useSuspenseQuery(
  //   trpc.album.getAlbum.queryOptions({ albumName })
  // )

  return (
    <PageTitleWrapper>
      <div className="flex flex-col gap-10">
        <div className="flex flex-row items-center justify-start gap-8">
          {/* <img */}
          {/*   className="aspect-square w-50 object-fill" */}
          {/*   src={makeArtworkUrl(album.albumCoverPath ?? '/dfjf/f/f')} */}
          {/* /> */}
          <div className="flex flex-col items-start justify-start gap-2">
            <h1 className="text-3xl font-bold">album name</h1>
            <div className="flex flex-row gap-2"></div>
          </div>
        </div>
        {/* <FavAlbum album={album} /> */}
        {/* <TrackTable tracks={album.tracks} /> */}
      </div>
    </PageTitleWrapper>
  )
}
