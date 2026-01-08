import { SidebarMenuButton } from "@/components/ui/sidebar"
import { IconUsers } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"

export default function SidebarArtists() {
  return (
    <Link to="/artists">
      <SidebarMenuButton className="cursor-pointer">
        <IconUsers size={sidebarIconSize} />
        <SidebarItemText text="Artists" />
      </SidebarMenuButton>
    </Link>
  )
}
