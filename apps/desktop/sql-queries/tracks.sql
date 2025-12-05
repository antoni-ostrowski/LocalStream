-- name: ListAllTracks :many
SELECT * FROM tracks ORDER by title;

-- name: ListFavTracks :many
SELECT * FROM tracks WHERE starred IS NOT NULL ORDER by title;

-- name: StarTrack :exec
UPDATE tracks SET starred = unixepoch() WHERE id = sqlc.arg(id);

-- name: GetTrackFromPath :one
SELECT * FROM tracks WHERE path LIKE sqlc.arg(track_path);

-- name: InsertTrack :exec
INSERT INTO tracks (
    id,
    created_at,
    path,
    -- sourceDir,
    title,
    artist,
    album,
    genre,
    year,
    duration_in_ms,
    starred,
    queue_id,
    is_missing
) VALUES (
    sqlc.arg(id),
    sqlc.arg(created_at),
    sqlc.arg(path),
    -- sqlc.arg(sourceDir),
    sqlc.arg(title),
    sqlc.arg(artist),
    sqlc.arg(album),
    sqlc.arg(genre),
    sqlc.arg(year),
    sqlc.arg(duration_in_ms),
    sqlc.arg(starred),
    sqlc.arg(queue_id),
    sqlc.arg(is_missing)
);

-- name: ListTracksByArtist :many
SELECT * FROM tracks WHERE artist LIKE sqlc.arg(artist) ORDER by title;

-- name: ListTracksByAlbum :many
SELECT * FROM tracks WHERE album = sqlc.arg(album_name);

-- name: ListTracksByPlaylist :many
SELECT
    t.id, 
    t.created_at, 
    t.path, 
    -- t.sourceDir, 
    t.title, 
    t.artist, 
    t.album, 
    t.genre, 
    t.year, 
    t.duration_in_ms, 
    t.starred, 
    t.queue_id,
    t.is_missing
FROM 
    tracks_to_playlists AS ttp
JOIN 
    tracks AS t ON ttp.track_id = t.id
WHERE 
    ttp.playlist_id = sqlc.arg(playlist_id)
ORDER BY 
    t.title;


-- name: UpdateTrack :exec
UPDATE tracks SET
    title = sqlc.arg(title),
    artist = sqlc.arg(artist),
    album = sqlc.arg(album),
    genre = sqlc.arg(genre),
    year = sqlc.arg(year),
    duration_in_ms = sqlc.arg(duration_in_ms),
    is_missing = sqlc.arg(is_missing)
WHERE id = sqlc.arg(id);
