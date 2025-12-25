import FullScreenError from "@/components/full-screen-error"
import FullScreenLoading from "@/components/full-screen-loading"
import GridWrapper from "@/components/grid-wrapper"
import PageTitleWrapper from "@/components/page-title-wrapper"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"
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
import { IconList } from "@tabler/icons-react"
import { createFileRoute } from "@tanstack/react-router"
import { Effect } from "effect"
import { useEffect } from "react"
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
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconList />
              </EmptyMedia>
              <EmptyTitle>No playlists yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any playlists yet. Create one in the
                sidebar.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ))
        .onError((err) => <FullScreenError errorDetail={err.message} />)
        .onSuccess((playlists) => (
          <PageTitleWrapper title="Your Playlists">
            <GridWrapper>
              {playlists.map((playlist) => (
                <PlaylistGridItem
                  key={`playlist-grid-item-${playlist.id}`}
                  {...{ playlist }}
                />
              ))}
            </GridWrapper>
          </PageTitleWrapper>
        ))
        .orElse(() => (
          <p>else</p>
        ))}
    </>
  )
}
