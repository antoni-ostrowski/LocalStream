import { Card } from "@/components/ui/card"
import { createFileLink } from "@/lib/utils"
import { sqlcDb } from "@/wailsjs/go/models"
import { Link } from "@tanstack/react-router"
import DeletePlaylist from "./delete-playlist"
import FavPlaylist from "./fav-playlist"

export default function PlaylistGridItem({
  playlist
}: {
  playlist: sqlcDb.Playlist
}) {
  return (
    <Link to="/playlist/$playlistId" params={{ playlistId: playlist.id }}>
      <Card
        key={playlist.id}
        className="group flex cursor-pointer flex-col gap-2 border-0 p-0 ring-0"
      >
        <div className="relative aspect-square overflow-hidden rounded-md">
          <img
            src={
              playlist.cover_path.Valid
                ? createFileLink(playlist.cover_path.String)
                : "/placeholder.webp"
            }
            alt={playlist.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex items-center justify-between gap-0">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-balance">
              {playlist.name}
            </h3>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            <FavPlaylist {...{ playlist }} />
            <DeletePlaylist {...{ playlist }} />
          </div>
        </div>
      </Card>
    </Link>
  )
}
