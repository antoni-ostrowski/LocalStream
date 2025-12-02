import { Moon, Sun } from "lucide-react"
import { Button } from "../ui/button"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        if (theme === "light") {
          setTheme("dark")
          return
        } else {
          setTheme("light")
          return
        }
      }}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
