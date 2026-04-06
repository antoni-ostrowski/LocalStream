import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import type { Track } from "@/db/schema";

interface TrackItemProps {
  track: Track;
  onPress?: (track: Track) => void;
  onLongPress?: (track: Track) => void;
  onPlayPause?: (track: Track) => void;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
  isFavorite?: boolean;
}

export function TrackItem({
  track,
  onPress,
  onLongPress,
  onPlayPause,
  isCurrentTrack,
  isPlaying,
  isFavorite,
}: TrackItemProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    onPlayPause?.(track);
  };

  const handleLongPress = () => {
    onLongPress?.(track);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress?.(track)}
      onLongPress={handleLongPress}
      delayLongPress={300}
    >
      <View style={styles.artwork}>
        <View style={styles.artworkPlaceholder} />
        {isCurrentTrack && (
          <View style={styles.playingOverlay}>
            <Text style={styles.playingIcon}>
              {isPlaying ? "\u23F8" : "\u25B6"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.title, isCurrentTrack && styles.playingText]}
          numberOfLines={1}
        >
          {track.title}
        </Text>
        <View style={styles.metadataRow}>
          {track.artist && (
            <Text style={styles.artist} numberOfLines={1}>
              {track.artist}
            </Text>
          )}
          {track.artist && track.album && (
            <Text style={styles.dot}>{"\u2022"}</Text>
          )}
          {track.album && (
            <Text style={styles.album} numberOfLines={1}>
              {track.album}
            </Text>
          )}
        </View>
      </View>

      <Pressable style={styles.favoriteButton}>
        <Text style={[styles.starIcon, isFavorite && styles.starIconActive]}>
          {"\u2606"}
        </Text>
      </Pressable>

      <Text style={styles.duration}>{formatDuration(track.duration)}</Text>

      <Pressable style={styles.playButton} onPress={handlePlayPause}>
        <Text style={styles.playButtonIcon}>
          {isCurrentTrack && isPlaying ? "\u23F8" : "\u25B6"}
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#121212",
    borderRadius: 4,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  pressed: {
    backgroundColor: "#1a1a1a",
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 4,
    marginRight: 12,
    position: "relative",
    overflow: "hidden",
  },
  artworkPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#282828",
  },
  playingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  playingIcon: {
    color: "#1DB954",
    fontSize: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    color: "#fff",
  },
  playingText: {
    color: "#1DB954",
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  artist: {
    fontSize: 14,
    color: "#b3b3b3",
  },
  dot: {
    fontSize: 14,
    color: "#b3b3b3",
  },
  album: {
    fontSize: 14,
    color: "#b3b3b3",
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
    marginRight: 4,
  },
  starIcon: {
    fontSize: 20,
    color: "#b3b3b3",
  },
  starIconActive: {
    color: "#1DB954",
  },
  duration: {
    fontSize: 14,
    color: "#b3b3b3",
    marginRight: 8,
    fontVariant: ["tabular-nums"],
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1DB954",
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonIcon: {
    fontSize: 14,
    color: "#000",
  },
});
