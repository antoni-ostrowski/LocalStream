import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import type { Track } from "@/db/schema";
import type { PlayerState, PlayerContextType } from "@/types/player";
import { audioPlayerService } from "@/services/audio-player-service";

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    error: null,
  });
  const onTrackFinishedRef = useRef<(() => Promise<void>) | null>(null);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    audioPlayerService.initialize().catch((error) => {
      console.error("Failed to initialize audio player:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to initialize audio player",
      }));
    });

    audioPlayerService.setStatusUpdateCallback(async (status) => {
      setState((prev) => ({
        ...prev,
        isPlaying: status.isPlaying,
        isLoading: status.isLoading,
        currentTime: status.currentTime * 1000,
        duration: status.duration * 1000,
        currentTrack: status.currentTrack,
        error: status.didJustFinish ? null : prev.error,
      }));

      if (status.didJustFinish && onTrackFinishedRef.current) {
        await onTrackFinishedRef.current();
      } else if (status.didJustFinish) {
        audioPlayerService.stop().catch(console.error);
      }
    });

    return () => {
      audioPlayerService.destroy();
    };
  }, []);

  const playTrack = useCallback(async (track: Track) => {
    try {
      setState((prev) => ({ ...prev, error: null, isLoading: true }));
      await audioPlayerService.playTrack(track);
    } catch (error) {
      console.error("Failed to play track:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to play track",
        isLoading: false,
      }));
    }
  }, []);

  const pauseTrack = useCallback(async () => {
    try {
      await audioPlayerService.pause();
    } catch (error) {
      console.error("Failed to pause track:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to pause track",
      }));
    }
  }, []);

  const resumeTrack = useCallback(async () => {
    try {
      await audioPlayerService.resume();
    } catch (error) {
      console.error("Failed to resume track:", error);
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to resume track",
      }));
    }
  }, []);

  const seekTo = useCallback(async (position: number) => {
    try {
      await audioPlayerService.seekTo(position);
    } catch (error) {
      console.error("Failed to seek:", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to seek",
      }));
    }
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const setOnTrackFinished = useCallback(
    (callback: (() => Promise<void>) | null) => {
      onTrackFinishedRef.current = callback;
    },
    [],
  );

  const value: PlayerContextType & {
    setOnTrackFinished: (callback: (() => Promise<void>) | null) => void;
  } = {
    ...state,
    playTrack,
    pauseTrack,
    resumeTrack,
    seekTo,
    formatTime,
    setOnTrackFinished,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context as PlayerContextType;
}

export function usePlayerInternal() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerInternal must be used within PlayerProvider");
  }
  return context as PlayerContextType & {
    setOnTrackFinished: (callback: (() => Promise<void>) | null) => void;
  };
}
