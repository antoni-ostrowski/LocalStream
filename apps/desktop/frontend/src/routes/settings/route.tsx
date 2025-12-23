import PageTitleWrapper, {
  pageTitleIconSize
} from "@/components/page-title-wrapper"
import { IconSettings } from "@tabler/icons-react"
import { createFileRoute } from "@tanstack/react-router"
import DbManagment from "./-components/db-managment/db-managment"
import LibraryManagment from "./-components/library-managment/library-managment"
import MusicSources from "./-components/music-sources.tsx/music-sources"

export const Route = createFileRoute("/settings")({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <PageTitleWrapper
      title="Settings"
      description="Manage your music library and preferences"
      icon={<IconSettings className={pageTitleIconSize} />}
    >
      <div className="flex w-full flex-col justify-start space-y-6">
        <MusicSources />
        <LibraryManagment />
        <DbManagment />
      </div>
    </PageTitleWrapper>
  )
}
