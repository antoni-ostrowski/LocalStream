import { SidebarMenuButton } from "@/components/ui/sidebar"
import { IconStar } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"

export default function FavTracks() {
  return (
    <>
      <SidebarMenuButton>
        <Link to="/track/favourites">
          <IconStar size={sidebarIconSize} color="yellow" fill="yellow" />
          <SidebarItemText text="Favourite Tracks" />
        </Link>
      </SidebarMenuButton>
    </>
  )
}
