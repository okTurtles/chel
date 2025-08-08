import { sbp } from '../deps.ts'

// Used by 'backend/translations/get'
// Do not include 'english.json' here unless the browser might need to download it.
const languageFileMap = new Map([
  ['ko', 'korean.json']
])

export function handleFetchResult (type: string): ((r: Response) => Promise<unknown>) {
  return function (r: Response) {
    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`)
    return (r as unknown as { [key: string]: () => Promise<unknown> })[type]()
  }
}

sbp('sbp/selectors/register', {
  async 'backend/translations/get' (language: string): Promise<Record<string, unknown> | null> {
    // The language code is usually the first part of the language tag.
    const [languageCode] = language.toLowerCase().split('-')
    const languageFileName = languageFileMap.get(languageCode) || ''

    if (languageFileName !== '') {
      return await fetch(`${sbp('okTurtles.data/get', 'API_URL')}/assets/strings/${languageFileName}`)
        .then(handleFetchResult('json')) as Record<string, unknown>
    }
    return null
  }
})
