import { eq, inArray, notInArray } from "drizzle-orm";
import { getDb } from "../db/client";
import { tracks, type Track, type NewTrack } from "../db/schema";
import { scanLibraryPath, type ScannedFile } from "./file-scanner";
import { extractMetadataWithFallback } from "./metadata-extractor";
import { getEnabledLibraryPaths, updateLibraryPath } from "./settings-service";
import { generateId } from "../utils/path-utils";

export interface SyncProgress {
  status: "idle" | "scanning" | "syncing" | "complete" | "error";
  progress: number;
  currentFile: string | null;
  totalFiles: number;
  processedFiles: number;
  addedCount: number;
  updatedCount: number;
  removedCount: number;
  errorCount: number;
  errors: string[];
}

export type SyncProgressCallback = (progress: SyncProgress) => void;

export async function syncLibrary(
  onProgress?: SyncProgressCallback,
): Promise<SyncProgress> {
  const db = getDb();
  const progress: SyncProgress = {
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
  };

  try {
    const enabledPaths = await getEnabledLibraryPaths();

    if (enabledPaths.length === 0) {
      progress.status = "complete";
      progress.progress = 100;
      onProgress?.(progress);
      return progress;
    }

    const allFiles: ScannedFile[] = [];

    for (const libraryPath of enabledPaths) {
      const files = await scanLibraryPath(libraryPath.path, (current) => {
        progress.currentFile = current;
        onProgress?.(progress);
      });
      allFiles.push(...files);
    }

    progress.totalFiles = allFiles.length;
    progress.status = "syncing";
    onProgress?.(progress);

    const existingTracks = await db.select().from(tracks);
    const existingPaths = new Map(existingTracks.map((t) => [t.path, t]));

    const toAdd: NewTrack[] = [];
    const toUpdate: Track[] = [];
    const toRemove: string[] = [];
    const processedPaths = new Set<string>();

    for (const file of allFiles) {
      processedPaths.add(file.path);
      progress.processedFiles++;
      progress.currentFile = file.name;
      progress.progress = (progress.processedFiles / progress.totalFiles) * 100;
      onProgress?.(progress);

      const existing = existingPaths.get(file.path);

      if (existing) {
        const needsUpdate = existing.lastModified !== file.lastModified;

        if (needsUpdate) {
          const metadata = await extractMetadataWithFallback(file.path);

          toUpdate.push({
            ...existing,
            title: metadata.title,
            artist: metadata.artist,
            album: metadata.album,
            duration: metadata.duration,
            fileSize: file.size,
            lastModified: file.lastModified,
            updatedAt: new Date(),
          });
          progress.updatedCount++;
        }
      } else {
        const metadata = await extractMetadataWithFallback(file.path);

        toAdd.push({
          id: generateId(),
          title: metadata.title,
          artist: metadata.artist,
          album: metadata.album,
          duration: metadata.duration,
          path: file.path,
          fileSize: file.size,
          lastModified: file.lastModified,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        progress.addedCount++;
      }
    }

    for (const existing of existingTracks) {
      if (!processedPaths.has(existing.path)) {
        toRemove.push(existing.id);
        progress.removedCount++;
      }
    }

    if (toAdd.length > 0) {
      await db.insert(tracks).values(toAdd);
    }

    for (const track of toUpdate) {
      await db.update(tracks).set(track).where(eq(tracks.id, track.id));
    }

    if (toRemove.length > 0) {
      await db.delete(tracks).where(inArray(tracks.id, toRemove));
    }

    const now = new Date();
    for (const libraryPath of enabledPaths) {
      await updateLibraryPath(libraryPath.id, { lastScannedAt: now });
    }

    progress.status = "complete";
    progress.progress = 100;
    progress.currentFile = null;
    onProgress?.(progress);

    return progress;
  } catch (error) {
    progress.status = "error";
    progress.errors.push(
      error instanceof Error ? error.message : String(error),
    );
    onProgress?.(progress);
    throw error;
  }
}

export async function getAllTracks(): Promise<Track[]> {
  const db = getDb();
  return db.select().from(tracks);
}

export async function getTrackById(id: string): Promise<Track | null> {
  const db = getDb();
  const result = await db.select().from(tracks).where(eq(tracks.id, id));
  return result[0] ?? null;
}

export async function clearAllTracks(): Promise<void> {
  const db = getDb();
  await db.delete(tracks);
}
