import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { queries } from "@/src/api/queries"
import { useQuery } from "@tanstack/react-query"

export default function SidebarRight() {
  const { data } = useQuery(queries.player.listQueue())

  const { data: data2 } = useQuery(queries.player.getCurrentPlaying())

  return (
    <Sidebar
      className="sticky top-0 h-svh w-[30vw] border-l bg-transparent lg:flex"
      collapsible="none"
    >
      <SidebarContent>
        {data2 && <div>now playing {data2.Track.title}</div>}
        {data &&
          data.map((a) => {
            return <div>{a.title}</div>
          })}
      </SidebarContent>
    </Sidebar>
  )
}
