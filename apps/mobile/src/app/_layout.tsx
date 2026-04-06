import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { initializeDatabase } from "@/db/client";
import { TracksProvider } from "@/contexts/tracks-context";
import { SyncProvider } from "@/contexts/sync-context";
import { PlayerProvider } from "@/contexts/player-context";
import { QueueProvider } from "@/contexts/queue-context";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { QueuePlayerBridge } from "@/components/queue-player-bridge";
import AppTabs from "@/components/app-tabs";

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    initializeDatabase()
      .then(() => setIsDbReady(true))
      .catch((error) => {
        console.error("Failed to initialize database:", error);
      });
  }, []);

  if (!isDbReady) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <PlayerProvider>
        <QueueProvider>
          <TracksProvider>
            <SyncProvider>
              <AnimatedSplashOverlay />
              <QueuePlayerBridge />
              <AppTabs />
            </SyncProvider>
          </TracksProvider>
        </QueueProvider>
      </PlayerProvider>
    </ThemeProvider>
  );
}
