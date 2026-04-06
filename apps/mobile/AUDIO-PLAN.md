# Audio Player Implementation Plan

## Requirements Summary

✅ **Background playback** with lock screen controls  
✅ **Stop after current track** (no auto-advance)  
✅ **Sticky mini-player** at top of app  
✅ **Play/pause + progress bar + time display**  
✅ **Play clicked track immediately** (no queue yet)  
✅ **Use expo-audio** (not expo-av)

---

## Implementation Plan: Audio Player Layer

### **Phase 1: Dependency Setup & Configuration** (15 minutes)

**Install expo-audio:**

```bash
bun add expo-audio
bun remove expo-av  # Remove deprecated package
```

**Configure app.json for background audio:**

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      ["expo-splash-screen", { ... }],
      ["expo-audio", { "enableBackgroundPlayback": true }],
      ["expo-file-system", { "enableFileSharing": true }]
    ]
  }
}
```

**Configure audio mode on app start:**

- Enable background playback
- Set interruption mode (pause for calls)
- Enable lock screen controls

---

### **Phase 2: Audio Player Service** (30 minutes)

**Create `src/services/audio-player-service.ts`:**

**Responsibilities:**

1. Initialize audio mode (background, interruptions)
2. Control playback (play, pause, stop, seek)
3. Set lock screen metadata
4. Handle playback status updates

**API:**

```typescript
class AudioPlayerService {
  // Initialization
  initialize(): Promise<void>;

  // Playback controls
  playTrack(track: Track): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  seekTo(position: number): Promise<void>;

  // Lock screen
  setLockScreenMetadata(track: Track): Promise<void>;

  // Status
  getStatus(): PlaybackStatus;

  // Cleanup
  destroy(): void;
}

interface PlaybackStatus {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  currentTrack: Track | null;
  didJustFinish: boolean;
}
```

**Implementation details:**

- Use singleton pattern
- Store audio player instance
- Manage playback state
- Handle audio focus/interruptions

---

### **Phase 3: Player State Management** (20 minutes)

**Create `src/contexts/player-context.tsx`:**

**State:**

```typescript
interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  error: string | null;
}
```

**Context API:**

```typescript
interface PlayerContextType {
  // State
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  error: string | null;

  // Controls
  playTrack: (track: Track) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;

  // Formatting helpers
  formatTime: (seconds: number) => string;
}
```

**Implementation:**

- Wrap app in PlayerProvider
- Use audio-player-service for actual playback
- Expose state and controls to components
- Handle status updates from service

---

### **Phase 4: Mini-Player Component** (45 minutes)

**Create `src/components/mini-player.tsx`:**

**Layout:**

```
┌─────────────────────────────────────┐
│ 🎵 Now Playing                      │
│ Track Title - Artist                │
│ ━━━━━━━━━━━━━●━━━━━━━━━━  1:23/3:45│
│        [ ⏸️ Pause ]                 │
└─────────────────────────────────────┘
[ Track List Below ]
```

**Features:**

1. **Current track info:** Title - Artist
2. **Progress bar:** Visual progress with seek capability
3. **Time display:** Current time / Total duration
4. **Play/pause button:** Toggle playback
5. **Loading state:** Show spinner when loading

**Props:**

```typescript
interface MiniPlayerProps {
  // All props come from PlayerContext
}
```

**Styling:**

- Fixed position at top of screen
- Semi-transparent background
- Material design shadow
- Safe area insets handling

---

### **Phase 5: App Layout Integration** (20 minutes)

**Update `src/app/_layout.tsx`:**

**New hierarchy:**

```tsx
<PlayerProvider>
  <ThemeProvider>
    <MiniPlayer />
    <AppTabs />
  </ThemeProvider>
</PlayerProvider>
```

**Layout considerations:**

- Mini-player is always visible (sticky)
- Content scrolls below mini-player
- Proper padding/margin for mini-player height
- Safe area insets for notch/status bar

**Update track list:**

- Add `onPress` handler to TrackItem
- Call `playTrack(track)` when tapped
- Highlight currently playing track

---

### **Phase 6: Background Audio & Lock Screen** (30 minutes)

**Initialize audio mode:**

```typescript
// In AudioPlayerService.initialize()
import { setAudioModeAsync } from "expo-audio";

await setAudioModeAsync({
  playsInSilentMode: true,
  staysActiveInBackground: true,
  shouldPlayInBackground: true,
  interruptionMode: "doNotMix", // Exclusive audio (music app)
});
```

**Lock screen controls:**

```typescript
// When track starts playing
import { AudioPlayer, setAudioModeAsync } from "expo-audio";

player.setActiveForLockScreen(true, {
  title: track.title,
  artist: track.artist || "Unknown Artist",
  duration: track.duration,
  artworkUrl: undefined, // No artwork for now
});

// Update status for lock screen
player.setStatusUpdateCallback((status) => {
  // React to lock screen controls
  if (status.shouldPlay) {
    player.play();
  } else if (status.shouldPause) {
    player.pause();
  }
});
```

**Handle interruptions:**

- Phone calls
- Siri
- Other audio apps
- Alarms

---

### **Phase 7: Audio Source Loading** (20 minutes)

**Load from local file URI:**

```typescript
// Track path is stored in database
// Format: file:///path/to/file.mp3

import { useAudioPlayer } from "expo-audio";

const player = useAudioPlayer({ uri: track.path });
```

**Handle file URIs:**

- expo-audio supports `file://` URIs
- No need to convert paths
- Works with iOS sandbox paths

---

### **Phase 8: Testing & Edge Cases** (30 minutes)

**Test scenarios:**

1. ✅ Play track from list
2. ✅ Pause/resume playback
3. ✅ Seek to position
4. ✅ Background playback
5. ✅ Lock screen controls
6. ✅ App background/foreground transitions
7. ✅ Track finishes → stop playback
8. ✅ Handle loading errors
9. ✅ Handle corrupted audio files
10. ✅ Multiple tracks in succession (play one, then another)

**Edge cases:**

- What if file doesn't exist?
- What if file is corrupted?
- What if user revokes permissions?
- What if track metadata is missing?
- What if duration is 0 or unknown?

---

## File Structure

```
src/
├── services/
│   ├── audio-player-service.ts  🆕 Audio playback control
│   ├── track-sync-service.ts     ✅ (existing)
│   └── ...                       ✅ (existing)
├── contexts/
│   ├── player-context.tsx       🆕 Player state management
│   ├── tracks-context.tsx       ✅ (existing)
│   └── sync-context.tsx          ✅ (existing)
├── components/
│   ├── mini-player.tsx          🆕 Sticky mini-player
│   ├── track-list.tsx           ✏️ Add play handler
│   └── track-item.tsx           ✏️ Add play onPress
├── app/
│   ├── _layout.tsx              ✏️ Add MiniPlayer component
│   └── ...                      ✅ (existing)
└── types/
    └── player.ts                🆕 Player type definitions
```

---

## Dependencies

**Add:**

- `expo-audio` (latest version)

**Remove:**

- `expo-av` (deprecated)

**Configure:**

- `app.json` - audio background plugin
- Audio mode initialization at app start

---

## Implementation Order

1. ✅ **Setup:** Install expo-audio, configure app.json
2. ✅ **Audio Service:** Create singleton player service
3. ✅ **Context:** Create PlayerContext with state management
4. ✅ **Mini-Player:** Build UI component with controls
5. ✅ **Integration:** Wire into app layout and track list
6. ✅ **Background:** Configure lock screen and background playback
7. ✅ **Testing:** Test all scenarios and edge cases

---

## Key Decisions

### Why expo-audio over expo-av?

- ✅ Modern, maintained API
- ✅ Hook-based (React-friendly)
- ✅ Automatic cleanup
- ✅ Better TypeScript support
- ✅ Background playback support
- ❌ expo-av is deprecated

### Why singleton service?

- Single audio instance throughout app
- Easier state management
- Centralized playback control
- Better for background audio

### Why sticky mini-player?

- Always visible for quick control
- Doesn't block navigation
- Standard music app pattern
- Easy to implement

---

## Estimated Total Time: **3-4 hours**

---

## Technical Notes

### expo-audio API Usage

**Hook-based approach:**

```typescript
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

function Player({ source }: { source: string }) {
  const player = useAudioPlayer({ uri: source });
  const status = useAudioPlayerStatus(player);

  return (
    <View>
      <Button
        title={status.playing ? 'Pause' : 'Play'}
        onPress={() => status.playing ? player.pause() : player.play()}
      />
      <Text>{formatTime(status.currentTime)} / {formatTime(status.duration)}</Text>
    </View>
  );
}
```

### Background Audio Configuration

**iOS requirements:**

- Enable "Audio, AirPlay, and Picture in Picture" background mode
- Configure in app.json with expo-audio plugin

**Android requirements:**

- Foreground service for background playback
- Wake lock permission
- Configured automatically by expo-audio plugin

### Lock Screen Integration

**Supported features:**

- ✅ Track title and artist
- ✅ Album artwork (if provided)
- ✅ Playback controls (play/pause)
- ✅ Skip controls (can be disabled)
- ✅ Progress bar display

### Error Handling

**Common errors:**

1. **File not found:** Track deleted after sync
2. **Permission denied:** File access revoked
3. **Corrupted file:** Invalid audio format
4. **Loading timeout:** Network or storage issues

**Recovery strategies:**

- Show error message in mini-player
- Skip to next track (if queue exists)
- Allow retry
- Log error for debugging

---

## Next Steps After Implementation

**Phase 2 features (future):**

1. Queue management (add/next/previous)
2. Shuffle mode
3. Repeat modes (track, list, none)
4. Volume control
5. Equalizer settings
6. Sleep timer
7. Playlist support
8. Search and filter
9. Album artwork extraction
10. Full metadata parsing

**Advanced features (future):**

1. CarPlay integration
2. Siri shortcuts
3. Widget support
4. Watch app
5. Cloud sync of playback position
6. Offline mode improvements
7. Chromecast/AirPlay support
