import sbp from 'npm:@sbp/sbp'

// Used by 'backend/translations/get'
// Do not include 'english.json' here unless the browser might need to download it.
const languageFileMap = new Map([
  ['ko', 'korean.json']
])

export function handleFetchResult <T extends 'json' | 'text' | 'blob'> (type: T): ((r: Response) => ReturnType<Response[T]>) {
  return function (r: Response) {
    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`)
    return r[type]() as ReturnType<Response[T]>
  }
}

// The server answers 403 when chel.toml has no dashboard password
export class NoPasswordError extends Error {}

sbp('sbp/selectors/register', {
  // With a password set, the browser already asked for it and sends it along
  async 'backend/dashboard/get' (path: string): Promise<unknown> {
    const r = await fetch(`${sbp('okTurtles.data/get', 'API_URL')}/api/${path}`)
    if (r.status === 403) throw new NoPasswordError()
    return handleFetchResult('json')(r)
  },
  async 'backend/translations/get' (language: string): Promise<Record<string, unknown> | null> {
    // The language code is usually the first part of the language tag.
    const [languageCode] = language.toLowerCase().split('-')
    const languageFileName = languageFileMap.get(languageCode) || ''

    if (languageFileName !== '') {
      return await fetch(`${sbp('okTurtles.data/get', 'API_URL')}/assets/strings/${languageFileName}`)
        .then(handleFetchResult('json'))
    }
    return null
  }
})
