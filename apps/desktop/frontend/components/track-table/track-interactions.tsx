import type { TrackType } from '@/server/db/schema'
import StarTrack from './star-track'
import TrackContextMenu from './track-context-menu'

export default function TrackInteractions({ track }: { track: TrackType }) {
  return (
    <div className="flex flex-row items-center justify-start gap-2">
      <StarTrack {...{ track }} />
      <TrackContextMenu track={track} />
    </div>
  )
}
