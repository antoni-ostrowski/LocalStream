import { Array, Effect, pipe } from "effect"
import * as Cause from "effect/Cause"
import type * as Option from "effect/Option"
import { toast } from "sonner"
import { NotFound } from "./errors"

export type ErrorConstructor<E extends { readonly _tag: string }> = {
  new (args: { cause: unknown; message?: string }): E
}

/**
 * A highly reusable helper for wrapping asynchronous Wails/Go calls.
 * This version allows passing any Tagged Error constructor.
 *
 */
export const wailsCall = <A, E extends { readonly _tag: string }>(
  fn: () => Promise<A>,
  ErrorType: ErrorConstructor<E>,
  errMessage?: string
): Effect.Effect<A, E, never> =>
  Effect.tryPromise({
    try: fn,
    catch: (cause) => new ErrorType({ cause, message: errMessage })
  }).pipe(Effect.tapError((error) => Effect.logError(error)))

type ToastOptions<A, E, Args extends ReadonlyArray<unknown>> = {
  onWaiting?: string | ((...args: Args) => string)
  onSuccess?: string | ((a: A, ...args: Args) => string)
  onFailure?: string | ((error: Option.Option<E>, ...args: Args) => string)
}

export const withToast = <A, E, Args extends ReadonlyArray<unknown>, R>(
  options: ToastOptions<A, E, Args>
) =>
  Effect.fnUntraced(function* (self: Effect.Effect<A, E, R>, ...args: Args) {
    let toastId: string | number | undefined = undefined

    // 1. Only show loading toast if onWaiting is provided
    if (options.onWaiting) {
      const message =
        typeof options.onWaiting === "string"
          ? options.onWaiting
          : options.onWaiting(...args)
      toastId = toast.loading(message)
    }

    return yield* self.pipe(
      Effect.tap((a) =>
        Effect.sync(() => {
          // 2. Only show success toast if onSuccess is provided
          if (options.onSuccess) {
            const message =
              typeof options.onSuccess === "string"
                ? options.onSuccess
                : options.onSuccess(a, ...args)

            // If we have a toastId (from loading), update it; otherwise create new
            toast.success(
              message,
              toastId !== undefined ? { id: toastId } : undefined
            )
          } else if (toastId !== undefined) {
            // If no success message but a loading toast exists, dismiss it
            toast.dismiss(toastId)
          }
        })
      ),
      Effect.tapErrorCause((cause) =>
        Effect.sync(() => {
          // 3. Only show error toast if onFailure is provided
          if (options.onFailure) {
            const message =
              typeof options.onFailure === "string"
                ? options.onFailure
                : options.onFailure(Cause.failureOption(cause), ...args)

            toast.error(
              message,
              toastId !== undefined ? { id: toastId } : undefined
            )
          } else if (toastId !== undefined) {
            // Dismiss loading toast if error happens and no failure message is set
            toast.dismiss(toastId)
          }
        })
      )
    )
  })

export function listFetcher<A, E extends { readonly _tag: string }>(
  dataGetter: () => Promise<A[]>,
  ErrorType: ErrorConstructor<E>,
  errMessage?: string,
  notFoundErrMessage?: string
) {
  return pipe(
    Effect.tryPromise({
      try: async () => {
        // just in case check for nils
        const res = await dataGetter()
        return res ?? []
      },
      catch: (cause) => new ErrorType({ cause, message: errMessage })
    }),
    Effect.flatMap((value) =>
      Array.isEmptyArray(value)
        ? Effect.fail(new NotFound({ message: notFoundErrMessage }))
        : Effect.succeed(value)
    ),
    Effect.tapBoth({
      onSuccess: (value) => Effect.logInfo(`Fetched ${value.length} items`),
      onFailure: (error) => Effect.logError(error)
    })
  )
}
