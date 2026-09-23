import sbp from 'npm:@sbp/sbp'
import { assertEquals } from 'jsr:@std/assert'
import createWorker from './createWorker.ts'
import { appendToIndexFactory, closeDB, initDB } from './database.ts'
import { randCID } from './worker-test-helpers.ts'

// Mirrors `PICOCREDITS_PER_BYTESECOND` in creditsWorker.ts, which is not exported
const PICOCREDITS_PER_BYTESECOND = 10n

// Shape of a 'charge' entry in `_private_ownerBalanceHistoryGranular_*`
// (see creditsWorker.ts)
interface ChargeEntry {
  sizeTotal: number
  picocreditAmount: string
  period: string
}

const FREE_ALLOWANCE_BYTES = 1000
const SMALL_ENTITY_SIZE = 400
const LARGE_ENTITY_SIZE = 2500
const LARGE_ENTITY_BILLABLE_SIZE = LARGE_ENTITY_SIZE - FREE_ALLOWANCE_BYTES

const granularHistoryKey = (entity: string) => `_private_ownerBalanceHistoryGranular_${entity}`
const balanceKey = (entity: string) => `_private_ownerPicocreditBalance_${entity}`

const readHistory = async (entity: string): Promise<ChargeEntry[]> => {
  const stored = await sbp('chelonia.db/get', granularHistoryKey(entity), { bypassCache: true })
  return stored ? JSON.parse(stored as string) : []
}

// `worker/computeCredits` fires off `updateCredits` without awaiting it, so
// poll the database until the expected number of history entries exists.
const waitForHistoryLength = async (entity: string, length: number) => {
  for (let i = 0; i < 500; i++) {
    const history = await readHistory(entity)
    if (history.length >= length) return history
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  throw new Error(`Timed out waiting for ${length} history entries for ${entity}`)
}

// Replicates the worker's charge arithmetic (`updateCredits` in
// creditsWorker.ts) from the values recorded in a history entry, so that the
// expected charge is fully determined by the entry itself.
const expectedCharge = (entry: ChargeEntry): string => {
  const [periodStart, periodEnd] = entry.period.split('/')
  const timeElapsed = Date.parse(periodEnd) - Date.parse(periodStart)
  return (BigInt(Math.floor(entry.sizeTotal * timeElapsed / 1000)) * PICOCREDITS_PER_BYTESECOND).toString(10)
}

Deno.test({
  name: 'Credits worker charges only storage in excess of the free allowance',
  async fn (t: Deno.TestContext) {
    await initDB()
    const worker = createWorker(new URL('./creditsWorker.ts', import.meta.url).toString())
    await worker.ready

    const smallEntity = randCID()
    const largeEntity = randCID()

    try {
      await sbp('chelonia.db/set', '_private_freeAllowanceBytes', String(FREE_ALLOWANCE_BYTES))
      await appendToIndexFactory('_private_billable_entities')(smallEntity)
      await appendToIndexFactory('_private_billable_entities')(largeEntity)
      await sbp('chelonia.db/set', `_private_ownerTotalSize_${smallEntity}`, String(SMALL_ENTITY_SIZE))
      await sbp('chelonia.db/set', `_private_ownerTotalSize_${largeEntity}`, String(LARGE_ENTITY_SIZE))

      await t.step('entities within the allowance are recorded but not charged', async () => {
        await worker.rpcSbp('worker/computeCredits')

        const [smallEntry] = await waitForHistoryLength(smallEntity, 1)
        // No time has elapsed since the (implicit) first history entry, so the
        // first cycle records the billable size without charging for it
        assertEquals(smallEntry.sizeTotal, 0)
        assertEquals(smallEntry.picocreditAmount, '0')
        assertEquals(await sbp('chelonia.db/get', balanceKey(smallEntity), { bypassCache: true }), '0')
      })

      await t.step('entities above the allowance are charged for the excess only', async () => {
        const [firstEntry] = await waitForHistoryLength(largeEntity, 1)
        assertEquals(firstEntry.sizeTotal, LARGE_ENTITY_BILLABLE_SIZE)
        assertEquals(firstEntry.picocreditAmount, '0')

        // Give the next cycle some billable time to charge for
        await new Promise(resolve => setTimeout(resolve, 150))
        await worker.rpcSbp('worker/computeCredits')

        const [secondEntry] = await waitForHistoryLength(largeEntity, 2)
        assertEquals(secondEntry.sizeTotal, LARGE_ENTITY_BILLABLE_SIZE)
        // If the full size were charged instead of the excess, this would fail
        assertEquals(secondEntry.picocreditAmount, expectedCharge(secondEntry))
        assertEquals(
          await sbp('chelonia.db/get', balanceKey(largeEntity), { bypassCache: true }),
          `-${secondEntry.picocreditAmount}`
        )
      })

      await t.step('a missing or invalid allowance falls back to charging the full size', async () => {
        await sbp('chelonia.db/set', '_private_freeAllowanceBytes', 'not-a-number')
        await worker.rpcSbp('worker/computeCredits')

        // Every cycle bills every entity: the small entity got entries in the
        // two previous cycles, so wait for the third one here
        const [smallEntry] = await waitForHistoryLength(smallEntity, 3)
        assertEquals(smallEntry.sizeTotal, SMALL_ENTITY_SIZE)
      })
    } finally {
      await closeDB()
      await worker.terminate()
    }
  }
})
