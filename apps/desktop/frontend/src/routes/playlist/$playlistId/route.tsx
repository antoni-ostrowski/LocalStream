import PageTitleWrapper from "@/components/page-title-wrapper"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/playlist/$playlistId")({
  // loader: async ({
  //   context: { queryClient, trpc },
  //   params: { playlistId },
  // }) => {
  //   await queryClient.prefetchQuery(
  //     trpc.playlist.getPlaylist.queryOptions({
  //       playlistId: playlistId,
  //     })
  //   )
  // },
  component: RouteComponent
})

function RouteComponent() {
  // const { playlistId } = Route.useParams()
  // const { data, isPending, isError, error } = useQuery(
  //   trpc.playlist.getPlaylist.queryOptions({
  //     playlistId: playlistId,
  //   })
  // )
  // if (isError)
  //   <FullScreenError
  //     errorDetail={error.message}
  //     errorMessage="Something went wrong"
  //   />
  // if (isPending) return <FullScreenLoading />
  // if (!data)
  //   return <FullScreenError type="warning" errorMessage="Playlist not found" />
  return (
    <PageTitleWrapper>
      <div className="flex flex-col gap-10">
        <div className="flex flex-row items-center justify-start gap-8">
          {/* <img */}
          {/*   className="aspect-square w-50 object-fill" */}
          {/*   src={makeImageUrl(data.playlist.coverPath ?? 'a')} */}
          {/* /> */}
          <div className="flex flex-col items-start justify-start gap-2">
            {/* <h1 className="text-3xl font-bold">{data.playlist.name}</h1> */}
            <div className="flex flex-row gap-2">
              {/* <EditPlaylist currentPlaylistState={data.playlist} /> */}
              {/* <DeletePlaylist currentPlaylistState={data.playlist} /> */}
            </div>
          </div>
        </div>
        {/* <TrackTable tracks={data.tracks} /> */}
      </div>
    </PageTitleWrapper>
  )
}
