import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { SidebarMenuSub } from "@/components/ui/sidebar"
import { IconChevronDown, IconStar } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"

export default function FavAlbums() {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild className="w-full">
        <Button
          className="flex w-full items-center justify-start"
          variant={"ghost"}
        >
          <IconStar size={sidebarIconSize} fill="yellow" color="yellow" />
          <SidebarItemText text="Favourite Albums" />
          <IconChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {/* {isPending && <Spinner />} */}
          <Link to={`/album/favourites`} key={crypto.randomUUID()}>
            <Button
              className="flex w-full items-center justify-start"
              variant={"ghost"}
            >
              <div>
                <IconStar size={sidebarIconSize} fill="yellow" color="yellow" />
                <p>All Favourite Albums</p>
              </div>
            </Button>
          </Link>
          {/* {data && */}
          {/*   !isPending && */}
          {/*   data.map((artist) => { */}
          {/*     return ( */}
          {/*       <Link */}
          {/*         to={`/artist/$artist`} */}
          {/*         params={{ artist: artist.artist }} */}
          {/*         key={`sidebar-playlist-${crypto.randomUUID()}`} */}
          {/*       > */}
          {/*         <Button */}
          {/*           className="flex w-full items-center justify-start" */}
          {/*           variant={"ghost"} */}
          {/*           asChild */}
          {/*         > */}
          {/*           <div> */}
          {/*             <User size={sidebarIconSize} /> */}
          {/*             <p>{artist.artist}</p> */}
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
