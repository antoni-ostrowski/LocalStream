# Music Player App - Track Sync Implementation

This is a mobile music player app built with Expo, React Native, TypeScript, and Drizzle ORM.

## Features Implemented

### Track Sync (v1)

- **FileScanner**: Recursively scans directories for audio files
- **Metadata Extraction**: Basic metadata (title fallback from filename)
- **Database**: SQLite with Drizzle ORM for offline storage
- **Library Management**: Add/remove library paths via settings
- **Track List**: Display all indexed tracks in a flat list
- **Sync Progress**: Detailed progress bar with file count

## Tech Stack

- **Expo SDK 55** with expo-router
- **React Native** with TypeScript
- **Drizzle ORM** with expo-sqlite
- **expo-file-system** for filesystem access

## Supported Audio Formats

- MP3 (.mp3)
- M4A (.m4a)
- FLAC (.flac)
- WAV (.wav)
- AAC (.aac)
- OGG (.ogg)
- Opus (.opus)
- WMA (.wma)
- APE (.ape)
- M4B (.m4b)

## Project Structure

```
src/
├── db/
│   ├── schema.ts           # Drizzle schemas for tracks and library_paths
│   └── client.ts           # Database initialization and connection
├── services/
│   ├── file-scanner.ts     # Directory scanning for audio files
│   ├── metadata-extractor.ts # Extract track metadata
│   ├── settings-service.ts   # Library path management
│   └── track-sync-service.ts # Main sync orchestration
├── contexts/
│   ├── tracks-context.tsx  # Track state management
│   └── sync-context.tsx    # Sync state management
├── components/
│   ├── track-list.tsx      # Track list display
│   ├── track-item.tsx      # Individual track component
│   └── sync-button.tsx     # Sync controls with progress
├── app/
│   ├── index.tsx           # Main track list screen
│   ├── settings.tsx        # Library path settings
│   └── _layout.tsx         # App layout with providers
└── utils/
    └── path-utils.ts       # Utility functions
```

## Getting Started

### Install Dependencies

```bash
bun install
```

### Run the App

```bash
# Start the development server
bun run start

# Run on iOS
bun run ios
```

## Usage

### First Launch

1. App initializes with default library path (Documents folder)
2. Go to Settings to add/remove library paths
3. Click "Sync Library" on the home screen to scan for tracks
4. Wait for sync to complete (shows progress)
5. Tracks appear in the list

### Adding Library Paths

- Go to Settings tab
- Click "+ Add Path"
- Select a directory containing audio files
- The path will be scanned during next sync

### Syncing Tracks

- Click "Sync Library" button on home screen
- Progress bar shows current operation
- File count and added/updated/removed counts displayed
- Track list auto-refreshes after sync completes

## Database Schema

### tracks

- `id`: Primary key
- `title`: Track title (fallback from filename)
- `artist`: Artist name (nullable)
- `album`: Album name (nullable)
- `duration`: Duration in seconds
- `path`: File path (unique)
- `fileSize`: File size in bytes
- `lastModified`: Last modified timestamp
- `createdAt` / `updatedAt`: Timestamps

### library_paths

- `id`: Primary key
- `path`: Directory path (unique)
- `isEnabled`: Whether path is active
- `lastScannedAt`: Last scan timestamp

## Next Steps (Future Implementation)

- [ ] Audio playback controls
- [ ] Now playing screen
- [ ] Queue management
- [ ] Playlists
- [ ] Search functionality
- [ ] Album art extraction
- [ ] Full metadata extraction (using expo-av)
- [ ] Watch mode for automatic sync
- [ ] Track grouping (by artist/album)
- [ ] Offline-first improvements

## Development Notes

### Key Design Decisions

1. **On-demand sync**: Manual trigger, no background watching in v1
2. **Basic metadata**: Filename fallback until proper audio metadata extraction
3. **SQLite**: Stored in Documents directory for persistence
4. **Flat track list**: Simple list view, grouping comes later
5. **Documents folder**: Pre-configured as default library path

### Known Limitations

- Metadata extraction is basic (uses filename as title)
- Duration requires audio file parsing (future: expo-av integration)
- iCloud directory support requires additional entitlements
- No background sync in v1

## Contributing

This is aboot-happy implementation focused on track synchronization.
Audio playback will be added in future iterations.
