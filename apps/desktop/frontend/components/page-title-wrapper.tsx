import type { ReactNode } from "react"
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
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex w-full flex-1 flex-col gap-4 p-4">
        {(title || description || icon) && (
          <div className="flex items-center gap-3">
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
