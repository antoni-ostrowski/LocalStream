import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import type { TrackType } from '@/server/db/schema'
import { MoreHorizontal } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import {
  playerStore,
  updatePlayerStore,
} from '../sidebar/sidebar-right/player/store'
import { Button } from '../ui/button'

export default function TrackContextMenu({
  track,
  children,
}: {
  track: TrackType
  children?: ReactNode
}) {
  const triggerRef = useRef(null)
  const contextMenuRef = useRef(null)

  const triggerContextMenuFromClick = (event) => {
    event.stopPropagation()
    console.log('Custom LEFT-CLICK logic executed!')

    if (!triggerRef.current) return
    if (!contextMenuRef.current) return

    contextMenuRef.current.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        clientX: triggerRef.current.getBoundingClientRect().x,
        clientY: triggerRef.current.getBoundingClientRect().y,
      })
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
        <ContextMenuItem onClick={() => appendToQueue(track)}>
          Append to queue
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => insertToQueue(track)}>
          Insert to queue
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export function handlePlayNewTrack(track: TrackType) {
  updatePlayerStore('currentTrack', createQueueTrack(track))
  updatePlayerStore('isPlaying', true)
}

export function createQueueTrack(track: TrackType) {
  return {
    ...track,
    queue_id: crypto.randomUUID(),
  }
}

export function MoreTrackOptionBtn() {
  return (
    <Button variant="ghost">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  )
}

function appendToQueue(track: TrackType) {
  updatePlayerStore('queue', [
    ...playerStore.state.queue,
    createQueueTrack(track),
  ])
}

function insertToQueue(track: TrackType) {
  updatePlayerStore('queue', [
    createQueueTrack(track),
    ...playerStore.state.queue,
  ])
}
