import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Track } from "@/db/schema";
import * as queueService from "@/services/queue-service";
import { isDbReady } from "@/db/client";

interface QueueItem {
  id: string;
  track: Track;
  position: number;
}

interface QueueContextType {
  queue: QueueItem[];
  isLoading: boolean;
  error: string | null;
  appendToQueue: (track: Track) => Promise<void>;
  pushToQueue: (track: Track) => Promise<void>;
  removeFromQueue: (queueId: string) => Promise<void>;
  clearQueue: () => Promise<void>;
  refreshQueue: () => Promise<void>;
  getNextTrack: () => Promise<Track | null>;
  removeFirstQueueItem: () => Promise<void>;
}

const QueueContext = createContext<QueueContextType | null>(null);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    if (!isDbReady()) {
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const items = await queueService.getQueue();
      setQueue(
        items.map((item) => ({
          id: item.id,
          track: item.track,
          position: item.position,
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load queue");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAndLoad = () => {
      if (isDbReady()) {
        loadQueue();
      }
    };

    checkAndLoad();

    const interval = setInterval(() => {
      if (isDbReady() && isLoading) {
        checkAndLoad();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [loadQueue, isLoading]);

  const appendToQueue = useCallback(
    async (track: Track) => {
      if (!isDbReady()) {
        setError("Database not ready");
        return;
      }
      try {
        setError(null);
        await queueService.appendToQueue(track.id);
        await loadQueue();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add to queue");
      }
    },
    [loadQueue],
  );

  const pushToQueue = useCallback(
    async (track: Track) => {
      if (!isDbReady()) {
        setError("Database not ready");
        return;
      }
      try {
        setError(null);
        await queueService.pushToQueue(track.id);
        await loadQueue();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add to queue");
      }
    },
    [loadQueue],
  );

  const removeFromQueue = useCallback(
    async (queueId: string) => {
      if (!isDbReady()) {
        return;
      }
      try {
        setError(null);
        await queueService.removeFromQueue(queueId);
        await loadQueue();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to remove from queue",
        );
      }
    },
    [loadQueue],
  );

  const clearQueue = useCallback(async () => {
    if (!isDbReady()) {
      return;
    }
    try {
      setError(null);
      await queueService.clearQueue();
      setQueue([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear queue");
    }
  }, []);

  const refreshQueue = useCallback(async () => {
    await loadQueue();
  }, [loadQueue]);

  const getNextTrack = useCallback(async (): Promise<Track | null> => {
    if (!isDbReady()) {
      return null;
    }
    const item = await queueService.getNextTrack();
    return item?.track ?? null;
  }, []);

  const removeFirstQueueItem = useCallback(async () => {
    if (!isDbReady()) {
      return;
    }
    try {
      await queueService.removeFirstQueueItem();
      await loadQueue();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update queue");
    }
  }, [loadQueue]);

  const value: QueueContextType = {
    queue,
    isLoading,
    error,
    appendToQueue,
    pushToQueue,
    removeFromQueue,
    clearQueue,
    refreshQueue,
    getNextTrack,
    removeFirstQueueItem,
  };

  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue must be used within QueueProvider");
  }
  return context;
}
