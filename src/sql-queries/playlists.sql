-- name: ListPlaylists :many
SELECT * FROM playlists ORDER BY name;

-- name: ListFavPlaylists :many
SELECT * FROM playlists WHERE starred IS NOT NULL ORDER BY name;

-- name: CreatePlaylist :one
INSERT INTO playlists (
  id,
  created_at,
  name,
  cover_path,
  starred
) VALUES (
  sqlc.arg(id),
  sqlc.arg(created_at),
  sqlc.arg(name),
  sqlc.arg(cover_path),
  sqlc.arg(starred)
)
RETURNING *;

-- name: EditPlaylist :one
UPDATE playlists SET
    name = sqlc.arg(name),
    cover_path = sqlc.arg(cover_path),
    starred = sqlc.arg(starred)
WHERE id = sqlc.arg(id)
RETURNING *;

-- name: DeletePlaylist :exec
DELETE FROM playlists WHERE id = sqlc.arg(id);

-- name: GetPlaylist :one
SELECT * FROM playlists WHERE id = sqlc.arg(id);

-- name: ListPlaylistsForTrack :many
SELECT 
    p.id, 
    p.name, 
    p.created_at,
    p.cover_path,
    p.starred,
    -- Returns 1 if the track is in the playlist, 0 otherwise
    CASE WHEN ttp.track_id IS NOT NULL THEN 1 ELSE 0 END AS is_in_playlist
FROM playlists p
LEFT JOIN tracks_to_playlists ttp 
    ON p.id = ttp.playlist_id 
    AND ttp.track_id = sqlc.arg(track_id); 


-- name: AddTrackToPlaylist :exec
INSERT OR IGNORE INTO tracks_to_playlists (
    id, 
    created_at, 
    track_id, 
    playlist_id
) VALUES (
    sqlc.arg(id), 
    sqlc.arg(created_at), 
    sqlc.arg(track_id), 
    sqlc.arg(playlist_id)
);

-- name: RemoveTrackFromPlaylist :exec
DELETE FROM tracks_to_playlists
WHERE track_id = sqlc.arg(track_id) 
AND playlist_id = sqlc.arg(playlist_id);
