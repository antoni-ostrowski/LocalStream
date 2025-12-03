import { CreateSourceDir, UpdatePreferences } from "@/wailsjs/go/main/App"
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
      toast.success("Updated preferences!")
    },
    mutationFn: (...newPrefs: Parameters<typeof UpdatePreferences>) =>
      UpdatePreferences(...newPrefs),
  })
}

export function useCreateNewSource() {
  const qc = useQueryClient()
  return useMutation({
    onError: ({ message }) => {
      toast.error("Failed create music source!", { description: message })
    },
    onSuccess: async () => {
      await qc.invalidateQueries(queries.me.preferences())
      toast.success("Created new music source!")
    },
    mutationFn: () => CreateSourceDir(),
  })
}
