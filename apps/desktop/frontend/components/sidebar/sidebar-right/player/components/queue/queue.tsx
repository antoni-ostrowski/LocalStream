import type { TrackType } from '@/server/db/schema'
import { useStore } from '@tanstack/react-store'
import { playerStore, updatePlayerStore } from '../../store'
import QueueTable from './queue-table'

export default function Queue() {
  const { queue } = useStore(playerStore)

  function deleteTrackFromQueue(trackToDelete: TrackType) {
    updatePlayerStore(
      'queue',
      queue.filter((queueTrack) => queueTrack.queueId !== trackToDelete.queueId)
    )
  }

  if (queue.length === 0) return null

  return <QueueTable {...{ tracks: queue, deleteTrackFromQueue }} />
}
