'use strict'

import { ChelErrorGenerator } from '../deps.ts'

export const BackendErrorNotFound: any = ChelErrorGenerator('BackendErrorNotFound')
export const BackendErrorGone: any = ChelErrorGenerator('BackendErrorGone')
export const BackendErrorBadData: any = ChelErrorGenerator('BackendErrorBadData')
