import { GenericError } from "@/src/api/errors"
import { queries } from "@/src/api/queries"
import { sqlcDb } from "@/wailsjs/go/models"
import { Result, useAtomValue } from "@effect-atom/atom-react"
import { useMemo } from "react"

export function useTrackArtwork(track: sqlcDb.Track) {
  const artworkAtomArg = useMemo(
    () => queries.tracks.makeGetTrackArtworkAtom(track),
    [track],
  )
  const artworkAtom = useAtomValue(artworkAtomArg)
  return { renderArtworkOrFallback: () => RenderArtworkOrFallback(artworkAtom) }
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
