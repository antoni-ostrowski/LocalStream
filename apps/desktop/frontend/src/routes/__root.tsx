import SidebarLeft from "@/components/sidebar/sidebar-left/sidebar-left"
import SidebarRight from "@/components/sidebar/sidebar-right/sidebar-right"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { RegistryProvider } from "@effect-atom/atom-react"
import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import appCss from "../style.css?url"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "localStream"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
      </div>
    )
  }
})

function RootComponent() {
  return (
    <>
      <RegistryProvider>
        <div className={`flex min-h-screen flex-col`}>
          <div className={`flex items-center gap-2 border-b`}>
            <div className={`flex-1`}>
              <SidebarProvider>
                <ResizablePanelGroup>
                  <ResizablePanel minSize={"2"} defaultSize={"20"}>
                    <div className="w-full">
                      <SidebarLeft />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel>
                    <SidebarInset>
                      <Outlet />
                    </SidebarInset>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel minSize={"2"} maxSize={"35"}>
                    <SidebarRight />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </SidebarProvider>
              <Toaster />
            </div>
          </div>
        </div>
      </RegistryProvider>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </>
  )
}
