CREATE TABLE IF NOT EXISTS tracks (
    id TEXT PRIMARY KEY NOT NULL,
    createdAt INTEGER NOT NULL,
    path TEXT NOT NULL,
    -- sourceDir TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    genre TEXT,
    year INTEGER,
    durationInMs INTEGER,
    starred INTEGER,
    queueId TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS tracks_path_unique ON tracks (path);

--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY NOT NULL,
    createdAt INTEGER NOT NULL,
    name TEXT NOT NULL,
    coverPath TEXT,
    starred INTEGER
);

--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tracks_to_playlists (
    id TEXT PRIMARY KEY NOT NULL,
    createdAt INTEGER NOT NULL,
    trackId TEXT NOT NULL,
    playlistId TEXT NOT NULL,
    
    -- Foreign Key Constraints (ON UPDATE NO ACTION is SQLite default and often omitted)
    FOREIGN KEY (trackId) REFERENCES tracks(id),
    FOREIGN KEY (playlistId) REFERENCES playlists(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS tracks_to_playlists_pair_unique 
    ON tracks_to_playlists (trackId, playlistId);


--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS favouriteArtists (
    id TEXT PRIMARY KEY NOT NULL,
    createdAt INTEGER NOT NULL,
    starred INTEGER,
    artist TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS favouriteArtists_artist_unique ON favouriteArtists (artist);

--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS favouriteAlbums (
    id TEXT PRIMARY KEY NOT NULL,
    createdAt INTEGER NOT NULL,
    starred INTEGER,
    albumName TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS favouriteAlbums_albumName_unique ON favouriteAlbums (albumName);



