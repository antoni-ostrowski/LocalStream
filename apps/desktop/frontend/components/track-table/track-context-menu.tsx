import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { usePlaybackControls } from "@/src/api/mutations"
import { sqlcDb } from "@/wailsjs/go/models"
import { MoreHorizontal } from "lucide-react"
import { useRef, type ReactNode } from "react"
import { Button } from "../ui/button"

export default function TrackContextMenu({
  track,
  children,
}: {
  track: sqlcDb.Track
  children?: ReactNode
}) {
  const { addToQueueEnd } = usePlaybackControls()
  const triggerRef = useRef(null)
  const contextMenuRef = useRef(null)

  const triggerContextMenuFromClick = (event) => {
    event.stopPropagation()
    console.log("Custom LEFT-CLICK logic executed!")

    if (!triggerRef.current) return
    if (!contextMenuRef.current) return

    contextMenuRef.current.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: triggerRef.current.getBoundingClientRect().x,
        clientY: triggerRef.current.getBoundingClientRect().y,
      }),
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger ref={contextMenuRef}>
        {children ? (
          <>{children}</>
        ) : (
          <div ref={triggerRef} onClick={(e) => triggerContextMenuFromClick(e)}>
            <Button variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        )}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem
          onClick={() => {
            addToQueueEnd.mutate(track)
          }}
        >
          Append to queue
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Insert to queue
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export function MoreTrackOptionBtn() {
  return (
    <Button variant="ghost">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  )
}
