import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import { artistsAtom } from "@/src/api/atoms/artist-atom"
import { atomRuntime } from "@/src/api/make-runtime"
import { Queries } from "@/src/api/queries"
import { sqlcDb } from "@/wailsjs/go/models"
import { Atom, Result, useAtomValue } from "@effect-atom/atom-react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Effect } from "effect"

export const Route = createFileRoute("/artists/")({
  component: RouteComponent
})

function RouteComponent() {
  const artistsResult = useAtomValue(artistsAtom)
  return (
    <>
      {Result.builder(artistsResult)
        .onInitialOrWaiting(() => <FullScreenLoading />)
        .onError((err) => <FullScreenError errorDetail={err.message} />)
        .onSuccess((artists) => (
          <PageTitleWrapper title="artists">
            <div className="flex flex-col">
              {artists.map((artist) => (
                <ArtistItem key={`artist-item-${artist}`} artist={artist} />
              ))}
            </div>
          </PageTitleWrapper>
        ))
        .orNull()}
    </>
  )
}

export const getArtistAtom = Atom.family((artist: string) =>
  atomRuntime.atom(
    Effect.gen(function* () {
      const q = yield* Queries
      const info = yield* q.getArtist(artist)
      return info
    })
  )
)

function ArtistItem(props: { artist: sqlcDb.ListArtistsRow }) {
  const getArtistResult = useAtomValue(getArtistAtom(props.artist.artist))
  return (
    <>
      {Result.builder(getArtistResult)
        .onError((err) => <FullScreenError errorDetail={err.message} />)
        .onSuccess((artistTracks) => {
          return (
            <Link
              to="/artists/$artist"
              params={{ artist: props.artist.artist }}
              className="hover:underline"
            >
              <h3 className="truncate text-xl font-semibold text-balance">
                {props.artist.artist}
                {" - "}
                {artistTracks.length} {"tracks"}
              </h3>
            </Link>
          )
        })
        .orNull()}
    </>
  )
}
