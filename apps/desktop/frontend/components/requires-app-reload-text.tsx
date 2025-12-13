import { TriangleAlert } from "lucide-react"

export default function RequiredAppReload() {
  return (
    <div className="flex flex-row items-center justify-start gap-2 text-yellow-400">
      <TriangleAlert size={18} /> Requires app reload!
    </div>
  )
}
