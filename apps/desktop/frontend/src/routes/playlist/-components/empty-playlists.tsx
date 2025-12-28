import { NewPlaylist } from "@/components/sidebar/sidebar-left/playlists/new-playlist"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"
import { ReactNode } from "@tabler/icons-react"

export default function EmptyPlaylists({
  description,
  icon
}: {
  description: string
  icon: ReactNode
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {icon}
          {/* <IconList /> */}
        </EmptyMedia>
        <EmptyTitle>No playlists yet</EmptyTitle>
        <EmptyDescription>
          {description}
          {/* You haven&apos;t created any playlists yet. Create one in the sidebar. */}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <NewPlaylist btnVariant="default" />
        </div>
      </EmptyContent>
    </Empty>
  )
}
