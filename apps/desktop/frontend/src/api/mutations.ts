import {
  AddToQueue,
  CreateSourceDir,
  PauseResume,
  PlayTrack,
  ReloadAppResources,
  StarTrack,
  UpdatePreferences,
} from "@/wailsjs/go/main/App"
import { sqlcDb } from "@/wailsjs/go/models"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function useUpdatePreferences() {
  return useMutation({
    onError: ({ message }) => {
      toast.error("Failed update preferences!", { description: message })
    },
    mutationFn: (...newPrefs: Parameters<typeof UpdatePreferences>) =>
      UpdatePreferences(...newPrefs),
  })
}

export function useCreateNewSource() {
  return useMutation({
    onError: ({ message }) => {
      toast.error("Failed create music source!", { description: message })
    },
    onSuccess: async () => {
      toast.success("Created new music source!")
    },
    mutationFn: () => CreateSourceDir(),
  })
}

export function useReloadAppResources() {
  return useMutation({
    onError: ({ message }) => {
      toast.error("Failed to reload resources!", { description: message })
    },
    mutationFn: () => ReloadAppResources(),
  })
}

export function useStarTrack() {
  return useMutation({
    onError: ({ message }) => {
      toast.error("Failed to star track!", { description: message })
    },
    mutationFn: (track: sqlcDb.Track) => StarTrack(track),
  })
}

export function usePlaybackControls() {
  return {
    playNow: useMutation({
      onError: ({ message }) => {
        toast.error("Failed to play track!", { description: message })
      },
      mutationFn: (track: sqlcDb.Track) => PlayTrack(track),
    }),

    pauseResume: useMutation({
      onError: ({ message }) => {
        toast.error("Failed to play/pause track!", { description: message })
      },
      mutationFn: () => PauseResume(),
    }),

    addToQueueEnd: useMutation({
      onError: ({ message }) => {
        toast.error("Failed to add to queue!", { description: message })
      },
      mutationFn: (track: sqlcDb.Track) => AddToQueue(track),
    }),
  }
}
