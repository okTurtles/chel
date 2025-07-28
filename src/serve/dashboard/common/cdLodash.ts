export function cloneDeep<T> (obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function isMergeableObject (val: unknown): val is Record<string, unknown> {
  const nonNullObject = val && typeof val === 'object'
  return !!nonNullObject && Object.prototype.toString.call(val) !== '[object RegExp]' && Object.prototype.toString.call(val) !== '[object Date]'
}

export function merge<T extends Record<string, unknown>> (obj: T, src: Record<string, unknown>): T {
  for (const key in src) {
    const srcValue = src[key]
    const clone = isMergeableObject(srcValue) ? cloneDeep(srcValue) : undefined
    if (clone && isMergeableObject(obj[key])) {
      merge(obj[key] as Record<string, unknown>, clone)
      continue
    }
    (obj as Record<string, unknown>)[key] = clone || srcValue
  }
  return obj
}

export function throttle<T extends unknown[], R> (func: (...args: T) => R, delay: number): (...args: T) => R | undefined {
  // reference: https://www.geeksforgeeks.org/javascript-throttling/

  // Previously called time of the function
  let prev = 0
  return (...args: T) => {
    // Current called time of the function
    const now = new Date().getTime()

    // If difference is greater than delay call
    if (now - prev > delay) {
      prev = now

      return func(...args)
    }
  }
}

export function debounce<T extends unknown[], R> (func: (...args: T) => R, wait: number, immediate: boolean | null | undefined): ((...args: T) => R | undefined) & { clear: () => void; flush: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null, args: T | null, context: unknown, timestamp: number, result: R | undefined
  if (wait == null) wait = 100

  function later () {
    const last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args!)
        context = args = null
      }
    }
  }

  const debounced = function (this: unknown, ...funcArgs: T) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this
    args = funcArgs
    timestamp = Date.now()
    const callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args!)
      context = args = null
    }

    return result
  }

  debounced.clear = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  debounced.flush = function () {
    if (timeout) {
      result = func.apply(context, args!)
      context = args = null
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}
