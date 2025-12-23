import PageTitleWrapper, {
  pageTitleIconSize
} from "@/components/page-title-wrapper"
import { createFileRoute } from "@tanstack/react-router"
import { Settings } from "lucide-react"
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
      icon={<Settings className={pageTitleIconSize} />}
    >
      <div className="flex w-full flex-col justify-start space-y-6">
        <MusicSources />
        <LibraryManagment />
        <DbManagment />
      </div>
    </PageTitleWrapper>
  )
}
