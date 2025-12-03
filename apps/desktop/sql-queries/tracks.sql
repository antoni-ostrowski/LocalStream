-- name: ListAllTracks :many
SELECT * FROM tracks ORDER by title;

-- name: ListFavTracks :many
SELECT * FROM tracks WHERE starred IS NOT NULL ORDER by title;

-- name: StarTrack :exec
UPDATE tracks SET starred = unixepoch() WHERE id = sqlc.arg(id);

-- name: GetTrackFromPath :one
SELECT * FROM tracks WHERE path LIKE sqlc.arg(trackPath);

-- name: InsertTrack :exec
INSERT INTO tracks (
    id,
    createdAt,
    path,
    -- sourceDir,
    title,
    artist,
    album,
    genre,
    year,
    durationInMs,
    starred,
    queueId
) VALUES (
    sqlc.arg(id),
    sqlc.arg(createdAt),
    sqlc.arg(path),
    -- sqlc.arg(sourceDir),
    sqlc.arg(title),
    sqlc.arg(artist),
    sqlc.arg(album),
    sqlc.arg(genre),
    sqlc.arg(year),
    sqlc.arg(durationInMs),
    sqlc.arg(starred),
    sqlc.arg(queueId)
);

-- name: ListTracksByArtist :many
SELECT * FROM tracks WHERE artist LIKE sqlc.arg(artist) ORDER by title;

-- name: ListTracksByAlbum :many
SELECT * FROM tracks WHERE album =sqlc.arg(albumName);

-- name: ListTracksByPlaylist :many
SELECT
    t.id, 
    t.createdAt, 
    t.path, 
    -- t.sourceDir, 
    t.title, 
    t.artist, 
    t.album, 
    t.genre, 
    t.year, 
    t.durationInMs, 
    t.starred, 
    t.queueId
FROM 
    tracks_to_playlists AS ttp
JOIN 
    tracks AS t ON ttp.trackId = t.id
WHERE 
    ttp.playlistId = sqlc.arg(playlistId)
ORDER BY 
    t.title;

