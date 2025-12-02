import TrackInteractions from '@/components/track-table/track-interactions'
import { makeArtworkUrl } from '@/lib/utils'
import type { TrackType } from '@/server/db/schema'
import { Dot } from 'lucide-react'

export default function TrackMetadata({
  currentTrack,
}: {
  currentTrack: TrackType
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <img
          className="w-full rounded-lg"
          src={makeArtworkUrl(currentTrack.path)}
        />
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex w-full flex-col items-start justify-start">
            <h1 className="text-xl font-bold">{currentTrack.title}</h1>
            <div className="flex flex-row gap-0">
              <h2 className="text-muted-foreground">{currentTrack.artist}</h2>
              {currentTrack.album && (
                <>
                  <Dot className="text-muted-foreground" />
                  <h2 className="text-muted-foreground">
                    {currentTrack.album}
                  </h2>
                </>
              )}
            </div>
          </div>
          <TrackInteractions track={currentTrack} />
        </div>
      </div>
    </>
  )
}
