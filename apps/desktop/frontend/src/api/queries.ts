import {
  GetPreferences,
  ListAllTracks,
  ListFavTracks,
} from "@/wailsjs/go/main/App"
import { createQueryKeys, mergeQueryKeys } from "@lukemorales/query-key-factory"

export const me = createQueryKeys("me", {
  all: ["me"],
  preferences: () => ({
    queryKey: ["preferences"],
    queryFn: GetPreferences,
  }),
})

export const tracks = createQueryKeys("tracks", {
  all: ["tracks"],
  listAll: () => ({
    queryKey: ["list"],
    queryFn: ListAllTracks,
  }),
  listFav: () => ({
    queryKey: ["list", "fav"],
    queryFn: ListFavTracks,
  }),
})

export const queries = mergeQueryKeys(me, tracks)
