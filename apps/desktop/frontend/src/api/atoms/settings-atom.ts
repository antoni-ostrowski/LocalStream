import { config, sqlcDb } from "@/wailsjs/go/models"
import { Atom, Registry, Result } from "@effect-atom/atom-react"
import { Data, Effect } from "effect"
import { atomRuntime } from "../make-runtime"
import { Mutations } from "../mutations"
import { Queries } from "../queries"
import { genericTrackListAtom } from "./generic-track-list-atom"

const remoteSettingsAtom = atomRuntime.atom(
  Effect.fn(function* () {
    const q = yield* Queries
    const settings = yield* q.getSettings
    return yield* Effect.succeed(settings)
  })
)

type Action = Data.TaggedEnum<{
  DeleteFromQueue: { readonly trackDoDelete: sqlcDb.Track }
}>

export const SettingsAtomAction = Data.taggedEnum<Action>()

export const settingsAtom = Object.assign(
  Atom.writable(
    (get: Atom.Context) => get(remoteSettingsAtom),
    (ctx, action: Action) => {
      const currentState = ctx.get(settingsAtom)
      if (!Result.isSuccess(currentState)) return

      // const update = SettingsAtomAction.$match(action, {})

      // ctx.setSelf(Result.success(update))
    }
  ),
  { remote: remoteSettingsAtom }
)

export const createSourceDirAtom = atomRuntime.fn(
  Effect.fn(function* () {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations
    yield* m.settings.createSourceDir

    registry.refresh(remoteSettingsAtom)
    registry.refresh(genericTrackListAtom.remote)
  })
)

export const updatePrefsAtom = atomRuntime.fn(
  Effect.fn(function* (newPrefs: config.Preferences) {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations
    yield* m.settings.updatePreferences(newPrefs)

    registry.refresh(remoteSettingsAtom)
    registry.refresh(genericTrackListAtom.remote)
  })
)

export const triggerTrackSyncAtom = atomRuntime.fn(
  Effect.fn(function* () {
    const registry = yield* Registry.AtomRegistry
    const m = yield* Mutations
    yield* m.settings.reloadAppResources

    registry.refresh(remoteSettingsAtom)
    registry.refresh(genericTrackListAtom.remote)
  })
)

export const defaultPreferencesAtom = atomRuntime.atom(
  Effect.fn(function* () {
    const q = yield* Queries
    const defaultSettings = yield* q.getDefaultSettings
    return yield* Effect.succeed(defaultSettings)
  })
)
