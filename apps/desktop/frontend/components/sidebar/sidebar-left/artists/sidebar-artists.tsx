import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import { ChevronDown, Users } from "lucide-react"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"
import AllArtists from "./all-artists"
import FavArtists from "./fav-artists"

export default function SidebarArtists() {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="cursor-pointer">
          <Users size={sidebarIconSize} />
          <SidebarItemText text="Artists" />
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub className="gap-1">
          <AllArtists />
          <FavArtists />
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}
