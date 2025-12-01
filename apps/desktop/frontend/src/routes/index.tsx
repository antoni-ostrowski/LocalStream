import { UpdatePreferences } from "@/wailsjs/go/main/App"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello{" "}
      <button
        onClick={async () => {
          await UpdatePreferences({
            databasePath: "test",
            sourceUrls: ["jfkdls"],
          })
        }}
      >
        update
      </button>
    </div>
  )
}
