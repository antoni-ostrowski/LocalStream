import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SidebarMenuButton, SidebarMenuSub } from "@/components/ui/sidebar"
import { ChevronDown, List, ListVideo } from "lucide-react"
import { sidebarIconSize, SidebarItemText } from "../sidebar-left"

export default function AllTracks() {
  // const { data, isError, isLoading } = useQuery(
  //   trpc.playlist.listPlaylists.queryOptions()
  // )
  // console.log('data - ', data)
  // if (isError) {
  //   console.log('[PLAYLIST] Error gettings playlists')
  //   return null
  // }

  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex w-full cursor-pointer items-center justify-start">
            <ListVideo size={sidebarIconSize - 10} />
            <SidebarItemText text="Playlists" />
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <Collapsible>
              <CollapsibleTrigger asChild className="w-full">
                <Button
                  className="flex w-full items-center justify-start"
                  variant={"ghost"}
                >
                  <List size={sidebarIconSize} />
                  <SidebarItemText text="My Playlists" />
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {/* {data && */}
                  {/*   data.length > 0 && */}
                  {/*   !isLoading && */}
                  {/*   data.map((playlist) => { */}
                  {/*     return ( */}
                  {/*       <Link */}
                  {/*         to={`/playlist/$playlistId`} */}
                  {/*         params={{ playlistId: playlist.id }} */}
                  {/*         key={`sidebar-playlist-${playlist.id}`} */}
                  {/*       > */}
                  {/*         <Button */}
                  {/*           className="flex w-full items-center justify-start" */}
                  {/*           variant={"ghost"} */}
                  {/*           asChild */}
                  {/*         > */}
                  {/*           <div> */}
                  {/*             {playlist.coverPath && ( */}
                  {/*               <img */}
                  {/*                 className="w-6" */}
                  {/*                 src={makeImageUrl(playlist.coverPath)} */}
                  {/*               /> */}
                  {/*             )} */}
                  {/*             <p>{playlist.name}</p> */}
                  {/*           </div> */}
                  {/*         </Button> */}
                  {/*       </Link> */}
                  {/*     ) */}
                  {/*   })} */}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
