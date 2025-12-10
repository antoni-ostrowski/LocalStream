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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queries } from "./queries"

// import { useState } from 'react';
//
// export function useAddToQueue() {
//     const [isPending, setIsPending] = useState(false);
//     const [error, setError] = useState(null);
//
//     const mutate = async (track) => {
//         setIsPending(true);
//         setError(null);
//         try {
//             // The Go function executes, modifies state, and emits the event.
//             await window.go.main.App.AddToQueue(track);
//             // The frontend is updated by the event listener in useQueueState.
//         } catch (e) {
//             setError(e);
//             console.error("Mutation failed:", e);
//         } finally {
//             setIsPending(false);
//         }
//     };
//
//     return { mutate, isPending, error };
// }

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

export function useReloadAppResources() {
  const qc = useQueryClient()
  return useMutation({
    onError: ({ message }) => {
      toast.error("Failed to reload resources!", { description: message })
    },
    onSuccess: async () => {
      await qc.invalidateQueries(queries.me.preferences())
    },
    mutationFn: () => ReloadAppResources(),
  })
}

export function useStarTrack() {
  const qc = useQueryClient()
  return useMutation({
    onError: ({ message }) => {
      toast.error("Failed to star track!", { description: message })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queries.tracks._def })
      await qc.invalidateQueries({
        queryKey: queries.player._def,
      })
    },
    mutationFn: (track: sqlcDb.Track) => StarTrack(track),
  })
}

export function usePlaybackControls() {
  const qc = useQueryClient()
  return {
    playNow: useMutation({
      onError: ({ message }) => {
        toast.error("Failed to play track!", { description: message })
      },

      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queries.player._def })
        await qc.invalidateQueries({ queryKey: queries.tracks._def })
      },
      mutationFn: (track: sqlcDb.Track) => PlayTrack(track),
    }),

    pauseResume: useMutation({
      onError: ({ message }) => {
        toast.error("Failed to play/pause track!", { description: message })
      },
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queries.player._def })
        await qc.invalidateQueries({ queryKey: queries.tracks._def })
      },
      mutationFn: () => PauseResume(),
    }),

    addToQueueEnd: useMutation({
      onError: ({ message }) => {
        toast.error("Failed to add to queue!", { description: message })
      },
      onSuccess: async () => {
        await qc.invalidateQueries({ queryKey: queries.player._def })
        await qc.invalidateQueries({ queryKey: queries.tracks._def })
      },
      mutationFn: (track: sqlcDb.Track) => AddToQueue(track),
    }),
  }
}
