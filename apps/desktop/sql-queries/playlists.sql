-- name: ListPlaylists :many
SELECT * FROM playlists ORDER BY name;

-- name: ListFavPlaylists :many
SELECT * FROM playlists WHERE starred IS NOT NULL ORDER BY name;

-- name: CreatePlaylist :exec
INSERT INTO playlists (
  id,
  createdAt,
  name,
  coverPath,
  starred
) VALUES (
  sqlc.arg(id),
  sqlc.arg(createdAt),
  sqlc.arg(name),
  sqlc.arg(coverPath),
  sqlc.arg(starred)
);

-- name: EditPlaylist :exec
UPDATE playlists SET
    name = sqlc.arg(name),
    coverPath = sqlc.arg(coverPath),
    starred = sqlc.arg(starred)
WHERE id = sqlc.arg(id);

-- name: DeletePlaylist :exec
DELETE FROM playlists WHERE id = sqlc.arg(id);

-- name: GetPlaylist :one
SELECT * FROM playlists WHERE id = sqlc.arg(id);


