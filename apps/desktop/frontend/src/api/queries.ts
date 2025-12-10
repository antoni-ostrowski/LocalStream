import {
  GetCurrent,
  GetPreferences,
  GetTrackArtwork,
  ListAllTracks,
  ListFavTracks,
  ListQueue,
} from "@/wailsjs/go/main/App"
import { sqlcDb } from "@/wailsjs/go/models"
import { EventsOn } from "@/wailsjs/runtime/runtime"
import { createQueryKeys, mergeQueryKeys } from "@lukemorales/query-key-factory"
import { useEffect, useState } from "react"

export namespace trackss {
  export function useListAll() {
    const [queue, setQueue] = useState<sqlcDb.Track[]>([])
    const [isPending, setIsPending] = useState(true)

    useEffect(() => {
      void (async () => {
        const data = await ListQueue()
        setQueue(data)
        setIsPending(false)
      })()

      const unsubscribe = EventsOn("queue", (newQueueData) => {
        setQueue(newQueueData)
      })

      return unsubscribe
    }, [])

    return { data: queue, isPending: isPending }
  }
}

export const me = createQueryKeys("me", {
  all: ["me"],
  preferences: () => ({
    queryKey: ["preferences"],
    queryFn: () => GetPreferences(),
  }),
})

export const tracks = createQueryKeys("tracks", {
  all: ["tracks"],
  listAll: () => ({
    queryKey: ["list"],
    queryFn: () => ListAllTracks(),
  }),
  listFav: () => ({
    queryKey: ["list", "fav"],
    queryFn: () => ListFavTracks(),
  }),
  getTrackArtwork: (track: sqlcDb.Track) => ({
    queryKey: ["track-artwork", track.path],
    queryFn: () => GetTrackArtwork(track),
  }),
})

export const player = createQueryKeys("player", {
  all: ["player"],
  listQueue: () => ({
    queryKey: ["list"],
    queryFn: () => ListQueue(),
  }),
  getCurrentPlaying: () => ({
    queryKey: ["current-playing"],
    queryFn: () => GetCurrent(),
  }),
})

export const queries = mergeQueryKeys(me, tracks, player)
