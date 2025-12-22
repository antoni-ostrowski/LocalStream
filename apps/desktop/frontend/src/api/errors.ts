import { Data } from "effect"

export class GenericError extends Data.TaggedError("GenericError")<{
  cause?: unknown
  message?: string
}> {
  constructor(args?: { message?: string }) {
    super({
      message: args?.message ?? "App call failed"
    })
  }
}

export class NotFound extends Data.TaggedError("NotFound")<{
  cause?: unknown
  message: string
}> {
  constructor(args?: { message?: string }) {
    super({
      message: args?.message ?? "Resource not found"
    })
  }
}

export class NoTracksFound extends Data.TaggedError("NoTracksFound")<{
  cause?: unknown
  message?: string
}> {}

export class ListTracksError extends Data.TaggedError("ListTracksError")<{
  cause?: unknown
  message?: string
}> {}

export class GetTrackArtworkError extends Data.TaggedError(
  "GetTrackArtworkError"
)<{
  cause?: unknown
  message?: string
}> {}

export class ListQueueError extends Data.TaggedError("ListQueueError")<{
  cause?: unknown
  message?: string
}> {
  constructor(args?: { message?: string }) {
    super({
      message: args?.message ?? "Failed to get queue"
    })
  }
}

export class GetCurrentTrackError extends Data.TaggedError(
  "GetCurrentTrackError"
)<{
  cause?: unknown
  message?: string
}> {}

export class StarTrackError extends Data.TaggedError("StarTrackError")<{
  cause?: unknown
  message?: string
}> {}
