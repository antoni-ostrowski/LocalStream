import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSync } from "@/contexts/sync-context";

export function SyncButton() {
  const { isSyncing, progress, startSync } = useSync();

  if (isSyncing && progress) {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>
            {progress.status === "scanning" ? "Scanning..." : "Syncing..."}
          </Text>
          <Text style={styles.progressPercent}>
            {Math.round(progress.progress)}%
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progress.progress}%` }]}
          />
        </View>

        {progress.currentFile && (
          <Text style={styles.currentFile} numberOfLines={1}>
            {progress.currentFile}
          </Text>
        )}

        <View style={styles.progressStats}>
          <Text style={styles.stat}>Found: {progress.totalFiles}</Text>
          <Text style={styles.stat}>Added: {progress.addedCount}</Text>
          <Text style={styles.stat}>Updated: {progress.updatedCount}</Text>
          <Text style={styles.stat}>Removed: {progress.removedCount}</Text>
        </View>

        {progress.errorCount > 0 && (
          <Text style={styles.errorCount}>{progress.errorCount} error(s)</Text>
        )}
      </View>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={startSync}
      disabled={isSyncing}
    >
      {isSyncing ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Sync Library</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: "#0051D5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  progressContainer: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  progressPercent: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
  },
  currentFile: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  stat: {
    fontSize: 12,
    color: "#888",
  },
  errorCount: {
    fontSize: 12,
    color: "#f44336",
    marginTop: 8,
    textAlign: "center",
  },
});
