import { Card } from "@/components/ui/card"
import { Link } from "@tanstack/react-router"
import FavAlbum from "./fav-album"

export default function GridAlbumCard() {
  // {
  //   album
  // }: {
  //     album: AlbumType
  // },
  return (
    <Link to={"/album/$albumName"} params={{ albumName: "album name" }}>
      <Card className="flex w-58 flex-col items-center justify-center gap-2 p-4">
        {/* <img */}
        {/*   src={makeArtworkUrl(album.albumCoverPath ?? "/f/f/f")} */}
        {/*   className="aspect-square w-full" */}
        {/* /> */}
        <div className={"flex w-full flex-row items-center justify-between"}>
          {/* <h1 className="font-bold">{album.albumName}</h1> */}
          {/* <p> {album.trackCount} tracks</p> */}
        </div>
        <FavAlbum />
      </Card>
    </Link>
  )
}
