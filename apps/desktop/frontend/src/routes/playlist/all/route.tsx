import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
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
import {
  Registry,
  Result,
  useAtomSet,
  useAtomValue
} from "@effect-atom/atom-react"
import { IconList, IconSearch } from "@tabler/icons-react"
import { createFileRoute } from "@tanstack/react-router"
import { Effect } from "effect"
import { useEffect } from "react"
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
        .onSuccess((playlists) => (
          <PageTitleWrapper title="Your Playlists">
            <div className="bg-background min-h-screen">
              <div className="mx-auto max-w-7xl">
                {/* Header */}

                {/* Search, Filters, and Sorting */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
                  {/* Search */}
                  <div className="relative flex-1">
                    <IconSearch
                      className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
                      size={18}
                    />
                    <Input
                      placeholder="Search playlists..."
                      className="pl-10"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Playlists</SelectItem>
                        <SelectItem value="favorites">Favorites</SelectItem>
                        <SelectItem value="recent">Recent</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Sort */}
                    <Select defaultValue="name">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="recent">Recently Added</SelectItem>
                        <SelectItem value="tracks">Track Count</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {playlists.map((playlist) => (
                    <PlaylistGridItem
                      key={`playlist-grid-item-${playlist.id}`}
                      {...{ playlist }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PageTitleWrapper>
        ))
        .orNull()}
    </>
  )
}
