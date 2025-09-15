import { ChelErrorGenerator } from '~/deps.ts'

export const BackendErrorNotFound = ChelErrorGenerator('BackendErrorNotFound')
export const BackendErrorGone = ChelErrorGenerator('BackendErrorGone')
export const BackendErrorBadData = ChelErrorGenerator('BackendErrorBadData')