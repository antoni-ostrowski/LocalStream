import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import TrackTable from "@/components/track-table/track-table"
import { createArtworkLink } from "@/lib/utils"
import {
  genericTrackListAtom,
  GenericTrackListAtomAction
} from "@/src/api/atoms/generic-track-list-atom"
import { atomRuntime } from "@/src/api/make-runtime"
import { Queries } from "@/src/api/queries"
import { sqlcDb } from "@/wailsjs/go/models"
import {
  Atom,
  Registry,
  Result,
  useAtom,
  useAtomValue
} from "@effect-atom/atom-react"
import { createFileRoute } from "@tanstack/react-router"
import { Effect } from "effect"
import { useEffect } from "react"

export const Route = createFileRoute("/albums/$albumName")({
  component: RouteComponent,
  pendingComponent: () => <FullScreenLoading />,
  errorComponent: ({ error }) => <FullScreenError errorDetail={error.message} />
})

export const getAlbumTracks = Atom.family((album: string) =>
  atomRuntime.atom(
    Effect.gen(function* () {
      const q = yield* Queries
      const info = yield* q.getAlbumsTracks(album)

      return info
    })
  )
)

function RouteComponent() {
  const { albumName } = Route.useParams()

  const getAlbumTracksResult = useAtomValue(getAlbumTracks(albumName))

  return (
    <>
      {Result.builder(getAlbumTracksResult)
        .onError((err) => <FullScreenError errorDetail={err.message} />)
        .onSuccess((tracks) => <Content tracks={tracks} album={albumName} />)
        .orNull()}
    </>
  )
}

const setAlbumsTracksToGenericsTracks = atomRuntime.fn(
  Effect.fn(function* (playlistTrack: sqlcDb.Track[]) {
    const registry = yield* Registry.AtomRegistry

    registry.set(
      genericTrackListAtom,
      GenericTrackListAtomAction.UpdateTrackList({
        newTrackList: playlistTrack
      })
    )
  })
)

function Content(props: { tracks: sqlcDb.Track[]; album: string }) {
  const tracksResult = useAtomValue(genericTrackListAtom)
  const [, setPlaylistsTracksAsGeneric] = useAtom(
    setAlbumsTracksToGenericsTracks
  )

  useEffect(() => {
    setPlaylistsTracksAsGeneric(props.tracks)
  }, [props.tracks, setPlaylistsTracksAsGeneric])

  return (
    <PageTitleWrapper title="album">
      {Result.builder(tracksResult)
        .onSuccess((tracks) => (
          <div className="bg-background min-h-screen w-full">
            <div className="mx-auto">
              <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end">
                <div className="shrink-0">
                  <img
                    src={
                      tracks[0]
                        ? createArtworkLink(tracks[0].path)
                        : "/placeholder.webp"
                    }
                    className="h-48 w-48 rounded-lg object-cover shadow-lg md:h-60 md:w-60"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-muted-foreground text-sm font-medium">
                        Album
                      </p>
                      <h1 className="mt-2 text-4xl font-bold text-balance md:text-5xl">
                        {props.album}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              <TrackTable tracks={tracks ?? []} />
            </div>
          </div>
        ))
        .orNull()}
    </PageTitleWrapper>
  )
}
