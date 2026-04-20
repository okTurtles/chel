// deno-lint-ignore-file no-this-alias
/* eslint-disable @typescript-eslint/no-this-alias */
import { SPMessage } from 'npm:@chelonia/lib/SPMessage'
import 'npm:@chelonia/lib/chelonia'
import { multicodes, parseCID } from 'npm:@chelonia/lib/functions'
import 'npm:@chelonia/lib/persistent-actions'
import { SERVER } from 'npm:@chelonia/lib/presets'
import sbp from 'npm:@sbp/sbp'
import chalk from 'npm:chalk'
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { createAdaptorServer } from 'npm:@hono/node-server'
import type { Server } from 'node:http'
import type { ImportMeta } from '../types/build.d.ts'
import createWorker from './createWorker.ts'
import { join } from 'node:path'
import process from 'node:process'
import { getClientIP, registerRoutes } from './routes.ts'
import { CREDITS_WORKER_TASK_TIME_INTERVAL, OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL } from './constants.ts'
import { KEYOP_SEGMENT_LENGTH, appendToIndexFactory, closeDB, initDB, lookupUltimateOwner, removeFromIndexFactory, updateSize } from './database.ts'
import { BackendErrorBadData, BackendErrorGone, BackendErrorNotFound } from './errors.ts'
import { SERVER_RUNNING } from './events.ts'
import { PUBSUB_INSTANCE, SERVER_INSTANCE } from './instance-keys.ts'
import {
  NOTIFICATION_TYPE,
  REQUEST_TYPE,
  createKvMessage,
  createMessage,
  createNotification,
  createPushErrorResponse,
  createServer,
  type WSS
} from './pubsub.ts'
import { addChannelToSubscription, deleteChannelFromSubscription, postEvent, pushServerActionhandlers, subscriptionInfoWrapper } from './push.ts'
import { pathToFileURL } from 'node:url'
// @deno-types="npm:@types/nconf"
import nconf from 'npm:nconf'

// ============================================================================
// Module-scope state for the current server run
// ============================================================================
let currentApp: Hono | null = null
let currentHttpServer: Server | null = null
let currentOwnerSizeTotalWorker: ReturnType<typeof createWorker> | undefined = undefined
let currentCreditsWorker: ReturnType<typeof createWorker> | undefined = undefined
let currentManifest: Record<string, unknown> | undefined = undefined
let currentPushHeartbeatIntervalID: ReturnType<typeof setInterval> | undefined = undefined
let isStopping = false

// Helper for appending to orphaned names index (stateless)
const appendToOrphanedNamesIndex = appendToIndexFactory('_private_orphaned_names_index')

// ============================================================================
// SBP selector registration (once per process)
// ============================================================================
let serverSelectorsInstalled = false

function installServerSelectorsOnce (): void {
  if (serverSelectorsInstalled) return
  serverSelectorsInstalled = true

  sbp('sbp/selectors/register', {
    'backend/server/persistState': async function (deserializedHEAD: unknown) {
      const contractID = (deserializedHEAD as Record<string, unknown>).contractID
      const cheloniaState = sbp('chelonia/rootState')
      // If the contract has been removed or the height hasn't been updated,
      // there's nothing to persist.
      // If `!cheloniaState.contracts[contractID]`, the contract's been removed
      // and therefore we shouldn't save it.
      // If `cheloniaState.contracts[contractID].height < deserializedHEAD.head.height`,
      // it means that the message wasn't processed (we'd expect the height to
      // be `>=` than the message's height if so), and therefore we also shouldn't
      // save it.
      if (!cheloniaState.contracts[contractID as string] || cheloniaState.contracts[contractID as string].height < (((deserializedHEAD as Record<string, unknown>).head as Record<string, unknown>).height as number)) {
        return
      }
      // If the current HEAD is not what we expect, don't save (the state could
      // have been updated by a later message). This ensures that we save the
      // latest state and also reduces the number of write operations
      if (cheloniaState.contracts[contractID as string].HEAD === (deserializedHEAD as Record<string, unknown>).hash) {
        // Extract the parts of the state relevant to this contract
        const state = {
          contractState: (cheloniaState as Record<string, unknown>)[contractID as string],
          cheloniaContractInfo: cheloniaState.contracts[contractID as string]
        }
        // Save the state under a 'contract partition' key, so that updating a
        // contract doesn't require saving the entire state.
        // Although it's not important for the server right now, this will fail to
        // persist changes to the state for other contracts.
        // For example, when watching foreign keys, this happens: whenever a
        // foreign key for contract A is added to contract B, the private state
        // for both contract A and B is updated (when both contracts are being
        // monitored by Chelonia). However, here in this case, the updated state
        // for contract A will not be saved immediately here, and it will only be
        // saved if some other event happens later on contract A.
        // TODO: If, in the future, processing a message affects other contracts
        // in a way that is meaningful to the server, there'll need to be a way
        // to detect these changes as well. One example could be, expanding on the
        // previous scenario, if we decide that the server should enforce key
        // rotations, so that updating a foreign key 'locks' that contract until
        // the foreign key is rotated or deleted. For this to work reliably, we'd
        // need to ensure that the state for both contract B and contract A are
        // saved when the foreign key gets added to contract B.
        await sbp('chelonia.db/set', '_private_cheloniaState_' + contractID, JSON.stringify(state))
      }
      // If this is a new contract, we also need to add it to the index, which
      // is used when starting up the server to know which keys to fetch.
      // In the future, consider having a multi-level index, since the index can
      // get pretty large.
      if (contractID === (deserializedHEAD as Record<string, unknown>).hash) {
        // We want to ensure that the index is updated atomically (i.e., if there
        // are multiple new contracts, all of them should be added), so a queue
        // is needed for the load & store operation.
        await sbp('backend/server/appendToContractIndex', contractID)
      }
      // If this was a key op, add it to a keyop index. To prevent the index from
      // growing too large, the index is segmented for every KEYOP_SEGMENT_LENGTH
      // height values
      if (cheloniaState.contracts[contractID as string].previousKeyOp === (deserializedHEAD as Record<string, unknown>).hash) {
        await appendToIndexFactory(`_private_keyop_idx_${contractID}_${(((deserializedHEAD as Record<string, unknown>).head as Record<string, unknown>).height as number) - (((deserializedHEAD as Record<string, unknown>).head as Record<string, unknown>).height as number) % KEYOP_SEGMENT_LENGTH}`)(String(((deserializedHEAD as Record<string, unknown>).head as Record<string, unknown>).height))
      }
    },
    'backend/server/appendToContractIndex': appendToIndexFactory('_private_cheloniaState_index'),
    'backend/server/broadcastKV': async function (contractID: string, key: string, entry: string) {
      const pubsub = sbp('okTurtles.data/get', PUBSUB_INSTANCE) as WSS
      const pubsubMessage = createKvMessage(contractID, key, entry)
      const subscribers = pubsub.enumerateSubscribers(contractID, key)
      console.debug(chalk.blue.bold(`[pubsub] Broadcasting KV change on ${contractID} to key ${key}`))
      await pubsub.broadcast(pubsubMessage, { to: subscribers, wsOnly: true })
    },
    'backend/server/broadcastEntry': async function (deserializedHEAD: ReturnType<typeof SPMessage.deserializeHEAD>, entry: string) {
      const pubsub = sbp('okTurtles.data/get', PUBSUB_INSTANCE) as WSS
      const contractID = deserializedHEAD.contractID
      const contractType = sbp('chelonia/rootState').contracts[contractID as string]?.type
      const pubsubMessage = createMessage(NOTIFICATION_TYPE.ENTRY, entry, { contractID, contractType })
      const subscribers = pubsub.enumerateSubscribers(contractID)
      console.debug(chalk.blue.bold(`[pubsub] Broadcasting ${deserializedHEAD.description()}`))
      await pubsub.broadcast(pubsubMessage, { to: subscribers })
    },
    'backend/server/broadcastDeletion': async function (contractID: string) {
      const pubsub = sbp('okTurtles.data/get', PUBSUB_INSTANCE) as WSS
      const pubsubMessage = createMessage(NOTIFICATION_TYPE.DELETION, contractID)
      const subscribers = pubsub.enumerateSubscribers(contractID)
      console.debug(chalk.blue.bold(`[pubsub] Broadcasting deletion of ${contractID}`))
      await pubsub.broadcast(pubsubMessage, { to: subscribers })
    },
    'backend/server/handleEntry': async function (deserializedHEAD: ReturnType<typeof SPMessage.deserializeHEAD>, entry: string) {
      const contractID = deserializedHEAD.contractID
      if (deserializedHEAD.head.op === SPMessage.OP_CONTRACT) {
        sbp('okTurtles.data/get', PUBSUB_INSTANCE).channels.add(contractID)
      }
      await sbp('chelonia/private/in/enqueueHandleEvent', contractID, entry)
      // Persist the Chelonia state after processing a message
      await sbp('backend/server/persistState', deserializedHEAD, entry)
      // No await on broadcast for faster responses
      sbp('backend/server/broadcastEntry', deserializedHEAD, entry).catch((e: unknown) => console.error(e, 'Error broadcasting entry', contractID, deserializedHEAD.hash))
    },
    'backend/server/saveOwner': async function (ownerID: string, resourceID: string) {
      // Store the owner for the current resource
      // Use a queue to check that the owner exists, preventing the creation of
      // orphaned resources (e.g., because the owner was just deleted)
      await sbp('chelonia/queueInvocation', ownerID, async () => {
        const owner = await sbp('chelonia.db/get', ownerID)
        if (!owner) {
          throw new Error('Owner resource does not exist')
        }
        await sbp('chelonia.db/set', `_private_owner_${resourceID}`, ownerID)
        const resourcesKey = `_private_resources_${ownerID}`
        // Store the resource in the resource index key
        // This is done in a queue to handle several simultaneous requests
        // reading and writing to the same key
        await appendToIndexFactory(resourcesKey)(resourceID)
        // Done as a persistent action to return quickly. If one of the owners
        // up the chain has many resources, the operation could take a while.
        sbp('chelonia.persistentActions/enqueue', ['backend/server/addToIndirectResourcesIndex', resourceID])
      })
    },
    'backend/server/addToIndirectResourcesIndex': async function (resourceID: string) {
      const ownerID = await sbp('chelonia.db/get', `_private_owner_${resourceID}`)
      let indirectOwnerID = ownerID
      // If the owner of the owner doesn't exist, there are no indirect resources.
      while ((indirectOwnerID = await sbp('chelonia.db/get', `_private_owner_${indirectOwnerID}`))) {
        await appendToIndexFactory(`_private_indirectResources_${indirectOwnerID}`)(resourceID)
      }
    },
    'backend/server/removeFromIndirectResourcesIndex': async function (resourceID: string) {
      const ownerID = await sbp('chelonia.db/get', `_private_owner_${resourceID}`)
      const resources = await sbp('chelonia.db/get', `_private_resources_${resourceID}`)
      const indirectResources = resources ? await sbp('chelonia.db/get', `_private_indirectResources_${resourceID}`) : undefined
      const allSubresources = [
        resourceID,
        ...(resources ? resources.split('\x00') : []),
        ...(indirectResources ? indirectResources.split('\x00') : [])
      ]
      let indirectOwnerID = ownerID
      while ((indirectOwnerID = await sbp('chelonia.db/get', `_private_owner_${indirectOwnerID}`))) {
        await removeFromIndexFactory(`_private_indirectResources_${indirectOwnerID}`)(allSubresources)
      }
    },
    'backend/server/registerBillableEntity': appendToIndexFactory('_private_billable_entities'),
    'backend/server/updateSize': function (resourceID: string, size: number, ultimateOwnerID: string | null | undefined) {
      const sizeKey = `_private_size_${resourceID}`
      return updateSize(resourceID, sizeKey, size).then(() => {
        // Because this is relevant key for size accounting, call updateSizeSideEffects
        return currentOwnerSizeTotalWorker?.rpcSbp('worker/updateSizeSideEffects', { resourceID, size, ultimateOwnerID })
      })
    },
    'backend/server/updateContractFilesTotalSize': function (resourceID: string, size: number) {
      const sizeKey = `_private_contractFilesTotalSize_${resourceID}`
      return updateSize(resourceID, sizeKey, size, true)
    },
    'backend/server/stop': async function () {
      await stopServer()
    },
    async 'backend/deleteFile' (cid: string, ultimateOwnerID: string | null | undefined, skipIfDeleted: boolean | null | undefined): Promise<void> {
      const owner = await sbp('chelonia.db/get', `_private_owner_${cid}`)
      const rawManifest = await sbp('chelonia.db/get', cid)
      const size = await sbp('chelonia.db/get', `_private_size_${cid}`)
      if (owner && !ultimateOwnerID) ultimateOwnerID = await lookupUltimateOwner(owner)
      // If running in a persistent queue, already deleted contract should not
      // result in an error, because exceptions will result in the task being
      // re-attempted
      if (rawManifest === '') { if (skipIfDeleted) return; throw new BackendErrorGone() }
      if (!rawManifest) { if (skipIfDeleted) return; throw new BackendErrorNotFound() }

      try {
        const manifest = JSON.parse(rawManifest)
        if (!manifest || typeof manifest !== 'object') throw new BackendErrorBadData('manifest format is invalid')
        if (manifest.version !== '1.0.0') throw new BackendErrorBadData('unsupported manifest version')
        if (!Array.isArray(manifest.chunks) || !manifest.chunks.length) throw new BackendErrorBadData('missing chunks')
        // Delete all chunks
        await Promise.all(manifest.chunks.map(([, cid]: [unknown, string]) => sbp('chelonia.db/delete', cid)))
      } catch (e: unknown) {
        console.warn(e, `Error parsing manifest for ${cid}. It's probably not a file manifest.`)
        throw new BackendErrorNotFound()
      }
      // The keys to be deleted are not read from or updated, so they can be deleted
      // without using a queue
      const resourcesKey = `_private_resources_${owner}`
      await removeFromIndexFactory(resourcesKey)(cid)
      await sbp('backend/server/removeFromIndirectResourcesIndex', cid)

      await sbp('chelonia.db/delete', `_private_owner_${cid}`)
      await sbp('chelonia.db/delete', `_private_size_${cid}`)
      await sbp('chelonia.db/delete', `_private_deletionTokenDgst_${cid}`)

      await sbp('chelonia.db/set', cid, '')
      await sbp('backend/server/updateContractFilesTotalSize', owner, -Number(size))

      if (ultimateOwnerID && size) {
        await currentOwnerSizeTotalWorker?.rpcSbp('worker/updateSizeSideEffects', { resourceID: cid, size: -parseInt(size), ultimateOwnerID })
      }
    },
    async 'backend/deleteContract' (cid: string, ultimateOwnerID?: string | null, skipIfDeleted?: boolean | null): Promise<void> {
      let contractsPendingDeletion = sbp('okTurtles.data/get', 'contractsPendingDeletion')
      if (!contractsPendingDeletion) {
        contractsPendingDeletion = new Set()
        sbp('okTurtles.data/set', 'contractsPendingDeletion', contractsPendingDeletion)
      }
      // Avoid deadlocks due to loops
      if (contractsPendingDeletion.has(cid)) {
        return
      }
      contractsPendingDeletion.add(cid)

      return await sbp('chelonia/queueInvocation', cid, async () => {
        const owner = await sbp('chelonia.db/get', `_private_owner_${cid}`)
        if (!ultimateOwnerID) ultimateOwnerID = await lookupUltimateOwner(cid)
        const rawManifest = await sbp('chelonia.db/get', cid)
        const size = await sbp('chelonia.db/get', `_private_size_${cid}`)
        // If running in a persistent queue, already deleted contract should not
        // result in an error, because exceptions will result in the task being
        // re-attempted
        if (rawManifest === '') { if (skipIfDeleted) return; throw new BackendErrorGone() }
        if (!rawManifest) { if (skipIfDeleted) return; throw new BackendErrorNotFound() }

        // Cascade delete all resources owned by this contract, such as files
        // (attachments) and other contracts. Removing a single contract could
        // therefore result in a large number of contracts being deleted. For
        // example, in Group Income, deleting an identity contract will delete:
        //   - All groups created by that contract
        //       - This includes files like the group avatar
        //       - And also all chatrooms
        //           - And all attachments in chatrooms
        //   - All DMs created by that contract
        //       - And all attachments
        const resourcesKey = `_private_resources_${cid}`
        const resources = await sbp('chelonia.db/get', resourcesKey)
        if (resources) {
          await Promise.allSettled(resources.split('\x00').map((resourceCid: string) => {
            const parsed = parseCID(resourceCid)

            if (parsed.code === multicodes.SHELTER_CONTRACT_DATA) {
              return sbp('chelonia.persistentActions/enqueue', ['backend/deleteContract', resourceCid, ultimateOwnerID, true])
            } else if (parsed.code === multicodes.SHELTER_FILE_MANIFEST) {
              return sbp('chelonia.persistentActions/enqueue', ['backend/deleteFile', resourceCid, ultimateOwnerID, true])
            } else {
              console.warn({ cid, resourceCid, code: parsed.code }, 'Resource should be deleted but it is of an unknown type')
            }

            return undefined
          }))
        }
        await sbp('chelonia.db/delete', resourcesKey)

        // Next, loop through all the events, except the very first one,
        // in the contract and delete them, starting with the most recent ones.
        // If the deletion process is interrupted, parts of the contract will
        // still be able to be synced, but won't be to write to it (due to
        // latestHEADinfo not being deleted).
        const latestHEADinfo = await sbp('chelonia/db/latestHEADinfo', cid)
        if (latestHEADinfo) {
          for (let i = latestHEADinfo.height; i > 0; i--) {
            const eventKey = `_private_hidx=${cid}#${i}`
            const event = await sbp('chelonia.db/get', eventKey)
            if (event) {
              await sbp('chelonia.db/delete', JSON.parse(event).hash)
              await sbp('chelonia.db/delete', eventKey)
            }
            if (i % KEYOP_SEGMENT_LENGTH === 0) {
              await sbp('chelonia.db/delete', `_private_keyop_idx_${cid}_${i}`)
            }
          }
          await sbp('chelonia/db/deleteLatestHEADinfo', cid)
        }

        // Then, delete all KV-store values associated with this contract
        const kvIndexKey = `_private_kvIdx_${cid}`
        const kvKeys = await sbp('chelonia.db/get', kvIndexKey)
        if (kvKeys) {
          await Promise.all(kvKeys.split('\x00').map((key: string) => {
            return sbp('chelonia.db/delete', `_private_kv_${cid}_${key}`)
          }))
        }
        await sbp('chelonia.db/delete', kvIndexKey)
        await sbp('backend/server/removeFromIndirectResourcesIndex', cid)
        await sbp('chelonia.db/delete', `_private_indirectResources_${cid}`)

        await sbp('chelonia.db/get', `_private_cid2name_${cid}`).then((name: unknown) => {
          if (!name) return
          return Promise.all([
            sbp('chelonia.db/delete', `_private_cid2name_${cid}`),
            appendToOrphanedNamesIndex(name as string)
          ])
        })
        await sbp('chelonia.db/delete', `_private_rid_${cid}`)
        await sbp('chelonia.db/delete', `_private_owner_${cid}`)
        await sbp('chelonia.db/delete', `_private_size_${cid}`)
        await sbp('chelonia.db/delete', `_private_contractFilesTotalSize_${cid}`)
        await sbp('chelonia.db/delete', `_private_deletionTokenDgst_${cid}`)
        await removeFromIndexFactory(`_private_resources_${owner}`)(cid)

        // Delete the first event and its associated keys. These were not deleted
        // in the loop above that deletes events one by one.
        await sbp('chelonia.db/delete', `_private_hidx=${cid}#0`)
        await sbp('chelonia.db/delete', `_private_keyop_idx_${cid}_0`)
        await sbp('chelonia.db/set', cid, '')
        sbp('chelonia/private/removeImmediately', cid)

        if (size) {
          await currentOwnerSizeTotalWorker?.rpcSbp('worker/updateSizeSideEffects', { resourceID: cid, size: -parseInt(size), ultimateOwnerID })
        }

        await sbp('chelonia.db/delete', `_private_cheloniaState_${cid}`)
        await removeFromIndexFactory('_private_cheloniaState_index')(cid)
        // Note: `creditsWorker.js` could be updated to do this instead
        await removeFromIndexFactory('_private_billable_entities')(cid)
        sbp('backend/server/broadcastDeletion', cid).catch((e: unknown) => {
          console.error(e, 'Error broadcasting contract deletion', cid)
        })
      }).finally(() => {
        contractsPendingDeletion.delete(cid)
      }).catch((e: unknown) => {
        console.error(e, 'Error in contract deletion cleanup')
        throw e
      })
    }
  })
}

// ============================================================================
// Exported server lifecycle functions
// ============================================================================

export async function startServer (): Promise<{ uri: string }> {
  // Read configuration from nconf
  const appDir = nconf.get('server:appDir') || process.cwd()
  const ARCHIVE_MODE = nconf.get('server:archiveMode')
  const host = nconf.get('server:host') || '0.0.0.0'
  const port = nconf.get('server:port') ?? 8000

  // Validate worker intervals
  if (CREDITS_WORKER_TASK_TIME_INTERVAL && OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL > CREDITS_WORKER_TASK_TIME_INTERVAL) {
    console.error('The size calculation worker must run more frequently than the credits worker for accurate billing')
    throw new Error('The size calculation worker must run more frequently than the credits worker for accurate billing')
  }

  // Load chelonia.json manifest
  try {
    currentManifest = (await import(pathToFileURL(join(appDir, 'chelonia.json')).toString(), {
      with: { type: 'json' }
    })).default
  } catch {
    console.warn('`chelonia.json` unparsable or not found. Version information will be unavailable.')
  }

  // Initialize workers for size calculation and credits processing
  currentOwnerSizeTotalWorker = ARCHIVE_MODE || !OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL
    ? undefined
    : createWorker((import.meta as ImportMeta).ownerSizeTotalWorker || './ownerSizeTotalWorker.ts')
  currentCreditsWorker = ARCHIVE_MODE || !CREDITS_WORKER_TASK_TIME_INTERVAL
    ? undefined
    : createWorker((import.meta as ImportMeta).creditsWorker || './creditsWorker.ts')

  // Create Hono app
  currentApp = new Hono()

  // Global middleware: CORS
  currentApp.use('*', cors({ origin: '*' }))

  // Global middleware: X-Frame-Options on every response
  currentApp.use('*', async (c, next) => {
    await next()
    c.header('X-Frame-Options', 'DENY')
  })

  // Dev logging middleware
  if (process.env.NODE_ENV === 'development' && !process.env.CI) {
    currentApp.use('*', async (c, next) => {
      await next()
      const ip = getClientIP(c) || 'unknown'
      console.debug(chalk`{grey ${ip}: ${c.req.method} ${c.req.path} --> ${c.res.status}}`)
    })
  }

  // Create the Node http.Server (without listening yet) via @hono/node-server
  currentHttpServer = createAdaptorServer({ fetch: currentApp.fetch }) as Server

  // Install SBP selectors
  installServerSelectorsOnce()

  // Set SERVER_INSTANCE so routes.ts can access it
  sbp('okTurtles.data/set', SERVER_INSTANCE, currentApp)

  // Create pubsub server and set PUBSUB_INSTANCE
  sbp('okTurtles.data/set', PUBSUB_INSTANCE, createServer(currentHttpServer, {
    serverHandlers: {
      connection (socket) {
        const manifest = currentManifest
        const appVersion = typeof manifest?.appVersion === 'string' ? manifest.appVersion : null
        const contracts = manifest?.contracts as Record<string, { version: string }> | undefined
        const versionInfo = {
          appVersion,
          contractsVersion: contracts ? Object.fromEntries(
            Object.entries(contracts)
              .map(([k, v]) => [k, v.version])
          ) : null
        }
        socket.send(createNotification(NOTIFICATION_TYPE.VERSION_INFO, versionInfo))
      }
    },
    socketHandlers: {
      // The `close()` handler signals the server that the WS has been closed and
      // that subsequent messages to subscribed channels should now be sent to its
      // associated web push subscription, if it exists.
      close () {
        const socket = this
        const { server } = this
        const subscriptionId = socket.pushSubscriptionId
        if (!subscriptionId) return
        if (!server.pushSubscriptions[subscriptionId]) return
        server.pushSubscriptions[subscriptionId].sockets.delete(socket)
        delete socket.pushSubscriptionId

        if (server.pushSubscriptions[subscriptionId].sockets.size === 0) {
          server.pushSubscriptions[subscriptionId].subscriptions.forEach((channelID) => {
            if (!server.subscribersByChannelID[channelID]) {
              server.subscribersByChannelID[channelID] = new Set()
            }
            server.subscribersByChannelID[channelID].add(server.pushSubscriptions[subscriptionId])
          })
        }
      }
    },
    messageHandlers: {
      [REQUEST_TYPE.PUSH_ACTION]: async function ({ data }) {
        const socket = this
        const { action, payload } = data

        if (!action) {
          socket.send(createPushErrorResponse({ message: '\'action\' field is required' }))
        }

        const handler = pushServerActionhandlers[action as keyof typeof pushServerActionhandlers]

        if (handler) {
          try {
            await (handler as (this: typeof socket, payload: unknown) => Promise<void>).call(socket, payload)
          } catch (error) {
            const message = (error as Error)?.message || `push server failed to perform [${action}] action`
            console.warn(error, `[${socket.ip}] Action '${action}' for '${REQUEST_TYPE.PUSH_ACTION}' handler failed: ${message}`)
            socket.send(createPushErrorResponse({ actionType: action, message: message }))
          }
        } else {
          socket.send(createPushErrorResponse({ message: `No handler for the '${action}' action` }))
        }
      },
      // This handler adds subscribed channels to the web push subscription
      // associated with the WS, so that when the WS is closed we can continue
      // sending messages as web push notifications.
      [NOTIFICATION_TYPE.SUB] ({ channelID }) {
        const socket = this
        const { server } = this
        if (!socket.pushSubscriptionId) return
        if (!server.pushSubscriptions[socket.pushSubscriptionId]) {
          delete socket.pushSubscriptionId
          return
        }

        addChannelToSubscription(server, socket.pushSubscriptionId, channelID)
      },
      // This handler removes subscribed channels from the web push subscription
      // associated with the WS, so that when the WS is closed we don't send
      // messages as web push notifications.
      [NOTIFICATION_TYPE.UNSUB] ({ channelID }) {
        const socket = this
        const { server } = this
        if (!socket.pushSubscriptionId) return
        if (!server.pushSubscriptions[socket.pushSubscriptionId]) {
          delete socket.pushSubscriptionId
          return
        }

        deleteChannelFromSubscription(server, socket.pushSubscriptionId, channelID)
      }
    }
  }))

  // Initialize database
  await initDB()

  // Wait for workers to be ready
  await currentOwnerSizeTotalWorker?.ready
  await currentCreditsWorker?.ready

  // Configure Chelonia
  await sbp('chelonia/configure', SERVER)
  sbp('chelonia.persistentActions/configure', {
    databaseKey: '_private_persistent_actions'
  })

  // Load the saved Chelonia state
  // First, get the contract index
  const savedStateIndex = await sbp('chelonia.db/get', '_private_cheloniaState_index')
  if (savedStateIndex) {
    // Now, we contract the contract state by reading each contract state
    // partition
    const recoveredState = Object.create(null)
    recoveredState.contracts = Object.create(null)
    const channels = sbp('okTurtles.data/get', PUBSUB_INSTANCE).channels
    await Promise.all(savedStateIndex.split('\x00').map(async (contractID: string) => {
      const cpSerialized = await sbp('chelonia.db/get', `_private_cheloniaState_${contractID}`)
      if (!cpSerialized) {
        console.warn(`[server] missing state for contractID ${contractID} - skipping setup for this contract`)
        return
      }
      const cp = JSON.parse(cpSerialized)
      recoveredState[contractID] = cp.contractState
      recoveredState.contracts[contractID] = cp.cheloniaContractInfo
      // Add existing contract IDs to the list of channels
      channels.add(contractID)
    }))
    Object.assign(sbp('chelonia/rootState'), recoveredState)
  }

  // Then, load push subscriptions
  const savedWebPushIndex = await sbp('chelonia.db/get', '_private_webpush_index')
  if (savedWebPushIndex) {
    const { pushSubscriptions, subscribersByChannelID } = sbp('okTurtles.data/get', PUBSUB_INSTANCE)
    await Promise.all(savedWebPushIndex.split('\x00').map(async (subscriptionId: string) => {
      const subscriptionSerialized = await sbp('chelonia.db/get', `_private_webpush_${subscriptionId}`)
      if (!subscriptionSerialized) {
        console.warn(`[server] missing state for subscriptionId '${subscriptionId}' - skipping setup for this subscription`)
        // TODO: implement removing the missing subscriptionId from the index
        return
      }
      const { settings, subscriptionInfo, channelIDs } = JSON.parse(subscriptionSerialized)
      pushSubscriptions[subscriptionId] = subscriptionInfoWrapper(subscriptionId, subscriptionInfo, { channelIDs, settings })
      channelIDs.forEach((channelID: string) => {
        if (!subscribersByChannelID[channelID]) subscribersByChannelID[channelID] = new Set()
        subscribersByChannelID[channelID].add(pushSubscriptions[subscriptionId])
      })
    }))
  }

  // Fire-and-forget persistent actions load
  sbp('chelonia.persistentActions/load').catch((e: unknown) => {
    console.error(e, 'Error loading persistent actions')
  })

  // Register routes
  registerRoutes(currentApp)

  // Start the push-heartbeat interval
  const map = new WeakMap()
  currentPushHeartbeatIntervalID = setInterval(() => {
    const now = Date.now()
    const pubsub = sbp('okTurtles.data/get', PUBSUB_INSTANCE) as WSS | undefined
    // Notification text
    const notification = JSON.stringify({ type: 'recurring' })
    // Find push subscriptions that do _not_ have a WS open. This means clients
    // that are 'asleep' and that might be woken up by the push event
    Object.values(pubsub?.pushSubscriptions || {})
      .filter((pushSubscription) =>
        !!pushSubscription.settings.heartbeatInterval && pushSubscription.sockets.size === 0
      ).forEach((pushSubscription) => {
        const last = map.get(pushSubscription) ?? Number.NEGATIVE_INFINITY
        if (now - last < pushSubscription.settings.heartbeatInterval!) return
        postEvent(pushSubscription, notification).then(() => {
          map.set(pushSubscription, now)
        }).catch((e) => {
          console.warn(e, 'Error sending recurring message to web push client', pushSubscription.id)
        })
      })
    // Repeat every 1 hour
  }, 1 * 60 * 60 * 1000)

  // Start listening
  const uri = await new Promise<string>((resolve, reject) => {
    currentHttpServer!.listen(port, host, () => {
      const addr = currentHttpServer!.address() as { address: string; port: number }
      const uri = `http://${addr.address}:${addr.port}`
      console.info('Backend server running at:', uri)
      sbp('okTurtles.events/emit', SERVER_RUNNING, { info: { uri } })
      resolve(uri)
    }).once('error', reject)
  })

  return { uri }
}

export async function stopServer (): Promise<void> {
  if (isStopping) return
  isStopping = true
  try {
    // Clear push-heartbeat interval
    if (currentPushHeartbeatIntervalID !== undefined) {
      clearInterval(currentPushHeartbeatIntervalID)
      currentPushHeartbeatIntervalID = undefined
    }

    // Stop rate limiters if registered
    if (sbp('sbp/selectors/fn', 'backend/server/stopRateLimiters')) {
      await sbp('backend/server/stopRateLimiters')
    }

    // Close pubsub server (clears its ping interval)
    const pubsub = sbp('okTurtles.data/get', PUBSUB_INSTANCE) as { close: () => void; clients: Set<{ terminate: () => void }> } | undefined
    if (pubsub) {
      // Since `ws` v8.0, `WebSocketServer.close()` no longer closes remaining connections.
      // See https://github.com/websockets/ws/commit/df7de574a07115e2321fdb5fc9b2d0fea55d27e8
      pubsub.clients.forEach((client) => client.terminate())
      pubsub.close()
      sbp('okTurtles.data/delete', PUBSUB_INSTANCE)
    }

    // Close HTTP server
    if (currentHttpServer) {
      await new Promise<void>((resolve, reject) => {
        currentHttpServer!.close((err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
      currentHttpServer = null
    }

    // Terminate workers
    await Promise.all([
      currentOwnerSizeTotalWorker?.terminate(),
      currentCreditsWorker?.terminate()
    ])
    currentOwnerSizeTotalWorker = undefined
    currentCreditsWorker = undefined

    // Close database
    await closeDB()

    // Clear app and manifest
    currentApp = null
    currentManifest = undefined
  } finally {
    isStopping = false
  }
}
