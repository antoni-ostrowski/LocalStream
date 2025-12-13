import { ThemeToggle } from "@/components/theme/theme-toggle"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Palette } from "lucide-react"

export default function ThemeManagment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <Palette />
          <h1>Theme settings</h1>
        </CardTitle>
        <CardDescription>
          <p>Change your theme settings.</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ThemeToggle />
      </CardContent>
    </Card>
  )
}
