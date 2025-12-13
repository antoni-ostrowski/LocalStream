import { atomRuntime } from "@/src/api/atom-runtime"
import { GenericError } from "@/src/api/errors"
import { Queries } from "@/src/api/queries"
import { sqlcDb } from "@/wailsjs/go/models"
import { Atom, Result, useAtomValue } from "@effect-atom/atom-react"
import { Effect } from "effect"

const artworkAtom = Atom.family((track: sqlcDb.Track | null) =>
  atomRuntime.atom(
    Effect.gen(function* () {
      if (!track)
        return yield* new GenericError({ message: "no track provided" })
      const q = yield* Queries
      const a = yield* q.getTrackArtwork(track)
      return a
    }),
  ),
)

export function useTrackArtwork(track: sqlcDb.Track | null) {
  const artworkResult = useAtomValue(artworkAtom(track))
  return {
    renderArtworkOrFallback: () => RenderArtworkOrFallback(artworkResult),
  }
}

export function RenderArtworkOrFallback(
  atom: Result.Result<string, GenericError>,
) {
  return (
    <>
      {Result.builder(atom)
        .onError(() => (
          <img
            className="w-full rounded-md"
            src={"../../../../placeholder.webp"}
          />
        ))
        .onSuccess((artwork) => (
          <img className="w-full rounded-md" src={artwork} />
        ))
        .orNull()}
    </>
  )
}
