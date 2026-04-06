import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Platform,
  ActionSheetIOS,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTracks } from "@/contexts/tracks-context";
import { useSync } from "@/contexts/sync-context";
import { usePlayer } from "@/contexts/player-context";
import { useQueue } from "@/contexts/queue-context";
import { TrackList } from "@/components/track-list";
import type { Track } from "@/db/schema";

export default function HomeScreen() {
  const { tracks, isLoading, error, refreshTracks } = useTracks();
  const { isSyncing, progress } = useSync();
  const { playTrack, pauseTrack, currentTrack, isPlaying } = usePlayer();
  const { appendToQueue, pushToQueue } = useQueue();

  useEffect(() => {
    if (!isSyncing && progress?.status === "complete") {
      refreshTracks();
    }
  }, [isSyncing, progress, refreshTracks]);

  const showActionSheet = (track: Track) => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: track.title,
          message: track.artist || "Unknown Artist",
          options: ["Play Next", "Add to Queue", "Cancel"],
          cancelButtonIndex: 2,
          destructiveButtonIndex: -1,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            try {
              await pushToQueue(track);
            } catch (err) {
              console.error("Failed to add to queue:", err);
            }
          } else if (buttonIndex === 1) {
            try {
              await appendToQueue(track);
            } catch (err) {
              console.error("Failed to add to queue:", err);
            }
          }
        },
      );
    } else {
      Alert.alert(track.title, track.artist || "Unknown Artist", [
        {
          text: "Play Next",
          onPress: async () => {
            try {
              await pushToQueue(track);
            } catch (err) {
              console.error("Failed to add to queue:", err);
            }
          },
        },
        {
          text: "Add to Queue",
          onPress: async () => {
            try {
              await appendToQueue(track);
            } catch (err) {
              console.error("Failed to add to queue:", err);
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleTrackPress = async (track: Track) => {
    try {
      await playTrack(track);
    } catch (err) {
      console.error("Failed to play track:", err);
    }
  };

  const handleTrackLongPress = (track: Track) => {
    showActionSheet(track);
  };

  const handleTrackPlayPause = async (track: Track) => {
    try {
      if (currentTrack?.id === track.id && isPlaying) {
        await pauseTrack();
      } else {
        await playTrack(track);
      }
    } catch (err) {
      console.error("Failed to toggle playback:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TrackList
          tracks={tracks}
          isLoading={isLoading}
          error={error}
          onTrackPress={handleTrackPress}
          onTrackLongPress={handleTrackLongPress}
          onTrackPlayPause={handleTrackPlayPause}
          currentTrackId={currentTrack?.id}
          isPlaying={isPlaying}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  content: {
    flex: 1,
  },
});
