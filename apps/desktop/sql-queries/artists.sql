-- name: ListFavArtists :many
SELECT * FROM favouriteArtists ORDER BY artist;

-- name: CreateFavArtist :exec
INSERT INTO favouriteArtists
(id, created_at, starred, artist)
VALUES (sqlc.arg(id), sqlc.arg(created_at), sqlc.arg(starred), sqlc.arg(artist));
