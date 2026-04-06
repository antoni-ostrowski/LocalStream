import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import type { Track } from "@/db/schema";
import { TrackItem } from "./track-item";

interface TrackListProps {
  tracks: Track[];
  onTrackPress?: (track: Track) => void;
  onTrackLongPress?: (track: Track) => void;
  onTrackPlayPause?: (track: Track) => void;
  currentTrackId?: string;
  isPlaying?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

export function TrackList({
  tracks,
  onTrackPress,
  onTrackLongPress,
  onTrackPlayPause,
  currentTrackId,
  isPlaying,
  isLoading,
  error,
}: TrackListProps) {
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading tracks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (tracks.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No tracks found</Text>
        <Text style={styles.emptySubtext}>
          Add library paths in Settings and sync your music
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tracks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TrackItem
          track={item}
          onPress={onTrackPress}
          onLongPress={onTrackLongPress}
          onPlayPause={onTrackPlayPause}
          isCurrentTrack={item.id === currentTrackId}
          isPlaying={item.id === currentTrackId && isPlaying}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
  },
  errorText: {
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#fff",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
