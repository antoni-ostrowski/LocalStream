import { Button } from "@/components/ui/button"
import { Atom, useAtomSet, useAtomValue } from "@effect-atom/atom-react"
import { createFileRoute } from "@tanstack/react-router"
import { Effect, Layer } from "effect"

export const Route = createFileRoute("/")({
  component: RouteComponent,
})
const runtimeAtom = Atom.runtime(Layer.empty)

let i = 0

//      ┌─── Atom.Atom<number>
//      ▼
const count = Atom.make(() => i++).pipe(
  // Refresh when the "counter" key changes
  Atom.withReactivity(["counter"]),
  // Or refresh when "counter" or "counter:1" or "counter:2" changes
  Atom.withReactivity({
    counter: [1, 2],
  }),
)

const someMutation = runtimeAtom.fn(
  Effect.fn(function* () {
    yield* Effect.log("Mutating the counter")
  }),
  // Invalidate the "counter" key when the Effect is finished
  { reactivityKeys: ["counter"] },
)

function RouteComponent() {
  const currentCountEffect = useAtomValue(count)

  const runMutation = useAtomSet(someMutation)
  return (
    <div>
      index.ts i: {currentCountEffect}
      <Button onClick={() => runMutation()}>Mutate/Refresh Count</Button>
    </div>
  )
}
