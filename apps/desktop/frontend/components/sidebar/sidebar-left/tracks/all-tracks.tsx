import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import { IconChevronDown, IconList } from "@tabler/icons-react"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"

export default function AllTracks() {
  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <CollapsibleTrigger
          render={(props) => (
            <SidebarMenuButton
              {...props}
              className="flex w-full cursor-pointer items-center justify-start"
            >
              <IconList size={sidebarIconSize - 10} />
              <SidebarItemText text="Playlists" />
              <IconChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          )}
        ></CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <Button
              className="flex w-full items-center justify-start"
              variant={"ghost"}
            >
              <IconList size={sidebarIconSize} />
              <SidebarItemText text="My Playlists" />
            </Button>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
