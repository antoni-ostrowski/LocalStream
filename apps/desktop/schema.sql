CREATE TABLE IF NOT EXISTS tracks (
    id TEXT PRIMARY KEY NOT NULL,
    created_at INTEGER NOT NULL,
    path TEXT NOT NULL,
    -- sourceDir TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    genre TEXT,
    year INTEGER,
    duration_in_ms INTEGER,
    starred INTEGER,
    queue_id TEXT,
    is_missing BOOL
);
CREATE UNIQUE INDEX IF NOT EXISTS tracks_path_unique ON tracks (path);

--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY NOT NULL,
    created_at INTEGER NOT NULL,
    name TEXT NOT NULL,
    cover_path TEXT,
    starred INTEGER
);

--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tracks_to_playlists (
    id TEXT PRIMARY KEY NOT NULL,
    created_at INTEGER NOT NULL,
    track_id TEXT NOT NULL,
    playlist_id TEXT NOT NULL,
    
    -- Foreign Key Constraints (ON UPDATE NO ACTION is SQLite default and often omitted)
    FOREIGN KEY (track_id) REFERENCES tracks(id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS tracks_to_playlists_pair_unique 
    ON tracks_to_playlists (track_id, playlist_id);


--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS favouriteArtists (
    id TEXT PRIMARY KEY NOT NULL,
    created_at INTEGER NOT NULL,
    starred INTEGER,
    artist TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS favouriteArtists_artist_unique ON favouriteArtists (artist);

--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS favouriteAlbums (
    id TEXT PRIMARY KEY NOT NULL,
    created_at INTEGER NOT NULL,
    starred INTEGER,
    album_name TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS favouriteAlbums_albumName_unique ON favouriteAlbums (album_name);



