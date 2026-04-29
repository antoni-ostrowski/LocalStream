import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  appendToQueueAtom,
  prependToQueueAtom
} from "@/src/api/atoms/queue-atom"
import { sqlcDb } from "@/wailsjs/go/models"
import { useAtom } from "@effect-atom/atom-react"
import { IconDots, IconPlaylist, IconPlaylistAdd } from "@tabler/icons-react"
import { Button } from "../ui/button"
import TracksPlaylists from "./tracks-playlists"

export default function TrackContextMenu({ track }: { track: sqlcDb.Track }) {
  const [, appendToQueue] = useAtom(appendToQueueAtom)
  const [, prependToQueue] = useAtom(prependToQueueAtom)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={"ghost"}>
            <IconDots />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                prependToQueue(track)
              }}
            >
              <IconPlaylistAdd />
              Play next
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                appendToQueue(track)
              }}
            >
              <IconPlaylistAdd />
              Play last
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <IconPlaylist /> Playlists
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <TracksPlaylists {...{ track }} />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
