import { trpc } from '@/app/router'
import { getCurrentUnixTimestamp } from '@/lib/utils'
import type { TrackType } from '@/server/db/schema'
import { useMutation } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { Star } from 'lucide-react'
import {
  playerStore,
  updatePlayerStore,
} from '../sidebar/sidebar-right/player/store'

export default function StarTrack({ track }: { track: TrackType }) {
  const { currentTrack } = useStore(playerStore)

  const { mutateAsync } = useMutation({
    ...trpc.track.starTrack.mutationOptions(),

    onSuccess: () => {
      if (currentTrack && currentTrack?.id === track.id) {
        updatePlayerStore('currentTrack', {
          ...currentTrack,
          starred: currentTrack.starred ? null : getCurrentUnixTimestamp(),
        })
      }

      playerStore.setState((prevPlayerState) => {
        return {
          ...prevPlayerState,
          queue: updateQueue(prevPlayerState.queue, track),
        }
      })
    },
  })

  return (
    <Star
      size={15}
      onClick={async () => {
        await mutateAsync({
          trackId: track.id,
          currentStarStatus: track.starred,
        })
      }}
      className="cursor-pointer"
      fill={track.starred ? 'yellow' : ''}
      color={track.starred ? 'yellow' : 'white'}
    />
  )
}

function updateQueue(queue: TrackType[], track: TrackType) {
  const queueWithPossibleNewStarTrack = queue.map((queueTrack) => {
    if (track.id === queueTrack.id) {
      return {
        ...queueTrack,
        starred: track.starred ? null : getCurrentUnixTimestamp(),
      }
    }
    return queueTrack
  })
  return queueWithPossibleNewStarTrack
}
