import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import { IconChevronDown, IconList } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"
import { NewPlaylist } from "./new-playlist"

export default function SidebarPlaylists() {
  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <CollapsibleTrigger
          render={(props) => (
            <SidebarMenuButton
              className="flex w-full cursor-pointer items-center justify-start"
              {...props}
            >
              <IconList size={sidebarIconSize - 10} />
              <SidebarItemText text="Playlists" />
              <IconChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          )}
        ></CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="gap-1">
            <NewPlaylist />
            <Link to="/playlist/all">
              <Button
                className="flex w-full items-center justify-start"
                variant={"ghost"}
              >
                <IconList size={sidebarIconSize} />
                <SidebarItemText text="My Playlists" />
              </Button>
            </Link>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
