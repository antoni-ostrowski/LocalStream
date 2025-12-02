import { GetPreferences } from "@/wailsjs/go/main/App"
import { createQueryKeys, mergeQueryKeys } from "@lukemorales/query-key-factory"

export const me = createQueryKeys("me", {
  all: ["me"],
  preferences: () => ({
    queryKey: ["preferences"],
    queryFn: GetPreferences,
  }),
})

export const queries = mergeQueryKeys(me)
