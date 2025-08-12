#!/usr/bin/env -S deno run --allow-read=./ --allow-write=./  --allow-net --no-remote --import-map=vendor/import_map.json
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __glob = (map) => (path5) => {
  var fn = map[path5];
  if (fn) return fn();
  throw new Error("Module not found in bundle: " + path5);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));

// src/deps.ts
var deps_exports = {};
__export(deps_exports, {
  AUTHSALT: () => AUTHSALT,
  Boom: () => default5,
  Bottleneck: () => default12,
  CID: () => CID,
  CONTRACTSALT: () => CONTRACTSALT,
  CS: () => CS,
  CURVE25519XSALSA20POLY1305: () => CURVE25519XSALSA20POLY1305,
  ChelErrorGenerator: () => ChelErrorGenerator,
  EDWARDS25519SHA512BATCH: () => EDWARDS25519SHA512BATCH,
  Hapi: () => Server,
  Inert: () => default7,
  Joi: () => default6,
  LRU: () => default10,
  NOTIFICATION_TYPE: () => NOTIFICATION_TYPE,
  PUSH_SERVER_ACTION_TYPE: () => PUSH_SERVER_ACTION_TYPE,
  REQUEST_TYPE: () => REQUEST_TYPE,
  RESPONSE_TYPE: () => RESPONSE_TYPE,
  SALT_LENGTH_IN_OCTETS: () => SALT_LENGTH_IN_OCTETS,
  SERVER: () => SERVER,
  SPMessage: () => SPMessage,
  SU: () => SU,
  WebSocket: () => default11,
  WebSocketServer: () => WebSocketServer,
  XSALSA20POLY1305: () => XSALSA20POLY1305,
  aes128gcm: () => aes128gcm,
  assert: () => assert,
  assertEquals: () => assertEquals,
  assertRejects: () => assertRejects,
  assertThrows: () => assertThrows,
  base58btc: () => base58btc,
  base64: () => base64,
  base64ToBase64url: () => base64ToBase64url,
  base64urlToBase64: () => base64urlToBase64,
  blake: () => default3,
  blake32Hash: () => blake32Hash,
  boxKeyPair: () => boxKeyPair,
  chalk: () => default8,
  checkKey: () => checkKey,
  cloneDeep: () => cloneDeep,
  colors: () => colors,
  computeCAndHc: () => computeCAndHc,
  copy: () => copy,
  createCID: () => createCID,
  createClient: () => createClient,
  createKvMessage: () => createKvMessage,
  createMessage: () => createMessage,
  decrypt: () => decrypt,
  decryptSaltUpdate: () => decryptSaltUpdate,
  deriveKeyFromPassword: () => deriveKeyFromPassword,
  deserializeKey: () => deserializeKey,
  encrypt: () => encrypt,
  encryptContractSalt: () => encryptContractSalt,
  encryptSaltUpdate: () => encryptSaltUpdate,
  esbuild: () => esbuild,
  flags: () => flags,
  fs: () => fs,
  generateSalt: () => generateSalt,
  getSubscriptionId: () => getSubscriptionId,
  hash: () => hash,
  hashRawStringArray: () => hashRawStringArray,
  hashStringArray: () => hashStringArray,
  keyId: () => keyId,
  keygen: () => keygen,
  keygenOfSameType: () => keygenOfSameType,
  maybeParseCID: () => maybeParseCID,
  messageParser: () => messageParser,
  multicodes: () => multicodes,
  omit: () => omit,
  parseCID: () => parseCID,
  parsePrefixableKey: () => parsePrefixableKey,
  parseRegisterSalt: () => parseRegisterSalt,
  path: () => path,
  pino: () => default9,
  prefixHandlers: () => prefixHandlers,
  randomNonce: () => randomNonce,
  readAll: () => readAll,
  rfc8188Encrypt: () => default14,
  sbp: () => default4,
  scrypt: () => default13,
  serializeKey: () => serializeKey,
  sign: () => sign,
  sqlite: () => sqlite,
  strToB64: () => strToB64,
  streams: () => streams,
  tweetnacl: () => default2,
  util: () => util,
  uuid: () => v4,
  validationMixin: () => validationMixin,
  verifyShelterAuthorizationHeader: () => verifyShelterAuthorizationHeader,
  verifySignature: () => verifySignature,
  writeAll: () => writeAll,
  z: () => z
});
import { assert, assertEquals, assertRejects, assertThrows } from "jsr:@std/assert@1.0.13";
import * as base64 from "jsr:@std/encoding@1.0.10/base64";
import * as flags from "jsr:@std/flags@0.224.0";
import * as colors from "jsr:@std/fmt@1.0.8/colors";
import * as fs from "jsr:@std/fs@1.0.19";
import * as path from "jsr:@std/path@1.1.1";
import * as streams from "jsr:@std/streams@1.0.10";
import * as util from "jsr:@std/io@0.225.2";
import { copy, readAll, writeAll } from "jsr:@std/io@0.225.2";
import * as sqlite from "jsr:@db/sqlite@0.12.0";
import * as esbuild from "npm:esbuild@0.25.6";
import { z } from "npm:zod@4.0.5";
import { default as default2 } from "npm:tweetnacl@1.0.3";
import { base58btc } from "npm:multiformats@11.0.2/bases/base58";
import { default as default3 } from "npm:@multiformats/blake2@1.0.13";
import { CID } from "npm:multiformats@11.0.2/cid";
import { default as default4 } from "npm:@sbp/sbp@2.4.1";
import { Server } from "npm:@hapi/hapi@20.1.2";
import { default as default5 } from "npm:@hapi/boom@9.1.0";
import { default as default6 } from "npm:@hapi/joi@17.1.1";
import { default as default7 } from "npm:@hapi/inert@6.0.3";
import { default as default8 } from "npm:chalk@4.1.0";
import { default as default9 } from "npm:pino@8.19.0";
import { default as default10 } from "npm:lru-cache@7.14.0";
import { default as default11, WebSocketServer } from "npm:ws@8.5.0";
import { v4 } from "npm:uuid@9.0.0";
import { cloneDeep, omit } from "npm:turtledash@1.0.3";
import { default as default12 } from "npm:bottleneck@2.19.5";
import { default as default13 } from "npm:scrypt-async@2.0.1";
import { aes128gcm } from "npm:@apeleghq/rfc8188@1.0.7/encodings";
import { default as default14 } from "npm:@apeleghq/rfc8188@1.0.7/encrypt";
import * as lib_1_2_star from "npm:@chelonia/lib@1.2.2";
import "npm:@chelonia/lib@1.2.2/persistent-actions";
import { blake32Hash, createCID, maybeParseCID, multicodes, strToB64, getSubscriptionId, parseCID } from "npm:@chelonia/lib@1.2.2/functions";
import { checkKey, parsePrefixableKey, prefixHandlers } from "npm:@chelonia/lib@1.2.2/db";
import { SPMessage } from "npm:@chelonia/lib@1.2.2/SPMessage";
import { SERVER } from "npm:@chelonia/lib@1.2.2/presets";
import { ChelErrorGenerator } from "npm:@chelonia/lib@1.2.2/errors";
import { PUSH_SERVER_ACTION_TYPE, REQUEST_TYPE, RESPONSE_TYPE, NOTIFICATION_TYPE, createMessage, createClient, createKvMessage, messageParser } from "npm:@chelonia/lib@1.2.2/pubsub";
import { verifyShelterAuthorizationHeader } from "npm:@chelonia/lib@1.2.2/utils";
import { base64ToBase64url, base64urlToBase64, boxKeyPair, computeCAndHc, decryptSaltUpdate, encryptContractSalt, encryptSaltUpdate, hash, hashRawStringArray, hashStringArray, parseRegisterSalt, randomNonce } from "npm:@chelonia/lib@1.2.2/zkpp";
import { AUTHSALT, CONTRACTSALT, CS, SALT_LENGTH_IN_OCTETS, SU } from "npm:@chelonia/lib@1.2.2/zkppConstants";
import { EDWARDS25519SHA512BATCH, CURVE25519XSALSA20POLY1305, XSALSA20POLY1305 } from "npm:@chelonia/crypto@1.0.1";
import { keygen, serializeKey, deserializeKey, keygenOfSameType, keyId, generateSalt, deriveKeyFromPassword } from "npm:@chelonia/crypto@1.0.1";
import { sign, verifySignature, encrypt, decrypt } from "npm:@chelonia/crypto@1.0.1";
import { validationMixin } from "npm:vuelidate@0.7.6";
var init_deps = __esm({
  "src/deps.ts"() {
    "use strict";
    __reExport(deps_exports, lib_1_2_star);
  }
});

// src/database-fs.ts
var database_fs_exports = {};
__export(database_fs_exports, {
  clear: () => clear,
  count: () => count,
  dataFolder: () => dataFolder,
  initStorage: () => initStorage,
  iterKeys: () => iterKeys,
  readData: () => readData,
  writeData: () => writeData,
  writeDataOnce: () => writeDataOnce
});
async function initStorage(options2 = {}) {
  dataFolder = path.resolve(options2.dirname);
  await Deno.mkdir(dataFolder, { mode: 488, recursive: true });
}
async function clear() {
  for await (const key of iterKeys()) {
    await Deno.remove(path.join(dataFolder, key));
  }
}
async function count() {
  let n = 0;
  for await (const entry of Deno.readDir(dataFolder)) {
    if (entry.isFile) {
      n++;
    }
  }
  return n;
}
async function* iterKeys() {
  for await (const entry of Deno.readDir(dataFolder)) {
    if (entry.isFile) {
      yield entry.name;
    }
  }
}
function readData(key) {
  checkKey2(key);
  return Deno.readFile(path.join(dataFolder, key)).catch(() => void 0);
}
async function writeData(key, value) {
  if (typeof value === "string") {
    await Deno.writeTextFile(path.join(dataFolder, key), value);
  } else {
    await Deno.writeFile(path.join(dataFolder, key), value);
  }
}
async function writeDataOnce(key, value) {
  const options2 = { createNew: true };
  try {
    if (typeof value === "string") {
      await Deno.writeTextFile(path.join(dataFolder, key), value, options2);
    } else {
      await Deno.writeFile(path.join(dataFolder, key), value, options2);
    }
  } catch (err) {
    if (err instanceof Error && err.name !== "AlreadyExists") throw err;
  }
}
var dataFolder;
var init_database_fs = __esm({
  "src/database-fs.ts"() {
    "use strict";
    init_deps();
    init_utils();
    dataFolder = "";
  }
});

// src/database-sqlite.ts
var database_sqlite_exports = {};
__export(database_sqlite_exports, {
  count: () => count2,
  dataFolder: () => dataFolder2,
  initStorage: () => initStorage2,
  iterKeys: () => iterKeys2,
  readData: () => readData2,
  writeData: () => writeData2,
  writeDataOnce: () => writeDataOnce2
});
async function initStorage2(options2 = {}) {
  const { dirname: dirname4, filename } = options2;
  dataFolder2 = path.resolve(dirname4);
  const filepath = path.join(dataFolder2, filename);
  if (db !== void 0) {
    if (filepath === dbPath) {
      return;
    }
    db.close();
  }
  db = new DB(filepath);
  db.run("CREATE TABLE IF NOT EXISTS Data(key TEXT NOT NULL PRIMARY KEY, value TEXT NOT NULL)");
  dbPath = filepath;
  if (!options2.internal) {
    console.log("Connected to the %s SQLite database.", filepath);
  }
  iterKeysStatement = db.prepare("SELECT key FROM Data");
  readStatement = db.prepare("SELECT value FROM Data WHERE key = ?");
  writeOnceStatement = db.prepare("INSERT INTO Data(key, value) VALUES(?, ?) ON CONFLICT (key) DO NOTHING");
  writeStatement = db.prepare("REPLACE INTO Data(key, value) VALUES(?, ?)");
}
function count2() {
  return db.prepare("SELECT COUNT(*) FROM Data").all()[0][0];
}
async function readData2(key) {
  const maybeRow = readStatement.all([key])[0];
  return maybeRow === void 0 ? void 0 : maybeRow[0] ?? new Uint8Array();
}
async function* iterKeys2() {
  for (const row of iterKeysStatement.iter()) {
    yield row[0];
  }
}
async function writeData2(key, value) {
  checkKey2(key);
  writeStatement.run([key, value]);
}
async function writeDataOnce2(key, value) {
  checkKey2(key);
  writeOnceStatement.run([key, value]);
}
var DB, db, dbPath, iterKeysStatement, readStatement, writeOnceStatement, writeStatement, dataFolder2;
var init_database_sqlite = __esm({
  "src/database-sqlite.ts"() {
    "use strict";
    init_deps();
    init_utils();
    DB = sqlite.Database;
    dataFolder2 = "";
  }
});

// src/utils.ts
function checkKey2(key) {
  if (!isValidKey(key)) {
    throw new Error(`bad key: ${JSON.stringify(key)}`);
  }
}
async function createEntryFromFile(filepath, multicode) {
  const buffer = await Deno.readFile(filepath);
  const key = createCID2(buffer, multicode);
  return [key, buffer];
}
function createCID2(data, multicode = multicodes2.RAW) {
  const uint8array = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const digest = multihasher.digest(uint8array);
  return CID.create(1, multicode, digest).toString(multibase.encoder);
}
function exit(x, internal = false) {
  const msg = x instanceof Error ? x.message : String(x);
  if (internal) throw new Error(msg);
  console.error("[chel]", colors.red("Error:"), msg);
  Deno.exit(1);
}
async function getBackend(src, { type, create } = { type: "", create: false }) {
  const fsOptions = { internal: true, dirname: src };
  const sqliteOptions = { internal: true, dirname: path.dirname(src), filename: path.basename(src) };
  if (!create && !await isDir(src) && !await isFile(src)) throw new Error(`not found: "${src}"`);
  let from = type;
  if (!from) {
    if (await isDir(src)) from = "fs";
    else if (await isFile(src)) from = "sqlite";
    else throw new Error(`could not infer backend type. Not found: "${src}"`);
  }
  let initOptions;
  switch (from) {
    case "fs":
      initOptions = fsOptions;
      break;
    case "sqlite":
      initOptions = sqliteOptions;
      break;
    default:
      throw new Error(`unknown backend type: "${from}"`);
  }
  const backend2 = backends[from];
  try {
    await backend2.initStorage(initOptions);
  } catch (error) {
    throw new Error(`could not init '${from}' storage backend at "${src}": ${error.message}`);
  }
  return backend2;
}
function isArrayLength(arg) {
  return Number.isInteger(arg) && arg >= 0 && arg <= 2 ** 32 - 1;
}
async function isDir(path5) {
  try {
    return (await Deno.stat(path5)).isDirectory;
  } catch {
    return false;
  }
}
async function isFile(path5) {
  try {
    return (await Deno.stat(path5)).isFile;
  } catch {
    return false;
  }
}
function isNotHashKey(key) {
  return key.startsWith("head=") || key.startsWith("name=");
}
function isURL(arg) {
  return URL.canParse(arg) && Boolean(new URL(arg).host);
}
function isValidKey(key) {
  return !/[\x00-\x1f\x7f\t\\/]/.test(key);
}
async function readRemoteData(src, key) {
  const buffer = await fetch(`${src}/file/${key}`).then(async (r) => r.ok ? await r.arrayBuffer() : await Promise.reject(new Error(`failed network request to ${src}: ${r.status} - ${r.statusText}`)));
  return new Uint8Array(buffer);
}
async function revokeNet() {
  await Deno.permissions.revoke({ name: "net" });
}
var backends, multibase, multicodes2, multihasher, readJsonFile;
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
    init_deps();
    init_database_fs();
    init_database_sqlite();
    backends = { fs: database_fs_exports, sqlite: database_sqlite_exports };
    multibase = base58btc;
    multicodes2 = {
      RAW: 0,
      JSON: 512,
      SHELTER_CONTRACT_MANIFEST: 5316096,
      SHELTER_CONTRACT_TEXT: 5316097,
      SHELTER_CONTRACT_DATA: 5316098,
      SHELTER_FILE_MANIFEST: 5316099,
      SHELTER_FILE_CHUNK: 5316100
    };
    multihasher = default3.blake2b.blake2b256;
    readJsonFile = async (file) => {
      const contents = await Deno.readTextFile(path.resolve(String(file)));
      return JSON.parse(contents);
    };
  }
});

// src/serve/dashboard-server.ts
var dashboard_server_exports = {};
__export(dashboard_server_exports, {
  default: () => dashboard_server_default,
  startDashboard: () => startDashboard
});
import path2 from "node:path";
import process from "node:process";
async function startDashboard(port) {
  const dashboardServer = new Server({
    port,
    host: "localhost",
    routes: {
      files: {
        relativeTo: getDashboardPath()
      }
    }
  });
  await dashboardServer.register(default7);
  dashboardServer.route({
    method: "GET",
    path: "/assets/{path*}",
    handler: {
      directory: {
        path: "assets",
        redirectToSlash: false
      }
    }
  });
  dashboardServer.route({
    method: "GET",
    path: "/dashboard",
    handler: (_request, h) => h.file("index.html")
  });
  dashboardServer.route({
    method: "GET",
    path: "/dashboard/",
    handler: (_request, h) => h.file("index.html")
  });
  dashboardServer.route({
    method: "GET",
    path: "/{path*}",
    handler: {
      directory: {
        path: ".",
        index: ["index.html"]
      }
    }
  });
  await dashboardServer.start();
  console.log(`\u{1F4CA} Dashboard server running at: http://localhost:${port}`);
}
var getDashboardPath, dashboard_server_default;
var init_dashboard_server = __esm({
  "src/serve/dashboard-server.ts"() {
    "use strict";
    init_deps();
    getDashboardPath = () => {
      return path2.resolve(process.cwd(), "dist-dashboard");
    };
    dashboard_server_default = startDashboard;
  }
});

// src/serve/events.ts
var SERVER_RUNNING;
var init_events = __esm({
  "src/serve/events.ts"() {
    "use strict";
    SERVER_RUNNING = "server-running";
  }
});

// src/serve/instance-keys.ts
var SERVER_INSTANCE, PUBSUB_INSTANCE;
var init_instance_keys = __esm({
  "src/serve/instance-keys.ts"() {
    "use strict";
    SERVER_INSTANCE = "@instance/server";
    PUBSUB_INSTANCE = "@instance/pubsub";
  }
});

// src/serve/logger.ts
import process2 from "node:process";
var prettyPrint, logger2, logLevel;
var init_logger = __esm({
  "src/serve/logger.ts"() {
    "use strict";
    init_deps();
    prettyPrint = process2.env.NODE_ENV === "development" || process2.env.CI || process2.env.CYPRESS_RECORD_KEY || process2.env.PRETTY;
    logger2 = default9({
      level: "debug"
    });
    logLevel = process2.env.LOG_LEVEL || (prettyPrint ? "debug" : "info");
    if (Object.keys(logger2.levels.values).includes(logLevel)) {
      logger2.level = logLevel;
    } else {
      logger2.warn(`Unknown log level: ${logLevel}`);
    }
    globalThis.logger = logger2;
    console.debug = logger2.debug.bind(logger2);
    console.info = logger2.info.bind(logger2);
    console.log = logger2.info.bind(logger2);
    console.warn = logger2.warn.bind(logger2);
    console.error = logger2.error.bind(logger2);
  }
});

// src/serve/auth.ts
var plugin, auth_default;
var init_auth = __esm({
  "src/serve/auth.ts"() {
    "use strict";
    init_deps();
    plugin = {
      name: "chel-auth",
      register(server) {
        server.auth.scheme("chel-bearer", () => {
          return {
            authenticate(request, h) {
              const { authorization } = request.headers;
              if (!authorization) {
                return h.unauthenticated(default5.unauthorized(null, "bearer"));
              }
              const thisScheme = "bearer ";
              if (authorization.slice(0, thisScheme.length) !== thisScheme) {
                return h.unauthenticated(default5.unauthorized(null, "bearer"));
              }
              const token = authorization.slice(thisScheme.length);
              return h.authenticated({ credentials: { token } });
            }
          };
        });
        server.auth.scheme("chel-shelter", () => {
          return {
            authenticate(request, h) {
              const { authorization } = request.headers;
              if (!authorization) {
                return h.unauthenticated(default5.unauthorized(null, "shelter"));
              }
              const thisScheme = "shelter ";
              if (authorization.slice(0, thisScheme.length) !== thisScheme) {
                return h.unauthenticated(default5.unauthorized(null, "shelter"));
              }
              try {
                const billableContractID = verifyShelterAuthorizationHeader(authorization);
                return h.authenticated({ credentials: { billableContractID } });
              } catch (e) {
                console.warn(e, "Shelter authorization failed");
                return h.unauthenticated(default5.unauthorized("Authentication failed", "shelter"));
              }
            }
          };
        });
        server.auth.strategy("chel-bearer", "chel-bearer");
        server.auth.strategy("chel-shelter", "chel-shelter");
      }
    };
    auth_default = plugin;
  }
});

// src/serve/constants.ts
var CREDITS_WORKER_TASK_TIME_INTERVAL, OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL;
var init_constants = __esm({
  "src/serve/constants.ts"() {
    "use strict";
    CREDITS_WORKER_TASK_TIME_INTERVAL = 3e5;
    OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL = 3e4;
  }
});

// src/serve/vapid.ts
import { Buffer as Buffer2 } from "node:buffer";
import process3 from "node:process";
var vapidPublicKey, vapidPrivateKey, vapid, initVapid, generateJwt, getVapidPublicKey, vapidAuthorization;
var init_vapid = __esm({
  "src/serve/vapid.ts"() {
    "use strict";
    init_deps();
    if (!process3.env.VAPID_EMAIL) {
      console.warn('Missing VAPID identification. Please set VAPID_EMAIL to a value like "mailto:some@example".');
    }
    vapid = { VAPID_EMAIL: process3.env.VAPID_EMAIL || "mailto:test@example.com" };
    initVapid = async () => {
      const vapidKeyPair = await default4("chelonia.db/get", "_private_immutable_vapid_key").then(async (vapidKeyPair2) => {
        if (!vapidKeyPair2) {
          console.info("Generating new VAPID keypair...");
          const keyPair = await crypto.subtle.generateKey(
            {
              name: "ECDSA",
              namedCurve: "P-256"
              // Use P-256 curve
            },
            true,
            // Whether the key is extractable
            ["sign", "verify"]
            // Usages
          );
          const serializedKeyPair2 = await Promise.all([
            crypto.subtle.exportKey("jwk", keyPair.privateKey),
            crypto.subtle.exportKey("raw", keyPair.publicKey).then(
              (key) => Buffer2.from(key).toString("base64url")
            )
          ]);
          return default4("chelonia.db/set", "_private_immutable_vapid_key", JSON.stringify(serializedKeyPair2)).then(() => {
            console.info("Successfully saved newly generated VAPID keys");
            return [keyPair.privateKey, serializedKeyPair2[1]];
          });
        }
        const serializedKeyPair = JSON.parse(vapidKeyPair2);
        return [
          await crypto.subtle.importKey(
            "jwk",
            serializedKeyPair[0],
            { name: "ECDSA", namedCurve: "P-256" },
            false,
            ["sign"]
          ),
          serializedKeyPair[1]
        ];
      });
      vapidPrivateKey = vapidKeyPair[0];
      vapidPublicKey = vapidKeyPair[1];
    };
    generateJwt = async (endpoint) => {
      const now = Date.now() / 1e3 | 0;
      const audience = endpoint.origin;
      const header = Buffer2.from(JSON.stringify(
        Object.fromEntries([["typ", "JWT"], ["alg", "ES256"]])
      )).toString("base64url");
      const body = Buffer2.from(JSON.stringify(
        // We're expecting to use the JWT immediately. We set a 10-minute window
        // for using the JWT (5 minutes into the past, 5 minutes into the future)
        // to account for potential network delays and clock drift.
        Object.fromEntries([
          // token audience
          ["aud", audience],
          // 'expiry' / 'not after' value for the token
          ["exp", now + 300],
          // (optional) issuance time for the token
          ["iat", now],
          // 'not before' value for the JWT
          ["nbf", now - 300],
          // URI used for identifying ourselves. This can be used by the push
          // provider to get in touch in case of issues.
          ["sub", vapid.VAPID_EMAIL]
        ])
      )).toString("base64url");
      const signature = Buffer2.from(
        await crypto.subtle.sign(
          { name: "ECDSA", hash: "SHA-256" },
          vapidPrivateKey,
          Buffer2.from([header, body].join("."))
        )
      ).toString("base64url");
      return [header, body, signature].join(".");
    };
    getVapidPublicKey = () => vapidPublicKey;
    vapidAuthorization = async (endpoint) => {
      const jwt = await generateJwt(endpoint);
      return `vapid t=${jwt}, k=${vapidPublicKey}`;
    };
  }
});

// src/serve/zkppSalt.ts
import { randomBytes, timingSafeEqual } from "node:crypto";
import { Buffer as Buffer3 } from "node:buffer";
var nacl, recordSecret, challengeSecret, registrationSecret, hashUpdateSecret, initZkpp, maxAge, computeZkppSaltRecordId, getZkppSaltRecord, setZkppSaltRecord, getChallenge, verifyChallenge, registrationKey, register, contractSaltVerifyC, getContractSalt, updateContractSalt, redeemSaltRegistrationToken, redeemSaltUpdateToken;
var init_zkppSalt = __esm({
  "src/serve/zkppSalt.ts"() {
    "use strict";
    init_deps();
    nacl = default2;
    initZkpp = async () => {
      const IKM = await default4("chelonia.db/get", "_private_immutable_zkpp_ikm").then((IKM2) => {
        if (!IKM2) {
          const secret = randomBytes(33).toString("base64");
          return default4("chelonia.db/set", "_private_immutable_zkpp_ikm", secret).then(() => {
            return secret;
          });
        }
        return IKM2;
      });
      recordSecret = Buffer3.from(hashStringArray("private/recordSecret", IKM)).toString("base64");
      challengeSecret = Buffer3.from(hashStringArray("private/challengeSecret", IKM)).toString("base64");
      registrationSecret = Buffer3.from(hashStringArray("private/registrationSecret", IKM)).toString("base64");
      hashUpdateSecret = Buffer3.from(hashStringArray("private/hashUpdateSecret", IKM)).toString("base64");
    };
    maxAge = 30;
    computeZkppSaltRecordId = async (contractID) => {
      const recordId = `_private_rid_${contractID}`;
      const record = await default4("chelonia.db/get", recordId);
      if (!record) {
        return null;
      }
      const recordBuf = Buffer3.concat([Buffer3.from(contractID), Buffer3.from(record)]);
      return hash(recordBuf);
    };
    getZkppSaltRecord = async (contractID) => {
      const recordId = `_private_rid_${contractID}`;
      const record = await default4("chelonia.db/get", recordId);
      if (record) {
        const encryptionKey = hashStringArray("REK", contractID, recordSecret).slice(0, nacl.secretbox.keyLength);
        const recordBuf = Buffer3.from(base64urlToBase64(record), "base64");
        const nonce = recordBuf.slice(0, nacl.secretbox.nonceLength);
        const recordCiphertext = recordBuf.slice(nacl.secretbox.nonceLength);
        const recordPlaintext = nacl.secretbox.open(recordCiphertext, nonce, encryptionKey);
        if (!recordPlaintext) {
          return null;
        }
        const recordString = Buffer3.from(recordPlaintext).toString("utf-8");
        try {
          const recordObj = JSON.parse(recordString);
          if (!Array.isArray(recordObj) || recordObj.length !== 3 && recordObj.length !== 4 || recordObj.slice(0, 3).some((r) => !r || typeof r !== "string") || recordObj[3] != null && typeof recordObj[3] !== "string") {
            console.error("Error validating encrypted JSON object " + recordId);
            return null;
          }
          const [hashedPassword, authSalt, contractSalt, cid] = recordObj;
          return {
            hashedPassword,
            authSalt,
            contractSalt,
            cid
          };
        } catch {
          console.error("Error parsing encrypted JSON object " + recordId);
        }
      }
      return null;
    };
    setZkppSaltRecord = async (contractID, hashedPassword, authSalt, contractSalt, cid) => {
      const recordId = `_private_rid_${contractID}`;
      const encryptionKey = hashStringArray("REK", contractID, recordSecret).slice(0, nacl.secretbox.keyLength);
      const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
      const recordPlaintext = JSON.stringify([hashedPassword, authSalt, contractSalt, cid]);
      const recordCiphertext = nacl.secretbox(Buffer3.from(recordPlaintext), nonce, encryptionKey);
      const recordBuf = Buffer3.concat([nonce, recordCiphertext]);
      const record = base64ToBase64url(recordBuf.toString("base64"));
      await default4("chelonia.db/set", recordId, record);
    };
    getChallenge = async (contract, b) => {
      const record = await getZkppSaltRecord(contract);
      if (!record) {
        console.debug("getChallenge: Error obtaining ZKPP salt record for contract ID " + contract);
        return false;
      }
      const { authSalt } = record;
      const s = randomNonce();
      const now = (Date.now() / 1e3 | 0).toString(16);
      const sig = [now, base64ToBase64url(Buffer3.from(hashStringArray(contract, b, s, now, challengeSecret)).toString("base64"))].join(",");
      return {
        authSalt,
        s,
        sig
      };
    };
    verifyChallenge = (contractID, r, s, userSig) => {
      if (!/^[a-fA-F0-9]{1,11},[a-zA-Z0-9_-]{86}(?:==)?$/.test(userSig)) {
        console.info(`wrong signature format for challenge for contract: ${contractID}`);
        return false;
      }
      const [then, mac] = userSig.split(",");
      const now = Date.now() / 1e3 | 0;
      const iThen = Number.parseInt(then, 16);
      if (!(iThen <= now) || !(iThen >= now - maxAge)) {
        return false;
      }
      const b = hash(r);
      const sig = hashStringArray(contractID, b, s, then, challengeSecret);
      const macBuf = Buffer3.from(base64urlToBase64(mac), "base64");
      return sig.byteLength === macBuf.byteLength && timingSafeEqual(sig, macBuf);
    };
    registrationKey = (provisionalId, b) => {
      const encryptionKey = hashStringArray("REG", provisionalId, registrationSecret).slice(0, nacl.secretbox.keyLength);
      const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
      const keyPair = boxKeyPair();
      const s = base64ToBase64url(Buffer3.concat([nonce, nacl.secretbox(keyPair.secretKey, nonce, encryptionKey)]).toString("base64"));
      const now = (Date.now() / 1e3 | 0).toString(16);
      const sig = [now, base64ToBase64url(Buffer3.from(hashStringArray(provisionalId, b, s, now, challengeSecret)).toString("base64"))].join(",");
      return {
        s,
        p: base64ToBase64url(Buffer3.from(keyPair.publicKey).toString("base64")),
        sig
      };
    };
    register = (provisionalId, clientPublicKey, encryptedSecretKey, userSig, encryptedHashedPassword) => {
      if (!verifyChallenge(provisionalId, clientPublicKey, encryptedSecretKey, userSig)) {
        console.warn("register: Error validating challenge: " + JSON.stringify({ contract: provisionalId, clientPublicKey, userSig }));
        throw new Error("register: Invalid challenge");
      }
      const encryptedSecretKeyBuf = Buffer3.from(base64urlToBase64(encryptedSecretKey), "base64");
      const encryptionKey = hashStringArray("REG", provisionalId, registrationSecret).slice(0, nacl.secretbox.keyLength);
      const secretKeyBuf = nacl.secretbox.open(encryptedSecretKeyBuf.slice(nacl.secretbox.nonceLength), encryptedSecretKeyBuf.slice(0, nacl.secretbox.nonceLength), encryptionKey);
      if (!secretKeyBuf) {
        console.warn(`register: Error decrypting arguments for contract ID ${provisionalId} (${JSON.stringify({ clientPublicKey, userSig })})`);
        return false;
      }
      const parseRegisterSaltRes = parseRegisterSalt(clientPublicKey, secretKeyBuf, encryptedHashedPassword);
      if (!parseRegisterSaltRes) {
        console.warn(`register: Error parsing registration salt for contract ID ${provisionalId} (${JSON.stringify({ clientPublicKey, userSig })})`);
        return false;
      }
      const [authSalt, contractSalt, hashedPasswordBuf, sharedEncryptionKey] = parseRegisterSaltRes;
      const token = encryptSaltUpdate(
        hashUpdateSecret,
        provisionalId,
        JSON.stringify([Date.now(), Buffer3.from(hashedPasswordBuf).toString(), authSalt, contractSalt])
      );
      return encryptContractSalt(sharedEncryptionKey, token);
    };
    contractSaltVerifyC = (h, r, s, userHc) => {
      const [c, hc] = computeCAndHc(r, s, h);
      const userHcBuf = Buffer3.from(base64urlToBase64(userHc), "base64");
      if (hc.byteLength === userHcBuf.byteLength && timingSafeEqual(hc, userHcBuf)) {
        return c;
      }
      return false;
    };
    getContractSalt = async (contract, r, s, sig, hc) => {
      if (!verifyChallenge(contract, r, s, sig)) {
        console.debug("getContractSalt: Error validating challenge: " + JSON.stringify({ contract, r, s, sig }));
        throw new Error("getContractSalt: Bad challenge");
      }
      const record = await getZkppSaltRecord(contract);
      if (!record) {
        console.error("getContractSalt: Error obtaining ZKPP salt record for contract ID " + contract);
        return false;
      }
      const { hashedPassword, contractSalt, cid } = record;
      const c = contractSaltVerifyC(hashedPassword, r, s, hc);
      if (!c) {
        console.error(`getContractSalt: Error verifying challenge for contract ID ${contract} (${JSON.stringify({ r, s, hc })})`);
        throw new Error("getContractSalt: Bad challenge");
      }
      return encryptContractSalt(c, JSON.stringify([contractSalt, cid]));
    };
    updateContractSalt = async (contract, r, s, sig, hc, encryptedArgs) => {
      if (!verifyChallenge(contract, r, s, sig)) {
        console.warn("update: Error validating challenge: " + JSON.stringify({ contract, r, s, sig }));
        throw new Error("update: Bad challenge");
      }
      const record = await getZkppSaltRecord(contract);
      if (!record) {
        console.error("update: Error obtaining ZKPP salt record for contract ID " + contract);
        return false;
      }
      const { hashedPassword, contractSalt: oldContractSalt } = record;
      const c = contractSaltVerifyC(hashedPassword, r, s, hc);
      if (!c) {
        console.error(`update: Error verifying challenge for contract ID ${contract} (${JSON.stringify({ r, s, hc })})`);
        throw new Error("update: Bad challenge");
      }
      const encryptionKey = hashRawStringArray(SU, c).slice(0, nacl.secretbox.keyLength);
      const encryptedArgsBuf = Buffer3.from(base64urlToBase64(encryptedArgs), "base64");
      const nonce = encryptedArgsBuf.slice(0, nacl.secretbox.nonceLength);
      const encryptedArgsCiphertext = encryptedArgsBuf.slice(nacl.secretbox.nonceLength);
      const args = nacl.secretbox.open(encryptedArgsCiphertext, nonce, encryptionKey);
      if (!args) {
        console.error(`update: Error decrypting arguments for contract ID ${contract} (${JSON.stringify({ r, s, hc })})`);
        return false;
      }
      try {
        const hashedPassword2 = Buffer3.from(args).toString();
        const recordId = await computeZkppSaltRecordId(contract);
        if (!recordId) {
          console.error(`update: Error obtaining record ID for contract ID ${contract}`);
          return false;
        }
        const authSalt = Buffer3.from(hashStringArray(AUTHSALT, c)).slice(0, SALT_LENGTH_IN_OCTETS).toString("base64");
        const contractSalt = Buffer3.from(hashStringArray(CONTRACTSALT, c)).slice(0, SALT_LENGTH_IN_OCTETS).toString("base64");
        const token = encryptSaltUpdate(
          hashUpdateSecret,
          recordId,
          JSON.stringify([Date.now(), hashedPassword2, authSalt, contractSalt])
        );
        return encryptContractSalt(c, JSON.stringify([oldContractSalt, token]));
      } catch {
        console.error(`update: Error parsing encrypted arguments for contract ID ${contract} (${JSON.stringify({ r, s, hc })})`);
      }
      return false;
    };
    redeemSaltRegistrationToken = async (provisoryRegistrationKey, contract, token) => {
      const decryptedToken = decryptSaltUpdate(
        hashUpdateSecret,
        provisoryRegistrationKey,
        token
      );
      const [timestamp, hashedPassword, authSalt, contractSalt] = JSON.parse(decryptedToken);
      if (timestamp < Date.now() - 18e4) {
        throw new Error("ZKPP token expired");
      }
      await setZkppSaltRecord(contract, hashedPassword, authSalt, contractSalt);
    };
    redeemSaltUpdateToken = async (contract, token) => {
      const recordId = await computeZkppSaltRecordId(contract);
      if (!recordId) {
        throw new Error("Record ID not found");
      }
      const decryptedToken = decryptSaltUpdate(
        hashUpdateSecret,
        recordId,
        token
      );
      const [timestamp, hashedPassword, authSalt, contractSalt] = JSON.parse(decryptedToken);
      if (timestamp < Date.now() - 18e4) {
        throw new Error("ZKPP token expired");
      }
      return (cid) => {
        return setZkppSaltRecord(contract, hashedPassword, authSalt, contractSalt, cid);
      };
    };
  }
});

// src/serve/DatabaseBackend.ts
var requiredMethodNames, DatabaseBackend;
var init_DatabaseBackend = __esm({
  "src/serve/DatabaseBackend.ts"() {
    "use strict";
    requiredMethodNames = ["init", "clear", "readData", "writeData", "deleteData"];
    DatabaseBackend = class _DatabaseBackend {
      constructor() {
        if (new.target === _DatabaseBackend) {
          throw new Error("Class DatabaseBackend cannot be instantiated directly.");
        }
        for (const name of requiredMethodNames) {
          const method = this[name];
          if (typeof method === "function") {
            this[name] = method.bind(this);
          }
        }
      }
    };
  }
});

// src/serve/database-fs.ts
var database_fs_exports2 = {};
__export(database_fs_exports2, {
  default: () => FsBackend
});
import { mkdir, readdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join, normalize, resolve } from "node:path";
import process4 from "node:process";
async function testCaseSensitivity(backend2) {
  const { readData: readData3, writeData: writeData3, deleteData } = backend2;
  const date = /* @__PURE__ */ new Date();
  const dateString = date.toISOString();
  const originalKey = `_private_testCaseSensitivity_${date.getTime()}_${(0, Math.random)().toFixed(8).slice(2)}`;
  const differentlyCasedKey = "_P" + originalKey.slice(2);
  await writeData3(originalKey, dateString);
  try {
    const valueOriginalCase = await readData3(originalKey);
    const valueDifferentCase = await readData3(differentlyCasedKey);
    if (valueOriginalCase?.toString() !== dateString) {
      console.error(`Unexpected value on case-sensitivity test; expected ${dateString}`);
      throw new Error("Unexpected value: original key does not have the correct value");
    }
    if (valueDifferentCase?.toString() === dateString) {
      const errStr = "Filesystem database backend only works on case-sensitive filesystems. This appears to be a case insensitive file system. Set SKIP_DB_FS_CASE_SENSITIVITY_CHECK=true to skip.";
      console.error(errStr);
      throw new Error(errStr);
    }
  } finally {
    await deleteData(originalKey);
  }
}
var splitAndGroup, FsBackend;
var init_database_fs2 = __esm({
  "src/serve/database-fs.ts"() {
    "use strict";
    init_deps();
    init_DatabaseBackend();
    splitAndGroup = (input, chunkLength, depth) => input.slice(0, chunkLength * depth).split("").reduce((acc, cv, i) => {
      acc[i / chunkLength | 0] = (acc[i / chunkLength | 0] || "") + cv;
      return acc;
    }, []);
    FsBackend = class extends DatabaseBackend {
      dataFolder = "";
      depth = 0;
      keyChunkLength = 2;
      constructor(options2 = {}) {
        super();
        this.dataFolder = resolve(options2.dirname || "");
        if (options2.depth) this.depth = options2.depth;
        if (options2.keyChunkLength) this.keyChunkLength = options2.keyChunkLength;
      }
      // Maps a given key to a real path on the filesystem.
      mapKey(key) {
        if (basename(normalize(key)) !== key) throw new TypeError("Invalid key");
        if (!this.depth) return join(this.dataFolder, key);
        const keyChunks = splitAndGroup(key, this.keyChunkLength, this.depth);
        return join(this.dataFolder, ...keyChunks, key);
      }
      async init() {
        await mkdir(this.dataFolder, { mode: 488, recursive: true });
        if (process4.env.SKIP_DB_FS_CASE_SENSITIVITY_CHECK === void 0) {
          await testCaseSensitivity(this);
        }
      }
      async clear() {
        const names = await readdir(this.dataFolder);
        const paths = names.map((name) => join(this.dataFolder, name));
        await Promise.all(
          paths.map((p) => rm(p, { recursive: true }))
        );
      }
      async readData(key) {
        checkKey(key);
        return await readFile(this.mapKey(key)).catch((err) => {
          if (err.code !== "ENOENT") throw err;
        });
      }
      async writeData(key, value) {
        const path5 = this.mapKey(key);
        if (this.depth) await mkdir(dirname(path5), { mode: 488, recursive: true });
        await writeFile(path5, value);
      }
      async deleteData(key) {
        await unlink(this.mapKey(key)).catch((e) => {
          if (e?.code === "ENOENT") {
            return;
          }
          throw e;
        });
      }
    };
  }
});

// src/serve/database-sqlite.ts
var database_sqlite_exports2 = {};
__export(database_sqlite_exports2, {
  default: () => SqliteBackend
});
import { mkdir as mkdir2 } from "node:fs/promises";
import { basename as basename2, dirname as dirname2, join as join2, resolve as resolve2 } from "node:path";
var SqliteBackend;
var init_database_sqlite2 = __esm({
  "src/serve/database-sqlite.ts"() {
    "use strict";
    init_deps();
    init_DatabaseBackend();
    SqliteBackend = class extends DatabaseBackend {
      dataFolder = "";
      db = null;
      filename = "";
      readStatement = null;
      writeStatement = null;
      deleteStatement = null;
      constructor(options2 = {}) {
        super();
        const { filepath = "" } = options2;
        const resolvedPath = resolve2(filepath);
        this.dataFolder = dirname2(resolvedPath);
        this.filename = basename2(resolvedPath);
      }
      run(sql) {
        if (!this.db) {
          throw new Error("Database not initialized");
        }
        this.db.prepare(sql).run();
      }
      async init() {
        const { dataFolder: dataFolder4, filename } = this;
        await mkdir2(dataFolder4, { mode: 488, recursive: true });
        if (this.db) {
          throw new Error(`The ${filename} SQLite database is already open.`);
        }
        this.db = new sqlite.Database(join2(dataFolder4, filename));
        this.run("CREATE TABLE IF NOT EXISTS Data(key TEXT NOT NULL PRIMARY KEY, value TEXT NOT NULL)");
        console.info(`Connected to the ${filename} SQLite database.`);
        this.readStatement = this.db.prepare("SELECT value FROM Data WHERE key = ?");
        this.writeStatement = this.db.prepare("REPLACE INTO Data(key, value) VALUES(?, ?)");
        this.deleteStatement = this.db.prepare("DELETE FROM Data WHERE key = ?");
      }
      // Useful in test hooks.
      async clear() {
        await this.run("DELETE FROM Data");
      }
      async readData(key) {
        const row = this.readStatement?.get(key);
        return await row?.value;
      }
      async writeData(key, value) {
        await this.writeStatement?.run(key, value);
      }
      async deleteData(key) {
        await this.deleteStatement?.run(key);
      }
    };
  }
});

// import("./database-*.ts") in src/serve/database-router.ts
var globImport_database_ts;
var init_ = __esm({
  'import("./database-*.ts") in src/serve/database-router.ts'() {
    globImport_database_ts = __glob({
      "./database-fs.ts": () => Promise.resolve().then(() => (init_database_fs2(), database_fs_exports2)),
      "./database-router.test.ts": () => Promise.resolve().then(() => (init_database_router_test(), database_router_test_exports)),
      "./database-router.ts": () => Promise.resolve().then(() => (init_database_router(), database_router_exports)),
      "./database-sqlite.ts": () => Promise.resolve().then(() => (init_database_sqlite2(), database_sqlite_exports2))
    });
  }
});

// src/serve/database-router.ts
var database_router_exports = {};
__export(database_router_exports, {
  default: () => RouterBackend
});
import { resolve as resolve3 } from "node:path";
import { readFile as readFile2 } from "node:fs/promises";
import process5 from "node:process";
var GI_PERSIST_ROUTER_CONFIG, GI_PERSIST_ROUTER_CONFIG_PATH, RouterBackend;
var init_database_router = __esm({
  "src/serve/database-router.ts"() {
    "use strict";
    init_DatabaseBackend();
    init_();
    ({
      GI_PERSIST_ROUTER_CONFIG: (
        // Tried first by the config lookup.
        // Define this if your config JSON comes as a string from an envar's contents.
        GI_PERSIST_ROUTER_CONFIG
      ),
      GI_PERSIST_ROUTER_CONFIG_PATH: (
        // Tried next.
        // Define this if your config comes from a JSON file.
        GI_PERSIST_ROUTER_CONFIG_PATH
      ) = "./database-router-config.json"
    } = process5.env);
    RouterBackend = class extends DatabaseBackend {
      backends;
      config;
      constructor(options2 = {}) {
        super();
        if (options2.config) this.config = options2.config;
      }
      lookupBackend(key) {
        const { backends: backends2, config } = this;
        const keyPrefixes = Object.keys(config);
        for (let i = 0; i < keyPrefixes.length; i++) {
          if (key.startsWith(keyPrefixes[i])) {
            return backends2[keyPrefixes[i]];
          }
        }
        return backends2["*"];
      }
      async readConfig() {
        if (GI_PERSIST_ROUTER_CONFIG) {
          console.info("[database-router] Reading config from envar GI_PERSIST_ROUTER_CONFIG");
        } else {
          console.info("[database-router] Reading config from path", GI_PERSIST_ROUTER_CONFIG_PATH);
        }
        const configString = GI_PERSIST_ROUTER_CONFIG || await readFile2(resolve3(GI_PERSIST_ROUTER_CONFIG_PATH), "utf8");
        const config = JSON.parse(configString);
        return Object.fromEntries(Object.entries(config).sort((a, b) => b[0].length - a[0].length));
      }
      validateConfig(config) {
        const errors = [];
        if (!config["*"]) {
          errors.push({ msg: 'Missing key: "*" (fallback storage is required)' });
        }
        for (const entry of Object.entries(config)) {
          const value = entry[1];
          if (typeof value?.name !== "string" || typeof value?.options !== "object") {
            errors.push({ msg: "entry value must be of type { name: string, options: Object }", entry });
            continue;
          }
          if (value.name === "router") {
            errors.push({ msg: "Router backends cannot be nested.", entry });
            continue;
          }
        }
        return errors;
      }
      async init() {
        if (!this.config) this.config = await this.readConfig();
        const errors = this.validateConfig(this.config);
        if (errors.length) {
          throw new Error(`[${this.constructor.name}] ${errors.length} error(s) found in your config.`, { cause: errors });
        }
        this.backends = /* @__PURE__ */ Object.create(null);
        const entries = Object.entries(this.config);
        await Promise.all(entries.map(async (entry) => {
          const [keyPrefix, { name, options: options2 }] = entry;
          const Ctor = (await globImport_database_ts(`./database-${name}.ts`)).default;
          const backend2 = new Ctor(options2);
          await backend2.init();
          this.backends[keyPrefix] = backend2;
        }));
      }
      async readData(key) {
        return await this.lookupBackend(key).readData(key);
      }
      async writeData(key, value) {
        return await this.lookupBackend(key).writeData(key, value);
      }
      async deleteData(key) {
        return await this.lookupBackend(key).deleteData(key);
      }
      async clear() {
        for (const backend2 of new Set(Object.values(this.backends))) {
          await backend2.clear();
        }
      }
    };
  }
});

// src/serve/database-router.test.ts
var database_router_test_exports = {};
var CID2, randomKeyWithPrefix, validConfig, db2;
var init_database_router_test = __esm({
  "src/serve/database-router.test.ts"() {
    "use strict";
    init_database_router();
    init_deps();
    CID2 = "Q";
    randomKeyWithPrefix = (prefix) => `${prefix}${globalThis.crypto.randomUUID().replaceAll("-", "")}`;
    validConfig = {
      [CID2]: {
        name: "sqlite",
        options: {
          filepath: "./test/temp/sqlite.db"
        }
      },
      "*": {
        name: "fs",
        options: {
          dirname: "./test/temp"
        }
      }
    };
    db2 = new RouterBackend({ config: validConfig });
    Deno.test({
      name: "DatabaseRouter::validateConfig",
      async fn(t) {
        await t.step("should accept a valid config", () => {
          const errors = db2.validateConfig(validConfig);
          if (errors.length !== 0) throw new Error(`Expected 0 errors but got ${errors.length}`);
        });
        await t.step("should reject configs missing a * key", () => {
          const config = omit(validConfig, ["*"]);
          const errors = db2.validateConfig(config);
          if (errors.length !== 1) throw new Error(`Expected 1 error but got ${errors.length}`);
        });
        await t.step("should reject config entries missing a name", () => {
          const config = cloneDeep(validConfig);
          delete config["*"].name;
          const errors = db2.validateConfig(config);
          if (errors.length !== 1) throw new Error(`Expected 1 error but got ${errors.length}`);
        });
      }
    });
    Deno.test({
      name: "DatabaseRouter::lookupBackend",
      async fn(t) {
        await db2.init();
        try {
          await t.step("should find the right backend for keys starting with configured prefixes", () => {
            for (const keyPrefix of Object.keys(db2.config)) {
              if (keyPrefix === "*") continue;
              const key = randomKeyWithPrefix(keyPrefix);
              const actual = db2.lookupBackend(key);
              const expected = db2.backends[keyPrefix];
              if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
            }
          });
          await t.step("should find the right backend for keys equal to configured prefixes", () => {
            for (const keyPrefix of Object.keys(db2.config)) {
              const key = keyPrefix;
              const actual = db2.lookupBackend(key);
              const expected = db2.backends[keyPrefix];
              if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
            }
          });
          await t.step("should return the fallback backend for keys not matching any configured prefix", () => {
            const key = "foo";
            const actual = db2.lookupBackend(key);
            const expected = db2.backends["*"];
            if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
          });
        } finally {
          await db2.clear();
        }
      }
    });
  }
});

// import("./database-*.ts") in src/serve/database.ts
var globImport_database_ts2;
var init_2 = __esm({
  'import("./database-*.ts") in src/serve/database.ts'() {
    globImport_database_ts2 = __glob({
      "./database-fs.ts": () => Promise.resolve().then(() => (init_database_fs2(), database_fs_exports2)),
      "./database-router.test.ts": () => Promise.resolve().then(() => (init_database_router_test(), database_router_test_exports)),
      "./database-router.ts": () => Promise.resolve().then(() => (init_database_router(), database_router_exports)),
      "./database-sqlite.ts": () => Promise.resolve().then(() => (init_database_sqlite2(), database_sqlite_exports2))
    });
  }
});

// src/serve/database.ts
import { Readable } from "node:stream";
import fs2 from "node:fs";
import { readdir as readdir2, readFile as readFile3 } from "node:fs/promises";
import path3 from "node:path";
import process6 from "node:process";
function namespaceKey(name) {
  return "name=" + name;
}
var production, persistence, dbRootPath, options, KEYOP_SEGMENT_LENGTH, dataFolder3, updateSize, database_default, initDB, appendToIndexFactory, appendToNamesIndex, removeFromIndexFactory, lookupUltimateOwner;
var init_database = __esm({
  "src/serve/database.ts"() {
    "use strict";
    init_deps();
    init_vapid();
    init_zkppSalt();
    init_2();
    production = process6.env.NODE_ENV === "production";
    persistence = process6.env.GI_PERSIST || (production ? "fs" : void 0);
    dbRootPath = process6.env.DB_PATH || "./data";
    options = {
      fs: {
        depth: 0,
        dirname: dbRootPath,
        keyChunkLength: 2
      },
      sqlite: {
        filepath: path3.join(dbRootPath, "groupincome.db")
      }
    };
    KEYOP_SEGMENT_LENGTH = 1e4;
    dataFolder3 = path3.resolve(options.fs.dirname);
    if (!fs2.existsSync(dataFolder3)) {
      fs2.mkdirSync(dataFolder3, { mode: 488 });
    }
    updateSize = async (resourceID, sizeKey, size, skipIfDeleted) => {
      if (!Number.isSafeInteger(size)) {
        throw new TypeError(`Invalid given size ${size} for ${resourceID}`);
      }
      await default4("okTurtles.eventQueue/queueEvent", sizeKey, async () => {
        const storedSize = await default4("chelonia.db/get", sizeKey, { bypassCache: true });
        if (skipIfDeleted && storedSize == null) return;
        const existingSize = parseInt(storedSize ?? "0", 10);
        if (!(existingSize >= 0)) {
          throw new TypeError(`Invalid stored size ${existingSize} for ${resourceID}`);
        }
        const updatedSize = existingSize + size;
        if (!(updatedSize >= 0)) {
          throw new TypeError(`Invalid stored updated size ${updatedSize} for ${resourceID}`);
        }
        await default4("chelonia.db/set", sizeKey, updatedSize.toString(10));
      });
    };
    database_default = default4("sbp/selectors/register", {
      "backend/db/streamEntriesAfter": async function(contractID, height, requestedLimit, options2 = {}) {
        const limit = Math.min(requestedLimit ?? Number.POSITIVE_INFINITY, Number(process6.env.MAX_EVENTS_BATCH_SIZE ?? "500"));
        const latestHEADinfo = await default4("chelonia/db/latestHEADinfo", contractID);
        if (latestHEADinfo === "") {
          throw default5.resourceGone(`contractID ${contractID} has been deleted!`);
        }
        if (!latestHEADinfo) {
          throw default5.notFound(`contractID ${contractID} doesn't exist!`);
        }
        let counter = 0;
        let currentHeight = height;
        let currentHash, serverMeta;
        let prefix = "";
        const nextKeyOp = /* @__PURE__ */ (() => {
          let index;
          return async () => {
            if (!index) {
              index = (await default4("chelonia.db/get", `_private_keyop_idx_${contractID}_${currentHeight - currentHeight % KEYOP_SEGMENT_LENGTH}`))?.split("\0");
            }
            const value = index?.find((h, i) => {
              if (Number(h) >= currentHeight) {
                index = index.slice(i + 1);
                return true;
              } else {
                return false;
              }
            });
            if (value != null) {
              const newHeight = Number(value);
              currentHeight = newHeight;
            } else {
              currentHeight = currentHeight - currentHeight % KEYOP_SEGMENT_LENGTH + KEYOP_SEGMENT_LENGTH;
              index = void 0;
              if (currentHeight > latestHEADinfo.height) {
                return false;
              } else {
                return null;
              }
            }
            return true;
          };
        })();
        const fetchMeta = async () => {
          if (currentHeight > latestHEADinfo.height) {
            return false;
          }
          const meta = await default4("chelonia/db/getEntryMeta", contractID, currentHeight);
          if (!meta) {
            return false;
          }
          const { hash: newCurrentHash, ...newServerMeta } = meta;
          currentHash = newCurrentHash;
          serverMeta = newServerMeta;
          return true;
        };
        const stream = Readable.from(async function* () {
          yield "[";
          await fetchMeta();
          while (serverMeta && counter < limit) {
            try {
              const entry = await default4("chelonia/db/getEntry", currentHash);
              if (!entry) break;
              const currentPrefix = prefix;
              prefix = ",";
              counter++;
              yield `${currentPrefix}"${strToB64(
                JSON.stringify({ serverMeta, message: entry.serialize() })
              )}"`;
              currentHeight++;
              currentHash = void 0;
              serverMeta = void 0;
              if (options2.keyOps) {
                while (await nextKeyOp() === null) ;
              }
              await fetchMeta();
            } catch (e) {
              console.error(`[backend] streamEntriesAfter: read(): ${e.message}:`, e.stack);
              break;
            }
          }
          yield "]";
        }(), { encoding: "utf8", objectMode: false });
        stream.headers = {
          "shelter-headinfo-head": latestHEADinfo.HEAD,
          "shelter-headinfo-height": latestHEADinfo.height
        };
        return stream;
      },
      // =======================
      // wrapper methods to add / lookup names
      // =======================
      "backend/db/registerName": async function(name, value) {
        const exists = await default4("backend/db/lookupName", name);
        if (exists) {
          throw default5.conflict("exists");
        }
        await default4("chelonia.db/set", namespaceKey(name), value);
        await default4("chelonia.db/set", `_private_cid2name_${value}`, name);
        await appendToNamesIndex(name);
        return { name, value };
      },
      "backend/db/lookupName": async function(name) {
        const value = await default4("chelonia.db/get", namespaceKey(name));
        return value;
      }
    });
    initDB = async ({ skipDbPreloading } = {}) => {
      if (persistence) {
        const Ctor = (await globImport_database_ts2(`./database-${persistence}.ts`)).default;
        const { init, readData: readData3, writeData: writeData3, deleteData } = new Ctor(options[persistence]);
        await init();
        const cache = new default10({
          max: Number(process6.env.GI_LRU_NUM_ITEMS) || 1e4
        });
        const prefixes = Object.keys(prefixHandlers);
        default4("sbp/selectors/overwrite", {
          "chelonia.db/get": async function(prefixableKey, { bypassCache } = {}) {
            if (!bypassCache) {
              const lookupValue = cache.get(prefixableKey);
              if (lookupValue !== void 0 && lookupValue !== null) {
                return lookupValue;
              }
            }
            const [prefix, key] = parsePrefixableKey(prefixableKey);
            let value = await readData3(key);
            if (value === void 0) {
              return;
            }
            value = prefixHandlers[prefix](value);
            cache.set(prefixableKey, value);
            return value;
          },
          "chelonia.db/set": async function(key, value) {
            if (process6.env.CHELONIA_ARCHIVE_MODE) throw new Error("Unable to write in archive mode");
            checkKey(key);
            if (key.startsWith("_private_immutable")) {
              const existingValue = await readData3(key);
              if (existingValue !== void 0) {
                throw new Error("Cannot set already set immutable key");
              }
            }
            await writeData3(key, value);
            prefixes.forEach((prefix) => {
              cache.delete(prefix + key);
            });
          },
          "chelonia.db/delete": async function(key) {
            if (process6.env.CHELONIA_ARCHIVE_MODE) throw new Error("Unable to write in archive mode");
            checkKey(key);
            if (key.startsWith("_private_immutable")) {
              throw new Error("Cannot delete immutable key");
            }
            await deleteData(key);
            prefixes.forEach((prefix) => {
              cache.delete(prefix + key);
            });
          }
        });
        default4("sbp/selectors/lock", ["chelonia.db/get", "chelonia.db/set", "chelonia.db/delete"]);
      }
      if (skipDbPreloading) return;
      if (persistence !== "fs" || options.fs.dirname !== dbRootPath) {
        const HASH_LENGTH = 56;
        const keys = (await readdir2(dataFolder3)).filter((k) => {
          if (k.length !== HASH_LENGTH) return false;
          const parsed = maybeParseCID(k);
          return [
            multicodes.SHELTER_CONTRACT_MANIFEST,
            multicodes.SHELTER_CONTRACT_TEXT
          ].includes(parsed?.code ?? -1);
        });
        const numKeys = keys.length;
        let numVisitedKeys = 0;
        let numNewKeys = 0;
        const savedProgress = { value: 0, numKeys: 0 };
        console.info("[chelonia.db] Preloading...");
        for (const key of keys) {
          if (!persistence || !await default4("chelonia.db/get", key)) {
            const value = await readFile3(path3.join(dataFolder3, key), "utf8");
            await default4("chelonia.db/set", key, value);
            numNewKeys++;
          }
          numVisitedKeys++;
          const progress = numVisitedKeys === numKeys ? 100 : Math.floor(100 * numVisitedKeys / numKeys);
          if (progress === 100 || progress - savedProgress.value >= 10 && numVisitedKeys - savedProgress.numKeys >= 10) {
            console.info(`[chelonia.db] Preloading... ${progress}% done`);
            savedProgress.numKeys = numVisitedKeys;
            savedProgress.value = progress;
          }
        }
        numNewKeys && console.info(`[chelonia.db] Preloaded ${numNewKeys} new entries`);
      }
      await Promise.all([initVapid(), initZkpp()]);
    };
    appendToIndexFactory = (key) => {
      return (value) => {
        return default4("okTurtles.eventQueue/queueEvent", key, async () => {
          const currentIndex = await default4("chelonia.db/get", key, { bypassCache: true });
          if (currentIndex) {
            if (
              // Check if the value is at the end
              currentIndex.endsWith("\0" + value) || // Check if the value is at the start
              currentIndex.startsWith(value + "\0") || // Check if the current index is exactly the value
              currentIndex === value
            ) {
              return;
            }
            await default4("chelonia.db/set", key, `${currentIndex}\0${value}`);
            return;
          }
          await default4("chelonia.db/set", key, value);
        });
      };
    };
    appendToNamesIndex = appendToIndexFactory("_private_names_index");
    removeFromIndexFactory = (key) => {
      return (values) => {
        return default4("okTurtles.eventQueue/queueEvent", key, async () => {
          let existingEntries = await default4("chelonia.db/get", key, { bypassCache: true });
          if (!existingEntries) return;
          if (!Array.isArray(values)) {
            values = [values];
          }
          for (const value of values) {
            if (existingEntries.endsWith("\0" + value)) {
              existingEntries = existingEntries.slice(0, -value.length - 1);
              continue;
            }
            if (existingEntries.startsWith(value + "\0")) {
              existingEntries = existingEntries.slice(value.length + 1);
              continue;
            }
            if (existingEntries === value) {
              existingEntries = void 0;
              break;
            }
            const entryIndex = existingEntries.indexOf("\0" + value + "\0");
            if (entryIndex === -1) continue;
            existingEntries = existingEntries.slice(0, entryIndex) + existingEntries.slice(entryIndex + value.length + 1);
          }
          if (existingEntries) {
            await default4("chelonia.db/set", key, existingEntries);
          } else {
            await default4("chelonia.db/delete", key);
          }
        });
      };
    };
    lookupUltimateOwner = async (resourceID) => {
      let ownerID = resourceID;
      for (let depth = 128; depth >= 0; depth--) {
        const newOwnerID = await default4("chelonia.db/get", `_private_owner_${ownerID}`, { bypassCache: true });
        if (!newOwnerID) break;
        if (!depth) {
          throw new Error("Exceeded max depth looking up owner for " + resourceID);
        }
        ownerID = newOwnerID;
      }
      return ownerID;
    };
  }
});

// src/serve/errors.ts
var BackendErrorNotFound, BackendErrorGone, BackendErrorBadData;
var init_errors = __esm({
  "src/serve/errors.ts"() {
    "use strict";
    init_deps();
    BackendErrorNotFound = ChelErrorGenerator("BackendErrorNotFound");
    BackendErrorGone = ChelErrorGenerator("BackendErrorGone");
    BackendErrorBadData = ChelErrorGenerator("BackendErrorBadData");
  }
});

// src/serve/rfc8291Ikm.ts
var rfc8291Ikm_default;
var init_rfc8291Ikm = __esm({
  "src/serve/rfc8291Ikm.ts"() {
    "use strict";
    rfc8291Ikm_default = async (uaPublic, salt) => {
      const [[asPrivateKey, asPublic], uaPublicKey] = await Promise.all([
        crypto.subtle.generateKey(
          {
            name: "ECDH",
            namedCurve: "P-256"
          },
          false,
          ["deriveKey"]
        ).then(async (asKeyPair) => {
          const asPublic2 = await crypto.subtle.exportKey(
            "raw",
            asKeyPair.publicKey
          );
          return [asKeyPair.privateKey, asPublic2];
        }),
        crypto.subtle.importKey(
          "raw",
          uaPublic,
          { name: "ECDH", namedCurve: "P-256" },
          false,
          []
        )
      ]);
      const ecdhSecret = await crypto.subtle.deriveKey(
        {
          name: "ECDH",
          public: uaPublicKey
        },
        asPrivateKey,
        {
          name: "HKDF",
          hash: "SHA-256"
        },
        false,
        ["deriveBits"]
      );
      const infoString = new Uint8Array([
        87,
        101,
        98,
        80,
        117,
        115,
        104,
        58,
        32,
        105,
        110,
        102,
        111,
        0
      ]);
      const info = new Uint8Array(infoString.byteLength + uaPublic.byteLength + asPublic.byteLength);
      info.set(infoString, 0);
      info.set(uaPublic, infoString.byteLength);
      info.set(
        new Uint8Array(asPublic),
        infoString.byteLength + uaPublic.byteLength
      );
      const IKM = await crypto.subtle.deriveBits(
        {
          name: "HKDF",
          hash: "SHA-256",
          salt,
          info
        },
        ecdhSecret,
        32 << 3
      );
      return [asPublic, IKM];
    };
  }
});

// src/serve/push.ts
import { Buffer as Buffer4 } from "node:buffer";
var addSubscriptionToIndex, deleteSubscriptionFromIndex, saveSubscription, addChannelToSubscription, deleteChannelFromSubscription, removeSubscription, subscriptionInfoWrapper, encryptPayload, postEvent, pushServerActionhandlers;
var init_push = __esm({
  "src/serve/push.ts"() {
    "use strict";
    init_database();
    init_instance_keys();
    init_rfc8291Ikm();
    init_vapid();
    init_deps();
    addSubscriptionToIndex = appendToIndexFactory("_private_webpush_index");
    deleteSubscriptionFromIndex = removeFromIndexFactory("_private_webpush_index");
    saveSubscription = (server, subscriptionId) => {
      return default4("chelonia.db/set", `_private_webpush_${subscriptionId}`, JSON.stringify({
        settings: server.pushSubscriptions[subscriptionId].settings,
        subscriptionInfo: server.pushSubscriptions[subscriptionId],
        channelIDs: [...server.pushSubscriptions[subscriptionId].subscriptions]
      })).catch((e) => {
        console.error(e, "Error saving subscription", subscriptionId);
        throw e;
      });
    };
    addChannelToSubscription = (server, subscriptionId, channelID) => {
      server.pushSubscriptions[subscriptionId].subscriptions.add(channelID);
      return saveSubscription(server, subscriptionId);
    };
    deleteChannelFromSubscription = (server, subscriptionId, channelID) => {
      server.pushSubscriptions[subscriptionId].subscriptions.delete(channelID);
      return saveSubscription(server, subscriptionId);
    };
    removeSubscription = async (subscriptionId) => {
      try {
        const server = default4("okTurtles.data/get", PUBSUB_INSTANCE);
        const subscription = server.pushSubscriptions[subscriptionId];
        if (subscription) {
          delete server.pushSubscriptions[subscriptionId];
          if (server.subscribersByChannelID) {
            subscription.subscriptions.forEach((channelID) => {
              server.subscribersByChannelID[channelID]?.delete(subscription);
            });
          }
        } else {
        }
        await default4("chelonia.db/delete", `_private_webpush_${subscriptionId}`);
        await deleteSubscriptionFromIndex(subscriptionId);
      } catch (e) {
        console.error(e, "Error removing subscription", subscriptionId);
      }
    };
    subscriptionInfoWrapper = (subscriptionId, subscriptionInfo, extra) => {
      subscriptionInfo.endpoint = new URL(subscriptionInfo.endpoint);
      Object.defineProperties(subscriptionInfo, {
        "id": {
          get() {
            return subscriptionId;
          }
        },
        // These encryption keys are used for encrypting push notification bodies
        // and are unrelated to VAPID, which is used for provenance.
        "encryptionKeys": {
          get: /* @__PURE__ */ (() => {
            let count3 = 0;
            let resultPromise;
            let salt;
            let uaPublic;
            return function() {
              if ((count3 | 0) === 0) {
                if (!salt) {
                  salt = Buffer4.from(this.keys.auth, "base64url");
                }
                if (!uaPublic) {
                  uaPublic = Buffer4.from(this.keys.p256dh, "base64url");
                }
                resultPromise = rfc8291Ikm_default(uaPublic, salt);
                count3 = 1;
              } else {
                count3++;
              }
              return resultPromise;
            };
          })()
        },
        "settings": {
          value: extra.settings || {}
        },
        "sockets": {
          value: /* @__PURE__ */ new Set()
        },
        "subscriptions": {
          value: new Set(extra.channelIDs)
        }
      });
      Object.freeze(subscriptionInfo);
      return subscriptionInfo;
    };
    encryptPayload = async (subscription, data) => {
      const readableStream = new Response(data).body;
      if (!readableStream) throw new Error("Failed to create readable stream");
      const [asPublic, IKM] = await subscription.encryptionKeys;
      return default14(aes128gcm, readableStream, 32768, asPublic.buffer, IKM.buffer).then(async (bodyStream) => {
        const chunks = [];
        const reader = bodyStream.getReader();
        for (; ; ) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(new Uint8Array(value));
        }
        return Buffer4.concat(chunks);
      });
    };
    postEvent = async (subscription, event) => {
      const authorization = await vapidAuthorization(subscription.endpoint);
      const body = event ? await encryptPayload(subscription, event) : void 0;
      const req = await fetch(subscription.endpoint, {
        method: "POST",
        headers: new Headers([
          ["authorization", authorization],
          ...body ? [
            ["content-encoding", "aes128gcm"],
            [
              "content-type",
              "application/octet-stream"
            ]
          ] : [],
          // ['push-receipt', ''],
          ["ttl", "60"]
        ]),
        body
      });
      if (!req.ok) {
        const endpointHost = new URL(subscription.endpoint).host;
        console.info(
          await req.text().then((response) => ({ response })).catch((e) => `ERR: ${e?.message}`),
          `Error ${req.status} sending push notification to '${subscription.id}' via ${endpointHost}`
        );
        if ([401, 404, 410].includes(req.status)) {
          removeSubscription(subscription.id);
          throw new Error(`Error sending push: ${req.status}`);
        }
        if (req.status === 413) {
          throw new Error("Payload too large");
        }
      }
    };
    pushServerActionhandlers = {
      [PUSH_SERVER_ACTION_TYPE.SEND_PUBLIC_KEY](socket) {
        socket.send(createMessage(REQUEST_TYPE.PUSH_ACTION, { type: PUSH_SERVER_ACTION_TYPE.SEND_PUBLIC_KEY, data: getVapidPublicKey() }));
      },
      async [PUSH_SERVER_ACTION_TYPE.STORE_SUBSCRIPTION](socket, payload) {
        const { server } = socket;
        const { applicationServerKey, settings, subscriptionInfo } = payload;
        if (applicationServerKey) {
          const ourVapidPublicKey = getVapidPublicKey();
          const theirVapidPublicKey = Buffer4.from(applicationServerKey, "base64").toString("base64url");
          if (ourVapidPublicKey !== theirVapidPublicKey) {
            socket.send(createMessage(REQUEST_TYPE.PUSH_ACTION, { type: PUSH_SERVER_ACTION_TYPE.SEND_PUBLIC_KEY, data: getVapidPublicKey() }));
            console.warn({ ourVapidPublicKey, theirVapidPublicKey }, "Refusing to store subscription because the associated public VAPID key does not match ours");
            return;
          }
        }
        let subscriptionId = null;
        let host = "";
        let subscriptionWrapper = null;
        try {
          subscriptionId = await getSubscriptionId(subscriptionInfo);
          if (!subscriptionId) {
            throw new Error("Failed to generate subscription ID");
          }
          subscriptionWrapper = server.pushSubscriptions[subscriptionId];
          if (!subscriptionWrapper) {
            console.debug(`saving new push subscription '${subscriptionId}':`, subscriptionInfo);
            server.pushSubscriptions[subscriptionId] = subscriptionInfoWrapper(subscriptionId, subscriptionInfo, { settings });
            subscriptionWrapper = server.pushSubscriptions[subscriptionId];
            host = subscriptionWrapper.endpoint.host;
            await addSubscriptionToIndex(subscriptionId);
            await saveSubscription(server, subscriptionId);
            if (subscriptionWrapper) {
              await postEvent(subscriptionWrapper, JSON.stringify({ type: "initial" }));
            }
          } else {
            host = subscriptionWrapper.endpoint.host;
            if (subscriptionWrapper.sockets.size === 0) {
              subscriptionWrapper.subscriptions.forEach((channelID) => {
                if (!server.subscribersByChannelID[channelID]) return;
                if (subscriptionWrapper) {
                  server.subscribersByChannelID[channelID].delete(subscriptionWrapper);
                }
              });
            }
          }
          if (socket.pushSubscriptionId) {
            if (socket.pushSubscriptionId === subscriptionId) return;
            await removeSubscription(socket.pushSubscriptionId);
          }
          socket.pushSubscriptionId = subscriptionId;
          subscriptionWrapper.subscriptions.forEach((channelID) => {
            server.subscribersByChannelID[channelID]?.delete(subscriptionWrapper);
          });
          subscriptionWrapper.sockets.add(socket);
          socket.subscriptions?.forEach((channelID) => {
            subscriptionWrapper.subscriptions.add(channelID);
          });
          await saveSubscription(server, subscriptionId);
        } catch (e) {
          console.error(e, `[${socket.ip}] Failed to store subscription '${subscriptionId || "??"}' (${host}), removing it!`);
          subscriptionId && removeSubscription(subscriptionId);
          throw e;
        }
      },
      [PUSH_SERVER_ACTION_TYPE.DELETE_SUBSCRIPTION](socket) {
        const { pushSubscriptionId: subscriptionId } = socket;
        if (subscriptionId) {
          return removeSubscription(subscriptionId);
        }
      }
    };
  }
});

// src/serve/pubsub.ts
import process7 from "node:process";
function createErrorResponse(data) {
  return JSON.stringify({ type: ERROR, data });
}
function createPushErrorResponse(data) {
  return JSON.stringify({
    type: ERROR,
    data: {
      ...data,
      type: REQUEST_TYPE.PUSH_ACTION
    }
  });
}
function createNotification(type, data) {
  return JSON.stringify({ type, data });
}
function createOkResponse(data) {
  return JSON.stringify({ type: OK, data });
}
function createServer(httpServer, options2 = {}) {
  const server = new WebSocketServer({
    ...defaultOptions,
    ...options2,
    ...{ clientTracking: true },
    server: httpServer
  });
  server.channels = /* @__PURE__ */ new Set();
  server.customServerEventHandlers = { ...options2.serverHandlers };
  server.customSocketEventHandlers = { ...options2.socketHandlers };
  server.customMessageHandlers = { ...options2.messageHandlers };
  server.pingIntervalID = void 0;
  server.subscribersByChannelID = /* @__PURE__ */ Object.create(null);
  server.pushSubscriptions = /* @__PURE__ */ Object.create(null);
  Object.keys(defaultServerHandlers).forEach((name) => {
    server.on(name, (...args) => {
      try {
        defaultServerHandlers[name]?.call(server, ...args);
        server.customServerEventHandlers[name]?.call(server, ...args);
      } catch (error) {
        server.emit("error", error);
      }
    });
  });
  if (server.options.pingInterval > 0) {
    server.pingIntervalID = setInterval(() => {
      if (server.clients.size && server.options.logPingRounds) {
        log.debug("Pinging clients");
      }
      server.clients.forEach((client) => {
        if (client.pinged && !client.activeSinceLastPing) {
          log(`Disconnecting irresponsive client ${client.id}`);
          return client.terminate();
        }
        if (client.readyState === default11.OPEN) {
          client.send(createMessage(PING, Date.now()), () => {
            client.activeSinceLastPing = false;
            client.pinged = true;
          });
        }
      });
    }, server.options.pingInterval);
  }
  return Object.assign(server, publicMethods);
}
var bold, PING, PONG, PUB, SUB, UNSUB, KV_FILTER, ERROR, OK, defaultOptions, tag, generateSocketID, log, defaultServerHandlers, defaultSocketEventHandlers, defaultMessageHandlers, publicMethods;
var init_pubsub = __esm({
  "src/serve/pubsub.ts"() {
    "use strict";
    init_deps();
    init_push();
    init_deps();
    ({ bold } = default8);
    ({ PING, PONG, PUB, SUB, UNSUB, KV_FILTER } = NOTIFICATION_TYPE);
    ({ ERROR, OK } = RESPONSE_TYPE);
    defaultOptions = {
      logPingRounds: process7.env.NODE_ENV !== "production" && !process7.env.CI,
      logPongMessages: false,
      maxPayload: 6 * 1024 * 1024,
      pingInterval: 3e4
    };
    tag = "[pubsub]";
    generateSocketID = /* @__PURE__ */ (() => {
      let counter = 0;
      return (debugID) => String(counter++) + (debugID ? "-" + debugID : "");
    })();
    log = logger.info.bind(logger, tag);
    log.bold = (...args) => logger.debug(bold(tag, ...args));
    log.debug = logger.debug.bind(logger, tag);
    log.error = (error, ...args) => logger.error(error, bold.red(tag, ...args));
    defaultServerHandlers = {
      close() {
        log("Server closed");
      },
      /**
       * Emitted when a connection handshake completes.
       *
       * @see https://github.com/websockets/ws/blob/master/doc/ws.md#event-connection
       * @param {ws.WebSocket} socket - The client socket that connected.
       * @param {http.IncomingMessage} request - The underlying Node http GET request.
       */
      connection(socket, request) {
        const server = this;
        const url = request.url;
        const urlSearch = url.includes("?") ? url.slice(url.lastIndexOf("?")) : "";
        const debugID = new URLSearchParams(urlSearch).get("debugID") || "";
        const send = socket.send.bind(socket);
        socket.id = generateSocketID(debugID);
        socket.activeSinceLastPing = true;
        socket.pinged = false;
        socket.server = server;
        socket.subscriptions = /* @__PURE__ */ new Set();
        socket.kvFilter = /* @__PURE__ */ new Map();
        socket.ip = request.headers["x-real-ip"] || (typeof request.headers["x-forwarded-for"] === "string" ? request.headers["x-forwarded-for"].split(",")[0].trim() : void 0) || request.socket.remoteAddress;
        socket.send = function(data) {
          if (typeof data === "object" && data !== null && typeof data[Symbol.toPrimitive] === "function") {
            return send(data[Symbol.toPrimitive]());
          }
          return send(data);
        };
        log.bold(`Socket ${socket.id} connected. Total: ${this.clients.size}`);
        ["close", "error", "message", "ping", "pong"].forEach((eventName) => {
          socket.on(eventName, (...args) => {
            if (eventName !== "message") {
              log.debug(`Event '${eventName}' on socket ${socket.id}`, ...args.map((arg) => String(arg)));
            }
            try {
              defaultSocketEventHandlers[eventName]?.call(socket, ...args);
              socket.server.customSocketEventHandlers[eventName]?.call(socket, ...args);
            } catch (error) {
              socket.server.emit("error", error);
              socket.terminate();
            }
          });
        });
      },
      error(error) {
        log.error(error, "Server error");
      },
      headers() {
      },
      listening() {
        log("Server listening");
      }
    };
    defaultSocketEventHandlers = {
      close() {
        const socket = this;
        const server = socket.server;
        for (const channelID of socket.subscriptions) {
          server.subscribersByChannelID[channelID].delete(socket);
        }
        socket.subscriptions.clear();
      },
      message(data) {
        const socket = this;
        const server = socket.server;
        const text = data.toString();
        let msg = { type: "" };
        try {
          const message = messageParser(text);
          msg = message;
        } catch (error) {
          log.error(error, `Malformed message: ${error.message}`);
          server.rejectMessageAndTerminateSocket(msg, socket);
          return;
        }
        if (msg.type !== "pong" || server.options.logPongMessages) {
          log.debug(`Received '${msg.type}' on socket ${socket.id}`, text);
        }
        socket.activeSinceLastPing = true;
        const defaultHandler = defaultMessageHandlers[msg.type];
        const customHandler = server.customMessageHandlers[msg.type];
        if (defaultHandler || customHandler) {
          try {
            defaultHandler?.call(server, socket, msg);
            customHandler?.call(server, socket, msg);
          } catch (error) {
            log.error(error, "onMessage");
            server.rejectMessageAndTerminateSocket(msg, socket);
          }
        } else {
          log.error(`Unhandled message type: ${msg.type}`);
          server.rejectMessageAndTerminateSocket(msg, socket);
        }
      }
    };
    defaultMessageHandlers = {
      [PONG]() {
        const socket = this;
        socket.activeSinceLastPing = true;
      },
      [PUB](msg) {
        const server = this.server;
        const subscribers = server.subscribersByChannelID[msg.channelID];
        server.broadcast(msg, { to: Array.from(subscribers ?? []) });
      },
      [SUB]({ channelID, kvFilter }) {
        const socket = this;
        const server = socket.server;
        if (!server.channels.has(channelID)) {
          socket.send(createErrorResponse(
            { type: SUB, channelID, reason: `Unknown channel id: ${channelID}` }
          ));
          return;
        }
        if (!socket.subscriptions.has(channelID)) {
          socket.subscriptions.add(channelID);
          if (Array.isArray(kvFilter)) {
            socket.kvFilter.set(channelID, new Set(kvFilter));
          }
          if (!server.subscribersByChannelID[channelID]) {
            server.subscribersByChannelID[channelID] = /* @__PURE__ */ new Set();
          }
          server.subscribersByChannelID[channelID].add(socket);
        } else {
          log.debug("Already subscribed to", channelID);
        }
        socket.send(createOkResponse({ type: SUB, channelID, kvFilter }));
      },
      [KV_FILTER]({ channelID, kvFilter }) {
        const socket = this;
        const server = socket.server;
        if (!server.channels.has(channelID)) {
          socket.send(createErrorResponse(
            { type: SUB, channelID, reason: `Unknown channel id: ${channelID}` }
          ));
          return;
        }
        if (socket.subscriptions.has(channelID)) {
          if (Array.isArray(kvFilter)) {
            socket.kvFilter.set(channelID, new Set(kvFilter));
          } else {
            socket.kvFilter.delete(channelID);
          }
        } else {
          log.debug("[KV_FILTER] Not subscribed to", channelID);
        }
        socket.send(createOkResponse({ type: KV_FILTER, channelID, kvFilter }));
      },
      [UNSUB]({ channelID }) {
        const socket = this;
        const server = socket.server;
        if (!server.channels.has(channelID)) {
          socket.send(createErrorResponse(
            { type: UNSUB, channelID, reason: `Unknown channel id: ${channelID}` }
          ));
        }
        if (socket.subscriptions.has(channelID)) {
          socket.subscriptions.delete(channelID);
          socket.kvFilter.delete(channelID);
          if (server.subscribersByChannelID[channelID]) {
            server.subscribersByChannelID[channelID].delete(socket);
          }
        }
        socket.send(createOkResponse({ type: UNSUB, channelID }));
      }
    };
    publicMethods = {
      /**
       * Broadcasts a message, ignoring clients which are not open.
       *
       * @param message
       * @param to - The intended recipients of the message. Defaults to every open client socket.
       * @param except - A recipient to exclude. Optional.
       */
      broadcast(message, { to, except, wsOnly } = {}) {
        const server = this;
        const msg = typeof message === "string" ? message : JSON.stringify(message);
        let shortMsg;
        const shortenPayload = () => {
          if (!shortMsg && (typeof message === "object" && message.type === NOTIFICATION_TYPE.ENTRY && message.data)) {
            delete message.data;
            shortMsg = JSON.stringify(message);
          }
          return shortMsg;
        };
        for (const client of to || server.clients) {
          if (!wsOnly && client.endpoint) {
            if (msg.length > 4096 - 86 - 17) {
              if (!shortenPayload()) {
                console.info("Skipping too large of a payload for", client.id);
                continue;
              }
            }
            postEvent(client, shortMsg || msg).catch((e) => {
              if (e?.message === "Payload too large") {
                if (shortMsg || !shortenPayload()) {
                  console.info("Skipping too large of a payload for", client.id);
                  return;
                }
                postEvent(client, shortMsg).catch((e2) => {
                  console.error(e2, "Error posting push notification");
                });
                return;
              }
              console.error(e, "Error posting push notification");
            });
            continue;
          }
          if (client.readyState === default11.OPEN && client !== except) {
            client.send(msg);
          }
        }
      },
      // Enumerates the subscribers of a given channel.
      *enumerateSubscribers(channelID, kvKey) {
        const server = this;
        if (channelID in server.subscribersByChannelID) {
          const subscribers = server.subscribersByChannelID[channelID];
          if (!kvKey) {
            yield* subscribers;
          } else {
            for (const subscriber of subscribers) {
              const kvFilter = subscriber.kvFilter?.get(channelID);
              if (!kvFilter || kvFilter.has(kvKey)) yield subscriber;
            }
          }
        }
      },
      rejectMessageAndTerminateSocket(request, socket) {
        socket.send(createErrorResponse({ ...request }), () => socket.terminate());
      }
    };
  }
});

// src/serve/routes.ts
var routes_exports = {};
import { Buffer as Buffer5 } from "node:buffer";
import { isIP } from "node:net";
import path4 from "node:path";
import process8 from "node:process";
function notFoundNoCache(h) {
  return h.response().code(404).header("Cache-Control", "no-store");
}
var logger3, MEGABYTE, SECOND, CID_REGEX, KV_KEY_REGEX, NAME_REGEX, POSITIVE_INTEGER_REGEX, FILE_UPLOAD_MAX_BYTES, SIGNUP_LIMIT_MIN, SIGNUP_LIMIT_HOUR, SIGNUP_LIMIT_DAY, SIGNUP_LIMIT_DISABLED, limiterPerMinute, limiterPerHour, limiterPerDay, cidLookupTable, limiterKey, ctEq, isCheloniaDashboard, appDir, staticServeConfig, errorMapper, route;
var init_routes = __esm({
  "src/serve/routes.ts"() {
    "use strict";
    init_deps();
    init_database();
    init_instance_keys();
    init_zkppSalt();
    logger3 = {
      info: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };
    MEGABYTE = 1048576;
    SECOND = 1e3;
    CID_REGEX = /^z[1-9A-HJ-NP-Za-km-z]{8,72}$/;
    KV_KEY_REGEX = /^(?!_private)[^\x00]{1,256}$/;
    NAME_REGEX = /^(?![_-])((?!([_-])\2)[a-z\d_-]){1,80}(?<![_-])$/;
    POSITIVE_INTEGER_REGEX = /^\d{1,16}$/;
    FILE_UPLOAD_MAX_BYTES = parseInt(process8.env.FILE_UPLOAD_MAX_BYTES || "0") || 30 * MEGABYTE;
    SIGNUP_LIMIT_MIN = parseInt(process8.env.SIGNUP_LIMIT_MIN || "0") || 2;
    SIGNUP_LIMIT_HOUR = parseInt(process8.env.SIGNUP_LIMIT_HOUR || "0") || 10;
    SIGNUP_LIMIT_DAY = parseInt(process8.env.SIGNUP_LIMIT_DAY || "0") || 50;
    SIGNUP_LIMIT_DISABLED = process8.env.NODE_ENV !== "production" || process8.env.SIGNUP_LIMIT_DISABLED === "true";
    limiterPerMinute = new default12.Group({
      strategy: default12.strategy.LEAK,
      highWater: 0,
      reservoir: SIGNUP_LIMIT_MIN,
      reservoirRefreshInterval: 60 * SECOND,
      reservoirRefreshAmount: SIGNUP_LIMIT_MIN
    });
    limiterPerHour = new default12.Group({
      strategy: default12.strategy.LEAK,
      highWater: 0,
      reservoir: SIGNUP_LIMIT_HOUR,
      reservoirRefreshInterval: 60 * 60 * SECOND,
      reservoirRefreshAmount: SIGNUP_LIMIT_HOUR
    });
    limiterPerDay = new default12.Group({
      strategy: default12.strategy.LEAK,
      highWater: 0,
      reservoir: SIGNUP_LIMIT_DAY,
      reservoirRefreshInterval: 24 * 60 * 60 * SECOND,
      reservoirRefreshAmount: SIGNUP_LIMIT_DAY
    });
    cidLookupTable = {
      [multicodes.SHELTER_CONTRACT_MANIFEST]: "application/vnd.shelter.contractmanifest+json",
      [multicodes.SHELTER_CONTRACT_TEXT]: "application/vnd.shelter.contracttext",
      [multicodes.SHELTER_CONTRACT_DATA]: "application/vnd.shelter.contractdata+json",
      [multicodes.SHELTER_FILE_MANIFEST]: "application/vnd.shelter.filemanifest+json",
      [multicodes.SHELTER_FILE_CHUNK]: "application/vnd.shelter.filechunk+octet-stream"
    };
    limiterKey = (ip) => {
      const ipVersion = isIP(ip);
      if (ipVersion === 4) {
        return ip;
      } else if (ipVersion === 6) {
        const [address, zoneIdx] = ip.split("%");
        const segments = address.split(":");
        let isCompressed = false;
        for (let i = 0; i < segments.length - 1; i++) {
          if (!isCompressed && segments[i] === "") {
            const requiredSegments = 8 - (segments.length - 1);
            if (requiredSegments < 0) {
              throw new Error("Invalid IPv6 address: too many segments");
            }
            if ((i === 0 || i === segments.length - 2) && segments[i + 1] === "") {
              segments[i + 1] = "0";
            }
            if (i === 0 && segments.length === 3 && segments[i + 2] === "") {
              segments[i + 2] = "0";
            }
            segments.splice(i, 1, ...new Array(requiredSegments).fill("0"));
            isCompressed = true;
            continue;
          }
          segments[i] = segments[i].replace(/^0+/, "0");
        }
        if (segments.length === 8 && isIP(segments[7]) === 4) {
          return segments[7];
        } else if (segments.length === 8) {
          if (zoneIdx) {
            segments[7] = segments[7].replace(/^0+/, "0");
            return segments.join(":").toLowerCase() + "%" + zoneIdx;
          } else {
            return segments.slice(0, 4).join(":").toLowerCase() + "::";
          }
        } else {
          throw new Error("Invalid IPv6 address");
        }
      }
      throw new Error("Invalid address format");
    };
    ctEq = (expected, actual) => {
      let r = actual.length ^ expected.length;
      for (let i = 0; i < actual.length; i++) {
        r |= (actual.codePointAt(i) || 0) ^ (expected.codePointAt(i) || 0);
      }
      return r === 0;
    };
    isCheloniaDashboard = process8.env.IS_CHELONIA_DASHBOARD_DEV;
    appDir = process8.env.CHELONIA_APP_DIR || ".";
    staticServeConfig = {
      routePath: isCheloniaDashboard ? "/dashboard/{path*}" : "/app/{path*}",
      distAssets: path4.resolve(isCheloniaDashboard ? "dist-dashboard/assets" : path4.join(appDir, "assets")),
      distIndexHtml: path4.resolve(isCheloniaDashboard ? "./dist-dashboard/index.html" : path4.join(appDir, "index.html")),
      redirect: isCheloniaDashboard ? "/dashboard/" : "/app/"
    };
    errorMapper = (e) => {
      switch (e?.name) {
        case "BackendErrorNotFound":
          return default5.notFound();
        case "BackendErrorGone":
          return default5.resourceGone();
        case "BackendErrorBadData":
          return default5.badData(e.message);
        default:
          console.error(e, "Unexpected backend error");
          return default5.internal(e.message ?? "internal error");
      }
    };
    route = new Proxy({}, {
      get: function(obj, prop) {
        return function(path5, options2, handler) {
          default4("okTurtles.data/apply", SERVER_INSTANCE, function(server) {
            server.route({ path: path5, method: prop, options: options2, handler });
          });
        };
      }
    });
    route.POST("/event", {
      auth: {
        strategy: "chel-shelter",
        mode: "optional"
      },
      validate: {
        headers: default6.object({
          "shelter-namespace-registration": default6.string().regex(NAME_REGEX)
        }),
        options: {
          allowUnknown: true
        },
        payload: default6.string().required()
      }
    }, async function(request) {
      if (process8.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
      const ip = request.headers["x-real-ip"] || request.info.remoteAddress;
      try {
        const deserializedHEAD = SPMessage.deserializeHEAD(request.payload);
        try {
          const parsed = maybeParseCID(deserializedHEAD.head.manifest);
          if (parsed?.code !== multicodes.SHELTER_CONTRACT_MANIFEST) {
            return default5.badData("Invalid manifest");
          }
          const credentials = request.auth.credentials;
          if (!credentials?.billableContractID && deserializedHEAD.isFirstMessage) {
            const manifest2 = await default4("chelonia.db/get", deserializedHEAD.head.manifest);
            const parsedManifest = JSON.parse(manifest2);
            const { name } = JSON.parse(parsedManifest.body);
            if (name !== "gi.contracts/identity") {
              return default5.unauthorized("This contract type requires ownership information", "shelter");
            }
            if (process8.env.CHELONIA_REGISTRATION_DISABLED) {
              return default5.forbidden("Registration disabled");
            }
            if (!SIGNUP_LIMIT_DISABLED) {
              try {
                const keyedIp = limiterKey(ip);
                await limiterPerMinute.key(keyedIp).schedule(() => Promise.resolve());
                await limiterPerHour.key(keyedIp).schedule(() => Promise.resolve());
                await limiterPerDay.key(keyedIp).schedule(() => Promise.resolve());
              } catch {
                console.warn("rate limit hit for IP:", ip);
                throw default5.tooManyRequests("Rate limit exceeded");
              }
            }
          }
          const saltUpdateToken = request.headers["shelter-salt-update-token"];
          let updateSalts;
          if (saltUpdateToken) {
            updateSalts = await redeemSaltUpdateToken(deserializedHEAD.contractID, saltUpdateToken);
          }
          await default4("backend/server/handleEntry", deserializedHEAD, request.payload);
          await updateSalts?.(deserializedHEAD.hash);
          if (deserializedHEAD.isFirstMessage) {
            if (credentials?.billableContractID) {
              await default4("backend/server/saveOwner", credentials.billableContractID, deserializedHEAD.contractID);
            } else {
              await default4("backend/server/registerBillableEntity", deserializedHEAD.contractID);
            }
            const name = request.headers["shelter-namespace-registration"];
            if (name) {
              const cheloniaState = default4("chelonia/rootState");
              if (cheloniaState.contracts[deserializedHEAD.contractID]?.type === "gi.contracts/identity") {
                const r = await default4("backend/db/registerName", name, deserializedHEAD.contractID);
                if (default5.isBoom(r)) {
                  return r;
                }
                const saltRegistrationToken = request.headers["shelter-salt-registration-token"];
                console.info(`new user: ${name}=${deserializedHEAD.contractID} (${ip})`);
                if (saltRegistrationToken) {
                  await redeemSaltRegistrationToken(name, deserializedHEAD.contractID, saltRegistrationToken);
                }
              }
            }
            const deletionTokenDgst = request.headers["shelter-deletion-token-digest"];
            if (deletionTokenDgst) {
              await default4("chelonia.db/set", `_private_deletionTokenDgst_${deserializedHEAD.contractID}`, deletionTokenDgst);
            }
          }
          await default4("backend/server/updateSize", deserializedHEAD.contractID, Buffer5.byteLength(request.payload), deserializedHEAD.isFirstMessage && !credentials?.billableContractID ? deserializedHEAD.contractID : void 0);
        } catch (err) {
          console.error(err, default8.bold.yellow(err.name));
          if (err.name === "ChelErrorDBBadPreviousHEAD" || err.name === "ChelErrorAlreadyProcessed") {
            const HEADinfo = await default4("chelonia/db/latestHEADinfo", deserializedHEAD.contractID) ?? { HEAD: null, height: 0 };
            const r = default5.conflict(err.message, { HEADinfo });
            Object.assign(r.output.headers, {
              "shelter-headinfo-head": HEADinfo.HEAD,
              "shelter-headinfo-height": HEADinfo.height
            });
            return r;
          } else if (err.name === "ChelErrorSignatureError") {
            return default5.badData("Invalid signature");
          } else if (err.name === "ChelErrorSignatureKeyUnauthorized") {
            return default5.forbidden("Unauthorized signing key");
          }
          throw err;
        }
        return deserializedHEAD.hash;
      } catch (err) {
        err.ip = ip;
        logger3.error(err, "POST /event", err.message);
        return err;
      }
    });
    route.GET("/eventsAfter/{contractID}/{since}/{limit?}", {
      validate: {
        params: default6.object({
          contractID: default6.string().regex(CID_REGEX).required(),
          since: default6.string().regex(POSITIVE_INTEGER_REGEX).required(),
          limit: default6.string().regex(POSITIVE_INTEGER_REGEX)
        }),
        query: default6.object({
          keyOps: default6.boolean()
        })
      }
    }, async function(request) {
      const { contractID, since, limit } = request.params;
      const ip = request.headers["x-real-ip"] || request.info.remoteAddress;
      try {
        const parsed = maybeParseCID(contractID);
        if (parsed?.code !== multicodes.SHELTER_CONTRACT_DATA) {
          return default5.badRequest();
        }
        const stream = await default4("backend/db/streamEntriesAfter", contractID, Number(since), limit == null ? void 0 : Number(limit), { keyOps: !!request.query["keyOps"] });
        request.events.once("disconnect", stream.destroy.bind(stream));
        return stream;
      } catch (err) {
        err.ip = ip;
        logger3.error(err, `GET /eventsAfter/${contractID}/${since}`, err.message);
        return err;
      }
    });
    route.GET("/ownResources", {
      auth: {
        strategies: ["chel-shelter"],
        mode: "required"
      }
    }, async function(request) {
      const billableContractID = request.auth.credentials.billableContractID;
      const resources = (await default4("chelonia.db/get", `_private_resources_${billableContractID}`))?.split("\0");
      if (resources) {
        return resources;
      } else {
        return [];
      }
    });
    if (process8.env.NODE_ENV === "development") {
      const levelToColor = {
        error: default8.bold.red,
        warn: default8.yellow,
        log: default8.green,
        info: default8.green,
        debug: default8.blue
      };
      route.POST("/log", {
        validate: {
          payload: default6.object({
            level: default6.string().required(),
            value: default6.string().required()
          })
        }
      }, function(request, h) {
        if (process8.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
        const ip = request.headers["x-real-ip"] || request.info.remoteAddress;
        const log2 = levelToColor[request.payload.level];
        console.debug(default8.bold.yellow(`REMOTE LOG (${ip}): `) + log2(`[${request.payload.level}] ${request.payload.value}`));
        return h.response().code(200);
      });
    }
    route.GET("/name/{name}", {
      validate: {
        params: default6.object({
          name: default6.string().regex(NAME_REGEX).required()
        })
      }
    }, async function(request, h) {
      const { name } = request.params;
      try {
        const lookupResult = await default4("backend/db/lookupName", name);
        return lookupResult ? h.response(lookupResult).type("text/plain") : notFoundNoCache(h);
      } catch (err) {
        logger3.error(err, `GET /name/${name}`, err.message);
        return err;
      }
    });
    route.GET("/latestHEADinfo/{contractID}", {
      cache: { otherwise: "no-store" },
      validate: {
        params: default6.object({
          contractID: default6.string().regex(CID_REGEX).required()
        })
      }
    }, async function(request, h) {
      const { contractID } = request.params;
      try {
        const parsed = maybeParseCID(contractID);
        if (parsed?.code !== multicodes.SHELTER_CONTRACT_DATA) return default5.badRequest();
        const HEADinfo = await default4("chelonia/db/latestHEADinfo", contractID);
        if (HEADinfo === "") {
          return default5.resourceGone();
        }
        if (!HEADinfo) {
          console.warn(`[backend] latestHEADinfo not found for ${contractID}`);
          return notFoundNoCache(h);
        }
        return HEADinfo;
      } catch (err) {
        logger3.error(err, `GET /latestHEADinfo/${contractID}`, err.message);
        return err;
      }
    });
    route.GET("/time", {}, function(request, h) {
      return h.response((/* @__PURE__ */ new Date()).toISOString()).header("cache-control", "no-store").type("text/plain");
    });
    route.POST(
      "/streams-test",
      {
        payload: {
          parse: "false"
        }
      },
      function(request, h) {
        if (request.payload.byteLength === 2 && Buffer5.from(request.payload).toString() === "ok") {
          return h.response().code(204);
        } else {
          return default5.badRequest();
        }
      }
    );
    if (process8.env.NODE_ENV === "development") {
      route.POST("/dev-file", {
        payload: {
          output: "data",
          multipart: true,
          allow: "multipart/form-data",
          failAction: function(request, h, err) {
            console.error("failAction error:", err);
            return err;
          },
          maxBytes: 6 * MEGABYTE,
          // TODO: make this a configurable setting
          timeout: 10 * SECOND
          // TODO: make this a configurable setting
        }
      }, async function(request) {
        if (process8.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
        try {
          console.log("FILE UPLOAD!");
          const { hash: hash3, data } = request.payload;
          if (!hash3) return default5.badRequest("missing hash");
          if (!data) return default5.badRequest("missing data");
          const parsed = maybeParseCID(hash3);
          if (!parsed) return default5.badRequest("invalid hash");
          const ourHash = createCID(data, parsed.code);
          if (ourHash !== hash3) {
            console.error(`hash(${hash3}) != ourHash(${ourHash})`);
            return default5.badRequest("bad hash!");
          }
          await default4("chelonia.db/set", hash3, data);
          return "/file/" + hash3;
        } catch (err) {
          logger3.error(err);
          return default5.internal("File upload failed");
        }
      });
    }
    route.POST("/file", {
      auth: {
        strategies: ["chel-shelter"],
        mode: "required"
      },
      payload: {
        parse: true,
        output: "stream",
        multipart: { output: "annotated" },
        allow: "multipart/form-data",
        failAction: function(request, h, err) {
          console.error(err, "failAction error");
          return err;
        },
        maxBytes: FILE_UPLOAD_MAX_BYTES,
        timeout: 10 * SECOND
        // TODO: make this a configurable setting
      }
    }, async function(request, h) {
      if (process8.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
      try {
        console.info("FILE UPLOAD!");
        const credentials = request.auth.credentials;
        if (!credentials?.billableContractID) {
          return default5.unauthorized("Uploading files requires ownership information", "shelter");
        }
        const manifestMeta = request.payload["manifest"];
        if (typeof manifestMeta !== "object") return default5.badRequest("missing manifest");
        if (manifestMeta.filename !== "manifest.json") return default5.badRequest("wrong manifest filename");
        if (!(manifestMeta.payload instanceof Uint8Array)) return default5.badRequest("wrong manifest format");
        const manifest2 = (() => {
          try {
            return JSON.parse(Buffer5.from(manifestMeta.payload).toString());
          } catch {
            throw default5.badData("Error parsing manifest");
          }
        })();
        if (typeof manifest2 !== "object") return default5.badData("manifest format is invalid");
        if (manifest2.version !== "1.0.0") return default5.badData("unsupported manifest version");
        if (manifest2.cipher !== "aes256gcm") return default5.badData("unsupported cipher");
        if (!Array.isArray(manifest2.chunks) || !manifest2.chunks.length) return default5.badData("missing chunks");
        let ourSize = 0;
        const chunks = manifest2.chunks.map((chunk, i) => {
          if (!Array.isArray(chunk) || chunk.length !== 2 || typeof chunk[0] !== "number" || typeof chunk[1] !== "string" || !Number.isSafeInteger(chunk[0]) || chunk[0] <= 0) {
            throw default5.badData("bad chunk description");
          }
          if (!request.payload[i] || !(request.payload[i].payload instanceof Uint8Array)) {
            throw default5.badRequest("chunk missing in submitted data");
          }
          const ourHash = createCID(request.payload[i].payload, multicodes.SHELTER_FILE_CHUNK);
          if (request.payload[i].payload.byteLength !== chunk[0]) {
            throw default5.badRequest("bad chunk size");
          }
          if (ourHash !== chunk[1]) {
            throw default5.badRequest("bad chunk hash");
          }
          ourSize += chunk[0];
          return [ourHash, request.payload[i].payload];
        });
        if (ourSize !== manifest2.size) return default5.badRequest("Mismatched total size");
        const manifestHash = createCID(manifestMeta.payload, multicodes.SHELTER_FILE_MANIFEST);
        if (await default4("chelonia.db/get", manifestHash)) {
          throw new Error(`Manifest ${manifestHash} already exists`);
        }
        await Promise.all(chunks.map(async ([cid]) => {
          const exists = !!await default4("chelonia.db/get", cid);
          if (exists) {
            throw new Error(`Chunk ${cid} already exists`);
          }
        }));
        await Promise.all(chunks.map(([cid, data]) => default4("chelonia.db/set", cid, data)));
        await default4("chelonia.db/set", manifestHash, manifestMeta.payload);
        await default4("backend/server/saveOwner", credentials.billableContractID, manifestHash);
        const size = manifest2.size + manifestMeta.payload.byteLength;
        await default4("backend/server/updateSize", manifestHash, size);
        await default4("backend/server/updateContractFilesTotalSize", credentials.billableContractID, size);
        const deletionTokenDgst = request.headers["shelter-deletion-token-digest"];
        if (deletionTokenDgst) {
          await default4("chelonia.db/set", `_private_deletionTokenDgst_${manifestHash}`, deletionTokenDgst);
        }
        return h.response(manifestHash);
      } catch (err) {
        logger3.error(err, "POST /file", err.message);
        return err;
      }
    });
    route.GET("/file/{hash}", {
      validate: {
        params: default6.object({
          hash: default6.string().regex(CID_REGEX).required()
        })
      }
    }, async function(request, h) {
      const { hash: hash3 } = request.params;
      const parsed = maybeParseCID(hash3);
      if (!parsed) {
        return default5.badRequest();
      }
      const blobOrString = await default4("chelonia.db/get", `any:${hash3}`);
      if (blobOrString?.length === 0) {
        return default5.resourceGone();
      } else if (!blobOrString) {
        return notFoundNoCache(h);
      }
      const type = cidLookupTable[parsed.code] || "application/octet-stream";
      return h.response(blobOrString).etag(hash3).header("Cache-Control", "public,max-age=31536000,immutable").header("content-security-policy", "default-src 'none'; frame-ancestors 'none'; form-action 'none'; upgrade-insecure-requests; sandbox").header("x-content-type-options", "nosniff").type(type);
    });
    route.POST("/deleteFile/{hash}", {
      auth: {
        // Allow file deletion, and allow either the bearer of the deletion token or
        // the file owner to delete it
        strategies: ["chel-shelter", "chel-bearer"],
        mode: "required"
      },
      validate: {
        params: default6.object({
          hash: default6.string().regex(CID_REGEX).required()
        })
      }
    }, async function(request, h) {
      if (process8.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
      const { hash: hash3 } = request.params;
      const strategy = request.auth.strategy;
      const parsed = maybeParseCID(hash3);
      if (parsed?.code !== multicodes.SHELTER_FILE_MANIFEST) {
        return default5.badRequest();
      }
      const owner = await default4("chelonia.db/get", `_private_owner_${hash3}`);
      if (!owner) {
        return default5.notFound();
      }
      switch (strategy) {
        case "chel-shelter": {
          const ultimateOwner = await lookupUltimateOwner(owner);
          if (!ctEq(request.auth.credentials.billableContractID, ultimateOwner)) {
            return default5.unauthorized("Invalid shelter auth", "shelter");
          }
          break;
        }
        case "chel-bearer": {
          const expectedTokenDgst = await default4("chelonia.db/get", `_private_deletionTokenDgst_${hash3}`);
          if (!expectedTokenDgst) {
            return default5.notFound();
          }
          const tokenDgst = blake32Hash(request.auth.credentials.token);
          if (!ctEq(expectedTokenDgst, tokenDgst)) {
            return default5.unauthorized("Invalid token", "bearer");
          }
          break;
        }
        default:
          return default5.unauthorized("Missing or invalid auth strategy");
      }
      try {
        await default4("backend/deleteFile", hash3, null, true);
        return h.response();
      } catch (e) {
        return errorMapper(e);
      }
    });
    route.POST("/deleteContract/{hash}", {
      auth: {
        // Allow file deletion, and allow either the bearer of the deletion token or
        // the file owner to delete it
        strategies: ["chel-shelter", "chel-bearer"],
        mode: "required"
      }
    }, async function(request, h) {
      if (process8.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
      const { hash: hash3 } = request.params;
      const strategy = request.auth.strategy;
      if (!hash3 || hash3.startsWith("_private")) return default5.notFound();
      switch (strategy) {
        case "chel-shelter": {
          const owner = await default4("chelonia.db/get", `_private_owner_${hash3}`);
          if (!owner) {
            return default5.notFound();
          }
          const ultimateOwner = await lookupUltimateOwner(owner);
          if (!ctEq(request.auth.credentials.billableContractID, ultimateOwner)) {
            return default5.unauthorized("Invalid shelter auth", "shelter");
          }
          break;
        }
        case "chel-bearer": {
          const expectedTokenDgst = await default4("chelonia.db/get", `_private_deletionTokenDgst_${hash3}`);
          if (!expectedTokenDgst) {
            return default5.notFound();
          }
          const tokenDgst = blake32Hash(request.auth.credentials.token);
          if (!ctEq(expectedTokenDgst, tokenDgst)) {
            return default5.unauthorized("Invalid token", "bearer");
          }
          break;
        }
        default:
          return default5.unauthorized("Missing or invalid auth strategy");
      }
      const username = await default4("chelonia.db/get", `_private_cid2name_${hash3}`);
      try {
        const [id] = default4("chelonia.persistentActions/enqueue", ["backend/deleteContract", hash3, null, true]);
        if (username) {
          const ip = request.headers["x-real-ip"] || request.info.remoteAddress;
          console.info({ contractID: hash3, username, ip, taskId: id }, "Scheduled deletion on named contract");
        }
        return h.response({ id }).code(202);
      } catch (e) {
        return errorMapper(e);
      }
    });
    route.POST("/kv/{contractID}/{key}", {
      auth: {
        strategies: ["chel-shelter"],
        mode: "required"
      },
      payload: {
        parse: false,
        maxBytes: 6 * MEGABYTE,
        // TODO: make this a configurable setting
        timeout: 10 * SECOND
        // TODO: make this a configurable setting
      },
      validate: {
        params: default6.object({
          contractID: default6.string().regex(CID_REGEX).required(),
          key: default6.string().regex(KV_KEY_REGEX).required()
        })
      }
    }, function(request, h) {
      if (process8.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
      const { contractID, key } = request.params;
      const parsed = maybeParseCID(contractID);
      if (parsed?.code !== multicodes.SHELTER_CONTRACT_DATA) {
        return default5.badRequest();
      }
      if (!ctEq(request.auth.credentials.billableContractID, contractID)) {
        return default5.unauthorized(null, "shelter");
      }
      return default4("chelonia/queueInvocation", contractID, async () => {
        const existing = await default4("chelonia.db/get", `_private_kv_${contractID}_${key}`);
        const expectedEtag = request.headers["if-match"];
        if (!expectedEtag) {
          return default5.badRequest("if-match is required");
        }
        const cid = existing ? createCID(existing, multicodes.RAW) : "";
        if (expectedEtag === "*") {
        } else {
          if (!expectedEtag.split(",").map((v) => v.trim()).includes(`"${cid}"`)) {
            return h.response(existing || "").etag(cid).header("x-cid", `"${cid}"`).code(412);
          }
        }
        try {
          const serializedData = JSON.parse(request.payload.toString());
          const { contracts } = default4("chelonia/rootState");
          if (contracts[contractID].height !== Number(serializedData.height)) {
            return h.response(existing || "").etag(cid).header("x-cid", `"${cid}"`).code(409);
          }
          default4("chelonia/parseEncryptedOrUnencryptedDetachedMessage", {
            contractID,
            serializedData,
            meta: key
          });
        } catch {
          return default5.badData();
        }
        const existingSize = existing ? Buffer5.from(existing).byteLength : 0;
        await default4("chelonia.db/set", `_private_kv_${contractID}_${key}`, request.payload);
        await default4("backend/server/updateSize", contractID, request.payload.byteLength - existingSize);
        await appendToIndexFactory(`_private_kvIdx_${contractID}`)(key);
        default4("backend/server/broadcastKV", contractID, key, request.payload.toString()).catch((e) => console.error(e, "Error broadcasting KV update", contractID, key));
        return h.response().code(204);
      });
    });
    route.GET("/kv/{contractID}/{key}", {
      auth: {
        strategies: ["chel-shelter"],
        mode: "required"
      },
      cache: { otherwise: "no-store" },
      validate: {
        params: default6.object({
          contractID: default6.string().regex(CID_REGEX).required(),
          key: default6.string().regex(KV_KEY_REGEX).required()
        })
      }
    }, async function(request, h) {
      const { contractID, key } = request.params;
      const parsed = maybeParseCID(contractID);
      if (parsed?.code !== multicodes.SHELTER_CONTRACT_DATA) {
        return default5.badRequest();
      }
      if (!ctEq(request.auth.credentials.billableContractID, contractID)) {
        return default5.unauthorized(null, "shelter");
      }
      const result = await default4("chelonia.db/get", `_private_kv_${contractID}_${key}`);
      if (!result) {
        return notFoundNoCache(h);
      }
      const cid = createCID(result, multicodes.RAW);
      return h.response(result).etag(cid).header("x-cid", `"${cid}"`);
    });
    route.GET("/serverMessages", { cache: { otherwise: "no-store" } }, (request, h) => {
      if (!process8.env.CHELONIA_SERVER_MESSAGES) return [];
      return h.response(process8.env.CHELONIA_SERVER_MESSAGES).type("application/json");
    });
    route.GET("/assets/{subpath*}", {
      ext: {
        onPostHandler: {
          method(request, h) {
            if (request.path.includes("assets/js/sw-")) {
              console.debug("adding header: Service-Worker-Allowed /");
              request.response.header("Service-Worker-Allowed", "/");
            }
            return h.continue;
          }
        }
      },
      files: {
        relativeTo: staticServeConfig.distAssets
      }
    }, function(request, h) {
      const { subpath } = request.params;
      const basename4 = path4.basename(subpath);
      if (basename4.includes("-cached")) {
        return h.file(subpath, { etagMethod: false }).etag(basename4).header("Cache-Control", "public,max-age=31536000,immutable");
      }
      return h.file(subpath);
    });
    if (isCheloniaDashboard) {
      route.GET("/dashboard/assets/{subpath*}", {
        ext: {
          onPostHandler: {
            method(request, h) {
              if (request.path.includes("assets/js/sw-")) {
                console.debug("adding header: Service-Worker-Allowed /");
                request.response.header("Service-Worker-Allowed", "/");
              }
              return h.continue;
            }
          }
        },
        files: {
          relativeTo: staticServeConfig.distAssets
        }
      }, function(request, h) {
        const { subpath } = request.params;
        const basename4 = path4.basename(subpath);
        if (basename4.includes("-cached")) {
          return h.file(subpath, { etagMethod: false }).etag(basename4).header("Cache-Control", "public,max-age=31536000,immutable");
        }
        return h.file(subpath);
      });
    }
    route.GET(staticServeConfig.routePath, {}, {
      file: staticServeConfig.distIndexHtml
    });
    route.GET("/", {}, function(req, h) {
      return h.redirect(staticServeConfig.redirect);
    });
    route.POST("/zkpp/register/{name}", {
      validate: {
        params: default6.object({
          name: default6.string().regex(NAME_REGEX).required()
        }),
        payload: default6.alternatives([
          {
            // b is a hash of a random public key (`g^r`) with secret key `r`,
            // which is used by the requester to commit to that particular `r`
            b: default6.string().required()
          },
          {
            // `r` is the value used to derive `b` (in this case, it's the public
            // key `g^r`)
            r: default6.string().required(),
            // `s` is an opaque (to the client) value that was earlier returned by
            // the server
            s: default6.string().required(),
            // `sig` is an opaque (to the client) value returned by the server
            // to validate the request (ensuring that (`r`, `s`) come from a
            // previous request
            sig: default6.string().required(),
            // `Eh` is the  Eh = E_{S_A + S_C}(h), where S_A and S_C are salts and
            //                                     h = H\_{S_A}(P)
            Eh: default6.string().required()
          }
        ])
      }
    }, async function(req) {
      if (process8.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
      const lookupResult = await default4("backend/db/lookupName", req.params["name"]);
      if (lookupResult) {
        return default5.conflict();
      }
      try {
        if (req.payload["b"]) {
          const result = registrationKey(req.params["name"], req.payload["b"]);
          if (result) {
            return result;
          }
        } else {
          const result = register(req.params["name"], req.payload["r"], req.payload["s"], req.payload["sig"], req.payload["Eh"]);
          if (result) {
            return result;
          }
        }
      } catch (e) {
        e.ip = req.headers["x-real-ip"] || req.info.remoteAddress;
        console.error(e, "Error at POST /zkpp/{name}: " + e.message);
      }
      return default5.internal("internal error");
    });
    route.GET("/zkpp/{contractID}/auth_hash", {
      validate: {
        params: default6.object({
          contractID: default6.string().regex(CID_REGEX).required()
        }),
        query: default6.object({ b: default6.string().required() })
      }
    }, async function(req, h) {
      try {
        const challenge = await getChallenge(req.params["contractID"], req.query["b"]);
        return challenge || notFoundNoCache(h);
      } catch (e) {
        e.ip = req.headers["x-real-ip"] || req.info.remoteAddress;
        console.error(e, "Error at GET /zkpp/{contractID}/auth_hash: " + e.message);
      }
      return default5.internal("internal error");
    });
    route.GET("/zkpp/{contractID}/contract_hash", {
      validate: {
        params: default6.object({
          contractID: default6.string().regex(CID_REGEX).required()
        }),
        query: default6.object({
          r: default6.string().required(),
          s: default6.string().required(),
          sig: default6.string().required(),
          hc: default6.string().required()
        })
      }
    }, async function(req) {
      try {
        const salt = await getContractSalt(req.params["contractID"], req.query["r"], req.query["s"], req.query["sig"], req.query["hc"]);
        if (salt) {
          return salt;
        }
      } catch (e) {
        e.ip = req.headers["x-real-ip"] || req.info.remoteAddress;
        console.error(e, "Error at GET /zkpp/{contractID}/contract_hash: " + e.message);
      }
      return default5.internal("internal error");
    });
    route.POST("/zkpp/{contractID}/updatePasswordHash", {
      validate: {
        params: default6.object({
          contractID: default6.string().regex(CID_REGEX).required()
        }),
        payload: default6.object({
          r: default6.string().required(),
          s: default6.string().required(),
          sig: default6.string().required(),
          hc: default6.string().required(),
          Ea: default6.string().required()
        })
      }
    }, async function(req) {
      if (process8.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
      try {
        const result = await updateContractSalt(req.params["contractID"], req.payload["r"], req.payload["s"], req.payload["sig"], req.payload["hc"], req.payload["Ea"]);
        if (result) {
          return result;
        }
      } catch (e) {
        e.ip = req.headers["x-real-ip"] || req.info.remoteAddress;
        console.error(e, "Error at POST /zkpp/{contractID}/updatePasswordHash: " + e.message);
      }
      return default5.internal("internal error");
    });
  }
});

// src/serve/server.ts
var server_exports = {};
import { basename as basename3, join as join3, dirname as dirname3 } from "node:path";
import { fileURLToPath } from "node:url";
import { Worker } from "node:worker_threads";
import process9 from "node:process";
var __filename, __dirname, createWorker, ownerSizeTotalWorker, creditsWorker, CONTRACTS_VERSION, GI_VERSION, hapi, appendToOrphanedNamesIndex;
var init_server = __esm({
  "src/serve/server.ts"() {
    "use strict";
    init_deps();
    init_auth();
    init_constants();
    init_database();
    init_errors();
    init_events();
    init_instance_keys();
    init_pubsub();
    init_push();
    __filename = fileURLToPath(import.meta.url);
    __dirname = dirname3(__filename);
    createWorker = (path5) => {
      let worker;
      let ready;
      const launchWorker = () => {
        worker = new Worker(path5);
        return new Promise((resolve4, reject) => {
          const msgHandler = (msg) => {
            if (msg === "ready") {
              worker.off("error", reject);
              worker.on("error", (e) => {
                console.error(e, `Running worker ${basename3(path5)} terminated. Attempting relaunch...`);
                worker.off("message", msgHandler);
                ready = launchWorker().catch((e2) => {
                  console.error(e2, `Error on worker ${basename3(path5)} relaunch`);
                  process9.exit(1);
                });
              });
              resolve4();
            }
          };
          worker.on("message", msgHandler);
          worker.once("error", reject);
        });
      };
      ready = launchWorker();
      const rpcSbp = (...args) => {
        return ready.then(() => new Promise((resolve4, reject) => {
          const mc = new MessageChannel();
          const cleanup = /* @__PURE__ */ ((worker2) => () => {
            worker2.off("error", reject);
            mc.port2.onmessage = null;
            mc.port2.onmessageerror = null;
          })(worker);
          mc.port2.onmessage = (event) => {
            cleanup();
            const [success, result] = event.data;
            if (success) return resolve4(result);
            reject(result);
          };
          mc.port2.onmessageerror = () => {
            cleanup();
            reject(Error("Message error"));
          };
          worker.postMessage([mc.port1, ...args], [mc.port1]);
          worker.once("error", reject);
        }));
      };
      return {
        ready,
        rpcSbp,
        terminate: () => worker.terminate()
      };
    };
    if (CREDITS_WORKER_TASK_TIME_INTERVAL && OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL > CREDITS_WORKER_TASK_TIME_INTERVAL) {
      process9.stderr.write("The size calculation worker must run more frequently than the credits worker for accurate billing");
      process9.exit(1);
    }
    try {
      ownerSizeTotalWorker = createWorker(join3(__dirname, "ownerSizeTotalWorker.ts"));
      creditsWorker = createWorker(join3(__dirname, "creditsWorker.ts"));
    } catch (error) {
      console.warn("[server] Workers disabled - worker files not found in bundled environment:", error.message);
      ownerSizeTotalWorker = void 0;
      creditsWorker = void 0;
    }
    ({ CONTRACTS_VERSION, GI_VERSION } = process9.env);
    hapi = new Server({
      // debug: false, // <- Hapi v16 was outputing too many unnecessary debug statements
      //               // v17 doesn't seem to do this anymore so I've re-enabled the logging
      // debug: { log: ['error'], request: ['error'] },
      port: process9.env.API_PORT,
      // See: https://github.com/hapijs/discuss/issues/262#issuecomment-204616831
      routes: {
        cors: {
          // TODO: figure out if we can live with '*' or if we need to restrict it
          origin: ["*"]
          // origin: [
          //   process.env.API_URL,
          //   // improve support for browsersync proxy
          //   ...(process.env.NODE_ENV === 'development' && ['http://localhost:3000'])
          // ]
        }
      }
    });
    hapi.ext({
      type: "onPreResponse",
      method: function(request, h) {
        try {
          const req = request;
          const response = req.response;
          if (typeof response.header === "function") {
            response.header("X-Frame-Options", "deny");
          } else {
            const output = response.output;
            const headers = output.headers;
            headers["X-Frame-Options"] = "deny";
          }
        } catch (err) {
          console.warn(default8.yellow("[backend] Could not set X-Frame-Options header:", err.message));
        }
        return h.continue;
      }
    });
    appendToOrphanedNamesIndex = appendToIndexFactory("_private_orphaned_names_index");
    default4("okTurtles.data/set", SERVER_INSTANCE, hapi);
    default4("sbp/selectors/register", {
      "backend/server/persistState": async function(deserializedHEAD) {
        const contractID = deserializedHEAD.contractID;
        const cheloniaState = default4("chelonia/rootState");
        if (!cheloniaState.contracts[contractID] || cheloniaState.contracts[contractID].height < deserializedHEAD.head.height) {
          return;
        }
        if (cheloniaState.contracts[contractID].HEAD === deserializedHEAD.hash) {
          const state = {
            contractState: cheloniaState[contractID],
            cheloniaContractInfo: cheloniaState.contracts[contractID]
          };
          await default4("chelonia.db/set", "_private_cheloniaState_" + contractID, JSON.stringify(state));
        }
        if (contractID === deserializedHEAD.hash) {
          await default4("backend/server/appendToContractIndex", contractID);
        }
        if (cheloniaState.contracts[contractID].previousKeyOp === deserializedHEAD.hash) {
          await appendToIndexFactory(`_private_keyop_idx_${contractID}_${deserializedHEAD.head.height - deserializedHEAD.head.height % KEYOP_SEGMENT_LENGTH}`)(String(deserializedHEAD.head.height));
        }
      },
      "backend/server/appendToContractIndex": appendToIndexFactory("_private_cheloniaState_index"),
      "backend/server/broadcastKV": async function(contractID, key, entry) {
        const pubsub = default4("okTurtles.data/get", PUBSUB_INSTANCE);
        const pubsubMessage = createKvMessage(contractID, key, entry);
        const subscribers = pubsub.enumerateSubscribers(contractID, key);
        console.debug(default8.blue.bold(`[pubsub] Broadcasting KV change on ${contractID} to key ${key}`));
        await pubsub.broadcast(pubsubMessage, { to: subscribers, wsOnly: true });
      },
      "backend/server/broadcastEntry": async function(deserializedHEAD, entry) {
        const pubsub = default4("okTurtles.data/get", PUBSUB_INSTANCE);
        const contractID = deserializedHEAD.contractID;
        const contractType = default4("chelonia/rootState").contracts[contractID]?.type;
        const pubsubMessage = createMessage(NOTIFICATION_TYPE.ENTRY, entry, { contractID, contractType });
        const subscribers = pubsub.enumerateSubscribers(contractID);
        console.debug(default8.blue.bold(`[pubsub] Broadcasting ${deserializedHEAD.description()}`));
        await pubsub.broadcast(pubsubMessage, { to: subscribers });
      },
      "backend/server/broadcastDeletion": async function(contractID) {
        const pubsub = default4("okTurtles.data/get", PUBSUB_INSTANCE);
        const pubsubMessage = createMessage(NOTIFICATION_TYPE.DELETION, contractID);
        const subscribers = pubsub.enumerateSubscribers(contractID);
        console.debug(default8.blue.bold(`[pubsub] Broadcasting deletion of ${contractID}`));
        await pubsub.broadcast(pubsubMessage, { to: subscribers });
      },
      "backend/server/handleEntry": async function(deserializedHEAD, entry) {
        const contractID = deserializedHEAD.contractID;
        if (deserializedHEAD.head.op === SPMessage.OP_CONTRACT) {
          default4("okTurtles.data/get", PUBSUB_INSTANCE).channels.add(contractID);
        }
        await default4("chelonia/private/in/enqueueHandleEvent", contractID, entry);
        await default4("backend/server/persistState", deserializedHEAD, entry);
        default4("backend/server/broadcastEntry", deserializedHEAD, entry).catch((e) => console.error(e, "Error broadcasting entry", contractID, deserializedHEAD.hash));
      },
      "backend/server/saveOwner": async function(ownerID, resourceID) {
        await default4("chelonia/queueInvocation", ownerID, async () => {
          const owner = await default4("chelonia.db/get", ownerID);
          if (!owner) {
            throw new Error("Owner resource does not exist");
          }
          await default4("chelonia.db/set", `_private_owner_${resourceID}`, ownerID);
          const resourcesKey = `_private_resources_${ownerID}`;
          await appendToIndexFactory(resourcesKey)(resourceID);
          default4("chelonia.persistentActions/enqueue", ["backend/server/addToIndirectResourcesIndex", resourceID]);
        });
      },
      "backend/server/addToIndirectResourcesIndex": async function(resourceID) {
        const ownerID = await default4("chelonia.db/get", `_private_owner_${resourceID}`);
        let indirectOwnerID = ownerID;
        while (indirectOwnerID = await default4("chelonia.db/get", `_private_owner_${indirectOwnerID}`)) {
          await appendToIndexFactory(`_private_indirectResources_${indirectOwnerID}`)(resourceID);
        }
      },
      "backend/server/removeFromIndirectResourcesIndex": async function(resourceID) {
        const ownerID = await default4("chelonia.db/get", `_private_owner_${resourceID}`);
        const resources = await default4("chelonia.db/get", `_private_resources_${resourceID}`);
        const indirectResources = resources ? await default4("chelonia.db/get", `_private_indirectResources_${resourceID}`) : void 0;
        const allSubresources = [
          resourceID,
          ...resources ? resources.split("\0") : [],
          ...indirectResources ? indirectResources.split("\0") : []
        ];
        let indirectOwnerID = ownerID;
        while (indirectOwnerID = await default4("chelonia.db/get", `_private_owner_${indirectOwnerID}`)) {
          await removeFromIndexFactory(`_private_indirectResources_${indirectOwnerID}`)(allSubresources);
        }
      },
      "backend/server/registerBillableEntity": appendToIndexFactory("_private_billable_entities"),
      "backend/server/updateSize": function(resourceID, size, ultimateOwnerID) {
        const sizeKey = `_private_size_${resourceID}`;
        return updateSize(resourceID, sizeKey, size).then(() => {
          return ownerSizeTotalWorker ? ownerSizeTotalWorker.rpcSbp("worker/updateSizeSideEffects", { resourceID, size, ultimateOwnerID }) : Promise.resolve();
        });
      },
      "backend/server/updateContractFilesTotalSize": function(resourceID, size) {
        const contractsIndex = default4("okTurtles.data/get", "contractsIndex");
        for (const [,] of Object.entries(contractsIndex)) {
          const sizeKey = `_private_contractFilesTotalSize_${resourceID}`;
          return updateSize(resourceID, sizeKey, size, true);
        }
      },
      "backend/server/stop": function() {
        return hapi.stop();
      },
      async "backend/deleteFile"(cid, ultimateOwnerID, skipIfDeleted) {
        const owner = await default4("chelonia.db/get", `_private_owner_${cid}`);
        const rawManifest = await default4("chelonia.db/get", cid);
        const size = await default4("chelonia.db/get", `_private_size_${cid}`);
        if (owner && !ultimateOwnerID) ultimateOwnerID = await lookupUltimateOwner(owner);
        if (rawManifest === "") {
          if (skipIfDeleted) return;
          throw new BackendErrorGone();
        }
        if (!rawManifest) {
          if (skipIfDeleted) return;
          throw new BackendErrorNotFound();
        }
        try {
          const manifest2 = JSON.parse(rawManifest);
          if (!manifest2 || typeof manifest2 !== "object") throw new BackendErrorBadData("manifest format is invalid");
          if (manifest2.version !== "1.0.0") throw new BackendErrorBadData("unsupported manifest version");
          if (!Array.isArray(manifest2.chunks) || !manifest2.chunks.length) throw BackendErrorBadData("missing chunks");
          await Promise.all(manifest2.chunks.map(([, cid2]) => default4("chelonia.db/delete", cid2)));
        } catch (e) {
          console.warn(e, `Error parsing manifest for ${cid}. It's probably not a file manifest.`);
          throw new BackendErrorNotFound();
        }
        const resourcesKey = `_private_resources_${owner}`;
        await removeFromIndexFactory(resourcesKey)(cid);
        await default4("backend/server/removeFromIndirectResourcesIndex", cid);
        await default4("chelonia.db/delete", `_private_owner_${cid}`);
        await default4("chelonia.db/delete", `_private_size_${cid}`);
        await default4("chelonia.db/delete", `_private_deletionTokenDgst_${cid}`);
        await default4("chelonia.db/set", cid, "");
        await default4("backend/server/updateContractFilesTotalSize", owner, -Number(size));
        if (ultimateOwnerID && size && ownerSizeTotalWorker) {
          await ownerSizeTotalWorker.rpcSbp("worker/updateSizeSideEffects", { resourceID: cid, size: -parseInt(size), ultimateOwnerID });
        }
      },
      async "backend/deleteContract"(cid, ultimateOwnerID, skipIfDeleted) {
        let contractsPendingDeletion = default4("okTurtles.data/get", "contractsPendingDeletion");
        if (!contractsPendingDeletion) {
          contractsPendingDeletion = /* @__PURE__ */ new Set();
          default4("okTurtles.data/set", "contractsPendingDeletion", contractsPendingDeletion);
        }
        if (contractsPendingDeletion.has(cid)) {
          return;
        }
        contractsPendingDeletion.add(cid);
        return await default4("chelonia/queueInvocation", cid, async () => {
          const owner = await default4("chelonia.db/get", `_private_owner_${cid}`);
          if (!ultimateOwnerID) ultimateOwnerID = await lookupUltimateOwner(cid);
          const rawManifest = await default4("chelonia.db/get", cid);
          const size = await default4("chelonia.db/get", `_private_size_${cid}`);
          if (rawManifest === "") {
            if (skipIfDeleted) return;
            throw new BackendErrorGone();
          }
          if (!rawManifest) {
            if (skipIfDeleted) return;
            throw new BackendErrorNotFound();
          }
          const resourcesKey = `_private_resources_${cid}`;
          const resources = await default4("chelonia.db/get", resourcesKey);
          if (resources) {
            await Promise.allSettled(resources.split("\0").map((resourceCid) => {
              const parsed = parseCID(resourceCid);
              if (parsed.code === multicodes.SHELTER_CONTRACT_DATA) {
                return default4("chelonia.persistentActions/enqueue", ["backend/deleteContract", resourceCid, ultimateOwnerID, true]);
              } else if (parsed.code === multicodes.SHELTER_FILE_MANIFEST) {
                return default4("chelonia.persistentActions/enqueue", ["backend/deleteFile", resourceCid, ultimateOwnerID, true]);
              } else {
                console.warn({ cid, resourceCid, code: parsed.code }, "Resource should be deleted but it is of an unknown type");
              }
              return void 0;
            }));
          }
          await default4("chelonia.db/delete", resourcesKey);
          const latestHEADinfo = await default4("chelonia/db/latestHEADinfo", cid);
          if (latestHEADinfo) {
            for (let i = latestHEADinfo.height; i > 0; i--) {
              const eventKey = `_private_hidx=${cid}#${i}`;
              const event = await default4("chelonia.db/get", eventKey);
              if (event) {
                await default4("chelonia.db/delete", JSON.parse(event).hash);
                await default4("chelonia.db/delete", eventKey);
              }
              if (i % KEYOP_SEGMENT_LENGTH === 0) {
                await default4("chelonia.db/delete", `_private_keyop_idx_${cid}_${i}`);
              }
            }
            await default4("chelonia/db/deleteLatestHEADinfo", cid);
          }
          const kvIndexKey = `_private_kvIdx_${cid}`;
          const kvKeys = await default4("chelonia.db/get", kvIndexKey);
          if (kvKeys) {
            await Promise.all(kvKeys.split("\0").map((key) => {
              return default4("chelonia.db/delete", `_private_kv_${cid}_${key}`);
            }));
          }
          await default4("chelonia.db/delete", kvIndexKey);
          await default4("backend/server/removeFromIndirectResourcesIndex", cid);
          await default4("chelonia.db/delete", `_private_indirectResources_${cid}`);
          await default4("chelonia.db/get", `_private_cid2name_${cid}`).then((name) => {
            if (!name) return;
            return Promise.all([
              default4("chelonia.db/delete", `_private_cid2name_${cid}`),
              appendToOrphanedNamesIndex(name)
            ]);
          });
          await default4("chelonia.db/delete", `_private_rid_${cid}`);
          await default4("chelonia.db/delete", `_private_owner_${cid}`);
          await default4("chelonia.db/delete", `_private_size_${cid}`);
          await default4("chelonia.db/delete", `_private_contractFilesTotalSize_${cid}`);
          await default4("chelonia.db/delete", `_private_deletionTokenDgst_${cid}`);
          await removeFromIndexFactory(`_private_resources_${owner}`)(cid);
          await default4("chelonia.db/delete", `_private_hidx=${cid}#0`);
          await default4("chelonia.db/delete", `_private_keyop_idx_${cid}_0`);
          await default4("chelonia.db/set", cid, "");
          default4("chelonia/private/removeImmediately", cid);
          if (size && ownerSizeTotalWorker) {
            await ownerSizeTotalWorker.rpcSbp("worker/updateSizeSideEffects", { resourceID: cid, size: -parseInt(size), ultimateOwnerID });
          }
          await default4("chelonia.db/delete", `_private_cheloniaState_${cid}`);
          await removeFromIndexFactory("_private_cheloniaState_index")(cid);
          await removeFromIndexFactory("_private_billable_entities")(cid);
          default4("backend/server/broadcastDeletion", cid).catch((e) => {
            console.error(e, "Error broadcasting contract deletion", cid);
          });
        }).finally(() => {
          contractsPendingDeletion.delete(cid);
        }).catch((e) => {
          console.error(e, "Error in contract deletion cleanup");
        });
      }
    });
    if (process9.env.NODE_ENV === "development" && !process9.env.CI) {
      hapi.events.on("response", (request) => {
        const req = request;
        const headers = req.headers;
        const info = req.info;
        const ip = headers["x-real-ip"] || info.remoteAddress;
        const response = req.response;
        console.debug(default8`{grey ${ip}: ${req.method} ${req.path} --> ${response.statusCode}}`);
      });
    }
    default4("okTurtles.data/set", PUBSUB_INSTANCE, createServer(hapi.listener, {
      serverHandlers: {
        connection(socket) {
          const versionInfo = {
            GI_VERSION: GI_VERSION || null,
            CONTRACTS_VERSION: CONTRACTS_VERSION || null
          };
          socket.send(createNotification(NOTIFICATION_TYPE.VERSION_INFO, versionInfo));
        }
      },
      socketHandlers: {
        // The `close()` handler signals the server that the WS has been closed and
        // that subsequent messages to subscribed channels should now be sent to its
        // associated web push subscription, if it exists.
        close() {
          const socket = this;
          const server = this.server;
          const subscriptionId = socket.pushSubscriptionId;
          if (!subscriptionId) return;
          const pushSubscriptions = server.pushSubscriptions;
          const subscribersByChannelID = server.subscribersByChannelID;
          if (!pushSubscriptions[subscriptionId]) return;
          const subscription = pushSubscriptions[subscriptionId];
          const sockets = subscription.sockets;
          sockets.delete(socket);
          delete socket.pushSubscriptionId;
          if (sockets.size === 0) {
            const subscriptions = subscription.subscriptions;
            for (const channelID of subscriptions) {
              const channelKey = channelID;
              if (!subscribersByChannelID[channelKey]) {
                subscribersByChannelID[channelKey] = /* @__PURE__ */ new Set();
              }
              subscribersByChannelID[channelKey].add(subscription);
            }
          }
        }
      },
      messageHandlers: {
        [REQUEST_TYPE.PUSH_ACTION]: async function(...args) {
          const { data } = args[0];
          const socket = this;
          const dataObj = data;
          const { action, payload } = dataObj;
          if (!action) {
            socket.send(createPushErrorResponse({ message: "'action' field is required" }));
          }
          const handler = pushServerActionhandlers[action];
          if (handler) {
            try {
              await handler(socket, payload);
            } catch (error) {
              const message = error?.message || `push server failed to perform [${action}] action`;
              console.warn(error, `[${socket.ip}] Action '${action}' for '${REQUEST_TYPE.PUSH_ACTION}' handler failed: ${message}`);
              socket.send(createPushErrorResponse({ actionType: action, message }));
            }
          } else {
            ;
            socket.send(createPushErrorResponse({ message: `No handler for the '${action}' action` }));
          }
        },
        // This handler adds subscribed channels to the web push subscription
        // associated with the WS, so that when the WS is closed we can continue
        // sending messages as web push notifications.
        [NOTIFICATION_TYPE.SUB](...args) {
          const { channelID } = args[0];
          const socket = this;
          const { server } = this;
          if (!socket.pushSubscriptionId) return;
          const serverObj = server;
          const pushSubscriptions = serverObj.pushSubscriptions;
          if (!pushSubscriptions[socket.pushSubscriptionId]) {
            delete socket.pushSubscriptionId;
            return;
          }
          addChannelToSubscription(serverObj, socket.pushSubscriptionId, channelID);
        },
        // This handler removes subscribed channels from the web push subscription
        // associated with the WS, so that when the WS is closed we don't send
        // messages as web push notifications.
        [NOTIFICATION_TYPE.UNSUB](...args) {
          const { channelID } = args[0];
          const socket = this;
          const { server } = this;
          if (!socket.pushSubscriptionId) return;
          const serverObj = server;
          const pushSubscriptions = serverObj.pushSubscriptions;
          if (!pushSubscriptions[socket.pushSubscriptionId]) {
            delete socket.pushSubscriptionId;
            return;
          }
          deleteChannelFromSubscription(serverObj, socket.pushSubscriptionId, channelID);
        }
      }
    }));
    (async function() {
      await initDB();
      if (ownerSizeTotalWorker) await ownerSizeTotalWorker.ready;
      if (creditsWorker) await creditsWorker.ready;
      await default4("chelonia/configure", SERVER);
      default4("chelonia.persistentActions/configure", {
        databaseKey: "_private_persistent_actions"
      });
      const savedStateIndex = await default4("chelonia.db/get", "_private_cheloniaState_index");
      if (savedStateIndex) {
        const recoveredState = /* @__PURE__ */ Object.create(null);
        recoveredState.contracts = /* @__PURE__ */ Object.create(null);
        const channels = default4("okTurtles.data/get", PUBSUB_INSTANCE).channels;
        await Promise.all(savedStateIndex.split("\0").map(async (contractID) => {
          const cpSerialized = await default4("chelonia.db/get", `_private_cheloniaState_${contractID}`);
          if (!cpSerialized) {
            console.warn(`[server] missing state for contractID ${contractID} - skipping setup for this contract`);
            return;
          }
          const cp = JSON.parse(cpSerialized);
          recoveredState[contractID] = cp.contractState;
          recoveredState.contracts[contractID] = cp.cheloniaContractInfo;
          channels.add(contractID);
        }));
        Object.assign(default4("chelonia/rootState"), recoveredState);
      }
      const savedWebPushIndex = await default4("chelonia.db/get", "_private_webpush_index");
      if (savedWebPushIndex) {
        const { pushSubscriptions, subscribersByChannelID } = default4("okTurtles.data/get", PUBSUB_INSTANCE);
        await Promise.all(savedWebPushIndex.split("\0").map(async (subscriptionId) => {
          const subscriptionSerialized = await default4("chelonia.db/get", `_private_webpush_${subscriptionId}`);
          if (!subscriptionSerialized) {
            console.warn(`[server] missing state for subscriptionId '${subscriptionId}' - skipping setup for this subscription`);
            return;
          }
          const { settings, subscriptionInfo, channelIDs } = JSON.parse(subscriptionSerialized);
          pushSubscriptions[subscriptionId] = subscriptionInfoWrapper(subscriptionId, subscriptionInfo, { channelIDs, settings });
          channelIDs.forEach((channelID) => {
            if (!subscribersByChannelID[channelID]) subscribersByChannelID[channelID] = /* @__PURE__ */ new Set();
            subscribersByChannelID[channelID].add(pushSubscriptions[subscriptionId]);
          });
        }));
      }
      default4("chelonia.persistentActions/load").catch((e) => {
        console.error(e, "Error loading persistent actions");
      });
      await hapi.register([
        { plugin: auth_default },
        { plugin: default7 }
        // {
        //   plugin: require('hapi-pino'),
        //   options: {
        //     instance: logger
        //   }
        // }
      ]);
      await Promise.resolve().then(() => (init_routes(), routes_exports));
      await hapi.start();
      console.info("Backend server running at:", hapi.info.uri);
      default4("okTurtles.events/emit", SERVER_RUNNING, hapi);
    })();
    (() => {
      const map = /* @__PURE__ */ new WeakMap();
      setInterval(() => {
        const now = Date.now();
        const pubsub = default4("okTurtles.data/get", PUBSUB_INSTANCE);
        const notification = JSON.stringify({ type: "recurring" });
        Object.values(pubsub.pushSubscriptions || {}).filter((pushSubscription) => {
          const sub = pushSubscription;
          const settings = sub.settings;
          const sockets = sub.sockets;
          return !!settings?.heartbeatInterval && sockets.size === 0;
        }).forEach((pushSubscription) => {
          const sub = pushSubscription;
          const last = map.get(sub) ?? Number.NEGATIVE_INFINITY;
          const settings = sub.settings;
          if (now - last < settings.heartbeatInterval) return;
          postEvent(sub, notification).then(() => {
            map.set(sub, now);
          }).catch((e) => {
            console.warn(e, "Error sending recurring message to web push client", sub.id);
          });
        });
      }, 1 * 60 * 60 * 1e3);
    })();
  }
});

// src/serve/index.ts
var serve_exports = {};
__export(serve_exports, {
  default: () => serve_default
});
import process10 from "node:process";
function logSBP(domain, selector, data) {
  if (!dontLog[selector]) {
    if (selector === "backend/server/handleEntry") {
      console.debug(default8.bold(`[sbp] ${selector}`), data[0].description());
    } else {
      console.debug(default8.bold(`[sbp] ${selector}`), data);
    }
  }
}
var dontLog, serve_default, shutdownFn;
var init_serve = __esm({
  "src/serve/index.ts"() {
    "use strict";
    init_deps();
    init_events();
    init_instance_keys();
    init_logger();
    console.info("NODE_ENV =", process10.env.NODE_ENV);
    dontLog = {
      "backend/server/broadcastEntry": true,
      "backend/server/broadcastDeletion": true,
      "backend/server/broadcastKV": true
    };
    ["backend"].forEach((domain) => default4("sbp/filters/domain/add", domain, logSBP));
    [].forEach((sel) => default4("sbp/filters/selector/add", sel, logSBP));
    serve_default = new Promise((resolve4, reject) => {
      default4("okTurtles.events/on", SERVER_RUNNING, function() {
        console.info(default8.bold("backend startup sequence complete."));
        resolve4();
      });
      Promise.resolve().then(() => (init_server(), server_exports)).catch(reject);
    });
    shutdownFn = function(message) {
      default4("okTurtles.data/apply", PUBSUB_INSTANCE, function(pubsub) {
        console.info("message received in child, shutting down...", message);
        pubsub.on("close", async function() {
          try {
            await default4("backend/server/stop");
            console.info("Hapi server down");
            process10.send?.({});
            process10.nextTick(() => process10.exit(0));
          } catch (err) {
            console.error(err, "Error during shutdown");
            process10.exit(1);
          }
        });
        pubsub.close();
        pubsub.clients.forEach((client) => client.terminate());
      });
    };
    process10.on("SIGUSR2", shutdownFn);
    process10.on("message", shutdownFn);
    process10.on("uncaughtException", (err) => {
      console.error(err, "[server] Unhandled exception");
      process10.exit(1);
    });
    process10.on("unhandledRejection", (reason) => {
      console.error(reason, "[server] Unhandled promise rejection:", reason);
      process10.exit(1);
    });
  }
});

// src/commands.ts
var commands_exports = {};
__export(commands_exports, {
  deploy: () => deploy,
  eventsAfter: () => eventsAfter,
  get: () => get,
  hash: () => hash2,
  help: () => help,
  keygen: () => keygen2,
  manifest: () => manifest,
  migrate: () => migrate,
  serve: () => serve,
  upload: () => upload,
  verifySignature: () => verifySignature2,
  version: () => version
});

// src/deploy.ts
init_deps();

// src/upload.ts
init_deps();
init_utils();
async function upload(args, internal = false) {
  const [urlOrDirOrSqliteFile, ...files] = args;
  if (files.length === 0) throw new Error("missing files!");
  const uploaded = [];
  const uploaderFn = await isDir(urlOrDirOrSqliteFile) ? uploadEntryToDir : urlOrDirOrSqliteFile.endsWith(".db") ? uploadEntryToSQLite : uploadEntryToURL;
  for (const filepath_ of files) {
    let type = multicodes2.RAW;
    let filepath = filepath_;
    if (internal) {
      if (filepath_[1] !== "|") throw new Error("Invalid path format");
      switch (filepath_[0]) {
        case "r":
          break;
        case "m":
          type = multicodes2.SHELTER_CONTRACT_MANIFEST;
          break;
        case "t":
          type = multicodes2.SHELTER_CONTRACT_TEXT;
          break;
        default:
          throw new Error("Unknown file type: " + filepath_[0]);
      }
      filepath = filepath_.slice(2);
    }
    const entry = await createEntryFromFile(filepath, type);
    const destination = await uploaderFn(entry, urlOrDirOrSqliteFile);
    if (!internal) {
      console.log(colors.green("uploaded:"), destination);
    } else {
      console.log(colors.green(`${path.relative(".", filepath)}:`), destination);
    }
    uploaded.push([filepath, destination]);
  }
  return uploaded;
}
async function uploadEntryToURL([cid, buffer], url) {
  const form = new FormData();
  form.append("hash", cid);
  form.append("data", new Blob([buffer]));
  return await fetch(`${url}/dev-file`, { method: "POST", body: form }).then(handleFetchResult("text")).then((r) => {
    if (r !== `/file/${cid}`) {
      throw new Error(`server returned bad URL: ${r}`);
    }
    return `${url}${r}`;
  });
}
async function uploadEntryToDir([cid, buffer], dir) {
  await revokeNet();
  const destination = path.join(dir, cid);
  await Deno.writeFile(destination, buffer);
  return destination;
}
async function uploadEntryToSQLite([cid, buffer], sqlitedb) {
  await revokeNet();
  const { initStorage: initStorage3, writeData: writeData3 } = await Promise.resolve().then(() => (init_database_sqlite(), database_sqlite_exports));
  await initStorage3({ dirname: path.dirname(sqlitedb), filename: path.basename(sqlitedb) });
  await writeData3(cid, buffer);
  return cid;
}
function handleFetchResult(type) {
  return async function(r) {
    if (!r.ok) throw new Error(`${r.status}: ${r.statusText}`);
    return await r[type]();
  };
}

// src/deploy.ts
var CONTRACT_TEXT_PREFIX = "t|";
var CONTRACT_MANIFEST_PREFIX = "m|";
var ContractBodySchema = z.object({
  contract: z.object({ file: z.string() }),
  contractSlim: z.object({ file: z.string() }).optional()
});
async function deploy(args) {
  const [urlOrDirOrSqliteFile, ...manifests] = args;
  if (manifests.length === 0) throw new Error("missing url or manifests!");
  const toUpload = [];
  for (const manifestPath of manifests) {
    const json = JSON.parse(Deno.readTextFileSync(manifestPath));
    const body = ContractBodySchema.parse(JSON.parse(json.body));
    const dirname4 = path.dirname(manifestPath);
    toUpload.push(CONTRACT_TEXT_PREFIX + path.join(dirname4, body.contract.file));
    if (body.contractSlim) {
      toUpload.push(CONTRACT_TEXT_PREFIX + path.join(dirname4, body.contractSlim.file));
    }
    toUpload.push(CONTRACT_MANIFEST_PREFIX + manifestPath);
  }
  await upload([urlOrDirOrSqliteFile, ...toUpload], true);
}

// src/eventsAfter.ts
init_deps();
init_utils();
var backend;
var defaultLimit = 50;
var headPrefix = "head=";
async function eventsAfter(args) {
  const parsedArgs = flags.parse(args);
  const limit = Number(parsedArgs.limit ?? defaultLimit);
  if (!isArrayLength(limit)) exit("argument --limit must be a valid array length");
  const [urlOrLocalPath, contractID] = parsedArgs._.map(String);
  const height = Number(parsedArgs._[2]);
  const src = urlOrLocalPath;
  try {
    let messages;
    if (isURL(src)) {
      messages = await getRemoteMessagesSince(src, contractID, height, limit);
    } else {
      messages = await getMessagesSince(src, contractID, height, limit);
    }
    console.log(JSON.stringify(messages, null, 2));
  } catch (error) {
    exit(error);
  }
}
async function getMessage(hash3) {
  const value = await readString(hash3);
  if (!value) throw new Error(`no entry for ${hash3}!`);
  return JSON.parse(value);
}
async function getMessagesSince(src, contractID, sinceHeight, limit) {
  backend = await getBackend(src);
  const contractHEAD = await readString(`${headPrefix}${contractID}`);
  if (contractHEAD === void 0) {
    throw new Deno.errors.NotFound(`contract ${contractID} doesn't exist!`);
  }
  const entries = [];
  let currentHEAD = JSON.parse(contractHEAD).HEAD;
  let currentHeight;
  while (true) {
    const entry = await getMessage(currentHEAD);
    if (!entry) {
      throw new Deno.errors.NotFound(`entry ${currentHEAD} no longer exists.`);
    }
    const head = JSON.parse(entry.head);
    currentHeight = head.height;
    entries.push(entry);
    if (currentHeight === sinceHeight) {
      break;
    }
    currentHEAD = head.previousHEAD;
  }
  return entries.reverse().slice(0, limit);
}
async function getRemoteMessagesSince(src, contractID, sinceHeight, limit) {
  const response = await fetch(`${src}/eventsAfter/${contractID}/${sinceHeight}`);
  if (!response.ok) {
    const bodyText = await response.text().catch(() => "") || "";
    throw new Error(`failed network request to ${src}: ${response.status} - ${response.statusText} - '${bodyText}'`);
  }
  const b64messages = await response.json();
  if (b64messages.length > limit) {
    b64messages.length = limit;
  }
  return b64messages.map((b64str) => JSON.parse(new TextDecoder().decode(base64.decodeBase64(b64str))));
}
async function readString(key) {
  const rv = await backend.readData(key);
  if (rv === void 0) return void 0;
  return typeof rv === "string" ? rv : new TextDecoder().decode(rv);
}

// src/get.ts
init_deps();
init_utils();
async function get(args) {
  const parsedArgs = flags.parse(args);
  const [urlOrLocalPath, key] = parsedArgs._.map(String);
  const src = urlOrLocalPath;
  try {
    const data = isURL(src) ? await readRemoteData(src, key) : await (await getBackend(src)).readData(key);
    if (data === void 0) exit(`no entry found for ${key}`);
    if (typeof data === "string") {
      console.log(data);
    } else {
      await writeAll(Deno.stdout, data);
    }
  } catch (error) {
    exit(error);
  }
}

// src/hash.ts
init_utils();
async function hash2(args, multicode = multicodes2.RAW, internal = false) {
  const [filename] = args;
  if (!filename) {
    console.error("please pass in a file");
    Deno.exit(1);
  }
  const [cid] = await createEntryFromFile(filename, multicode);
  if (!internal) {
    console.log(`CID(${filename}):`, cid);
  }
  return cid;
}

// src/help.ts
function help(args) {
  if (args == null || args.length === 0) {
    console.log(`
      chel
      chel help [command]
      chel version
      chel keygen [--out <key.json>] [--pubout <key.pub.json>]
      chel verifySignature [-k <pubkey.json>] <manifest.json>
      chel manifest [-k|--key <pubkey1.json> [-k|--key <pubkey2.json> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] [-n|--name <name>] <key.json> <contract-bundle.js>
      chel deploy <url-or-dir-or-sqlitedb> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]
      chel upload <url-or-dir-or-sqlitedb> <file1> [<file2> [<file3> ...]]
      chel latestState <url> <contractID>
      chel eventsAfter [--limit N] <url-or-dir-or-sqlitedb> <contractID> <height>
      chel eventsBefore [--limit N] <url> <contractID> <hash>
      chel get <url-or-dir-or-sqlitedb> <hash>
      chel hash <file>
      chel migrate --from <backend> --to <backend> --out <dir-or-sqlitedb> <dir-or-sqlitedb>
    `);
  } else if (helpDict[args[0]]) {
    console.log(helpDict[args[0]]);
  } else {
    console.error(`Unknown command: ${args[0]}`);
  }
}
var helpDict = {
  help: `
    chel help [command]
  `,
  version: `
    chel version
  `,
  hash: `
    chel hash <file>

    Computes and logs the content identifier (CID) for the given file.
    File contents will be interpreted as raw binary data, unless the file extension is '.json'.
  `,
  manifest: `
    chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]]
                  [--out=<manifest.json>]
                  [--slim <contract-slim.js>]
                  [-v|--version <version>]
                  <key.json> <contract-bundle.js>

    If unspecified, <version> is set to 'x'.
  `,
  migrate: `
    chel migrate --from (fs|sqlite) --to (fs|sqlite) --out <dir-or-sqlitedb> [<dir-or-sqlitedb>='.']

    Reads all key-value pairs from a given database and creates or updates another database accordingly.
    - The output database will be created if necessary.
    - The source database won't be modified nor deleted.
    - Invalid key-value pairs entries will be skipped.
    - Arguments --from and --to must be different.
    - The source and --out must resolve to distinct paths.
    - Requires read and write access to the source.
    - Requires read and write access to --out.
  `,
  upload: `
    chel upload <url-or-dir-or-sqlitedb> <file1> [<file2> [<file3> ...]]

    Requires read and write access to the destination.
  `,
  deploy: `
    chel deploy <url-or-dir> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]
  `,
  eventsAfter: `
    chel eventsAfter [--limit N=50] <url-or-localpath> <contractID> <hash>

    Displays a JSON array of the N first events that happened in a given contract, since a given entry identified by its hash.
    - Older events are displayed first.
    - The output is parseable with tools such as 'jq'.
    - If <hash> is the same as <contractID>, then the oldest events will be returned.
    - If <url-or-localpath> is a URL, then its /eventsAfter REST endpoint will be called.
  `,
  get: `
    chel get <url-or-dir-or-sqlitedb> <hash>
    
    Retrieves the entry associated with a given <hash> key, from a given database or server.
    When the first argument is a URL, this queries the GET <url>/file/<hash> route.

    - The output can be piped to a file, like this:
      chel get https://url.com mygreatlongkey > file.png
  `
};

// src/keygen.ts
init_deps();
init_utils();
var keygen2 = async (args) => {
  await revokeNet();
  const parsedArgs = flags.parse(args);
  const key = keygen(EDWARDS25519SHA512BATCH);
  const pubKeyData = {
    version: "1.0.0",
    pubkey: serializeKey(key, false)
  };
  const keyData = {
    ...pubKeyData,
    privkey: serializeKey(key, true)
  };
  const result = JSON.stringify(keyData);
  const pubResult = JSON.stringify(pubKeyData);
  const idx = keyId(key).slice(-12);
  const outFile = parsedArgs.out || `${EDWARDS25519SHA512BATCH}-${idx}.json`;
  const pubOutFile = parsedArgs.pubout || `${EDWARDS25519SHA512BATCH}-${idx}.pub.json`;
  await Deno.writeTextFile(outFile, result);
  console.log(colors.green("wrote:"), outFile, colors.blue("(secret)"));
  await Deno.writeTextFile(pubOutFile, pubResult);
  console.log(colors.green("wrote:"), pubOutFile, colors.blue("(public)"));
};

// src/manifest.ts
init_deps();
init_utils();
function isSigningKeyDescriptor(obj) {
  return obj !== null && typeof obj === "object" && typeof obj.privkey === "string";
}
async function manifest(args) {
  await revokeNet();
  const parsedArgs = flags.parse(args, { collect: ["key"], alias: { key: "k" } });
  const [keyFileRaw, contractFileRaw] = parsedArgs._;
  if (typeof keyFileRaw !== "string" || typeof contractFileRaw !== "string") {
    exit("Missing or invalid key or contract file");
  }
  const keyFile = keyFileRaw;
  const contractFile = contractFileRaw;
  const parsedFilepath = path.parse(contractFile);
  const { name: contractFileName, base: contractBasename, dir: contractDir } = parsedFilepath;
  const name = parsedArgs.name || parsedArgs.n || contractFileName;
  const version2 = parsedArgs.version || parsedArgs.v || "x";
  const slim = parsedArgs.slim || parsedArgs.s;
  const outFile = parsedArgs.out || path.join(contractDir, `${contractFileName}.${version2}.manifest.json`);
  if (!keyFile) exit("Missing signing key file");
  const signingKeyDescriptorRaw = await readJsonFile(keyFile);
  if (!isSigningKeyDescriptor(signingKeyDescriptorRaw)) {
    exit("Invalid signing key file: missing or invalid privkey", true);
  }
  const signingKeyDescriptor = signingKeyDescriptorRaw;
  const signingKey = deserializeKey(signingKeyDescriptor.privkey);
  const publicKeys = Array.from(new Set(
    [serializeKey(signingKey, false)].concat(...await Promise.all(parsedArgs.key?.map(
      async (kf) => {
        if (typeof kf !== "string" && typeof kf !== "number") {
          exit(`Invalid key file reference: ${String(kf)}`);
        }
        const descriptor = await readJsonFile(String(kf));
        const key = deserializeKey(descriptor.pubkey);
        if (key.type !== EDWARDS25519SHA512BATCH) {
          exit(`Invalid key type ${key.type}; only ${EDWARDS25519SHA512BATCH} keys are supported.`);
        }
        return serializeKey(key, false);
      }
    ) || []))
  ));
  const body = {
    name,
    version: version2,
    contract: {
      hash: await hash2([contractFile], multicodes2.SHELTER_CONTRACT_TEXT, true),
      file: contractBasename
    },
    signingKeys: publicKeys
  };
  if (typeof slim === "string" && slim !== "") {
    body.contractSlim = {
      file: path.basename(slim),
      hash: await hash2([slim], multicodes2.SHELTER_CONTRACT_TEXT, true)
    };
  }
  const serializedBody = JSON.stringify(body);
  const head = { manifestVersion: "1.0.0" };
  const serializedHead = JSON.stringify(head);
  const manifest2 = JSON.stringify({
    head: serializedHead,
    body: serializedBody,
    signature: {
      keyId: keyId(signingKey),
      value: sign(signingKey, serializedBody + serializedHead)
    }
  });
  if (parsedArgs.out === "-") {
    console.log(manifest2);
  } else {
    Deno.writeTextFileSync(outFile, manifest2);
    console.log(colors.green("wrote:"), outFile);
  }
}

// src/migrate.ts
init_deps();
init_utils();
async function migrate(args) {
  await revokeNet();
  const parsedArgs = flags.parse(args);
  const { from, to, out } = parsedArgs;
  const src = path.resolve(parsedArgs._[0] ? String(parsedArgs._[0]) : ".");
  if (!from) exit("missing argument: --from");
  if (!to) exit("missing argument: --to");
  if (!out) exit("missing argument: --out");
  if (from === to) exit("arguments --from and --to must be different");
  let backendFrom;
  let backendTo;
  try {
    backendFrom = await getBackend(src, { type: from, create: false });
    backendTo = await getBackend(out, { type: to, create: true });
  } catch (error) {
    exit(error);
  }
  const numKeys = await backendFrom.count();
  let numVisitedKeys = 0;
  for await (const key of backendFrom.iterKeys()) {
    if (!isValidKey(key)) continue;
    const value = await backendFrom.readData(key);
    if (value === void 0) continue;
    if (isNotHashKey(key)) {
      await backendTo.writeData(key, value);
    } else {
      await backendTo.writeDataOnce(key, value);
    }
    ++numVisitedKeys;
    if (numVisitedKeys % (numKeys / 10) < 1) {
      console.log(`[chel] Migrating... ${Math.round(numVisitedKeys / (numKeys / 10))}0% done`);
    }
  }
  numKeys && console.log(`[chel] ${colors.green("Migrated:")} ${numKeys} entries`);
}

// src/serve.ts
init_deps();
import process11 from "node:process";
async function startDashboardServer(port) {
  const dashboardServer = await Promise.resolve().then(() => (init_dashboard_server(), dashboard_server_exports));
  await dashboardServer.startDashboard(port);
}
async function startApplicationServer(port, directory) {
  process11.env.API_PORT = port.toString();
  process11.env.CHELONIA_APP_DIR = directory;
  const startServer = await Promise.resolve().then(() => (init_serve(), serve_exports));
  await startServer.default;
}
async function serve(args) {
  const { directory, options: options2 } = parseServeArgs(args);
  const {
    dp: dashboardPort = 3e3,
    port: applicationPort = 8e3,
    "db-type": dbType = "mem",
    "db-location": dbLocation
  } = options2;
  console.log(colors.cyan("\u{1F680} Starting Chelonia app server..."));
  console.log(colors.blue("Directory:"), directory || "");
  console.log(colors.blue("Dashboard port:"), dashboardPort);
  console.log(colors.blue("Application port:"), applicationPort);
  console.log(colors.blue("Database type:"), dbType);
  if (dbLocation) {
    console.log(colors.gray(`Database location: ${dbLocation}`));
  }
  try {
    console.log(colors.cyan("\u{1F680} Starting dashboard server..."));
    try {
      await startDashboardServer(dashboardPort);
      console.log(colors.green(`\u2705 Dashboard server started on port ${dashboardPort}`));
    } catch (error) {
      console.error(colors.red("\u274C Failed to start dashboard server:"), error);
      throw error;
    }
    console.log(colors.cyan("\u{1F680} Starting application server..."));
    try {
      await startApplicationServer(applicationPort, directory);
      console.log(colors.green(`\u2705 Application server started on port ${applicationPort}`));
    } catch (error) {
      console.error(colors.red("\u274C Failed to start application server:"), error);
      throw error;
    }
    console.log(colors.green("\u2705 Both servers started successfully!"));
    console.log(colors.yellow(`\u{1F4CA} Dashboard: http://localhost:${dashboardPort}`));
    console.log(colors.yellow(`\u{1F310} Application: http://localhost:${applicationPort}`));
    await new Promise(() => {
    });
  } catch (error) {
    console.error(colors.red("\u274C Failed to start server:"), error);
    process11.exit(1);
  }
}
function parseServeArgs(args) {
  const parsed = flags.parse(args, {
    string: ["dp", "port", "db-type", "db-location"],
    default: {
      dp: "3000",
      port: "8000",
      "db-type": "mem"
    }
  });
  const directory = parsed._[0] || ".";
  const options2 = {
    dp: parseInt(parsed.dp),
    port: parseInt(parsed.port),
    "db-type": parsed["db-type"],
    "db-location": parsed["db-location"]
  };
  return { directory, options: options2 };
}

// src/verifySignature.ts
init_deps();
init_utils();
function isExternalKeyDescriptor(obj) {
  return obj !== null && typeof obj === "object" && typeof obj.pubkey === "string";
}
function isManifest(obj) {
  const maybe = obj;
  return typeof obj === "object" && obj !== null && typeof maybe.head === "string" && typeof maybe.body === "string" && typeof maybe.signature === "object" && maybe.signature !== null;
}
var verifySignature2 = async (args, internal = false) => {
  await revokeNet();
  const parsedArgs = flags.parse(args);
  const [manifestFile] = parsedArgs._;
  const keyFile = parsedArgs.k;
  const [externalKeyDescriptorRaw, manifestRaw] = await Promise.all([
    typeof keyFile === "string" ? readJsonFile(keyFile) : null,
    readJsonFile(manifestFile)
  ]);
  let externalKeyDescriptor;
  if (keyFile && externalKeyDescriptorRaw) {
    if (!isExternalKeyDescriptor(externalKeyDescriptorRaw)) {
      return exit("Public key missing from key file", internal);
    }
    externalKeyDescriptor = externalKeyDescriptorRaw;
  }
  if (!isManifest(manifestRaw)) {
    return exit("Invalid manifest: missing signature key ID", internal);
  }
  const manifest2 = manifestRaw;
  if (!manifest2.head) {
    exit("Invalid manifest: missing head", internal);
  }
  if (!manifest2.body) {
    exit("Invalid manifest: missing body", internal);
  }
  if (!manifest2.signature) {
    exit("Invalid manifest: missing signature", internal);
  }
  if (!manifest2.signature.keyId) {
    exit("Invalid manifest: missing signature key ID", internal);
  }
  if (!manifest2.signature.value) {
    exit("Invalid manifest: missing signature value", internal);
  }
  const body = JSON.parse(manifest2.body);
  const signingKey = body.signingKeys?.find((k) => {
    return keyId(k) === manifest2.signature.keyId;
  });
  if (externalKeyDescriptor) {
    const id = keyId(externalKeyDescriptor.pubkey);
    if (manifest2.signature.keyId !== id) {
      exit(`Invalid manifest signature: key ID doesn't match the provided key file. Expected ${id} but got ${manifest2.signature.keyId}.`, internal);
    }
  }
  const serializedPubKey = signingKey || externalKeyDescriptor?.pubkey;
  if (!serializedPubKey) {
    exit("The manifest appears to be signed but verification can't proceed because the key used is unknown.", internal);
  }
  const pubKey = deserializeKey(serializedPubKey);
  try {
    verifySignature(pubKey, manifest2.body + manifest2.head, manifest2.signature.value);
  } catch (e) {
    exit("Error validating signature: " + (e?.message || String(e)), internal);
  }
  if (!signingKey) {
    exit("The signature is valid but the signing key is not listed in signingKeys", internal);
  }
  const parsedFilepath = path.parse(manifestFile);
  if (!body.contract?.file) {
    exit("Invalid manifest: no contract file", internal);
  }
  const computedHash = await hash2([path.join(parsedFilepath.dir, body.contract.file)], multicodes2.SHELTER_CONTRACT_TEXT, true);
  if (computedHash !== body.contract.hash) {
    exit(`Invalid contract file hash. Expected ${body.contract.hash} but got ${computedHash}`, internal);
  }
  if (body.contractSlim) {
    const computedHash2 = await hash2([path.join(parsedFilepath.dir, body.contractSlim.file)], multicodes2.SHELTER_CONTRACT_TEXT, true);
    if (computedHash2 !== body.contractSlim.hash) {
      exit(`Invalid slim contract file hash. Expected ${body.contractSlim.hash} but got ${computedHash2}`, internal);
    }
  }
  if (!internal) console.log(colors.green("ok"), "all checks passed");
};

// src/version.ts
function version() {
  console.log("3.0.0");
}

// src/main.ts
var [command, ...rest] = Deno.args;
if (!command) {
  help();
} else if (commands_exports[command]) {
  await commands_exports[command](rest);
} else {
  console.error(`Unknown command: ${command}`);
  Deno.exit(1);
}
Deno.exit(0);
