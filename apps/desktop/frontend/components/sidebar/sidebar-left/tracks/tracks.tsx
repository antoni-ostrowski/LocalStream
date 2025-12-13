import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { ChevronDown, List, ListVideo, Star } from "lucide-react"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"

export default function SidebarTracks() {
  // const { data, isError, isPending } = useQuery(
  //   trpc.playlist.listPlaylists.queryOptions(),
  // )
  //
  // if (isPending || !data) return null
  //
  // if (isError) {
  //   console.log("[PLAYLIST] Error gettings playlists")
  //   return null
  // }

  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex w-full cursor-pointer items-center justify-start">
            <ListVideo size={sidebarIconSize - 10} />
            <SidebarItemText text="Tracks" />
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="gap-1">
            <Link to="/track/favourites">
              <SidebarMenuButton>
                <Star size={sidebarIconSize} color="yellow" fill="yellow" />
                <SidebarItemText text="Favourite Tracks" />
              </SidebarMenuButton>
            </Link>
            <Link to="/track/all">
              <SidebarMenuButton>
                <List size={sidebarIconSize} />
                <SidebarItemText text="All Tracks" />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
