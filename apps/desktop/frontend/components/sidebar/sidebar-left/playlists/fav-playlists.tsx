import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { SidebarMenuSub } from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { ChevronDown, Star } from "lucide-react"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"

export default function FavPlaylists() {
  // const { data, isPending } = useQuery(
  //   trpc.playlist.listFavPlaylists.queryOptions()
  // )

  return (
    <Collapsible>
      <CollapsibleTrigger asChild className="w-full">
        <Button
          className="flex w-full items-center justify-start"
          variant={"ghost"}
        >
          <Star size={sidebarIconSize} fill="yellow" color="yellow" />
          <SidebarItemText text="Favourite Playlists" />
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          <Link to={`/playlist/favourites`}>
            <Button
              className="flex w-full items-center justify-start"
              variant={"ghost"}
              asChild
            >
              <div>
                <Star size={sidebarIconSize} fill="yellow" color="yellow" />
                <p>All Favourite Playlists</p>
              </div>
            </Button>
          </Link>
          {/* {data && */}
          {/*   !isPending && */}
          {/*   data.map((playlist) => { */}
          {/*     return ( */}
          {/*       <Link */}
          {/*         to={`/playlist/$playlistId`} */}
          {/*         params={{ playlistId: playlist.id }} */}
          {/*         key={crypto.randomUUID()} */}
          {/*       > */}
          {/*         <Button */}
          {/*           className="flex w-full items-center justify-start" */}
          {/*           variant={"ghost"} */}
          {/*           asChild */}
          {/*         > */}
          {/*           <div> */}
          {/*             <p>{playlist.name}</p> */}
          {/*           </div> */}
          {/*         </Button> */}
          {/*       </Link> */}
          {/*     ) */}
          {/*   })} */}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}
