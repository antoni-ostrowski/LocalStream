import { Card } from "@/components/ui/card"
import { IconPlus } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import FavArtist from "./fav-artist"

// export type ArtistGridItemType =
//   inferRouterOutputs<AppRouter>['metadata']['listArtists'][number]

export default function ArtistGridItem() {
  // { item }: { item: ArtistGridItemType }
  return (
    <Link to={"/artist/$artist"} params={{ artist: "artist" }}>
      <Card className="flex w-60 flex-col items-center justify-center gap-2 p-4">
        <div className={"flex w-full flex-row items-center justify-between"}>
          <div className="flex flex-row items-center justify-center gap-1">
            <FavArtist />
            <h1 className="font-bold">some artist</h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p>10</p>
            <IconPlus />
          </div>
        </div>
      </Card>
    </Link>
  )
}
