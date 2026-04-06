import { eq } from "drizzle-orm";
import { getDb } from "../db/client";
import {
  libraryPaths,
  type LibraryPath,
  type NewLibraryPath,
} from "../db/schema";
import { generateId } from "../utils/path-utils";
import { Paths } from "expo-file-system";

export async function getLibraryPaths(): Promise<LibraryPath[]> {
  const db = getDb();
  const paths = await db.select().from(libraryPaths);
  return paths;
}

export async function getEnabledLibraryPaths(): Promise<LibraryPath[]> {
  const db = getDb();
  const paths = await db
    .select()
    .from(libraryPaths)
    .where(eq(libraryPaths.isEnabled, true));
  return paths;
}

export async function addLibraryPath(path: string): Promise<LibraryPath> {
  const db = getDb();

  const existing = await db
    .select()
    .from(libraryPaths)
    .where(eq(libraryPaths.path, path));

  if (existing.length > 0) {
    throw new Error("Library path already exists");
  }

  const newLibraryPath: NewLibraryPath = {
    id: generateId(),
    path,
    isEnabled: true,
    lastScannedAt: null,
  };

  const result = await db
    .insert(libraryPaths)
    .values(newLibraryPath)
    .returning();
  return result[0];
}

export async function updateLibraryPath(
  id: string,
  updates: Partial<Omit<LibraryPath, "id" | "path">>,
): Promise<LibraryPath | null> {
  const db = getDb();

  const result = await db
    .update(libraryPaths)
    .set(updates)
    .where(eq(libraryPaths.id, id))
    .returning();

  return result[0] ?? null;
}

export async function removeLibraryPath(id: string): Promise<void> {
  const db = getDb();
  await db.delete(libraryPaths).where(eq(libraryPaths.id, id));
}

export async function initializeDefaultLibraryPath(): Promise<LibraryPath | null> {
  const paths = await getLibraryPaths();

  if (paths.length > 0) {
    return null;
  }

  const documentsPath = Paths.document.uri;

  try {
    const newPath = await addLibraryPath(documentsPath);
    return newPath;
  } catch (error) {
    console.error("Error initializing default library path:", error);
    return null;
  }
}
