import { Card } from "@/components/ui/card"
import FavPlaylist from "./fav-playlist"

export default function PlaylistGridItem() {
  // {
  //   // playlist,
  // }: {
  //   playlist: PlaylistType
  // },
  return (
    <Card className="flex w-60 flex-col items-center justify-center gap-2 p-4">
      <div className={"flex w-full flex-row items-center justify-between"}>
        <h1 className="font-bold">playlist name</h1>
      </div>
      <FavPlaylist />
    </Card>
    // <Link to={"/playlist/$playlistId"} params={{ playlistId: playlist.id }}>
    //   <Card className="flex w-60 flex-col items-center justify-center gap-2 p-4">
    //     <img
    //       src={makeImageUrl(playlist.coverPath ?? "/f/f/f")}
    //       className="aspect-square w-full"
    //     />
    //     <div className={"flex w-full flex-row items-center justify-between"}>
    //       <h1 className="font-bold">{playlist.name}</h1>
    //     </div>
    //     <FavPlaylist playlist={playlist} />
    //   </Card>
    // </Link>
  )
}
