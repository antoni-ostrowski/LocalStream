import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'

export default function AllArtists() {
  return (
    <Link to={'/artist/all'} className="w-full">
      <Button
        variant={'ghost'}
        className="flex w-full items-center justify-start"
      >
        <Users /> All Artists
      </Button>
    </Link>
  )
}
