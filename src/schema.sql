CREATE TABLE IF NOT EXISTS tracks (
    id TEXT PRIMARY KEY NOT NULL,
    created_at INTEGER NOT NULL,
    path TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    genre TEXT,
    year INTEGER,
    duration_seconds INTEGER,
    starred INTEGER,
    is_missing BOOL
);
CREATE UNIQUE INDEX IF NOT EXISTS tracks_path_unique ON tracks (path);

--------------------------------------------------------------------------------

CREATE VIRTUAL TABLE IF NOT EXISTS tracks_fts USING fts5(
    id UNINDEXED, 
    title,
    artist,
    album,
    tokenize='unicode61'
);

DROP TRIGGER IF EXISTS tracks_ai;
CREATE TRIGGER tracks_ai AFTER INSERT ON tracks 
BEGIN
  INSERT INTO tracks_fts(id, title, artist, album)
  VALUES (new.id, new.title, new.artist, new.album);
END;

DROP TRIGGER IF EXISTS tracks_ad;
CREATE TRIGGER tracks_ad AFTER DELETE ON tracks 
BEGIN
  INSERT INTO tracks_fts(tracks_fts, id, title, artist, album)
  VALUES('delete', old.id, old.title, old.artist, old.album);
END;

DROP TRIGGER IF EXISTS tracks_au;
CREATE TRIGGER tracks_au AFTER UPDATE ON tracks
WHEN old.title != new.title OR old.artist != new.artist OR old.album != new.album
BEGIN
  INSERT INTO tracks_fts(tracks_fts, id, title, artist, album)
  VALUES('delete', old.id, old.title, old.artist, old.album);
  
  INSERT INTO tracks_fts(id, title, artist, album)
  VALUES (new.id, new.title, new.artist, new.album);
END;

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



