import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  appendToQueueAtom,
  deleteFromQueueAtom,
  prependToQueueAtom,
} from "@/src/api/atoms/queue-atom"
import { sqlcDb } from "@/wailsjs/go/models"
import { useAtom } from "@effect-atom/atom-react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "../ui/button"

export default function TrackContextMenu({ track }: { track: sqlcDb.Track }) {
  const [, appendToQueue] = useAtom(appendToQueueAtom)
  const [, prependToQueue] = useAtom(prependToQueueAtom)
  const [, deleteFromQueue] = useAtom(deleteFromQueueAtom)

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

            <DropdownMenuItem
              onClick={() => {
                deleteFromQueue(track)
              }}
            >
              delete from q
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
