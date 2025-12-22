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


