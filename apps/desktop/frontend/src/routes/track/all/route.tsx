import PageTitleWrapper from "@/components/page-title-wrapper"
import TrackTable from "@/components/track-table/track-table"
import { GenericError } from "@/src/api/errors"
import {
  genericTrackListAtom,
  GenericTrackListAtomAction,
} from "@/src/api/track-list-atom"
import { ListAllTracks } from "@/wailsjs/go/main/App"
import {
  Atom,
  Registry,
  Result,
  useAtom,
  useAtomValue,
} from "@effect-atom/atom-react"
import { createFileRoute } from "@tanstack/react-router"
import { Effect } from "effect"
import { useEffect } from "react"

export const Route = createFileRoute("/track/all")({
  component: RouteComponent,
})

//temp lazy implementation of fetching data
const setGenericTrackListAtomDataAtom = Atom.fn(
  Effect.fn(function* () {
    const registry = yield* Registry.AtomRegistry
    const data = yield* Effect.tryPromise({
      try: async () => await ListAllTracks(),
      catch: () => new GenericError({ message: "Failed to get tracks" }),
    })

    registry.set(
      genericTrackListAtom,
      GenericTrackListAtomAction.UpdateTrackList({ newTrackList: data }),
    )
  }),
)

function RouteComponent() {
  // here fetch the server tracks we want to show
  const [state, setGenericTrackListAtomData] = useAtom(
    setGenericTrackListAtomDataAtom,
    { mode: "promiseExit" },
  )
  useEffect(() => {
    void (async () => {
      await setGenericTrackListAtomData()
    })()
  }, [])

  return (
    <PageTitleWrapper title={`All Tracks`}>
      <>
        {Result.builder(state)
          .onSuccess(() => <Child />)
          .orNull()}
      </>
    </PageTitleWrapper>
  )
}

function Child() {
  const trackList = useAtomValue(genericTrackListAtom)
  return (
    <>
      {Result.builder(trackList)
        .onSuccess((tracks) => <TrackTable tracks={tracks} />)
        .orNull()}
    </>
  )
}
