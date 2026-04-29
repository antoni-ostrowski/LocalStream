import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { IconRefresh } from "@tabler/icons-react"
import ManualTracksSync from "./manual-sync"

export default function LibraryManagment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconRefresh />
          <h1>Library Management</h1>
        </CardTitle>
        <CardDescription>
          <p>Manage your library settings.</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ManualTracksSync />
      </CardContent>
    </Card>
  )
}
