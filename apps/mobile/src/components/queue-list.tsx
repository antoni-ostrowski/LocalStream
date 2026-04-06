import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { useQueue } from "@/contexts/queue-context";

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function QueueList() {
  const { queue, removeFromQueue, clearQueue } = useQueue();

  if (queue.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Queue is empty</Text>
        <Text style={styles.emptySubtext}>
          Long press on a track to add it to the queue
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Queue</Text>
        <Pressable style={styles.clearButton} onPress={clearQueue}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      </View>

      <FlatList
        data={queue}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.queueItem}>
            <Text style={styles.queueIndex}>{index + 1}</Text>
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                {item.track.title}
              </Text>
              {item.track.artist && (
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {item.track.artist}
                </Text>
              )}
            </View>
            <Text style={styles.trackDuration}>
              {formatDuration(item.track.duration)}
            </Text>
            <Pressable
              style={styles.removeButton}
              onPress={() => removeFromQueue(item.id)}
            >
              <Text style={styles.removeButtonText}>{"\u2715"}</Text>
            </Pressable>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#333",
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#b3b3b3",
    fontWeight: "500",
  },
  emptyContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#121212",
    borderRadius: 4,
    marginBottom: 4,
  },
  queueIndex: {
    fontSize: 14,
    color: "#888",
    width: 24,
    textAlign: "center",
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 14,
    color: "#b3b3b3",
  },
  trackDuration: {
    fontSize: 14,
    color: "#888",
    marginRight: 12,
    fontVariant: ["tabular-nums"],
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    fontSize: 12,
    color: "#b3b3b3",
  },
});
