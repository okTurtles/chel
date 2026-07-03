import { errorMessage } from '~/utils.ts'

export interface BackendInitError extends Error {
  backendName?: string
}

// Tags a sub-backend failure with its name and a raw detail message, without
// building a full user-facing sentence. The outer router wrap reads the
// `backendName` to produce a single, clear message naming the real sub-backend.
export function tagBackendError (name: string, e: unknown): BackendInitError {
  const wrapped = new Error(errorMessage(e), { cause: e }) as BackendInitError
  wrapped.backendName = name
  return wrapped
}

// Wraps a backend failure with a clear message naming the configured backend
// and surfacing the original detail. For the `router` backend, the failing
// sub-backend is named when possible via `backendName` set by `tagBackendError`.
export function wrapBackendError (
  backendName: string,
  phase: 'load' | 'init',
  e: unknown
): BackendInitError {
  const subName = (e as BackendInitError | undefined)?.backendName
  const display = backendName === 'router' && subName ? subName : backendName
  const verb = phase === 'load' ? 'be loaded' : 'initialize'
  const wrapped = new Error(
    `chel is configured for the "${display}" database backend, ` +
    `but it failed to ${verb}: ${errorMessage(e)}`,
    { cause: e }
  ) as BackendInitError
  // Preserve sub-backend name so nested router configs surface the real name.
  if (backendName === 'router' && subName) wrapped.backendName = subName
  return wrapped
}
