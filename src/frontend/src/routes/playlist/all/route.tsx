import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  GenericPlaylistListAction,
  genericPlaylistListAtom
} from "@/src/api/atoms/playlist-list-atom"
import { atomRuntime } from "@/src/api/make-runtime"
import { Queries } from "@/src/api/queries"
import { sqlcDb } from "@/wailsjs/go/models"
import {
  Registry,
  Result,
  useAtomSet,
  useAtomValue
} from "@effect-atom/atom-react"
import { IconList, IconStar } from "@tabler/icons-react"
import { createFileRoute } from "@tanstack/react-router"
import { Effect } from "effect"
import { useEffect, useMemo, useState } from "react"
import EmptyPlaylists from "../-components/empty-playlists"
import PlaylistGridItem from "../-components/playlist-grid-item"

export const Route = createFileRoute("/playlist/all")({
  component: RouteComponent
})

const setGenericPlaylistListAtom = atomRuntime.fn(
  Effect.fn(function* () {
    const registry = yield* Registry.AtomRegistry
    const q = yield* Queries
    const newPlaylistList = yield* q.listAllPlaylists

    Effect.logInfo("running atom to update to all tracks")
    registry.set(
      genericPlaylistListAtom,
      GenericPlaylistListAction.UpdatePlaylistList({
        newPlaylistList
      })
    )
  })
)
function RouteComponent() {
  const genericPlaylistListValue = useAtomValue(genericPlaylistListAtom)
  const updateGenericPlaylistList = useAtomSet(setGenericPlaylistListAtom)

  useEffect(() => {
    console.log("playlist all use effect")
    updateGenericPlaylistList()
  }, [updateGenericPlaylistList])

  console.log({ genericPlaylistListValue })

  return (
    <>
      {Result.builder(genericPlaylistListValue)
        .onInitialOrWaiting(() => <FullScreenLoading />)
        .onErrorTag("NotFound", () => (
          <EmptyPlaylists
            description="You haven't created any playlists yet. Create one in the sidebar."
            icon={<IconList />}
          />
        ))
        .onError((err) => <FullScreenError errorDetail={err.message} />)
        .onSuccess((playlists) => <PlaylistPageContent {...{ playlists }} />)
        .orNull()}
    </>
  )
  type Filters = "all" | "favs"

  function PlaylistPageContent({
    playlists
  }: {
    playlists: sqlcDb.Playlist[]
  }) {
    const [search, setSearch] = useState("")
    const [curFilter, setCurFilter] = useState<Filters>("all")

    const shownPlaylists = useMemo(() => {
      // 1. First, apply the "All/Favourites" filter
      let filtered =
        curFilter === "all"
          ? playlists
          : playlists.filter((p) => p.starred?.Valid && p.starred.Int64 > 0)

      // 2. Then, apply the search query if it exists
      const query = search.trim().toLowerCase()
      if (query) {
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(query))
      }

      return filtered
    }, [playlists, search, curFilter])

    return (
      <PageTitleWrapper title="Your Playlists">
        <div className="mx-auto w-full">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
            <Input
              placeholder="Search playlists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />

            <Select
              value={curFilter}
              onValueChange={(val) => setCurFilter(val as Filters)}
            >
              <SelectTrigger className={"w-30"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <IconList size={16} /> All
                    </div>
                  </SelectItem>
                  <SelectItem value="favs">
                    <div className="flex items-center gap-2">
                      <IconStar size={16} color="yellow" fill="yellow" />
                      Favourites
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shownPlaylists.map((playlist) => (
              <PlaylistGridItem
                key={`playlist-grid-item-${playlist.id}`}
                playlist={playlist}
              />
            ))}
          </div>
        </div>
      </PageTitleWrapper>
    )
  }
}
