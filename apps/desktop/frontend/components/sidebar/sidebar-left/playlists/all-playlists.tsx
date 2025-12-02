import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { LayoutGrid } from 'lucide-react'

export default function AllPlaylists() {
  return (
    <Link to={'/playlist/all'} className="w-full">
      <Button
        variant={'ghost'}
        className="flex w-full items-center justify-start"
      >
        <LayoutGrid /> All playlists
      </Button>
    </Link>
  )
}
