import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePlaybackControls } from "@/src/api/mutations"
import { sqlcDb } from "@/wailsjs/go/models"
import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"

export default function TrackContextMenu({ track }: { track: sqlcDb.Track }) {
  const { addToQueueEnd } = usePlaybackControls()

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
            <DropdownMenuItem onClick={() => addToQueueEnd.mutate(track)}>
              Add to queue
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
