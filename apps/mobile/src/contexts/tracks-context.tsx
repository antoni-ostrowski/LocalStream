import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Track } from "../db/schema";
import { getAllTracks } from "../services/track-sync-service";

interface TracksContextType {
  tracks: Track[];
  isLoading: boolean;
  error: string | null;
  refreshTracks: () => Promise<void>;
}

const TracksContext = createContext<TracksContextType | null>(null);

export function TracksProvider({ children }: { children: React.ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTracks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allTracks = await getAllTracks();
      setTracks(allTracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tracks");
      console.error("Error loading tracks:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTracks();
  }, [refreshTracks]);

  return (
    <TracksContext.Provider value={{ tracks, isLoading, error, refreshTracks }}>
      {children}
    </TracksContext.Provider>
  );
}

export function useTracks() {
  const context = useContext(TracksContext);
  if (!context) {
    throw new Error("useTracks must be used within TracksProvider");
  }
  return context;
}
