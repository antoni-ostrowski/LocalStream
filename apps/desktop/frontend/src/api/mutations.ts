import { UpdatePreferences } from "@/wailsjs/go/main/App"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queries } from "./queries"

export function useUpdatePreferences() {
  const qc = useQueryClient()
  return useMutation({
    onError: ({ message }) => {
      toast.error("Failed update preferences!", { description: message })
    },
    onSuccess: async () => {
      await qc.invalidateQueries(queries.me.preferences())
    },
    mutationFn: (...newPrefs: Parameters<typeof UpdatePreferences>) =>
      UpdatePreferences(...newPrefs),
  })
}
