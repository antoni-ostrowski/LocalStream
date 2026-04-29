import { createFileLink } from "@/lib/utils"
import { atomRuntime } from "@/src/api/make-runtime"
import { Mutations } from "@/src/api/mutations"
import { Queries } from "@/src/api/queries"
import { getPlaylistAtom } from "@/src/routes/playlist/$playlistId/route"
import { sqlcDb } from "@/wailsjs/go/models"
import {
  Atom,
  Registry,
  Result,
  useAtom,
  useAtomValue
} from "@effect-atom/atom-react"
import { Effect } from "effect"
import { useState } from "react"
import { DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { Switch } from "../ui/switch"

const getPlaylistForTrackAtom = Atom.family((trackId: string) =>
  atomRuntime.atom(
    Effect.gen(function* () {
      const q = yield* Queries
      return yield* q.listPlaylistsForTrack(trackId)
    })
  )
)

export default function TracksPlaylists({ track }: { track: sqlcDb.Track }) {
  const playlistForTrackResult = useAtomValue(getPlaylistForTrackAtom(track.id))
  const [input, setInput] = useState("")
  console.log({ playlistForTrackResult })
  return (
    <>
      <DropdownMenuLabel>
        <Input
          autoFocus
          placeholder="Playlist name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        />
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {Result.builder(playlistForTrackResult)
        .onInitial(() => <DropdownMenuLabel>Initializing...</DropdownMenuLabel>)
        .onSuccess((playlists) => (
          <>
            {playlists.map((playlist) => {
              const query = input.toLowerCase()
              if (!playlist.name.toLowerCase().includes(query) && query !== "")
                return null
              return (
                <PlaylistItem
                  {...{ playlist, track }}
                  key={`playlist-context-menu-item-${playlist.id}`}
                />
              )
            })}
          </>
        ))

        .orNull()}
    </>
  )
}

const addTrackToPlaylist = atomRuntime.fn(
  Effect.fn(function* ({
    trackId,
    playlistId
  }: {
    trackId: string
    playlistId: string
  }) {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations
    yield* m.addTrackToPlaylist(trackId, playlistId)
    registry.refresh(getPlaylistForTrackAtom(trackId))
    registry.refresh(getPlaylistAtom(playlistId))
  })
)

const deleteTrackFromPlaylist = atomRuntime.fn(
  Effect.fn(function* ({
    trackId,
    playlistId
  }: {
    trackId: string
    playlistId: string
  }) {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations
    yield* m.DeleteTrackFromPlaylist(trackId, playlistId)
    registry.refresh(getPlaylistForTrackAtom(trackId))
    registry.refresh(getPlaylistAtom(playlistId))
  })
)

function PlaylistItem({
  playlist,
  track
}: {
  playlist: sqlcDb.ListPlaylistsForTrackRow
  track: sqlcDb.Track
}) {
  const [isChecked, setIsChecked] = useState(!!playlist.is_in_playlist)
  const [, add] = useAtom(addTrackToPlaylist)
  const [, deleteIt] = useAtom(deleteTrackFromPlaylist)
  return (
    <DropdownMenuLabel
      className={"flex w-full flex-row items-center justify-between"}
    >
      <img
        className="w-7"
        src={
          playlist.cover_path.String === ""
            ? "/placeholder.webp"
            : createFileLink(playlist.cover_path.String)
        }
      />
      <p>{playlist.name}</p>
      <Switch
        checked={isChecked}
        onCheckedChange={(e) => {
          setIsChecked(e)
          if (!e) {
            deleteIt({ trackId: track.id, playlistId: playlist.id })
          } else {
            add({ trackId: track.id, playlistId: playlist.id })
          }
        }}
      />
    </DropdownMenuLabel>
  )
}
