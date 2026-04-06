import React, { createContext, useContext, useState, useCallback } from "react";
import { syncLibrary, type SyncProgress } from "../services/track-sync-service";

interface SyncContextType {
  isSyncing: boolean;
  progress: SyncProgress | null;
  startSync: () => Promise<void>;
  cancelSync: () => void;
}

const SyncContext = createContext<SyncContextType | null>(null);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState<SyncProgress | null>(null);

  const startSync = useCallback(async () => {
    try {
      setIsSyncing(true);
      setProgress({
        status: "scanning",
        progress: 0,
        currentFile: null,
        totalFiles: 0,
        processedFiles: 0,
        addedCount: 0,
        updatedCount: 0,
        removedCount: 0,
        errorCount: 0,
        errors: [],
      });

      await syncLibrary((syncProgress) => {
        setProgress(syncProgress);
      });
    } catch (error) {
      setProgress((prev) =>
        prev
          ? {
              ...prev,
              status: "error",
              errors: [error instanceof Error ? error.message : String(error)],
            }
          : null,
      );
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const cancelSync = useCallback(() => {
    setIsSyncing(false);
    setProgress(null);
  }, []);

  return (
    <SyncContext.Provider
      value={{ isSyncing, progress, startSync, cancelSync }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSync must be used within SyncProvider");
  }
  return context;
}
