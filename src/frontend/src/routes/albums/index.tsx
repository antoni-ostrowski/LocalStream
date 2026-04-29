import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import { albumsAtom } from "@/src/api/atoms/albums-atom"
import { Result, useAtomValue } from "@effect-atom/atom-react"
import { createFileRoute } from "@tanstack/react-router"
import AlbumItem from "./-components/album-grid-card"

export const Route = createFileRoute("/albums/")({
  component: RouteComponent
})

function RouteComponent() {
  const albumsResult = useAtomValue(albumsAtom)
  return (
    <>
      {Result.builder(albumsResult)
        .onInitialOrWaiting(() => <FullScreenLoading />)
        .onError((err) => <FullScreenError errorDetail={err.message} />)
        .onSuccess((albums) => (
          <PageTitleWrapper title="albums">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {albums.map((album) => (
                <AlbumItem key={`album-item-${album}`} album={album} />
              ))}
            </div>
          </PageTitleWrapper>
        ))
        .orNull()}
    </>
  )
}
