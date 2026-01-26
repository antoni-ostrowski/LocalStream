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
import { sqlcDb } from "@/wailsjs/go/models"
import {
  Registry,
  Result,
  useAtom,
  useAtomValue
} from "@effect-atom/atom-react"
import { createFileRoute } from "@tanstack/react-router"
import { Effect } from "effect"
import { useEffect } from "react"
import { getArtistAtom } from ".."

export const Route = createFileRoute("/artists/$artist")({
  component: RouteComponent,
  pendingComponent: () => <FullScreenLoading />,
  errorComponent: ({ error }) => <FullScreenError errorDetail={error.message} />
})

function RouteComponent() {
  const { artist } = Route.useParams()

  const getArtistResult = useAtomValue(getArtistAtom(artist))

  return (
    <>
      {Result.builder(getArtistResult)
        .onError((err) => <FullScreenError errorDetail={err.message} />)
        .onSuccess((tracks) => <Content tracks={tracks} artist={artist} />)
        .orNull()}
    </>
  )
}

const setArtistsTracksToGenericsTracks = atomRuntime.fn(
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

function Content(props: { tracks: sqlcDb.Track[]; artist: string }) {
  const tracksResult = useAtomValue(genericTrackListAtom)
  const [, setPlaylistsTracksAsGeneric] = useAtom(
    setArtistsTracksToGenericsTracks
  )

  useEffect(() => {
    setPlaylistsTracksAsGeneric(props.tracks)
  }, [props.tracks, setPlaylistsTracksAsGeneric])

  return (
    <PageTitleWrapper title="tracks">
      {Result.builder(tracksResult)
        .onSuccess((tracks) => (
          <div className="min-h-screen w-full overflow-hidden">
            <div className="mx-auto overflow-hidden">
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
                        Artist
                      </p>
                      <h1 className="mt-2 text-4xl font-bold text-balance md:text-5xl">
                        {props.artist}
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
