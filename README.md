# LocalStream (WIP)

Lightweight, minimalistic, local desktop music player focused on simplicity.

> **Warning** It's a really early alpha version of the app. I want to take a break from it, but I plan to come back to it and actively maintain it/add new features.

# Getting started

Start by downloading a zip from latest release. It will contain just a compiled app, it's about few MB's.

# General Tips

- You can create playlists and add tracks to them by clicking 3 dots on the track. You can also have favourite playlists.
- Queue: you can easly add track to the start or the end of the queue.
- You can configure every app behaviour from settings. To **add your music** you need to add a music source directory, you can add multiple directories LocalStream will read your music from. Music sources are the basic settings everybody needs to touch, all of the others are pretty much useless for most people.

# Features I still want to add

- albums pages (_this is the core feature for my listening process, and it will be added first_)
- artists pages (with details page)
- track details page
- precise listening stats (_one of the main reasons I started this project_)
- raycast extension to control the playback (_I'm really excited about this one_)
- full screen "now playing" view
- editing tracks metadata directly in app
- reordering queue
- playback crossfade

> Keep in mind I want to keep this app simple and nice to use for me. My use case is probably vastly different from yours and thats okay, but this means I will not rush about adding stuff that I will not even use. Stuff listed here is what I focus on and anything other than that is not my focus for now.

# For devs

The app looks for a configuration file in the following locations:

- macOS / Linux: ~/.config/localStream/config.json
- Windows: %AppData%\localStream\config.json

On the first launch, LocalStream automatically generates this directory, a default config.json and db file for you.

<br/>

Why a Config File?

The entire application behavior is driven by this JSON configuration. Specifically, the databasePath property tells the app exactly where to look for your SQLite database. I designed it this way to support:

- Easy database swapping: Switch between different music libraries just by updating a file path.
- iCloud / Cloud sync ready: By pointing the databasePath to a synced folder (like iCloud Drive), you can maintain a single source of truth across multiple devices.
- future-proofing: This architecture paves the way for the LocalStream ios app I plan to build, allowing both versions of the app to share the exact same database file and user data.

<br/>

App is built with wails:

- I tried to put as much stuff as I can in Go part of the app (I use beep lib for playback, taglib for track metadata)
- Frontend is built with react, tanstack router and heavly depends on effect and effect-atom for state managment

# notes

If you decide to try the app and find some problems, feel free to open an issue! I will try my best to fix everything that comes up. (also it's my first oss project so idk what im doing)
