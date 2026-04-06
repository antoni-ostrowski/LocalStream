import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import type { AudioPlayer } from "expo-audio";
import type { Track } from "@/db/schema";
import type { PlaybackStatus } from "@/types/player";

class AudioPlayerService {
  private static instance: AudioPlayerService;
  private player: AudioPlayer | null = null;
  private statusCallback: ((status: PlaybackStatus) => void) | null = null;
  private currentTrack: Track | null = null;
  private isInitialized = false;
  private statusSubscription: { remove: () => void } | null = null;

  private constructor() {}

  static getInstance(): AudioPlayerService {
    if (!AudioPlayerService.instance) {
      AudioPlayerService.instance = new AudioPlayerService();
    }
    return AudioPlayerService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: "doNotMix",
      });

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize audio mode:", error);
      throw error;
    }
  }

  async playTrack(track: Track): Promise<void> {
    try {
      if (this.player) {
        this.statusSubscription?.remove();
        this.player.clearLockScreenControls();
        this.player.remove();
        this.player = null;
      }

      this.currentTrack = track;
      this.player = createAudioPlayer(
        { uri: track.path },
        { updateInterval: 500 },
      );

      this.statusSubscription = this.player.addListener(
        "playbackStatusUpdate",
        (status) => {
          if (this.statusCallback) {
            this.statusCallback({
              isPlaying: status.playing ?? false,
              isLoading: status.isBuffering ?? false,
              currentTime: status.currentTime ?? 0,
              duration: status.duration ?? track.duration,
              currentTrack: this.currentTrack,
              didJustFinish: status.didJustFinish ?? false,
            });
          }
        },
      );

      this.player.setActiveForLockScreen(
        true,
        {
          title: track.title,
          artist: track.artist || "Unknown Artist",
        },
        {
          showSeekForward: true,
          showSeekBackward: true,
        },
      );

      this.player.play();
    } catch (error) {
      console.error("Failed to play track:", error);
      this.currentTrack = null;
      throw error;
    }
  }

  async pause(): Promise<void> {
    if (this.player) {
      this.player.pause();
    }
  }

  async resume(): Promise<void> {
    if (this.player) {
      this.player.play();
    }
  }

  async stop(): Promise<void> {
    if (this.player) {
      this.player.pause();
      await this.player.seekTo(0);
    }
  }

  async seekTo(position: number): Promise<void> {
    if (this.player) {
      await this.player.seekTo(position / 1000);
    }
  }

  setStatusUpdateCallback(callback: (status: PlaybackStatus) => void): void {
    this.statusCallback = callback;
  }

  getStatus(): PlaybackStatus {
    if (!this.player) {
      return {
        isPlaying: false,
        isLoading: false,
        currentTime: 0,
        duration: 0,
        currentTrack: null,
        didJustFinish: false,
      };
    }

    return {
      isPlaying: this.player.playing ?? false,
      isLoading: this.player.isBuffering ?? false,
      currentTime: this.player.currentTime ?? 0,
      duration: this.player.duration ?? this.currentTrack?.duration ?? 0,
      currentTrack: this.currentTrack,
      didJustFinish: false,
    };
  }

  destroy(): void {
    if (this.player) {
      this.statusSubscription?.remove();
      this.player.clearLockScreenControls();
      this.player.remove();
      this.player = null;
    }
    this.currentTrack = null;
    this.statusCallback = null;
    this.isInitialized = false;
  }
}

export const audioPlayerService = AudioPlayerService.getInstance();
