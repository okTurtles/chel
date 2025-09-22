import { sbp } from "~/deps.ts";
import { CREDITS_WORKER_TASK_TIME_INTERVAL as TASK_TIME_INTERVAL } from "./constants.ts";
import { readyQueueName } from "./genericWorker.ts";
const PICOCREDITS_PER_BYTESECOND = BigInt(10);
const GRANULAR_HISTORY_MAX_ENTRIES = 1e3;
const COARSE_HISTORY_MAX_ENTRIES = 1e3;
const GRANULAR_ENTRIES_PER_COARSE_ENTRIES = 288;
const startTime = Date.now();
const updateCredits = async (billableEntity, type, amount) => {
  const granularHistoryKey = `_private_ownerBalanceHistoryGranular_${billableEntity}`;
  await sbp("okTurtles.eventQueue/queueEvent", granularHistoryKey, async () => {
    const now = /* @__PURE__ */ new Date();
    const date = now.toISOString();
    const granularHistoryList = await sbp("chelonia.db/get", granularHistoryKey, { bypassCache: true }) ?? "[]";
    const granularHistory = JSON.parse(granularHistoryList);
    if (granularHistory.length >= GRANULAR_HISTORY_MAX_ENTRIES - 1) {
      granularHistory.splice(GRANULAR_HISTORY_MAX_ENTRIES - 1);
    }
    const previousPcBalance = BigInt(granularHistory[0]?.balancePicocreditAmount || 0);
    if (type === "charge") {
      const previousTime = new Date(granularHistory[0]?.date).getTime() || now.getTime();
      const timeElapsed = Math.max(0, now.getTime() - Math.max(previousTime, startTime));
      const picocreditsUsed = BigInt(Math.floor(amount * timeElapsed / 1e3)) * PICOCREDITS_PER_BYTESECOND;
      const balancePicocreditAmount = (previousPcBalance - picocreditsUsed).toString(10);
      granularHistory.unshift({
        type: "charge",
        date,
        sizeTotal: amount,
        picocreditAmount: picocreditsUsed.toString(10),
        // Period in ISO 8601 format, i.e., `{start}/{end}`
        period: `${new Date(now.getTime() - timeElapsed).toISOString()}/${date}`,
        balancePicocreditAmount
      });
      await sbp("chelonia.db/set", `_private_ownerPicocreditBalance_${billableEntity}`, balancePicocreditAmount);
    } else if (type === "credit") {
      const picocreditsToAdd = BigInt(amount);
      const newBalance = previousPcBalance + picocreditsToAdd;
      const newBalanceStr = newBalance.toString(10);
      const newEntry = {
        type: "credit",
        date,
        picocreditAmount: picocreditsToAdd.toString(10),
        // Credits added
        balancePicocreditAmount: newBalanceStr
      };
      granularHistory.unshift(newEntry);
      await sbp("chelonia.db/set", `_private_ownerPicocreditBalance_${billableEntity}`, newBalanceStr);
    } else {
      console.error(`[creditsWorker] Invalid update type "${type}" for ${billableEntity}`);
      return;
    }
    const lastCoarseSyncIdx = granularHistory.findIndex((value) => {
      return !!value.coarseSyncPoint;
    });
    if (lastCoarseSyncIdx >= GRANULAR_ENTRIES_PER_COARSE_ENTRIES || lastCoarseSyncIdx < 0) {
      const coarseHistoryKey = `_private_ownerBalanceHistoryCoarse_${billableEntity}`;
      granularHistory[0].coarseSyncPoint = true;
      const coarseHistoryList = await sbp("chelonia.db/get", coarseHistoryKey, { bypassCache: true }) ?? "[]";
      const coarseHistory = JSON.parse(coarseHistoryList);
      if (coarseHistory.length >= COARSE_HISTORY_MAX_ENTRIES - 1) {
        coarseHistory.splice(COARSE_HISTORY_MAX_ENTRIES - 1);
      }
      const { periodStart, charges, credits, periodSize, totalPeriodLength } = granularHistory.slice(0, lastCoarseSyncIdx < 0 ? granularHistory.length : lastCoarseSyncIdx).reduce((acc, entry) => {
        if (entry.type === "charge") {
          acc.charges += BigInt(entry.picocreditAmount);
          const [periodStart2, periodEnd] = entry.period.split("/");
          const [periodStartDate, periodEndDate] = [Date.parse(periodStart2), Date.parse(periodEnd)];
          const periodLength = Math.floor(periodEndDate - periodStartDate);
          if (periodLength >= 0) {
            acc.periodSize += entry.sizeTotal * periodLength;
            acc.totalPeriodLength += periodLength;
          }
          acc.periodStart = periodStart2;
        } else if (entry.type === "credit") {
          acc.credits += BigInt(entry.picocreditAmount);
        } else {
          throw new Error("Invalid entry type: " + entry.type);
        }
        return acc;
      }, { charges: BigInt(0), credits: BigInt(0), periodStart: date, periodSize: 0, totalPeriodLength: 0 });
      coarseHistory.unshift({
        type: "aggregate",
        date,
        sizeTotal: totalPeriodLength > 0 ? Math.floor(periodSize / totalPeriodLength) : 0,
        chargesPicocreditAmount: charges.toString(10),
        creditsPicocreditAmount: credits.toString(10),
        period: `${periodStart}/${date}`,
        balancePicocreditAmount: granularHistory[0].balancePicocreditAmount
      });
      await sbp("chelonia.db/set", coarseHistoryKey, JSON.stringify(coarseHistory));
    }
    await sbp("chelonia.db/set", granularHistoryKey, JSON.stringify(granularHistory));
  });
};
sbp("okTurtles.eventQueue/queueEvent", readyQueueName, () => setTimeout(sbp, TASK_TIME_INTERVAL, "worker/computeCredits"));
sbp("sbp/selectors/register", {
  "worker/computeCredits": async () => {
    const billableEntities = await sbp("chelonia.db/get", "_private_billable_entities", { bypassCache: true });
    billableEntities && await Promise.all(billableEntities.split("\0").map(async (billableEntity) => {
      const sizeString = await sbp("chelonia.db/get", `_private_ownerTotalSize_${billableEntity}`, { bypassCache: true });
      const size = parseInt(sizeString, 10);
      if (isNaN(size)) {
        console.warn(`[creditsWorker] Invalid size fetched for entity ${billableEntity}: ${sizeString}. Skipping charge.`);
        return;
      }
      updateCredits(billableEntity, "charge", size).catch((e) => {
        console.error(e, "[creditsWorker] Error computing balance", billableEntity);
      });
    }));
    setTimeout(sbp, TASK_TIME_INTERVAL, "worker/computeCredits");
  }
});
