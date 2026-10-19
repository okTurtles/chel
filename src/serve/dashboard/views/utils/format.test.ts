// The dashboard is set up for the browser, so tests here need Deno's types
/// <reference lib="deno.ns" />
import { assertEquals } from 'jsr:@std/assert'
import { credits, humanBytes } from './format.ts'

Deno.test('credits', async (t) => {
  await t.step('turns picocredits into credits, cut to 2 decimals', () => {
    assertEquals(credits('0', 'en-US'), '0.00')
    assertEquals(credits('1000000000000', 'en-US'), '1.00')
    assertEquals(credits('1239999999999', 'en-US'), '1.23')
    assertEquals(credits('-1500000000000', 'en-US'), '-1.50')
    assertEquals(credits('-10000000000', 'en-US'), '-0.01')
  })

  await t.step('stays exact past what a Number can hold', () => {
    assertEquals(credits('123456789012345678901234567890', 'en-US'), '123,456,789,012,345,678.90')
  })

  await t.step('writes the number the way the locale does', () => {
    assertEquals(credits('1234500000000000', 'de-DE'), '1.234,50')
  })

  await t.step('shows a balance just below zero as 0.00, not -0.00', () => {
    assertEquals(credits('-1', 'en-US'), '0.00')
    assertEquals(credits('-9999999999', 'en-US'), '0.00')
  })
})

Deno.test('humanBytes', () => {
  assertEquals(humanBytes(0, 'en-US'), '0 B')
  assertEquals(humanBytes(1023, 'en-US'), '1,023 B')
  assertEquals(humanBytes(1024, 'en-US'), '1.0 KiB')
  assertEquals(humanBytes(10 * 1024 * 1024, 'en-US'), '10.0 MiB')
  assertEquals(humanBytes(1536, 'de-DE'), '1,5 KiB')
})
