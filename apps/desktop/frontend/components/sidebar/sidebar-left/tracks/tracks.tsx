import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import { IconChevronDown, IconList, IconStar } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"

export default function SidebarTracks() {
  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex w-full cursor-pointer items-center justify-start">
            <IconList size={sidebarIconSize - 10} />
            <SidebarItemText text="Tracks" />
            <IconChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="gap-1">
            <Link to="/track/favourites">
              <SidebarMenuButton>
                <IconStar size={sidebarIconSize} color="yellow" fill="yellow" />
                <SidebarItemText text="Favourite Tracks" />
              </SidebarMenuButton>
            </Link>
            <Link to="/track/all">
              <SidebarMenuButton>
                <IconList size={sidebarIconSize} />
                <SidebarItemText text="All Tracks" />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
