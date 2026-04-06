import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const tracks = sqliteTable("tracks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  album: text("album"),
  duration: real("duration").notNull(),
  path: text("path").notNull().unique(),
  fileSize: integer("file_size").notNull(),
  lastModified: integer("last_modified").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const libraryPaths = sqliteTable("library_paths", {
  id: text("id").primaryKey(),
  path: text("path").notNull().unique(),
  isEnabled: integer("is_enabled", { mode: "boolean" }).notNull().default(true),
  lastScannedAt: integer("last_scanned_at", { mode: "timestamp" }),
});

export const queue = sqliteTable("queue", {
  id: text("id").primaryKey(),
  trackId: text("track_id")
    .notNull()
    .references(() => tracks.id),
  position: integer("position").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type Track = typeof tracks.$inferSelect;
export type NewTrack = typeof tracks.$inferInsert;
export type LibraryPath = typeof libraryPaths.$inferSelect;
export type NewLibraryPath = typeof libraryPaths.$inferInsert;
export type QueueItem = typeof queue.$inferSelect;
export type NewQueueItem = typeof queue.$inferInsert;
