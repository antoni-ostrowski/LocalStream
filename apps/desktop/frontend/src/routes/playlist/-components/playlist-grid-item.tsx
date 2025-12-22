import { Card } from "@/components/ui/card"
import useDisplayImage from "@/lib/hooks/use-display-image"
import { sqlcDb } from "@/wailsjs/go/models"
import { Link } from "@tanstack/react-router"
import DeletePlaylist from "./delete-playlist"
import FavPlaylist from "./fav-playlist"

export default function PlaylistGridItem({
  playlist
}: {
  playlist: sqlcDb.Playlist
}) {
  const { imageString } = useDisplayImage(playlist.cover_path.String)

  return (
    <Card className="flex w-60 flex-col items-center justify-center gap-2 p-4">
      <img src={imageString ?? "/placeholder.webp"} />
      <div className={"flex w-full flex-row items-center justify-between"}>
        <h1 className="font-bold">{playlist.name}</h1>
      </div>
      <FavPlaylist {...{ playlist }} />
      <DeletePlaylist {...{ playlist }} />

      <Link to={"/playlist/$playlistId"} params={{ playlistId: playlist.id }}>
        <p>details</p>
      </Link>
    </Card>
  )
}
