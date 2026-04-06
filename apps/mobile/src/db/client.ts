import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite";
import * as schema from "./schema";

const DATABASE_NAME = "music_library.db";
const DATABASE_VERSION = 2;

let dbInstance: ReturnType<typeof drizzle> | null = null;
let sqliteInstance: SQLiteDatabase | null = null;

export async function initializeDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  sqliteInstance = openDatabaseSync(DATABASE_NAME);

  await sqliteInstance.execAsync("PRAGMA journal_mode = WAL");
  await sqliteInstance.execAsync("PRAGMA foreign_keys = ON");

  await runMigrations(sqliteInstance);

  dbInstance = drizzle(sqliteInstance, { schema });

  return dbInstance;
}

async function runMigrations(db: SQLiteDatabase) {
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );

  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentVersion === 0) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tracks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        artist TEXT,
        album TEXT,
        duration REAL NOT NULL,
        path TEXT NOT NULL UNIQUE,
        file_size INTEGER NOT NULL,
        last_modified INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS library_paths (
        id TEXT PRIMARY KEY NOT NULL,
        path TEXT NOT NULL UNIQUE,
        is_enabled INTEGER NOT NULL DEFAULT 1,
        last_scanned_at INTEGER
      );
      
      CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(artist);
      CREATE INDEX IF NOT EXISTS idx_tracks_album ON tracks(album);
      CREATE INDEX IF NOT EXISTS idx_tracks_path ON tracks(path);
    `);
  }

  if (currentVersion < 2) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS queue (
        id TEXT PRIMARY KEY NOT NULL,
        track_id TEXT NOT NULL,
        position INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_queue_position ON queue(position);
    `);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export function getDb() {
  if (!dbInstance) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first.",
    );
  }
  return dbInstance;
}

export function getSqliteDb() {
  if (!sqliteInstance) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first.",
    );
  }
  return sqliteInstance;
}

export function isDbReady(): boolean {
  return dbInstance !== null;
}
