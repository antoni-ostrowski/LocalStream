import { InitAppResources } from "@/wailsjs/go/main/App"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { tryCatch } from "../lib/utils"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [info, setInfo] = useState("")
  return (
    <div>
      Hello
      <button
        onClick={async () => {
          const [, err] = await tryCatch(InitAppResources())
          if (err) {
            setInfo(err.message)
            return
          }
          setInfo("loaded config succesfully")
        }}
      >
        click me
      </button>
      <p>{info}</p>
    </div>
  )
}
