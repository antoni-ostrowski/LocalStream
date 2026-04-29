import FullScreenLoading from "@/components/full-screen-loading"
import PageTitleWrapper from "@/components/page-title-wrapper"
import TrackTable from "@/components/track-table/track-table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  genericTrackListAtom,
  GenericTrackListAtomAction
} from "@/src/api/atoms/generic-track-list-atom"
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

export const Route = createFileRoute("/tracks/all")({
  component: RouteComponent
})

// a func to set specific list of tracks as the current one
// this could be abstacted to some hook probably,
// the whole flow of running a set func on genericTrackList
const setGenericTracksToAllTracks = atomRuntime.fn(
  Effect.fn(function* () {
    const registry = yield* Registry.AtomRegistry
    const q = yield* Queries
    const newTrackList = yield* q.listAllTracks

    Effect.logInfo("running atom to update to all tracks")
    registry.set(
      genericTrackListAtom,
      GenericTrackListAtomAction.UpdateTrackList({
        newTrackList: newTrackList
      })
    )
  })
)

function RouteComponent() {
  console.log("track all route")
  const genericTrackListResult = useAtomValue(genericTrackListAtom)
  const updateGenericTrackList = useAtomSet(setGenericTracksToAllTracks)

  useEffect(() => {
    console.log("track all use effect")
    updateGenericTrackList()
  }, [])

  return (
    <PageTitleWrapper title={`Tracks`}>
      {Result.builder(genericTrackListResult)
        .onInitialOrWaiting(() => <FullScreenLoading />)
        .onSuccess((tracks) => <TracksPageContents tracks={tracks ?? []} />)
        .orNull()}
    </PageTitleWrapper>
  )
}

type Filters = "all" | "favs"

function TracksPageContents({ tracks }: { tracks: sqlcDb.Track[] }) {
  const [curFilter, setCurFilter] = useState<Filters>("all")

  function handleNewFilter(value: Filters | null) {
    if (value) setCurFilter(value)
  }

  const showedTracks = useMemo(() => {
    if (curFilter === "all") return tracks
    return tracks.filter((item) => item.starred.Valid && item.starred.Int64 > 0)
  }, [tracks, curFilter])

  return (
    <div className="flex flex-col gap-2">
      <TrackTable
        filter=""
        filterValue=""
        tracks={showedTracks}
        filters={
          <Select value={curFilter} onValueChange={handleNewFilter}>
            <SelectTrigger className="w-30">
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
                    <IconStar size={16} color="yellow" fill="yellow" />{" "}
                    Favourites
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        }
      />
    </div>
  )
}
