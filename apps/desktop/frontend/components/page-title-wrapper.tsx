import { IconArrowNarrowLeft } from "@tabler/icons-react"
import { useRouter } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { Button } from "./ui/button"
export const pageTitleIconSize = "h-8 w-8"

export default function PageTitleWrapper({
  title = "",
  icon,
  description = "",
  children
}: {
  title?: string
  icon?: ReactNode
  description?: string
  children: ReactNode
}) {
  const router = useRouter()
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex w-full flex-1 flex-col gap-4 p-4">
        {(title || description || icon) && (
          <div className="flex items-center gap-1">
            <Button
              className={"w-10"}
              variant={"ghost"}
              onClick={() => router.history.back()}
            >
              <IconArrowNarrowLeft />
            </Button>

            <div className="">{icon}</div>
            <div>
              {title && (
                <h1 className="text-foreground text-3xl font-bold">{title}</h1>
              )}
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  )
}
