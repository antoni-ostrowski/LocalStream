import { SidebarMenuButton } from "@/components/ui/sidebar"
import { IconList } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"

export default function SidebarTracks() {
  return (
    <Link to="/tracks/all">
      <SidebarMenuButton className="flex w-full cursor-pointer items-center justify-start">
        <IconList size={sidebarIconSize - 10} />
        <SidebarItemText text="Tracks" />
      </SidebarMenuButton>
    </Link>
  )
}
