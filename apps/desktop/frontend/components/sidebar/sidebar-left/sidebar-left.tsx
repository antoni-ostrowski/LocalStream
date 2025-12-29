import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import { IconMinimize, IconSettings } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import SidebarPlaylists from "./playlists/sidebar-playlist"
import SidebarTracks from "./tracks/tracks"

export const sidebarIconSize = 40

export default function SidebarLeft() {
  return (
    <Sidebar
      className="sticky top-0 h-svh border-r bg-transparent lg:flex"
      collapsible="none"
    >
      <SidebarContent>
        <SidebarMenu>
          <Link to="/">
            <SidebarMenuButton>
              <IconMinimize size={sidebarIconSize} />
              <SidebarItemText text="Start" />
            </SidebarMenuButton>
          </Link>
          <Link to="/settings">
            <SidebarMenuButton>
              <IconSettings size={sidebarIconSize} />
              <SidebarItemText text="Settings" />
            </SidebarMenuButton>
          </Link>
          <SidebarTracks />
          <SidebarPlaylists />
          {/* <SidebarArtists /> */}
          {/* <SidebarAlbums /> */}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export function SidebarItemText({ text }: { text: string }) {
  return <h1 className="text-md font-semibold">{text}</h1>
}
