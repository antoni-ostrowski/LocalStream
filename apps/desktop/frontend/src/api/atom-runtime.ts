import { Atom } from "@effect-atom/atom-react"
import { Layer, Logger, LogLevel } from "effect"
import { Mutations } from "./mutations"
import { Queries } from "./queries"

export const makeAtomRuntime = Atom.context({ memoMap: Atom.defaultMemoMap })

makeAtomRuntime.addGlobalLayer(
  Layer.provideMerge(Logger.pretty, Logger.minimumLogLevel(LogLevel.Debug)),
)

export const atomRuntime = makeAtomRuntime(
  Layer.mergeAll(Queries.Default, Mutations.Default),
)
