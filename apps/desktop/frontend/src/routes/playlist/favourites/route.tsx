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
import { IconStar } from "@tabler/icons-react"
import { createFileRoute } from "@tanstack/react-router"
import { Effect } from "effect"
import { useEffect } from "react"
import PlaylistGridItem from "../-components/playlist-grid-item"

export const Route = createFileRoute("/playlist/favourites")({
  component: RouteComponent
})

const setGenericPlaylistListAtom = atomRuntime.fn(
  Effect.fn(function* () {
    const registry = yield* Registry.AtomRegistry
    const q = yield* Queries
    const newPlaylistList = yield* q.listFavPlaylists

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
    console.log("playlist fav use effect")
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
                <IconStar color="yellow" fill="yellow" />
              </EmptyMedia>
              <EmptyTitle>No favourite playlists yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t added any playlists to favourites.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ))
        .onError((err) => <FullScreenError errorDetail={err.message} />)
        .onSuccess((playlists) => (
          <PageTitleWrapper
            title="Your Favourite Playlists"
            icon={<IconStar color="yellow" fill="yellow" />}
          >
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
