// deno-lint-ignore-file no-this-alias
/* eslint-disable @typescript-eslint/no-this-alias */
// TODO: Use logger for debug output if needed

import { Buffer } from 'node:buffer'
import process from 'node:process'
import { has } from 'npm:turtledash'

/*
 * Pub/Sub server implementation using the `ws` library.
 * See https://github.com/websockets/ws#api-docs
 */

import {
  createClient,
  createKvMessage,
  createMessage,
  messageParser,
  NOTIFICATION_TYPE,
  REQUEST_TYPE,
  RESPONSE_TYPE
} from 'npm:@chelonia/lib/pubsub'

import type {
  Message,
  NotificationTypeEnum,
  PubMessage, SubMessage, UnsubMessage
} from 'npm:@chelonia/lib/pubsub'
import { postEvent, PushSubscriptionInfo } from './push.ts'

const isPushSubscriptionInfo = (x: unknown): x is PushSubscriptionInfo => {
  return has(x, 'endpoint')
}

// Define JSON types locally since they're not exported from the module
type JSONType = string | number | boolean | null | JSONObject | JSONType[]
type JSONObject = { [key: string]: JSONType }
// TODO: Use logger for debugging WebSocket events
import logger from './logger.ts'
import type { IncomingMessage } from 'node:http'
import chalk from 'npm:chalk'
// @deno-types="npm:@types/ws"
import WebSocket, { WebSocketServer } from 'npm:ws'

const { bold } = chalk

const { PING, PONG, PUB, SUB, UNSUB, KV_FILTER } = NOTIFICATION_TYPE
const { ERROR, OK } = RESPONSE_TYPE

const defaultOptions = {
  logPingRounds: process.env.NODE_ENV !== 'production' && !process.env.CI,
  logPongMessages: false,
  maxPayload: 6 * 1024 * 1024,
  pingInterval: 30000
}
// Used to tag console output.
const tag = '[pubsub]'

// ====== Helpers ====== //

const generateSocketID = (() => {
  let counter = 0

  return (debugID?: string) => String(counter++) + (debugID ? '-' + debugID : '')
})()

const log = logger.info.bind(logger, tag) as typeof logger.info & {
  bold: typeof logger.debug;
  debug: typeof logger.debug;
  error: typeof logger.error;
}
log.bold = (...args: unknown[]) => logger.debug(bold(tag, ...args))
log.debug = logger.debug.bind(logger, tag)
log.error = (error: unknown, ...args: unknown[]) => logger.error(error, bold.red(tag, ...args))

// ====== API ====== //

// Re-export some useful things from the shared module.
export { createClient, createKvMessage, createMessage, NOTIFICATION_TYPE, REQUEST_TYPE, RESPONSE_TYPE }

export function createErrorResponse (data: JSONType): string {
  return JSON.stringify({ type: ERROR, data })
}

export function createPushErrorResponse (data: JSONObject): string {
  return JSON.stringify({
    type: ERROR,
    data: {
      ...data,
      type: REQUEST_TYPE.PUSH_ACTION
    }
  })
}

export function createNotification (type: NotificationTypeEnum, data: JSONType): string {
  return JSON.stringify({ type, data })
}

export function createOkResponse (data: JSONType): string {
  return JSON.stringify({ type: OK, data })
}

type BufferLike =
    | string
    | Buffer
    | DataView
    | number
    | ArrayBufferView
    | Uint8Array
    | ArrayBuffer
    | SharedArrayBuffer
    | readonly number[]
    | { valueOf(): ArrayBuffer }
    | { valueOf(): SharedArrayBuffer }
    | { valueOf(): Uint8Array }
    | { valueOf(): readonly number[] }
    | { valueOf(): string }
    | { [Symbol.toPrimitive](hint: string): string };

export interface WS extends Omit<WebSocket, 'send'> {
  server: WSS;
  pinged: boolean;
  activeSinceLastPing: boolean;
  id: string;
  subscriptions: Set<string>;
  kvFilter: Map<string, Set<string>>;
  ip?: string;
  pushSubscriptionId?: string;
  send(msg: {
    type: string;
    data: JSONType;
    [x: string]: JSONType
  }, cb?: (err?: Error) => void): void;
  send(data: BufferLike, cb?: (err?: Error) => void): void;
  send(
      data: BufferLike,
      options: {
          mask?: boolean | undefined;
          binary?: boolean | undefined;
          compress?: boolean | undefined;
          fin?: boolean | undefined;
      },
      cb?: (err?: Error) => void,
  ): void;
}
interface ServerHandlers {
  close: (this: WSS) => void;
  connection: (this: WSS, socket: WS, request: IncomingMessage) => void;
  error: (this: WSS, error: Error) => void;
  headers: (this: WSS) => void;
  listening: (this: WSS) => void;
}

interface SocketHandlers {
  close: (this: WS) => void;
  message: (this: WS, data: Buffer | ArrayBuffer | Buffer[]) => void;
  error: (this: WS, message: Message) => void;
  ping: (this: WS, message: Message) => void;
  pong: (this: WS, message: Message) => void;
}

interface PushActionMessage {
  data: {
    action: string,
    payload?: unknown;
  }
}

interface MessageHandlers {
  [PONG]: (this: WS) => void;
  [PUB]: (this: WS, msg: PubMessage) => void;
  [SUB]: (this: WS, msg: SubMessage) => void;
  [KV_FILTER]: (this: WS, msg: SubMessage) => void;
  [UNSUB]: (this: WS, msg: UnsubMessage) => void;
  [REQUEST_TYPE.PUSH_ACTION]: (this: WS, msg: PushActionMessage) => void;
}

type BaseOptions = Exclude<ConstructorParameters<typeof WebSocketServer>[0], undefined>
interface ServerOptions extends BaseOptions {
  serverHandlers?: Partial<ServerHandlers>;
  socketHandlers?: Partial<SocketHandlers>;
  messageHandlers?: Partial<MessageHandlers>;
  pingInterval?: number;
  logPingRounds?: boolean;
  logPongMessages?: boolean;
}

export interface WSS extends Omit<WebSocketServer, 'clients' | 'options'> {
  clients: Set<WS | PushSubscriptionInfo>;
  channels: Set<string>;
  customServerEventHandlers: Partial<ServerHandlers>;
  customSocketEventHandlers: Partial<SocketHandlers>;
  customMessageHandlers: Partial<MessageHandlers>;
  pingIntervalID?: ReturnType<typeof setTimeout>
  subscribersByChannelID: Record<string, Set<WS | PushSubscriptionInfo>>
  pushSubscriptions: Record<string, PushSubscriptionInfo>;
  options: ServerOptions
  broadcast: (this: WSS, message: Message | string, param?: { to?: Iterable<WS | PushSubscriptionInfo>, except?: unknown, wsOnly?: boolean }) => void;
  enumerateSubscribers: (channelID: string, kvKey?: string) => Generator<WS | PushSubscriptionInfo>;
  rejectMessageAndTerminateSocket: (this: WSS, request: Message, socket: WS) => void;
}

/**
 * Creates a pubsub server instance.
 *
 * @param {(http.Server|https.Server)} server - A Node.js HTTP/S server to attach to.
 * @param {Object?} options
 * {boolean?} logPingRounds - Whether to log ping rounds.
 * {boolean?} logPongMessages - Whether to log received pong messages.
 * {object?} messageHandlers - Custom handlers for different message types.
 * {object?} serverHandlers - Custom handlers for server events.
 * {object?} socketHandlers - Custom handlers for socket events.
 * {number?} backlog=511 - The maximum length of the queue of pending connections.
 * {Function?} handleProtocols - A function which can be used to handle the WebSocket subprotocols.
 * {number?} maxPayload=6_291_456 - The maximum allowed message size in bytes.
 * {string?} path - Accept only connections matching this path.
 * {(boolean|object)?} perMessageDeflate - Enables/disables per-message deflate.
 * {number?} pingInterval=30_000 - The time to wait between successive pings.
 * @returns {Object}
 */
export function createServer (httpServer: import('node:http').Server, options: ServerOptions = {}): unknown {
  const server = new WebSocketServer({
    ...defaultOptions,
    ...options,
    ...{ clientTracking: true },
    server: httpServer
  }) as WSS
  server.channels = new Set<string>()
  server.customServerEventHandlers = { ...options.serverHandlers }
  server.customSocketEventHandlers = { ...options.socketHandlers }
  server.customMessageHandlers = { ...options.messageHandlers }
  server.pingIntervalID = undefined
  server.subscribersByChannelID = Object.create(null)
  server.pushSubscriptions = Object.create(null)

  // Add listeners for server events, i.e. events emitted on the server object.
  const handlers = (Object.keys(defaultServerHandlers) as (keyof ServerHandlers)[])
  handlers.forEach(<T extends keyof ServerHandlers>(name: T) => {
    server.on(name, (...args: Parameters<ServerHandlers[T]>) => {
      try {
        // Always call the default handler first.
        ;(defaultServerHandlers[name] as unknown as (this: WSS, ...args: Parameters<ServerHandlers[T]>) => void).apply(server, args)
        ;(server.customServerEventHandlers[name]  as unknown as (this: WSS, ...args: Parameters<ServerHandlers[T]>) => void)?.apply(server, args)
      } catch (error) {
        server.emit('error', error)
      }
    })
  })
  // Setup a ping interval if required.
  if (server.options.pingInterval! > 0) {
    server.pingIntervalID = setInterval(() => {
      if (server.clients.size && server.options.logPingRounds) {
        log.debug('Pinging clients')
      }
      server.clients.forEach((client) => {
        if (isPushSubscriptionInfo(client)) return
        if (client.pinged && !client.activeSinceLastPing) {
          log(`Disconnecting irresponsive client ${client.id}`)
          return client.terminate()
        }
        if (client.readyState === WebSocket.OPEN) {
          client.send(createMessage(PING, Date.now()), () => {
            client.activeSinceLastPing = false
            client.pinged = true
          })
        }
      })
    }, server.options.pingInterval)
  }
  return Object.assign(server, publicMethods)
}

// Default handlers for server events.
// The `this` binding refers to the server object.
const defaultServerHandlers: ServerHandlers = {
  close () {
    log('Server closed')
  },
  /**
   * Emitted when a connection handshake completes.
   *
   * @see https://github.com/websockets/ws/blob/master/doc/ws.md#event-connection
   * @param {ws.WebSocket} socket - The client socket that connected.
   * @param {http.IncomingMessage} request - The underlying Node http GET request.
   */
  connection (socket, request) {
    const server = this
    const url = request.url
    const urlSearch = url?.includes('?') ? url.slice(url.lastIndexOf('?')) : ''
    const debugID = new URLSearchParams(urlSearch).get('debugID') || ''
    const send = socket.send.bind(socket)
    socket.id = generateSocketID(debugID)
    socket.activeSinceLastPing = true
    socket.pinged = false
    socket.server = server
    socket.subscriptions = new Set()
    socket.kvFilter = new Map()
    socket.ip = (request.headers['x-real-ip'] as unknown as string) || (request.headers['x-forwarded-for'] as unknown as string)?.split(',')[0].trim() || request.socket.remoteAddress
    // Sometimes (like when using `createMessage`), we want to send objects that
    // are serialized as strings. The `ws` library sends these as binary data,
    // whereas the client expects strings. This avoids having to manually
    // specify `{ binary: false }` along with calls.
    socket.send = function (data: unknown) {
      if (typeof data === 'object' && data !== null && typeof (data as { [Symbol.toPrimitive]?: () => string })[Symbol.toPrimitive] === 'function') {
        return send((data as { [Symbol.toPrimitive]: () => string })[Symbol.toPrimitive]())
      }
      return send(data as BufferLike)
    }

    log.bold(`Socket ${socket.id} connected. Total: ${(this as unknown as { clients: Set<WebSocket> }).clients.size}`)

    // Add listeners for socket events, i.e. events emitted on a socket object.
    ;(['close', 'error', 'message', 'ping', 'pong'] as const).forEach((eventName) => {
      socket.on(eventName, (...args: Parameters<SocketHandlers[typeof eventName]>) => {
        // Logging of 'message' events is handled in the default 'message' event handler.
        if (eventName !== 'message') {
          log.debug(`Event '${eventName}' on socket ${socket.id}`, ...args.map(arg => String(arg)))
        }
        try {
          ;(defaultSocketEventHandlers as unknown as Record<string, (this: WS, ...args: Parameters<SocketHandlers[typeof eventName]>) => void>)[eventName]?.call(socket, ...args)
          ;(socket.server.customSocketEventHandlers as unknown as Record<string, (this: WS, ...args: Parameters<SocketHandlers[typeof eventName]>) => void>)[eventName]?.call(socket, ...args)
        } catch (error: unknown) {
          socket.server.emit('error', error)
          socket.terminate()
        }
      })
    })
  },
  error (error) {
    log.error(error, 'Server error')
  },
  headers () {
  },
  listening () {
    log('Server listening')
  }
}

// Default handlers for server-side client socket events.
// The `this` binding refers to the connected `ws` socket object.
const defaultSocketEventHandlers: Partial<SocketHandlers> = {
  close () {
    const socket = this
    const { server } = this

    for (const channelID of socket.subscriptions) {
      // Remove this socket from the channel subscribers.
      server.subscribersByChannelID[channelID].delete(socket)
    }
    socket.subscriptions.clear()
  },

  message (data: Buffer | ArrayBuffer | Buffer[]) {
    const socket = this
    const { server } = this
    const text = data.toString()
    let msg: Message = { type: '' }

    try {
      msg = messageParser(text)
    } catch (error) {
      log.error(error, `Malformed message: ${(error as Error).message}`)
      server.rejectMessageAndTerminateSocket(msg, socket)
      return
    }
    // Now that we have successfully parsed the message, we can log it.
    if (msg.type !== 'pong' || server.options.logPongMessages) {
      log.debug(`Received '${msg.type}' on socket ${socket.id}`, text)
    }
    // The socket can be marked as active since it just received a message.
    socket.activeSinceLastPing = true
    const defaultHandler = defaultMessageHandlers[msg.type as keyof MessageHandlers]
    const customHandler = server.customMessageHandlers[msg.type as keyof MessageHandlers]

    if (defaultHandler || customHandler) {
      try {
        ;(defaultHandler as unknown as (this: WS, msg: Message) => void)?.call(socket, msg)
        ;(customHandler as unknown as (this: WS, msg: Message) => void)?.call(socket, msg)
      } catch (error) {
        // Log the error message and stack trace but do not send it to the client.
        log.error(error, 'onMessage')
        server.rejectMessageAndTerminateSocket(msg, socket)
      }
    } else {
      log.error(`Unhandled message type: ${msg.type}`)
      server.rejectMessageAndTerminateSocket(msg, socket)
    }
  }
}

// These handlers receive the connected `ws` socket through the `this` binding.
const defaultMessageHandlers: Partial<MessageHandlers> = {
  [PONG] () {
    const socket = this
    // const timestamp = Number(msg.data)
    // const latency = Date.now() - timestamp
    socket.activeSinceLastPing = true
  },

  [PUB] (msg: PubMessage) {
    const { server } = this
    const subscribers = server.subscribersByChannelID[msg.channelID]
    server.broadcast(msg, { to: subscribers ?? [] })
  },

  [SUB] ({ channelID, kvFilter }: SubMessage) {
    const socket = this
    const { server } = this

    if (!server.channels.has(channelID)) {
      socket.send(createErrorResponse(
        { type: SUB, channelID, reason: `Unknown channel id: ${channelID}` }
      ))
      return
    }
    if (!socket.subscriptions.has(channelID)) {
      // Add the given channel ID to our subscriptions.
      socket.subscriptions.add(channelID)
      if (Array.isArray(kvFilter)) {
        socket.kvFilter.set(channelID, new Set(kvFilter))
      }
      if (!server.subscribersByChannelID[channelID]) {
        server.subscribersByChannelID[channelID] = new Set()
      }
      // Add this socket to the channel subscribers.
      server.subscribersByChannelID[channelID].add(socket)
    } else {
      log.debug('Already subscribed to', channelID)
    }
    // `kvFilter` can be undefined, which is incompatible with the way JSONType
    // is defined. Using type assertion to handle this case.
    socket.send(createOkResponse({ type: SUB, channelID, kvFilter } as SubMessage))
  },

  [KV_FILTER] ({ channelID, kvFilter }: SubMessage) {
    const socket = this
    const { server } = this

    if (!server.channels.has(channelID)) {
      socket.send(createErrorResponse(
        { type: SUB, channelID, reason: `Unknown channel id: ${channelID}` }
      ))
      return
    }
    if (socket.subscriptions.has(channelID)) {
      if (Array.isArray(kvFilter)) {
        socket.kvFilter.set(channelID, new Set(kvFilter))
      } else {
        socket.kvFilter.delete(channelID)
      }
    } else {
      log.debug('[KV_FILTER] Not subscribed to', channelID)
    }
    // Using type assertion to handle kvFilter compatibility
    socket.send(createOkResponse({ type: KV_FILTER, channelID, kvFilter } as unknown as SubMessage))
  },
  [UNSUB] ({ channelID }: UnsubMessage) {
    const socket = this
    const { server } = this

    if (!server.channels.has(channelID)) {
      socket.send(createErrorResponse(
        { type: UNSUB, channelID, reason: `Unknown channel id: ${channelID}` }
      ))
    }
    if (socket.subscriptions.has(channelID)) {
      // Remove the given channel ID from our subscriptions.
      socket.subscriptions.delete(channelID)
      socket.kvFilter.delete(channelID)
      if (server.subscribersByChannelID[channelID]) {
        // Remove this socket from the channel subscribers.
        server.subscribersByChannelID[channelID].delete(socket)
      }
    }
    socket.send(createOkResponse({ type: UNSUB, channelID }))
  }
}

const publicMethods: Partial<WSS> = {
  /**
   * Broadcasts a message, ignoring clients which are not open.
   *
   * @param message
   * @param to - The intended recipients of the message. Defaults to every open client socket.
   * @param except - A recipient to exclude. Optional.
   */
  broadcast (
    message,
    { to, except, wsOnly } = {}
  ) {
    const server = this
    const msg = typeof message === 'string' ? message : JSON.stringify(message)
    let shortMsg: string | undefined
    // Utility function to remove `data` (i.e., the SPMessage data) from a
    // message. We need this for push notifications, which may have a certain
    // maximum size (usually around 4 KiB)
    const shortenPayload = (): string | undefined => {
      if (!shortMsg && (typeof message === 'object' && message.type === NOTIFICATION_TYPE.ENTRY && message.data)) {
        delete (message as { data?: unknown }).data
        shortMsg = JSON.stringify(message)
      }
      return shortMsg
    }

    for (const client of to || server.clients) {
      // `client` could be either a WebSocket or a wrapped subscription info
      // object
      // Duplicate message sending (over both WS and push) is handled on the
      // WS logic, for the `close` event (to remove the WS and send over push)
      // and for the `STORE_SUBSCRIPTION` WS action.
      if (!wsOnly && isPushSubscriptionInfo(client)) {
        // `client.endpoint` means the client is a subscription info object
        // The max length for push notifications in many providers is 4 KiB.
        // However, encrypting adds a slight overhead of 17 bytes at the end
        // and 86 bytes at the start.
        if (msg.length > (4096 - 86 - 17)) {
          if (!shortenPayload()) {
            console.info('Skipping too large of a payload for', client.id)
            continue
          }
        }
        postEvent(client as PushSubscriptionInfo, shortMsg || msg).catch((e) => {
          // If we have an error posting due to too large of a payload and the
          // message wasn't already shortened, try again
          if ((e as Error)?.message === 'Payload too large') {
            if (shortMsg || !shortenPayload()) {
              // The max length for push notifications in many providers is 4 KiB.
              console.info('Skipping too large of a payload for', client.id)
              return
            }
            postEvent(client as PushSubscriptionInfo, shortMsg!).catch((e) => {
              console.error(e, 'Error posting push notification')
            })
            return
          }
          console.error(e, 'Error posting push notification')
        })
        continue
      }
      if ((client as WS).readyState === WebSocket.OPEN && client !== except) {
        // In this branch, we're dealing with a WebSocket
        (client as WS).send(msg)
      }
    }
  },

  // Enumerates the subscribers of a given channel.
  * enumerateSubscribers (channelID, kvKey) {
    const server = this
    if (channelID in server.subscribersByChannelID!) {
      const subscribers = server.subscribersByChannelID![channelID]
      if (!kvKey) {
        yield * subscribers
      } else {
        for (const subscriber of subscribers) {
          // kvFilter may be undefined for push subscriptions
          const kvFilter = (subscriber as WS).kvFilter?.get(channelID)
          if (!kvFilter || kvFilter.has(kvKey)) yield subscriber as WS
        }
      }
    }
  },

  rejectMessageAndTerminateSocket (request, socket) {
    socket.send(createErrorResponse({ ...request }), () => socket.terminate())
  }
}
