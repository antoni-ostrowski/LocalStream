import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"
import { ChevronDown, ListVideo, Users } from "lucide-react"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"
import FavAlbums from "./fav-albums"

export default function SidebarAlbums() {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="cursor-pointer">
          <ListVideo size={sidebarIconSize} />
          <SidebarItemText text="Albums" />
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub className="gap-1">
          <Link to={"/album/all"} className="w-full">
            <Button
              variant={"ghost"}
              className="flex w-full items-center justify-start"
            >
              <Users /> All Albums
            </Button>
          </Link>
          <FavAlbums />
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}
