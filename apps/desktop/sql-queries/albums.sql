-- name: ListDistinctAlbums :many
SELECT DISTINCT album FROM tracks ORDER BY title;

-- name: ListFavAlbums :many
SELECT * FROM favouriteAlbums ORDER BY albumName;

-- name: CreateFavAlbum :exec
INSERT INTO favouriteAlbums (id, createdAt, starred, albumName)
VALUES (sqlc.arg(id), sqlc.arg(createdAt), sqlc.arg(starred), sqlc.arg(albumName));

-- name: UpdateFavAlbum :exec
UPDATE favouriteAlbums SET starred = sqlc.arg(starred) WHERE albumName = sqlc.arg(albumName)


