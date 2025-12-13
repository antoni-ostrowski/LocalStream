import { artworkAtom } from "@/src/api/atoms/track-atoms"
import { GenericError } from "@/src/api/errors"
import { sqlcDb } from "@/wailsjs/go/models"
import { Result, useAtomValue } from "@effect-atom/atom-react"

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
