import { Sidebar, SidebarContent } from "@/components/ui/sidebar"

export default function SidebarRight() {
  return (
    <Sidebar
      className="sticky top-0 h-svh w-[30vw] border-l bg-transparent lg:flex"
      collapsible="none"
    >
      <SidebarContent>{/* <Player /> */}</SidebarContent>
    </Sidebar>
  )
}
