import { tryCatch } from "@/lib/utils"
import { GetIsAppReady } from "@/wailsjs/go/main/App"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"
import { toast } from "sonner"
import { routeTree } from "./routeTree.gen"
import "./style.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
      staleTime: 0,
      refetchOnMount: true,
    },
  },
})

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

async function checkForAppReady() {
  const delay = 500
  const maxAttempts = 50
  let attempts = 0

  while (true) {
    if (attempts === maxAttempts) {
      console.log("max attempts, app not responding")
      return false
    }

    const isReady = await tryCatch(GetIsAppReady())
    if (isReady) {
      toast.success("app ready")
      return true
    }

    attempts++
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  const isReady = await checkForAppReady()
  console.log({ isReady })

  const app = (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )

  if (isReady) {
    root.render(app) // Renders the main app only if ready
  } else {
    // If the app is NOT ready after max attempts, show a fatal error screen.
    root.render(
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>🚨 Fatal Error</h1>
        <p>
          The backend failed to initialize. Please check the application logs
          and restart the app.
        </p>
      </div>,
    )
    // You might also want to prevent the toast.success from running if it failed.
  }
}
