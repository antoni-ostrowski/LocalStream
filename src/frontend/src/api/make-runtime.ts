import { Atom } from "@effect-atom/atom-react"
import { Layer, Logger } from "effect"
import { Mutations } from "./mutations"
import { Queries } from "./queries"

export const makeAtomRuntime = Atom.context({ memoMap: Atom.defaultMemoMap })

makeAtomRuntime.addGlobalLayer(Logger.pretty)
export const atomRuntime = makeAtomRuntime(
  Layer.mergeAll(Queries.Default, Mutations.Default)
)
