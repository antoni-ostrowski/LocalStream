import { useEffect, useRef } from "react";
import { usePlayerInternal } from "@/contexts/player-context";
import { useQueue } from "@/contexts/queue-context";
import { audioPlayerService } from "@/services/audio-player-service";
import { isDbReady } from "@/db/client";

export function QueuePlayerBridge() {
  const { setOnTrackFinished } = usePlayerInternal();
  const { getNextTrack, removeFirstQueueItem } = useQueue();
  const isSettingUpRef = useRef(false);

  useEffect(() => {
    const setupCallback = () => {
      const handleTrackFinished = async () => {
        if (!isDbReady()) {
          return;
        }
        try {
          const nextTrack = await getNextTrack();
          if (nextTrack) {
            await audioPlayerService.playTrack(nextTrack);
            await removeFirstQueueItem();
          }
        } catch (err) {
          console.error("Failed to play next track from queue:", err);
        }
      };

      setOnTrackFinished(handleTrackFinished);
    };

    if (isDbReady() && !isSettingUpRef.current) {
      isSettingUpRef.current = true;
      setupCallback();
    }

    const checkInterval = setInterval(() => {
      if (isDbReady() && !isSettingUpRef.current) {
        isSettingUpRef.current = true;
        setupCallback();
        clearInterval(checkInterval);
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
      setOnTrackFinished(null);
    };
  }, [setOnTrackFinished, getNextTrack, removeFirstQueueItem]);

  return null;
}
