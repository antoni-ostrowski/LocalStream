import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  appendToQueueAtom,
  prependToQueueAtom,
} from "@/src/api/atoms/queue-atom"
import { sqlcDb } from "@/wailsjs/go/models"
import { useAtom } from "@effect-atom/atom-react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"

export default function TrackContextMenu({ track }: { track: sqlcDb.Track }) {
  const [_, appendToQueue] = useAtom(appendToQueueAtom)
  const [__, prependToQueue] = useAtom(prependToQueueAtom)
  // const { addToQueueEnd } = usePlaybackControls()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={"ghost"}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                prependToQueue(track)
              }}
            >
              Play next
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                appendToQueue(track)
              }}
            >
              Play last
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
