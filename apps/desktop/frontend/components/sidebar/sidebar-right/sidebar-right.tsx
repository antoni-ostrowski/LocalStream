import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import Player from "./player/player"

export default function SidebarRight() {
  return (
    <Sidebar
      className="sticky top-0 h-svh w-[30vw] border-l bg-transparent lg:flex"
      collapsible="none"
    >
      <SidebarContent>
        {/* <QueueTrackTable /> */}
        <Player />
        {/* {data2 && <div>now playing {data2.Track.title}</div>} */}
        {/* {data && */}
        {/*   data.map((a) => { */}
        {/*     return <div>{a.title}</div> */}
        {/*   })} */}
      </SidebarContent>
    </Sidebar>
  )
}
