import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlayer } from "@/contexts/player-context";
import { QueueList } from "@/components/queue-list";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ARTWORK_SIZE = SCREEN_WIDTH - 64;
const PROGRESS_BAR_WIDTH = SCREEN_WIDTH - 64;

export default function NowPlayingScreen() {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    error,
    pauseTrack,
    resumeTrack,
    seekTo,
    formatTime,
  } = usePlayer();

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No track playing</Text>
          <Text style={styles.emptySubtext}>
            Select a track from your Library to start playing
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await pauseTrack();
      } else {
        await resumeTrack();
      }
    } catch (err) {
      console.error("Failed to toggle playback:", err);
    }
  };

  const handleSeek = async (event: any) => {
    const { locationX } = event.nativeEvent;
    const newProgress = (locationX / PROGRESS_BAR_WIDTH) * duration;
    await seekTo(newProgress);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.playerSection}>
          <View style={styles.artworkContainer}>
            <View style={styles.artwork} />
          </View>

          <View style={styles.trackInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {currentTrack.title}
            </Text>
            {currentTrack.artist && (
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            )}
            {currentTrack.album && (
              <Text style={styles.album} numberOfLines={1}>
                {currentTrack.album}
              </Text>
            )}
          </View>

          <View style={styles.progressSection}>
            <Pressable style={styles.progressBarContainer} onPress={handleSeek}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
            </Pressable>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatTime(currentTime / 1000)}
              </Text>
              <Text style={styles.timeText}>{formatTime(duration / 1000)}</Text>
            </View>
          </View>

          <View style={styles.controls}>
            {error && <Text style={styles.errorText}>{error}</Text>}
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Pressable onPress={handlePlayPause} style={styles.playButton}>
                <Text style={styles.playButtonIcon}>
                  {isPlaying ? "\u23F8" : "\u25B6"}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        <QueueList />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  playerSection: {
    paddingHorizontal: 32,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#fff",
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
  artworkContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  trackInfo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#fff",
  },
  artist: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 4,
    color: "#b3b3b3",
  },
  album: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
  progressSection: {
    marginBottom: 24,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#333",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#1DB954",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 13,
    fontVariant: ["tabular-nums"],
    color: "#888",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1DB954",
  },
  playButtonIcon: {
    fontSize: 32,
    color: "#000",
  },
  errorText: {
    fontSize: 14,
    color: "#f44336",
    marginBottom: 16,
  },
});
