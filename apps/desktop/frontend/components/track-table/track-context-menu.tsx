import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePlaybackControls } from "@/src/api/mutations"
import { AddToQueue } from "@/wailsjs/go/main/App"
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
            <DropdownMenuItem
              onClick={async () => {
                console.log("trying to add to queue")
                await AddToQueue(track)
                console.log("aaddeed to queue")
              }}
            >
              Add to queue
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
