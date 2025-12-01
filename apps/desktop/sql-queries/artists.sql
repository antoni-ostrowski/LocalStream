-- name: ListFavArtists :many
SELECT * FROM favouriteArtists ORDER BY artist;

-- name: CreateFavArtist :exec
INSERT INTO favouriteArtists
(id, createdAt, starred, artist)
VALUES (sqlc.arg(id), sqlc.arg(createdAt), sqlc.arg(starred), sqlc.arg(artist));
