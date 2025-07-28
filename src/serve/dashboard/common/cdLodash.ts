export function cloneDeep (obj: object): any {
  return JSON.parse(JSON.stringify(obj))
}

function isMergeableObject (val: any): boolean {
  const nonNullObject = val && typeof val === 'object'
  return nonNullObject && Object.prototype.toString.call(val) !== '[object RegExp]' && Object.prototype.toString.call(val) !== '[object Date]'
}

export function merge (obj: any, src: any): any {
  for (const key in src) {
    const clone = isMergeableObject(src[key]) ? cloneDeep(src[key]) : undefined
    if (clone && isMergeableObject(obj[key])) {
      merge(obj[key], clone)
      continue
    }
    obj[key] = clone || src[key]
  }
  return obj
}

export function throttle (func: (...args: any[]) => any, delay: number): (...args: any[]) => any {
  // reference: https://www.geeksforgeeks.org/javascript-throttling/

  // Previously called time of the function
  let prev = 0
  return (...args: any[]) => {
    // Current called time of the function
    const now = new Date().getTime()

    // If difference is greater than delay call
    if (now - prev > delay) {
      prev = now

      return func(...args)
    }
  }
}

export function debounce (func: (...args: any[]) => any, wait: number, immediate: boolean | null | undefined): ((...args: any[]) => any) & { clear: () => void; flush: () => void } {
  let timeout: any, args: any, context: any, timestamp: any, result: any
  if (wait == null) wait = 100

  function later () {
    const last = Date.now() - timestamp

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        context = args = null
      }
    }
  }

  const debounced = function (this: any, ...funcArgs: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this
    args = funcArgs
    timestamp = Date.now()
    const callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
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
      result = func.apply(context, args)
      context = args = null
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}
