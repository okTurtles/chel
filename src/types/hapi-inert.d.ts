// Type augmentation for @hapi/inert plugin
// This adds the `file` method to ResponseToolkit which is provided by the Inert plugin
// See: https://github.com/hapijs/inert#replyfilepath-options

import type { ResponseObject, ReqRef, ReqRefDefaults } from 'npm:@hapi/hapi'

export interface ReplyFileHandlerOptions {
  confine?: boolean | string | undefined;
  filename?: string | undefined;
  mode?: false | 'attachment' | 'inline' | undefined;
  lookupCompressed?: boolean | undefined;
  lookupMap?: { [index: string]: string } | undefined;
  etagMethod?: 'hash' | 'simple' | false | undefined;
  start?: number | undefined;
  end?: number | undefined;
}

declare module 'npm:@hapi/hapi' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ResponseToolkit<Refs extends ReqRef = ReqRefDefaults> {
    file(path: string, options?: ReplyFileHandlerOptions): ResponseObject;
  }
}
