import QueueTrackTable from "@/components/queue-track-table/queue-track-table"
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import Player from "./player/player"

export default function SidebarRight() {
  return (
    <Sidebar
      className="bg-background sticky top-0 h-svh w-full lg:flex"
      collapsible="none"
    >
      <SidebarContent className="w-full">
        <Player />
        <QueueTrackTable />
      </SidebarContent>
    </Sidebar>
  )
}
