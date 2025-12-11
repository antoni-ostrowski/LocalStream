import { GetEvents } from "@/wailsjs/go/main/App"
import { events } from "@/wailsjs/go/models"
import { EventsOn } from "@/wailsjs/runtime/runtime"
import { useAtomRefresh } from "@effect-atom/atom-react"
import { useEffect, useState } from "react"
import { queries } from "./queries"

export default function MountGoEventHandler() {
  const [data, setData] = useState<events.EventsStruct | null>(null)
  useEffect(() => {
    void (async () => {
      const data = await GetEvents()
      setData(data)
    })()
  }, [])
  if (data) {
    console.log("rendering events handlers")
    return <Comp {...{ events: data }} />
  }
  console.log("no data for events handlers")
  return null
}
function Comp({ events }: { events: events.EventsStruct }) {
  const refreshListQueue = useAtomRefresh(queries.player.listQueue)
  const refreshCurrentPlaying = useAtomRefresh(queries.player.getCurrentPlaying)
  const refreshListAllTracks = useAtomRefresh(queries.tracks.listAllTracksAtom)

  console.log({ events })
  console.log(events.QueueUpdated)

  useEffect(() => {
    const disposeQueueUpdated = EventsOn(events.QueueUpdated, async () => {
      console.log("got updated refresh list queue")
      refreshListAllTracks()
      refreshListQueue()
      refreshCurrentPlaying()
    })

    const disposeCurrentPlayingUpdated = EventsOn(
      events.CurrentPlayingUpdated,
      async () => {
        console.log("get updated currenlty playing")
        refreshListAllTracks()
        refreshListQueue()
        refreshCurrentPlaying()
      },
    )

    const disposeAnyTrackInfoUpdated = EventsOn(
      events.AnyTrackInfoUpdated,
      async () => {
        console.log("get updated any track updated")
        refreshListAllTracks()
        refreshListQueue()
        refreshCurrentPlaying()
      },
    )

    return () => {
      disposeQueueUpdated()
      disposeCurrentPlayingUpdated()
      disposeAnyTrackInfoUpdated()
    }
  }, [events])

  return null
}
