# LocalStream

Simple music player.

> **Warning** It's a really early version of the app.

https://github.com/user-attachments/assets/17bfed51-99de-4911-ad6a-e0b8a1a8a574

# Getting started

## Installation

Start by downloading a zip from [latest release](https://github.com/antoni-ostrowski/localStream/releases). It will contain just a compiled app. You just have to unzip it and then you can run the app!

> On macos you will have to go to `Privacy & Security` and allow app to run, since it's not signed.

## Building from source

Requires [Go](https://go.dev/) (1.24.0), [Wails CLI](https://wails.io/docs/gettingstarted/installation/) (v2.11.0) and [Bun](https://bun.com/) for frontend.

```bash
# (these build for both: amd64 and arm64)
make all
make mac
make win
# Remove build artifacts
make clean
# you can also build only for specific CPU arch, example:
make mac_arm64
make win_amd64
```

> Wails should work on linux too, but i could not get it to work due to some webview crashes (i focus on mac since im on it). You can try building it for yourself.

# General Tips

- To **add your music** you need to add a music source directory, you can add multiple directories LocalStream will read your music from.
- You can create playlists and add tracks to them by clicking 3 dots on the track. You can also have favourite playlists.
- Queue: you can easly add track to the start or the end of the queue.
- Browse your library by albums and artist views.

# Details

The app looks for a configuration file in the following locations:

- macOS / Linux: ~/.config/localStream/config.json
- Windows: %AppData%\localStream\config.json

On the first launch, LocalStream automatically generates this directory, a default config.json and db file for you.

# Contributing

Contributions are highly appreciated!
If you decide to try the app and find some problems, feel free to open an issue! I will try my best to fix everything that comes up. This is my first open-source project, so I’m learning as I go, thanks for your patience and support! 😁🙏

# Features I still want to add

- track details page
- precise listening stats
- raycast extension to control the playback
- full screen "now playing" view
- editing tracks metadata directly in app
- reordering queue
- playback crossfade
