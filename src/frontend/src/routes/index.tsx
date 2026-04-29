import PageTitleWrapper from "@/components/page-title-wrapper"
import { EventsOn } from "@/wailsjs/runtime/runtime"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/")({
  component: RouteComponent
})

function RouteComponent() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    EventsOn("tracksync", (data) => {
      setProgress(data)
    })
  }, [])

  return (
    <PageTitleWrapper>
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-center">
          <h1>Add directory with your music in settings</h1>
          <Link to="/settings">
            <p className="text-muted-foreground underline">Settings</p>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1>Play some music!</h1>
          <Link to="/tracks/all">
            <p className="text-muted-foreground underline">tracks</p>
          </Link>
        </div>

        {progress && <p>{progress} tracks synced</p>}
      </div>
    </PageTitleWrapper>
  )
}
