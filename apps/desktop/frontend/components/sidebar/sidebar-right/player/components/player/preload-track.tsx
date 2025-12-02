import { makeMusicUrl } from '@/lib/utils'
import type { TrackType } from '@/server/db/schema'
import { useEffect, useRef } from 'react'

export default function PreloadTrack({
  nextTrackToPreload,
}: {
  nextTrackToPreload: TrackType | null
}) {
  const preloadAudioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (preloadAudioRef.current && nextTrackToPreload) {
      // Set the src and load the metadata
      console.log('use effect for next track run')
      preloadAudioRef.current.src = makeMusicUrl(nextTrackToPreload.path)
      preloadAudioRef.current.load()
      console.log(`Preloading started for: ${nextTrackToPreload.title}`)
    }
  }, [nextTrackToPreload]) // Re-run whenever the next track in the queue changes

  return (
    <>
      {/* Preload Audio Element - Hidden, only handles buffering */}
      <audio
        ref={preloadAudioRef}
        // Use 'preload="auto"' to hint to the browser to start downloading
        // The 'src' attribute will be managed by the useEffect hook above
        preload="auto"
        style={{ display: 'none' }} // Hide it from the user interface
        src={
          nextTrackToPreload ? makeMusicUrl(nextTrackToPreload.path) : undefined
        }
      />
    </>
  )
}
