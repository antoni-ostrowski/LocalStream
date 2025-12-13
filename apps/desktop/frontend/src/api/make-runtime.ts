import { Atom } from "@effect-atom/atom-react"
import { Layer } from "effect"
import { Mutations } from "./mutations"
import { Queries } from "./queries"

export const makeAtomRuntime = Atom.context({ memoMap: Atom.defaultMemoMap })

export const atomRuntime = makeAtomRuntime(
  Layer.mergeAll(Queries.Default, Mutations.Default),
)
