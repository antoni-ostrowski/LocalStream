import { Effect } from "effect"

export type ErrorConstructor<E extends { readonly _tag: string }> = {
  // readonly [TypeId]: E[typeof TypeId]
  new (args: { cause: unknown }): E
}

/**
 * A highly reusable helper for wrapping asynchronous Wails/Go calls.
 * This version allows passing any Tagged Error constructor.
 *
 * @template A The success type (the return value of the Wails function).
 * @template E The failure type (a specific tagged error).
 *
 * @param fn The asynchronous function that calls the Go backend.
 * @param ErrorType The constructor for the specific tagged error type to create on failure.
 * @returns An Effect that handles the async call, maps the error, and logs the failure.
 */
export const wailsCall = <A, E extends { readonly _tag: string }>(
  fn: () => Promise<A>,
  ErrorType: ErrorConstructor<E>
): Effect.Effect<A, E, never> =>
  Effect.tryPromise({
    try: fn,
    catch: (cause) => new ErrorType({ cause })
  }).pipe(Effect.tapError((error) => Effect.logError(error)))
