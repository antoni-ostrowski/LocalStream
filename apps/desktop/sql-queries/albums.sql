-- name: ListDistinctAlbums :many
SELECT DISTINCT album FROM tracks ORDER BY title;

-- name: ListFavAlbums :many
SELECT * FROM favouriteAlbums ORDER BY album_name;

-- name: CreateFavAlbum :exec
INSERT INTO favouriteAlbums (id, created_at, starred, album_name)
VALUES (sqlc.arg(id), sqlc.arg(created_at), sqlc.arg(starred), sqlc.arg(album_name));

-- name: UpdateFavAlbum :exec
UPDATE favouriteAlbums SET starred = sqlc.arg(starred) WHERE album_name = sqlc.arg(album_name)


