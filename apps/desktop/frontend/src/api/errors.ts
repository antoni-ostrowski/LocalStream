import { Data } from "effect"

export class GenericError extends Data.TaggedError("GenericError")<{
  message: string
}> {}

export class NotFound extends Data.TaggedError("NotFound")<{
  message: string
}> {}
