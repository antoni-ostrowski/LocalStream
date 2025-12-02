import type { TrackType } from '@/server/db/schema'
import { Store } from '@tanstack/react-store'

type PlayerStore = {
  queue: TrackType[]
  currentTrack: TrackType | undefined
  isPlaying: boolean
}

export const playerStore = new Store<PlayerStore>({
  queue: [],
  currentTrack: undefined,
  isPlaying: false,
})
export function updatePlayerStore<K extends keyof PlayerStore>(
  key: K,
  value: PlayerStore[K]
) {
  playerStore.setState((prevState) => ({
    ...prevState,
    [key]: value,
  }))
}
