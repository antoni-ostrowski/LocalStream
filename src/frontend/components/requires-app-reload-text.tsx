import { IconAlertTriangle } from "@tabler/icons-react"

export default function RequiredAppReload() {
  return (
    <div className="flex flex-row items-center justify-start gap-2 text-yellow-400">
      <IconAlertTriangle size={18} /> Requires app reload!
    </div>
  )
}
