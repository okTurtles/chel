export class EOFError extends Error {}

export class ConnectionClosedError extends Error {}

export class SubscriptionClosedError extends Error {}

export class ErrorReplyError extends Error {}
export class NotImplementedError extends Error {
  constructor(message?: string) {
    super(message ? `Not implemented: ${message}` : "Not implemented");
  }
}

export class InvalidStateError extends Error {
  constructor(message?: string) {
    const base = "Invalid state";
    super(message ? `${base}: ${message}` : base);
  }
}

export function isRetriableError(error: unknown): boolean {
  return (error instanceof Deno.errors.BadResource ||
    error instanceof Deno.errors.BrokenPipe ||
    error instanceof Deno.errors.ConnectionAborted ||
    error instanceof Deno.errors.ConnectionRefused ||
    error instanceof Deno.errors.ConnectionReset ||
    error instanceof Deno.errors.UnexpectedEof ||
    error instanceof EOFError);
}
