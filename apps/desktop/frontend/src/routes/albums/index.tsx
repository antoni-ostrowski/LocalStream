import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import { Card } from "@/components/ui/card"
import { albumsAtom } from "@/src/api/atoms/albums-atom"
import { Result, useAtomValue } from "@effect-atom/atom-react"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/albums/")({
  component: RouteComponent
})

function RouteComponent() {
  const albumsResult = useAtomValue(albumsAtom)
  return (
    <div>
      {Result.builder(albumsResult)
        .onInitialOrWaiting(() => <FullScreenLoading />)
        .onError((err) => <FullScreenError errorDetail={err.message} />)
        .onSuccess((albums) => (
          <PageTitleWrapper>
            <div className="mx-auto w-full">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {albums.map((album) => (
                  <Link
                    to="/albums/$albumName"
                    params={{ albumName: album }}
                    key={`album-card-${album}`}
                  >
                    <Card className="group flex cursor-pointer flex-col gap-2 border-0 p-0 ring-0">
                      <div className="relative aspect-square overflow-hidden rounded-md">
                        <img
                          src={"/placeholder.webp"}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-0">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-balance">
                            {album}
                          </h3>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                          }}
                        ></div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </PageTitleWrapper>
        ))
        .orNull()}
    </div>
  )
}
