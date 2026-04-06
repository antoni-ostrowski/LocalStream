import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Directory } from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import type { LibraryPath } from "@/db/schema";
import {
  getLibraryPaths,
  addLibraryPath,
  removeLibraryPath,
  initializeDefaultLibraryPath,
} from "@/services/settings-service";
import { SyncButton } from "@/components/sync-button";

export default function SettingsScreen() {
  const [libraryPaths, setLibraryPaths] = useState<LibraryPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLibraryPaths = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const paths = await getLibraryPaths();

      if (paths.length === 0) {
        await initializeDefaultLibraryPath();
        const updatedPaths = await getLibraryPaths();
        setLibraryPaths(updatedPaths);
      } else {
        setLibraryPaths(paths);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load paths");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLibraryPaths();
  }, []);

  const handleAddPath = async () => {
    try {
      const result = await Directory.pickDirectoryAsync();

      if (result) {
        await addLibraryPath(result.uri);
        await loadLibraryPaths();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add path");
    }
  };

  const handleRemovePath = async (id: string) => {
    try {
      await removeLibraryPath(id);
      await loadLibraryPaths();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove path");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Library Paths</Text>
        <Pressable style={styles.addButton} onPress={handleAddPath}>
          <Text style={styles.addButtonText}>+ Add Path</Text>
        </Pressable>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={libraryPaths}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.pathItem}>
            <View style={styles.pathInfo}>
              <Text style={styles.pathText} numberOfLines={1}>
                {item.path}
              </Text>
              {item.lastScannedAt && (
                <Text style={styles.scannedText}>
                  Last scanned: {new Date(item.lastScannedAt).toLocaleString()}
                </Text>
              )}
            </View>
            <Pressable
              style={styles.removeButton}
              onPress={() => handleRemovePath(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No library paths configured</Text>
            <Text style={styles.emptySubtext}>
              Add directories to scan for music files
            </Text>
          </View>
        }
      />

      <View style={styles.syncSection}>
        <Text style={styles.sectionTitle}>Sync Library</Text>
        <SyncButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 6,
  },
  errorText: {
    color: "#f44336",
  },
  list: {
    padding: 16,
  },
  pathItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  pathInfo: {
    flex: 1,
    marginRight: 12,
  },
  pathText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#fff",
  },
  scannedText: {
    fontSize: 12,
    color: "#888",
  },
  removeButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 8,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
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
  syncSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
});
