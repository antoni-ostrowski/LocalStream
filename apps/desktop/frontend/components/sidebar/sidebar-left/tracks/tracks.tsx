import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import { IconChevronDown, IconList } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"

export default function SidebarTracks() {
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
              <SidebarItemText text="Tracks" />
              <IconChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          )}
        ></CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="gap-1">
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
