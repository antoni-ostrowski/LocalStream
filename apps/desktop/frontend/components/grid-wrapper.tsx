import type { ReactNode } from 'react'

export default function GridWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row flex-wrap items-start justify-start gap-4">
      {children}
    </div>
  )
}
