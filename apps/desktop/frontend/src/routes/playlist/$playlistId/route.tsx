import PageTitleWrapper from "@/components/page-title-wrapper"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/playlist/$playlistId")({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <PageTitleWrapper>
      <div className="flex flex-col gap-10">
        <div className="flex flex-row items-center justify-start gap-8">
          here the playlist details
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-row gap-2"></div>
          </div>
        </div>
      </div>
    </PageTitleWrapper>
  )
}
