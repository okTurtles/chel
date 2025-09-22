import { sbp } from "~/deps.ts";
import { OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL as TASK_TIME_INTERVAL } from "./constants.ts";
import { appendToIndexFactory, lookupUltimateOwner, removeFromIndexFactory, updateSize } from "./database.ts";
import { readyQueueName } from "./genericWorker.ts";
const updatedSizeList = /* @__PURE__ */ new Set();
const updatedSizeMap = /* @__PURE__ */ new Map();
const cachedUltimateOwnerMap = /* @__PURE__ */ new Map();
const fastBase58Hash = (cid) => {
  const len = cid.length;
  const a = cid.codePointAt(len - 2) || 0;
  const b = cid.codePointAt(len - 1) || 0;
  return a * 19 + (b + 19) & 255;
};
const addToTempIndex = (cid) => {
  return appendToIndexFactory(`_private_pendingIdx_ownerTotalSize_${fastBase58Hash(cid)}`)(cid);
};
const removeFromTempIndex = (cids) => {
  const cidsByBucket = cids.reduce((acc, cv) => {
    const bucket = fastBase58Hash(cv);
    const ownedResourcesSet = acc.get(bucket);
    if (ownedResourcesSet) {
      ownedResourcesSet.add(cv);
    } else {
      acc.set(bucket, /* @__PURE__ */ new Set([cv]));
    }
    return acc;
  }, /* @__PURE__ */ new Map());
  return Promise.all([...cidsByBucket].map(([bucket, cids2]) => {
    return removeFromIndexFactory(`_private_pendingIdx_ownerTotalSize_${bucket}`)([...cids2]);
  }));
};
sbp("okTurtles.eventQueue/queueEvent", readyQueueName, async () => {
  for (let i = 0; i < 256; i++) {
    const data = await sbp("chelonia.db/get", `_private_pendingIdx_ownerTotalSize_${i}`, { bypassCache: true });
    if (data) {
      data.split("\0").forEach((cid) => {
        updatedSizeList.add(cid);
      });
    }
  }
  console.info(`[ownerSizeTotalWorker] Loaded ${updatedSizeList.size} CIDs for full recalculation.`);
  if (updatedSizeList.size) {
    sbp("backend/server/computeSizeTask");
  }
  setTimeout(sbp, TASK_TIME_INTERVAL, "backend/server/computeSizeTaskDeltas");
});
sbp("sbp/selectors/register", {
  /**
   * Selector: 'worker/updateSizeSideEffects'
   * Handles incoming size update events for a specific resource.
   * It adds the CID to the temporary persistent index (if not already processed
   * or pending full recalc) and updates the in-memory delta map (`updatedSizeMap`).
   *
   * IMPORTANT: This should only be called for keys where this is relevant,
   * such as `_private_size_` keys.
   */
  "worker/updateSizeSideEffects": async ({ resourceID, size, ultimateOwnerID }) => {
    if (updatedSizeList.has(resourceID)) return;
    const current = updatedSizeMap.get(resourceID);
    if (current === void 0) {
      try {
        await addToTempIndex(ultimateOwnerID || resourceID);
        updatedSizeMap.set(resourceID, size);
      } catch (e) {
        console.error(e, `[ownerSizeTotalWorker] Error adding ${resourceID} to temp index:`);
      }
    } else {
      updatedSizeMap.set(resourceID, current + size);
    }
    if (ultimateOwnerID) {
      cachedUltimateOwnerMap.set(resourceID, ultimateOwnerID);
    }
  },
  /**
   * Selector: 'backend/server/computeSizeTaskDeltas'
   * Periodically executed task (via setTimeout) to process accumulated
   * size _deltas_.
   * Calculates the change in total size for ultimate owners based on the deltas
   * stored in `updatedSizeMap` and updates the database.
   */
  "backend/server/computeSizeTaskDeltas": async function() {
    const deltaEntries = Array.from(updatedSizeMap);
    updatedSizeMap.clear();
    const ultimateOwners = /* @__PURE__ */ new Map();
    const orphansSet = /* @__PURE__ */ new Set();
    await Promise.all(deltaEntries.map(async ([contractID, delta]) => {
      const cachedOwnerID = cachedUltimateOwnerMap.get(contractID);
      const ownerID = cachedOwnerID || await lookupUltimateOwner(contractID);
      if (!cachedOwnerID && ownerID === contractID) {
        if (!await sbp("chelonia.db/get", contractID)) {
          const current = updatedSizeMap.get(contractID) ?? 0;
          updatedSizeMap.set(contractID, current + delta);
          orphansSet.add(contractID);
          return;
        }
      }
      cachedUltimateOwnerMap.delete(contractID);
      const [val, ownedResourcesSet] = ultimateOwners.get(ownerID) || [0, /* @__PURE__ */ new Set([ownerID])];
      ownedResourcesSet.add(contractID);
      ultimateOwners.set(ownerID, [val + delta, ownedResourcesSet]);
    }));
    await Promise.all(Array.from(ultimateOwners).map(async ([id, [totalDelta, contributingResources]]) => {
      await updateSize(id, `_private_ownerTotalSize_${id}`, totalDelta);
      await removeFromTempIndex(Array.from(contributingResources));
    }));
    await removeFromTempIndex(Array.from(orphansSet));
    setTimeout(sbp, TASK_TIME_INTERVAL, "backend/server/computeSizeTaskDeltas");
  },
  /**
   * Selector: 'backend/server/computeSizeTask'
   * Task to perform a full recalculation of total owner sizes.
   * Triggered on startup if `updatedSizeList` is populated (from
   * persistent index).
   * Processes resource IDs from `updatedSizeList`.
   */
  "backend/server/computeSizeTask": async function() {
    const start = performance.now();
    const resourcesToRecalculate = Array.from(updatedSizeList);
    const ultimateOwners = /* @__PURE__ */ new Map();
    await Promise.all(resourcesToRecalculate.map(async (contractID) => {
      const ownerID = await lookupUltimateOwner(contractID);
      const resources = ultimateOwners.get(ownerID);
      if (resources) {
        resources.add(contractID);
      } else {
        ultimateOwners.set(ownerID, /* @__PURE__ */ new Set([contractID]));
      }
    }));
    await Promise.all(Array.from(ultimateOwners).map(async ([ownerID, contractIDs]) => {
      const resources = await sbp("chelonia.db/get", `_private_resources_${ownerID}`);
      const indirectResources = resources ? await sbp("chelonia.db/get", `_private_indirectResources_${ownerID}`) : void 0;
      const allSubresources = Array.from(/* @__PURE__ */ new Set([
        ownerID,
        ...resources ? resources.split("\0") : [],
        ...indirectResources ? indirectResources.split("\0") : []
      ]));
      const totalSize = (await Promise.all(allSubresources.map((id) => {
        return sbp("chelonia.db/get", `_private_size_${id}`);
      }))).reduce((acc, cv) => {
        if (cv) {
          const parsed = parseInt(cv, 10);
          if (parsed) return parsed + acc;
        }
        return acc;
      }, 0);
      await sbp("okTurtles.eventQueue/queueEvent", `_private_ownerTotalSize_${ownerID}`, async () => {
        allSubresources.forEach((id) => {
          updatedSizeList.delete(id);
          if (updatedSizeMap.delete(id)) {
            contractIDs.add(id);
          }
        });
        await sbp("chelonia.db/set", `_private_ownerTotalSize_${ownerID}`, totalSize.toString(10));
        await removeFromTempIndex(Array.from(contractIDs).filter((id) => {
          return !updatedSizeMap.has(id);
        }));
      });
    }));
    console.info(`[ownerSizeTotalWorker] Computed size for ${updatedSizeList.size} CIDs in ${((performance.now() - start) / 1e3).toFixed(2)} seconds.`);
  }
});
