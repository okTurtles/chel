'use strict'

import { ChelErrorGenerator } from '../deps.ts'

export const BackendErrorNotFound = ChelErrorGenerator('BackendErrorNotFound') as unknown as { new (message?: string): Error; (message?: string): Error }
export const BackendErrorGone = ChelErrorGenerator('BackendErrorGone') as unknown as { new (message?: string): Error; (message?: string): Error }
export const BackendErrorBadData = ChelErrorGenerator('BackendErrorBadData') as unknown as { new (message?: string): Error; (message?: string): Error }
