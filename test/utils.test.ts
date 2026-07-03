import { assertEquals } from 'jsr:@std/assert'
import { errorMessage } from '../src/utils.ts'

Deno.test('errorMessage', async (t) => {
  await t.step('uses Error.message', () => {
    assertEquals(errorMessage(new Error('boom')), 'boom')
  })
  await t.step('falls back to .code when message is empty', () => {
    const e = new Error()
    ;(e as { code?: string }).code = 'ECONNREFUSED'
    assertEquals(errorMessage(e), 'ECONNREFUSED')
  })
  await t.step('joins AggregateError sub-messages', () => {
    const e = new AggregateError([
      new Error('connect ECONNREFUSED ::1:6379'),
      new Error('connect ECONNREFUSED 127.0.0.1:6379')
    ])
    assertEquals(
      errorMessage(e),
      'connect ECONNREFUSED ::1:6379; connect ECONNREFUSED 127.0.0.1:6379'
    )
  })
  await t.step('combines a non-empty outer message with sub-error detail', () => {
    const e = new AggregateError(
      [new Error('connect ECONNREFUSED 127.0.0.1:6379')],
      'Redis connection failed'
    )
    assertEquals(
      errorMessage(e),
      'Redis connection failed (connect ECONNREFUSED 127.0.0.1:6379)'
    )
  })
  await t.step('recurses into empty sub-errors that only have .code', () => {
    const sub = new Error()
    ;(sub as { code?: string }).code = 'ECONNREFUSED'
    assertEquals(errorMessage(new AggregateError([sub])), 'ECONNREFUSED')
  })
  await t.step('falls back to error name when nothing else is present', () => {
    assertEquals(errorMessage(new Error()), 'Error')
  })
  await t.step('never returns an empty string', () => {
    assertEquals(errorMessage(''), '(unknown error)')
  })
})
