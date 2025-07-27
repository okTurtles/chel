'use strict'

import { ChelErrorGenerator } from '../deps.ts'

export const BackendErrorNotFound: typeof Error = ChelErrorGenerator('BackendErrorNotFound')
export const BackendErrorGone: typeof Error = ChelErrorGenerator('BackendErrorGone')
export const BackendErrorBadData: typeof Error = ChelErrorGenerator('BackendErrorBadData')
