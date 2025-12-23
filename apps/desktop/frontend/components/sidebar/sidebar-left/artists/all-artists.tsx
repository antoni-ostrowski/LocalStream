import { Button } from "@/components/ui/button"
import { IconUsers } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"

export default function AllArtists() {
  return (
    <Link to={"/artist/all"} className="w-full">
      <Button
        variant={"ghost"}
        className="flex w-full items-center justify-start"
      >
        <IconUsers /> All Artists
      </Button>
    </Link>
  )
}
