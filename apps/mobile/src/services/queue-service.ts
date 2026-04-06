import { eq, asc, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import type { Track, QueueItem, NewQueueItem } from "@/db/schema";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function getQueue(): Promise<(QueueItem & { track: Track })[]> {
  const db = getDb();

  const result = await db
    .select({
      id: schema.queue.id,
      trackId: schema.queue.trackId,
      position: schema.queue.position,
      createdAt: schema.queue.createdAt,
      track: schema.tracks,
    })
    .from(schema.queue)
    .innerJoin(schema.tracks, eq(schema.queue.trackId, schema.tracks.id))
    .orderBy(asc(schema.queue.position));

  return result.map((row) => ({
    id: row.id,
    trackId: row.trackId,
    position: row.position,
    createdAt: row.createdAt,
    track: row.track,
  }));
}

export async function appendToQueue(trackId: string): Promise<QueueItem> {
  const db = getDb();

  const maxPositionResult = await db
    .select({ position: schema.queue.position })
    .from(schema.queue)
    .orderBy(asc(schema.queue.position))
    .limit(1);

  const nextPosition =
    maxPositionResult.length > 0
      ? (maxPositionResult[0]?.position ?? -1) + 1
      : 0;

  const queueItem: NewQueueItem = {
    id: generateId(),
    trackId,
    position: nextPosition,
    createdAt: new Date(),
  };

  const result = await db.insert(schema.queue).values(queueItem).returning();

  return result[0];
}

export async function pushToQueue(trackId: string): Promise<QueueItem> {
  const db = getDb();

  await db.run(sql`UPDATE queue SET position = position + 1`);

  const queueItem: NewQueueItem = {
    id: generateId(),
    trackId,
    position: 0,
    createdAt: new Date(),
  };

  const result = await db.insert(schema.queue).values(queueItem).returning();

  return result[0];
}

export async function removeFromQueue(queueId: string): Promise<void> {
  const db = getDb();

  const item = await db
    .select()
    .from(schema.queue)
    .where(eq(schema.queue.id, queueId))
    .limit(1);

  if (item.length === 0) return;

  const position = item[0]!.position;

  await db.delete(schema.queue).where(eq(schema.queue.id, queueId));

  await db.run(
    sql`UPDATE queue SET position = position - 1 WHERE position > ${position}`,
  );
}

export async function clearQueue(): Promise<void> {
  const db = getDb();
  await db.delete(schema.queue);
}

export async function getNextTrack(): Promise<
  (QueueItem & { track: Track }) | null
> {
  const db = getDb();

  const result = await db
    .select({
      id: schema.queue.id,
      trackId: schema.queue.trackId,
      position: schema.queue.position,
      createdAt: schema.queue.createdAt,
      track: schema.tracks,
    })
    .from(schema.queue)
    .innerJoin(schema.tracks, eq(schema.queue.trackId, schema.tracks.id))
    .orderBy(asc(schema.queue.position))
    .limit(1);

  if (result.length === 0) return null;

  const firstItem = result[0];

  return {
    id: firstItem.id,
    trackId: firstItem.trackId,
    position: firstItem.position,
    createdAt: firstItem.createdAt,
    track: firstItem.track,
  };
}

export async function removeFirstQueueItem(): Promise<void> {
  const db = getDb();

  const firstItem = await getNextTrack();
  if (!firstItem) return;

  await db.delete(schema.queue).where(eq(schema.queue.id, firstItem.id));

  await db.run(sql`UPDATE queue SET position = position - 1`);
}
