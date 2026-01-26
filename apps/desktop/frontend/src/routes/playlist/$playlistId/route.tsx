import FullScreenError from "@/components/full-screen-error"
import PageTitleWrapper from "@/components/page-title-wrapper"
import TrackTable from "@/components/track-table/track-table"
import { createFileLink } from "@/lib/utils"
import {
  genericTrackListAtom,
  GenericTrackListAtomAction
} from "@/src/api/atoms/generic-track-list-atom"
import { atomRuntime } from "@/src/api/make-runtime"
import { Queries } from "@/src/api/queries"
import { main, sqlcDb } from "@/wailsjs/go/models"
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
import DeletePlaylist from "../-components/delete-playlist"
import FavPlaylist from "../-components/fav-playlist"

export const Route = createFileRoute("/playlist/$playlistId")({
  component: RouteComponent
})

export const getPlaylistAtom = Atom.family((playlistId: string) =>
  atomRuntime.atom(
    Effect.gen(function* () {
      const q = yield* Queries
      const info = yield* q.getPlaylist(playlistId)
      return info
    })
  )
)

function RouteComponent() {
  const { playlistId } = Route.useParams()
  const getPlaylistResult = useAtomValue(getPlaylistAtom(playlistId))
  console.log({ getPlaylistResult })

  return (
    <>
      {Result.builder(getPlaylistResult)
        .onError((err) => <FullScreenError errorDetail={err.message} />)
        .onSuccess((playlist) => <Content playlist={playlist} />)
        .orNull()}
    </>
  )
}

const setPlaylistsTrackToGenericTracks = atomRuntime.fn(
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

function Content({ playlist }: { playlist: main.PlaylistWithTracks }) {
  const tracksResult = useAtomValue(genericTrackListAtom)
  const [, setPlaylistsTracksAsGeneric] = useAtom(
    setPlaylistsTrackToGenericTracks
  )

  useEffect(() => {
    setPlaylistsTracksAsGeneric(playlist.tracks)
  }, [playlist, setPlaylistsTracksAsGeneric])

  return (
    <PageTitleWrapper title="playlist">
      <div className="min-h-screen">
        <div className="mx-auto">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end">
            <div className="shrink-0">
              <img
                src={
                  playlist.playlist.cover_path.String !== ""
                    ? createFileLink(playlist.playlist.cover_path.String)
                    : "/placeholder.webp"
                }
                alt={playlist.playlist.name}
                className="h-48 w-48 rounded-lg object-cover shadow-lg md:h-60 md:w-60"
              />
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Playlist
                  </p>
                  <h1 className="mt-2 text-4xl font-bold text-balance md:text-5xl">
                    {playlist.playlist.name}
                  </h1>
                  <div className="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
                    <span>{playlist?.tracks?.length} tracks</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* <Button variant="outline" className="gap-2 bg-transparent"> */}
                {/*   <IconPencil size={16} /> */}
                {/*   Edit Playlist */}
                {/* </Button> */}

                <FavPlaylist {...{ playlist: playlist.playlist }} />
                <DeletePlaylist
                  {...{ playlist: playlist.playlist, goBack: true }}
                />
              </div>
            </div>
          </div>

          {Result.builder(tracksResult)
            .onSuccess((tracks) => <TrackTable tracks={tracks ?? []} />)
            .orNull()}
        </div>
      </div>
    </PageTitleWrapper>
  )
}
