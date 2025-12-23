import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import { IconChevronDown, IconUsers } from "@tabler/icons-react"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"
import AllArtists from "./all-artists"
import FavArtists from "./fav-artists"

export default function SidebarArtists() {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <CollapsibleTrigger
        render={(props) => (
          <SidebarMenuButton {...props} className="cursor-pointer">
            <IconUsers size={sidebarIconSize} />
            <SidebarItemText text="Artists" />
            <IconChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        )}
      ></CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub className="gap-1">
          <AllArtists />
          <FavArtists />
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}
