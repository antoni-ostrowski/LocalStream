import { SidebarMenuButton } from "@/components/ui/sidebar"
import { IconList } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"

export default function SidebarAlbums() {
  return (
    <Link to={"/albums"} className="w-full">
      <SidebarMenuButton className="cursor-pointer">
        <IconList size={sidebarIconSize} />
        <SidebarItemText text="Albums" />
      </SidebarMenuButton>
    </Link>
  )
}
