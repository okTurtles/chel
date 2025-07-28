'use strict'

import { sbp } from '../../../../deps.ts'
import { OPEN_PROMPT, PROMPT_RESPONSE } from './events.ts'

export type PromptParams = {
  title: string,
  content: string,
  primaryButton?: string,
  secondaryButton?: string,
  hideCloseButton?: boolean
}

sbp('sbp/selectors/register', {
  'dashboard.ui/prompt' (params: PromptParams): Promise<unknown> {
    const { title, content } = params
    if (!title && !content) { throw Error('Missing parameters') }

    sbp('okTurtles.events/emit', OPEN_PROMPT, params)

    return new Promise((resolve) => {
      sbp('okTurtles.events/once', PROMPT_RESPONSE, (response: unknown) => {
        resolve(response)
      })
    })
  }
})
