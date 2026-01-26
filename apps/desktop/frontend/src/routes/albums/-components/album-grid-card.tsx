import FullScreenError from "@/components/full-screen-error"
import { Card } from "@/components/ui/card"
import { createArtworkLink } from "@/lib/utils"
import { Result, useAtomValue } from "@effect-atom/atom-react"
import { Link } from "@tanstack/react-router"
import { getAlbumTracks } from "../$albumName/route"

export default function AlbumItem(props: { album: string }) {
  const getAlbumTracksResult = useAtomValue(getAlbumTracks(props.album))
  return (
    <>
      {Result.builder(getAlbumTracksResult)
        .onError((err) => <FullScreenError errorDetail={err.message} />)
        .onSuccess((tracks) => {
          const track = tracks[0]
          return (
            <Link
              to="/albums/$albumName"
              params={{ albumName: props.album }}
              key={`album-card-${props.album}`}
            >
              <Card className="group flex cursor-pointer flex-col gap-2 border-0 p-0 ring-0">
                <div className="relative aspect-square overflow-hidden rounded-md">
                  <img
                    src={
                      track.path
                        ? createArtworkLink(track.path)
                        : "/placeholder.webp"
                    }
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between gap-0">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-balance">
                      {props.album}
                    </h3>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })
        .orNull()}
    </>
  )
}
