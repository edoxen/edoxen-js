// Result<T, E> — discriminated union for composable error handling.
//
// Public APIs that can fail offer both throw-based and Result-based
// variants. Result is preferred for callers who don't want to use
// try/catch control flow.

export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E }

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

// Convenience: wrap a throwing function in a Result.
export function tryOk<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn())
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)))
  }
}

export async function tryOkAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    return ok(await fn())
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)))
  }
}

// Type guards for narrowing.
export function isOk<T, E>(r: Result<T, E>): r is { readonly ok: true; readonly value: T } {
  return r.ok
}

export function isErr<T, E>(r: Result<T, E>): r is { readonly ok: false; readonly error: E } {
  return !r.ok
}
