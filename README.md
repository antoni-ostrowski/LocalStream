# LocalStream

Lightweight, minimalistic, local desktop music player focused on simplicity.

> **Warning** It's a really early alpha version of the app.

# Getting started

Start by downloading a zip from [latest release](https://github.com/antoni-ostrowski/localStream/releases). It will contain just a compiled app. You just have to unzip it and then you can run the app!

> **Note for Linux users**: LocalStream is built using [Wails](https://wails.io/), which is a fully cross-platform framework. While the app is designed to work everywhere, I have only verified it on macOS and Windows so far. It should only require minor tweaks to get it running perfectly and Linux too, I just don't have any machine with linux at hand.
> If you'd like to try it now, you can build it from source using the [Wails CLI](https://wails.io/docs/reference/cli/), or you can wait for the official builds coming soon.

# General Tips

- To **add your music** you need to add a music source directory, you can add multiple directories LocalStream will read your music from.
- You can create playlists and add tracks to them by clicking 3 dots on the track. You can also have favourite playlists.
- Queue: you can easly add track to the start or the end of the queue.
- Browse your library by albums and artist views.

# Features I still want to add

- track details page
- precise listening stats 
- raycast extension to control the playback 
- full screen "now playing" view
- editing tracks metadata directly in app
- reordering queue
- playback crossfade

# Details

The app looks for a configuration file in the following locations:

- macOS / Linux: ~/.config/localStream/config.json
- Windows: %AppData%\localStream\config.json

On the first launch, LocalStream automatically generates this directory, a default config.json and db file for you.

# Contributing

Contributions are highly appreciated!
If you decide to try the app and find some problems, feel free to open an issue! I will try my best to fix everything that comes up. This is my first open-source project, so I’m learning as I go, thanks for your patience and support! 😁🙏
