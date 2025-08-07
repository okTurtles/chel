#!/usr/bin/env -S deno run --allow-read=./ --allow-write=./  --allow-net --no-remote --import-map=vendor/import_map.json
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x2)(function(x2) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __glob = (map) => (path5) => {
  var fn = map[path5];
  if (fn) return fn();
  throw new Error("Module not found in bundle: " + path5);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from3, except, desc) => {
  if (from3 && typeof from3 === "object" || typeof from3 === "function") {
    for (let key of __getOwnPropNames(from3))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from3[key], enumerable: !(desc = __getOwnPropDesc(from3, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/deps.ts
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
import { default as default15 } from "npm:@sbp/okturtles.data@0.1.5";
import { default as default16 } from "npm:@sbp/okturtles.eventqueue@1.2.0";
import { default as default17 } from "npm:@sbp/okturtles.events@1.0.0";
import { validationMixin } from "npm:vuelidate@0.7.6";
var init_deps = __esm({
  "src/deps.ts"() {
    "use strict";
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
function exit(x2, internal = false) {
  const msg = x2 instanceof Error ? x2.message : String(x2);
  if (internal) throw new Error(msg);
  console.error("[chel]", colors.red("Error:"), msg);
  Deno.exit(1);
}
async function getBackend(src2, { type, create: create2 } = { type: "", create: false }) {
  const fsOptions = { internal: true, dirname: src2 };
  const sqliteOptions = { internal: true, dirname: path.dirname(src2), filename: path.basename(src2) };
  if (!create2 && !await isDir(src2) && !await isFile(src2)) throw new Error(`not found: "${src2}"`);
  let from3 = type;
  if (!from3) {
    if (await isDir(src2)) from3 = "fs";
    else if (await isFile(src2)) from3 = "sqlite";
    else throw new Error(`could not infer backend type. Not found: "${src2}"`);
  }
  let initOptions;
  switch (from3) {
    case "fs":
      initOptions = fsOptions;
      break;
    case "sqlite":
      initOptions = sqliteOptions;
      break;
    default:
      throw new Error(`unknown backend type: "${from3}"`);
  }
  const backend2 = backends[from3];
  try {
    await backend2.initStorage(initOptions);
  } catch (error) {
    throw new Error(`could not init '${from3}' storage backend at "${src2}": ${error.message}`);
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
async function readRemoteData(src2, key) {
  const buffer = await fetch(`${src2}/file/${key}`).then(async (r) => r.ok ? await r.arrayBuffer() : await Promise.reject(new Error(`failed network request to ${src2}: ${r.status} - ${r.statusText}`)));
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
import process2 from "node:process";
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
    handler: (_request, h2) => h2.file("index.html")
  });
  dashboardServer.route({
    method: "GET",
    path: "/dashboard/",
    handler: (_request, h2) => h2.file("index.html")
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
      return path2.resolve(process2.cwd(), "dist-dashboard");
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
import process3 from "node:process";
var prettyPrint, logger2, logLevel;
var init_logger = __esm({
  "src/serve/logger.ts"() {
    "use strict";
    init_deps();
    prettyPrint = process3.env.NODE_ENV === "development" || process3.env.CI || process3.env.CYPRESS_RECORD_KEY || process3.env.PRETTY;
    logger2 = default9({
      level: "debug"
    });
    logLevel = process3.env.LOG_LEVEL || (prettyPrint ? "debug" : "info");
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
      register(server, opts) {
        server.auth.scheme("chel-bearer", (server2, options2) => {
          return {
            authenticate(request, h2) {
              const { authorization } = request.headers;
              if (!authorization) {
                return h2.unauthenticated(default5.unauthorized(null, "bearer"));
              }
              const thisScheme = "bearer ";
              if (authorization.slice(0, thisScheme.length) !== thisScheme) {
                return h2.unauthenticated(default5.unauthorized(null, "bearer"));
              }
              const token = authorization.slice(thisScheme.length);
              return h2.authenticated({ credentials: { token } });
            }
          };
        });
        server.auth.scheme("chel-shelter", (server2, options2) => {
          return {
            authenticate(request, h2) {
              const { authorization } = request.headers;
              if (!authorization) {
                return h2.unauthenticated(default5.unauthorized(null, "shelter"));
              }
              const thisScheme = "shelter ";
              if (authorization.slice(0, thisScheme.length) !== thisScheme) {
                return h2.unauthenticated(default5.unauthorized(null, "shelter"));
              }
              try {
                const billableContractID = verifyShelterAuthorizationHeader(authorization);
                return h2.authenticated({ credentials: { billableContractID } });
              } catch (e2) {
                console.warn(e2, "Shelter authorization failed");
                return h2.unauthenticated(default5.unauthorized("Authentication failed", "shelter"));
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

// node_modules/.deno/@sbp+sbp@2.4.1/node_modules/@sbp/sbp/dist/esm/index.js
function sbp(selector, ...data) {
  const domain = domainFromSelector(selector);
  const starSelector = `${domain}/*`;
  const selExists = !!selectors[selector];
  let sel = selector;
  if (!selExists) {
    if (selectors[starSelector]) {
      sel = starSelector;
    } else {
      throw new Error(`SBP: selector not registered: ${selector}`);
    }
  }
  for (const filters of [selectorFilters[selector], domainFilters[domain], globalFilters]) {
    if (filters) {
      for (const filter of filters) {
        if (filter(domain, selector, data) === false)
          return;
      }
    }
  }
  if (!selExists) {
    data.unshift(selector);
  }
  return selectors[sel].apply(domains[domain].state, data);
}
function domainFromSelector(selector) {
  const domainLookup = DOMAIN_REGEX.exec(selector);
  if (domainLookup === null) {
    throw new Error(`SBP: selector missing domain: ${selector}`);
  }
  return domainLookup[0];
}
var selectors, domains, globalFilters, domainFilters, selectorFilters, unsafeSelectors, DOMAIN_REGEX, SBP_BASE_SELECTORS, esm_default;
var init_esm = __esm({
  "node_modules/.deno/@sbp+sbp@2.4.1/node_modules/@sbp/sbp/dist/esm/index.js"() {
    selectors = /* @__PURE__ */ Object.create(null);
    domains = /* @__PURE__ */ Object.create(null);
    globalFilters = [];
    domainFilters = /* @__PURE__ */ Object.create(null);
    selectorFilters = /* @__PURE__ */ Object.create(null);
    unsafeSelectors = /* @__PURE__ */ Object.create(null);
    DOMAIN_REGEX = /^[^/]+/;
    SBP_BASE_SELECTORS = {
      "sbp/selectors/register": (sels) => {
        const registered = [];
        for (const selector in sels) {
          const domainName = domainFromSelector(selector);
          const domain = domainName in domains ? domains[domainName] : domains[domainName] = { state: /* @__PURE__ */ Object.create(null), locked: false };
          if (domain.locked) {
            (console.warn || console.log)(`[SBP WARN]: not registering selector on locked domain: '${selector}'`);
          } else if (selectors[selector]) {
            (console.warn || console.log)(`[SBP WARN]: not registering already registered selector: '${selector}'`);
          } else if (typeof sels[selector] === "function") {
            if (unsafeSelectors[selector]) {
              (console.warn || console.log)(`[SBP WARN]: registering unsafe selector: '${selector}' (remember to lock after overwriting)`);
            }
            const fn = selectors[selector] = sels[selector];
            registered.push(selector);
            if (selector === `${domainName}/_init`) {
              fn.call(domain.state);
            }
          }
        }
        return registered;
      },
      "sbp/selectors/unregister": (sels) => {
        var _a2;
        for (const selector of sels) {
          if (!unsafeSelectors[selector]) {
            throw new Error(`SBP: can't unregister locked selector: ${selector}`);
          }
          if ((_a2 = domains[domainFromSelector(selector)]) === null || _a2 === void 0 ? void 0 : _a2.locked) {
            throw new Error(`SBP: can't unregister selector on a locked domain: '${selector}'`);
          }
          delete selectors[selector];
        }
      },
      "sbp/selectors/overwrite": (sels) => {
        sbp("sbp/selectors/unregister", Object.keys(sels));
        return sbp("sbp/selectors/register", sels);
      },
      "sbp/selectors/unsafe": (sels) => {
        for (const selector of sels) {
          if (selectors[selector]) {
            throw new Error("unsafe must be called before registering selector");
          }
          unsafeSelectors[selector] = true;
        }
      },
      "sbp/selectors/lock": (sels) => {
        for (const selector of sels) {
          delete unsafeSelectors[selector];
        }
      },
      "sbp/selectors/fn": (sel) => {
        return selectors[sel];
      },
      "sbp/filters/global/add": (filter) => {
        globalFilters.push(filter);
      },
      "sbp/filters/domain/add": (domain, filter) => {
        if (!domainFilters[domain])
          domainFilters[domain] = [];
        domainFilters[domain].push(filter);
      },
      "sbp/filters/selector/add": (selector, filter) => {
        if (!selectorFilters[selector])
          selectorFilters[selector] = [];
        selectorFilters[selector].push(filter);
      },
      "sbp/domains/lock": (domainNames) => {
        if (!domainNames) {
          for (const name in domains) {
            domains[name].locked = true;
          }
        } else {
          for (const name of domainNames) {
            if (!domains[name]) {
              throw new Error(`SBP: cannot lock non-existent domain: ${name}`);
            }
            domains[name].locked = true;
          }
        }
      }
    };
    SBP_BASE_SELECTORS["sbp/selectors/register"](SBP_BASE_SELECTORS);
    esm_default = sbp;
  }
});

// node_modules/.deno/@sbp+okturtles.eventqueue@1.2.1/node_modules/@sbp/okturtles.eventqueue/dist/esm/index.mjs
var isEventQueueSbpEvent, esm_default2;
var init_esm2 = __esm({
  "node_modules/.deno/@sbp+okturtles.eventqueue@1.2.1/node_modules/@sbp/okturtles.eventqueue/dist/esm/index.mjs"() {
    init_esm();
    isEventQueueSbpEvent = (e2) => {
      return Object.prototype.hasOwnProperty.call(e2, "sbpInvocation");
    };
    esm_default2 = esm_default("sbp/selectors/register", {
      "okTurtles.eventQueue/_init": function() {
        this.eventQueues = /* @__PURE__ */ Object.create(null);
      },
      "okTurtles.eventQueue/isWaiting": function(name) {
        var _a2;
        return !!((_a2 = this.eventQueues[name]) === null || _a2 === void 0 ? void 0 : _a2.length);
      },
      "okTurtles.eventQueue/queuedInvocations": function(name) {
        var _a2, _b;
        if (name == null) {
          return Object.fromEntries(Object.entries(this.eventQueues).map(([name2, events]) => [name2, events.map((event) => {
            if (isEventQueueSbpEvent(event)) {
              return event.sbpInvocation;
            } else {
              return event.fn;
            }
          })]));
        }
        return (_b = (_a2 = this.eventQueues[name]) === null || _a2 === void 0 ? void 0 : _a2.map((event) => {
          if (isEventQueueSbpEvent(event)) {
            return event.sbpInvocation;
          } else {
            return event.fn;
          }
        })) !== null && _b !== void 0 ? _b : [];
      },
      "okTurtles.eventQueue/queueEvent": async function(name, invocation) {
        if (!Object.prototype.hasOwnProperty.call(this.eventQueues, name)) {
          this.eventQueues[name] = [];
        }
        const events = this.eventQueues[name];
        let accept;
        const promise = new Promise((resolve4) => {
          accept = resolve4;
        });
        const thisEvent = typeof invocation === "function" ? {
          fn: invocation,
          promise
        } : {
          sbpInvocation: invocation,
          promise
        };
        events.push(thisEvent);
        while (events.length > 0) {
          const event = events[0];
          if (event === thisEvent) {
            try {
              if (typeof invocation === "function") {
                return await invocation();
              } else {
                return await esm_default(...invocation);
              }
            } finally {
              accept();
              events.shift();
            }
          } else {
            await event.promise;
          }
        }
      }
    });
  }
});

// node_modules/.deno/@sbp+okturtles.data@0.1.6/node_modules/@sbp/okturtles.data/dist/esm/index.mjs
var _store, esm_default3;
var init_esm3 = __esm({
  "node_modules/.deno/@sbp+okturtles.data@0.1.6/node_modules/@sbp/okturtles.data/dist/esm/index.mjs"() {
    init_esm();
    _store = /* @__PURE__ */ new Map();
    esm_default3 = esm_default("sbp/selectors/register", {
      "okTurtles.data/get": function(key) {
        return _store.get(key);
      },
      "okTurtles.data/set": function(key, data) {
        _store.set(key, data);
        return data;
      },
      "okTurtles.data/delete": function(key) {
        return _store.delete(key);
      },
      "okTurtles.data/add": function(key, data) {
        const array = _store.get(key);
        if (array) {
          array.push(data);
        } else {
          _store.set(key, [data]);
        }
      },
      "okTurtles.data/remove": function(key, data) {
        const array = _store.get(key);
        if (array) {
          const aLen = array.length;
          const filtered = array.filter((v2) => v2 !== data);
          _store.set(key, filtered);
          return aLen - filtered.length;
        }
      },
      "okTurtles.data/apply": function(key, fn) {
        return fn(_store.get(key));
      }
    });
  }
});

// node_modules/.deno/@sbp+okturtles.events@1.0.1/node_modules/@sbp/okturtles.events/dist/esm/index.mjs
var listenKey, esm_default4;
var init_esm4 = __esm({
  "node_modules/.deno/@sbp+okturtles.events@1.0.1/node_modules/@sbp/okturtles.events/dist/esm/index.mjs"() {
    init_esm();
    init_esm3();
    listenKey = (evt) => `events/${evt}/listeners`;
    esm_default4 = esm_default("sbp/selectors/register", {
      "okTurtles.events/_init": function() {
        this.errorHandler = (event, e2) => {
          console.error(`[okTurtles.events] Error at handler for ${event}`, e2);
        };
      },
      "okTurtles.events/on": function(event, handler) {
        esm_default("okTurtles.data/add", listenKey(event), handler);
        return () => esm_default("okTurtles.events/off", event, handler);
      },
      "okTurtles.events/once": function(event, handler) {
        const cbWithOff = (...args) => {
          handler(...args);
          esm_default("okTurtles.events/off", event, cbWithOff);
        };
        return esm_default("okTurtles.events/on", event, cbWithOff);
      },
      "okTurtles.events/emit": function(event, ...data) {
        var _a2;
        for (const listener of esm_default("okTurtles.data/get", listenKey(event)) || []) {
          try {
            listener(...data);
          } catch (e2) {
            (_a2 = this.errorHandler) === null || _a2 === void 0 ? void 0 : _a2.call(this, event, e2);
          }
        }
      },
      // almost identical to Vue.prototype.$off, except we require `event` argument
      "okTurtles.events/off": function(event, handler) {
        if (handler) {
          esm_default("okTurtles.data/remove", listenKey(event), handler);
        } else {
          esm_default("okTurtles.data/delete", listenKey(event));
        }
      },
      "okTurtles.events/setErrorHandler": function(errorHandler) {
        this.errorHandler = errorHandler;
      }
    });
  }
});

// node_modules/.deno/turtledash@1.0.2/node_modules/turtledash/dist/esm/index.js
function pick(o2, props) {
  const x2 = /* @__PURE__ */ Object.create(null);
  for (const k of props) {
    if (has(o2, k)) {
      x2[k] = o2[k];
    }
  }
  return x2;
}
function omit2(o2, props) {
  const x2 = /* @__PURE__ */ Object.create(null);
  for (const k in o2) {
    if (!props.includes(k)) {
      x2[k] = o2[k];
    }
  }
  return x2;
}
function cloneDeep2(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function isMergeableObject(val) {
  const nonNullObject = val && typeof val === "object";
  return nonNullObject && Object.prototype.toString.call(val) !== "[object RegExp]" && Object.prototype.toString.call(val) !== "[object Date]";
}
function merge(obj, src2) {
  const res = obj;
  for (const key in src2) {
    const clone = isMergeableObject(src2[key]) ? cloneDeep2(src2[key]) : void 0;
    let x2;
    if (clone && isMergeableObject(x2 = res[key])) {
      merge(x2, clone);
      continue;
    }
    res[key] = clone || src2[key];
  }
  return res;
}
function delay(msec) {
  return new Promise((resolve4) => {
    setTimeout(resolve4, msec);
  });
}
function randomBytes(length2) {
  return crypto.getRandomValues(new Uint8Array(length2));
}
function randomHexString(length2) {
  return Array.from(randomBytes(length2), (byte) => (byte % 16).toString(16)).join("");
}
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function uniq(array) {
  return Array.from(new Set(array));
}
function intersection(a1, ...arrays) {
  return uniq(a1).filter((v1) => arrays.every((v2) => v2.indexOf(v1) >= 0));
}
function difference(a1, ...arrays) {
  const a2 = Array.prototype.concat.apply([], arrays);
  return a1.filter((v2) => a2.indexOf(v2) === -1);
}
function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;
  if (wait == null)
    wait = 100;
  function later() {
    const last = performance.now() - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = void 0;
      if (!immediate) {
        result = func.apply(context, args);
        args = void 0;
        context = void 0;
      }
    }
  }
  const debounced = function(...args_) {
    args = args_;
    context = this;
    timestamp = performance.now();
    const callNow = immediate && !timeout;
    if (!timeout)
      timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      args = void 0;
      context = void 0;
    }
    return result;
  };
  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = void 0;
    }
  };
  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args);
      args = void 0;
      context = void 0;
      clearTimeout(timeout);
      timeout = void 0;
    }
  };
  return debounced;
}
var has;
var init_esm5 = __esm({
  "node_modules/.deno/turtledash@1.0.2/node_modules/turtledash/dist/esm/index.js"() {
    has = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bytes.mjs
function equals(aa, bb) {
  if (aa === bb) {
    return true;
  }
  if (aa.byteLength !== bb.byteLength) {
    return false;
  }
  for (let ii = 0; ii < aa.byteLength; ii++) {
    if (aa[ii] !== bb[ii]) {
      return false;
    }
  }
  return true;
}
function coerce(o2) {
  if (o2 instanceof Uint8Array && o2.constructor.name === "Uint8Array") {
    return o2;
  }
  if (o2 instanceof ArrayBuffer) {
    return new Uint8Array(o2);
  }
  if (ArrayBuffer.isView(o2)) {
    return new Uint8Array(o2.buffer, o2.byteOffset, o2.byteLength);
  }
  throw new Error("Unknown type, must be binary type");
}
var empty;
var init_bytes = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bytes.mjs"() {
    empty = new Uint8Array(0);
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/base-x.mjs
function base(ALPHABET, name) {
  if (ALPHABET.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  var BASE_MAP = new Uint8Array(256);
  for (var j = 0; j < BASE_MAP.length; j++) {
    BASE_MAP[j] = 255;
  }
  for (var i2 = 0; i2 < ALPHABET.length; i2++) {
    var x2 = ALPHABET.charAt(i2);
    var xc = x2.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) {
      throw new TypeError(x2 + " is ambiguous");
    }
    BASE_MAP[xc] = i2;
  }
  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256);
  var iFACTOR = Math.log(256) / Math.log(BASE);
  function encode3(source) {
    if (source instanceof Uint8Array) {
    } else if (ArrayBuffer.isView(source)) {
      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
    } else if (Array.isArray(source)) {
      source = Uint8Array.from(source);
    }
    if (!(source instanceof Uint8Array)) {
      throw new TypeError("Expected Uint8Array");
    }
    if (source.length === 0) {
      return "";
    }
    var zeroes = 0;
    var length2 = 0;
    var pbegin = 0;
    var pend = source.length;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }
    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size);
    while (pbegin !== pend) {
      var carry = source[pbegin];
      var i3 = 0;
      for (var it1 = size - 1; (carry !== 0 || i3 < length2) && it1 !== -1; it1--, i3++) {
        carry += 256 * b58[it1] >>> 0;
        b58[it1] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i3;
      pbegin++;
    }
    var it2 = size - length2;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }
    var str = LEADER.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += ALPHABET.charAt(b58[it2]);
    }
    return str;
  }
  function decodeUnsafe(source) {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array();
    }
    var psz = 0;
    if (source[psz] === " ") {
      return;
    }
    var zeroes = 0;
    var length2 = 0;
    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    }
    var size = (source.length - psz) * FACTOR + 1 >>> 0;
    var b256 = new Uint8Array(size);
    while (source[psz]) {
      var carry = BASE_MAP[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }
      var i3 = 0;
      for (var it3 = size - 1; (carry !== 0 || i3 < length2) && it3 !== -1; it3--, i3++) {
        carry += BASE * b256[it3] >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length2 = i3;
      psz++;
    }
    if (source[psz] === " ") {
      return;
    }
    var it4 = size - length2;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }
    var vch = new Uint8Array(zeroes + (size - it4));
    var j2 = zeroes;
    while (it4 !== size) {
      vch[j2++] = b256[it4++];
    }
    return vch;
  }
  function decode5(string) {
    var buffer = decodeUnsafe(string);
    if (buffer) {
      return buffer;
    }
    throw new Error(`Non-${name} character`);
  }
  return {
    encode: encode3,
    decodeUnsafe,
    decode: decode5
  };
}
var src, _brrp__multiformats_scope_baseX, base_x_default;
var init_base_x = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/base-x.mjs"() {
    src = base;
    _brrp__multiformats_scope_baseX = src;
    base_x_default = _brrp__multiformats_scope_baseX;
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bases/base.mjs
function or(left, right) {
  var _a2, _b;
  return new ComposedDecoder(Object.assign(Object.assign({}, (_a2 = left.decoders) !== null && _a2 !== void 0 ? _a2 : { [left.prefix]: left }), (_b = right.decoders) !== null && _b !== void 0 ? _b : { [right.prefix]: right }));
}
function from({ name, prefix, encode: encode3, decode: decode5 }) {
  return new Codec(name, prefix, encode3, decode5);
}
function baseX({ name, prefix, alphabet }) {
  const { encode: encode3, decode: decode5 } = base_x_default(alphabet, name);
  return from({
    prefix,
    name,
    encode: encode3,
    decode: (text) => coerce(decode5(text))
  });
}
function decode(string, alphabet, bitsPerChar, name) {
  const codes = {};
  for (let i2 = 0; i2 < alphabet.length; ++i2) {
    codes[alphabet[i2]] = i2;
  }
  let end = string.length;
  while (string[end - 1] === "=") {
    --end;
  }
  const out = new Uint8Array(end * bitsPerChar / 8 | 0);
  let bits = 0;
  let buffer = 0;
  let written = 0;
  for (let i2 = 0; i2 < end; ++i2) {
    const value = codes[string[i2]];
    if (value === void 0) {
      throw new SyntaxError(`Non-${name} character`);
    }
    buffer = buffer << bitsPerChar | value;
    bits += bitsPerChar;
    if (bits >= 8) {
      bits -= 8;
      out[written++] = 255 & buffer >> bits;
    }
  }
  if (bits >= bitsPerChar || (255 & buffer << 8 - bits) !== 0) {
    throw new SyntaxError("Unexpected end of data");
  }
  return out;
}
function encode(data, alphabet, bitsPerChar) {
  const pad = alphabet[alphabet.length - 1] === "=";
  const mask = (1 << bitsPerChar) - 1;
  let out = "";
  let bits = 0;
  let buffer = 0;
  for (let i2 = 0; i2 < data.length; ++i2) {
    buffer = buffer << 8 | data[i2];
    bits += 8;
    while (bits > bitsPerChar) {
      bits -= bitsPerChar;
      out += alphabet[mask & buffer >> bits];
    }
  }
  if (bits !== 0) {
    out += alphabet[mask & buffer << bitsPerChar - bits];
  }
  if (pad) {
    while ((out.length * bitsPerChar & 7) !== 0) {
      out += "=";
    }
  }
  return out;
}
function rfc4648({ name, prefix, bitsPerChar, alphabet }) {
  return from({
    prefix,
    name,
    encode(input) {
      return encode(input, alphabet, bitsPerChar);
    },
    decode(input) {
      return decode(input, alphabet, bitsPerChar, name);
    }
  });
}
var Encoder, Decoder, ComposedDecoder, Codec;
var init_base = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bases/base.mjs"() {
    init_bytes();
    init_base_x();
    Encoder = class {
      constructor(name, prefix, baseEncode) {
        this.name = name;
        this.prefix = prefix;
        this.baseEncode = baseEncode;
      }
      encode(bytes) {
        if (bytes instanceof Uint8Array) {
          return `${this.prefix}${this.baseEncode(bytes)}`;
        } else {
          throw Error("Unknown type, must be binary type");
        }
      }
    };
    Decoder = class {
      constructor(name, prefix, baseDecode) {
        this.name = name;
        this.prefix = prefix;
        if (prefix.codePointAt(0) === void 0) {
          throw new Error("Invalid prefix character");
        }
        this.prefixCodePoint = prefix.codePointAt(0);
        this.baseDecode = baseDecode;
      }
      decode(text) {
        if (typeof text === "string") {
          if (text.codePointAt(0) !== this.prefixCodePoint) {
            throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
          }
          return this.baseDecode(text.slice(this.prefix.length));
        } else {
          throw Error("Can only multibase decode strings");
        }
      }
      or(decoder) {
        return or(this, decoder);
      }
    };
    ComposedDecoder = class {
      constructor(decoders) {
        this.decoders = decoders;
      }
      or(decoder) {
        return or(this, decoder);
      }
      decode(input) {
        const prefix = input[0];
        const decoder = this.decoders[prefix];
        if (decoder != null) {
          return decoder.decode(input);
        } else {
          throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
        }
      }
    };
    Codec = class {
      constructor(name, prefix, baseEncode, baseDecode) {
        this.name = name;
        this.prefix = prefix;
        this.baseEncode = baseEncode;
        this.baseDecode = baseDecode;
        this.encoder = new Encoder(name, prefix, baseEncode);
        this.decoder = new Decoder(name, prefix, baseDecode);
      }
      encode(input) {
        return this.encoder.encode(input);
      }
      decode(input) {
        return this.decoder.decode(input);
      }
    };
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bases/base58.mjs
var base58btc2, base58flickr;
var init_base58 = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bases/base58.mjs"() {
    init_base();
    base58btc2 = baseX({
      name: "base58btc",
      prefix: "z",
      alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    });
    base58flickr = baseX({
      name: "base58flickr",
      prefix: "Z",
      alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
    });
  }
});

// node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/util.js
var require_util = __commonJS({
  "node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/util.js"(exports, module) {
    var ERROR_MSG_INPUT = "Input must be an string, Buffer or Uint8Array";
    function normalizeInput(input) {
      let ret;
      if (input instanceof Uint8Array) {
        ret = input;
      } else if (typeof input === "string") {
        const encoder = new TextEncoder();
        ret = encoder.encode(input);
      } else {
        throw new Error(ERROR_MSG_INPUT);
      }
      return ret;
    }
    function toHex(bytes) {
      return Array.prototype.map.call(bytes, function(n) {
        return (n < 16 ? "0" : "") + n.toString(16);
      }).join("");
    }
    function uint32ToHex(val) {
      return (4294967296 + val).toString(16).substring(1);
    }
    function debugPrint(label, arr, size) {
      let msg = "\n" + label + " = ";
      for (let i2 = 0; i2 < arr.length; i2 += 2) {
        if (size === 32) {
          msg += uint32ToHex(arr[i2]).toUpperCase();
          msg += " ";
          msg += uint32ToHex(arr[i2 + 1]).toUpperCase();
        } else if (size === 64) {
          msg += uint32ToHex(arr[i2 + 1]).toUpperCase();
          msg += uint32ToHex(arr[i2]).toUpperCase();
        } else throw new Error("Invalid size " + size);
        if (i2 % 6 === 4) {
          msg += "\n" + new Array(label.length + 4).join(" ");
        } else if (i2 < arr.length - 2) {
          msg += " ";
        }
      }
      console.log(msg);
    }
    function testSpeed(hashFn, N10, M2) {
      let startMs = (/* @__PURE__ */ new Date()).getTime();
      const input = new Uint8Array(N10);
      for (let i2 = 0; i2 < N10; i2++) {
        input[i2] = i2 % 256;
      }
      const genMs = (/* @__PURE__ */ new Date()).getTime();
      console.log("Generated random input in " + (genMs - startMs) + "ms");
      startMs = genMs;
      for (let i2 = 0; i2 < M2; i2++) {
        const hashHex = hashFn(input);
        const hashMs = (/* @__PURE__ */ new Date()).getTime();
        const ms = hashMs - startMs;
        startMs = hashMs;
        console.log("Hashed in " + ms + "ms: " + hashHex.substring(0, 20) + "...");
        console.log(
          Math.round(N10 / (1 << 20) / (ms / 1e3) * 100) / 100 + " MB PER SECOND"
        );
      }
    }
    module.exports = {
      normalizeInput,
      toHex,
      debugPrint,
      testSpeed
    };
  }
});

// node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/blake2b.js
var require_blake2b = __commonJS({
  "node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/blake2b.js"(exports, module) {
    var util2 = require_util();
    function ADD64AA(v3, a, b) {
      const o0 = v3[a] + v3[b];
      let o1 = v3[a + 1] + v3[b + 1];
      if (o0 >= 4294967296) {
        o1++;
      }
      v3[a] = o0;
      v3[a + 1] = o1;
    }
    function ADD64AC(v3, a, b0, b1) {
      let o0 = v3[a] + b0;
      if (b0 < 0) {
        o0 += 4294967296;
      }
      let o1 = v3[a + 1] + b1;
      if (o0 >= 4294967296) {
        o1++;
      }
      v3[a] = o0;
      v3[a + 1] = o1;
    }
    function B2B_GET32(arr, i2) {
      return arr[i2] ^ arr[i2 + 1] << 8 ^ arr[i2 + 2] << 16 ^ arr[i2 + 3] << 24;
    }
    function B2B_G(a, b, c, d, ix, iy) {
      const x0 = m3[ix];
      const x1 = m3[ix + 1];
      const y0 = m3[iy];
      const y1 = m3[iy + 1];
      ADD64AA(v2, a, b);
      ADD64AC(v2, a, x0, x1);
      let xor0 = v2[d] ^ v2[a];
      let xor1 = v2[d + 1] ^ v2[a + 1];
      v2[d] = xor1;
      v2[d + 1] = xor0;
      ADD64AA(v2, c, d);
      xor0 = v2[b] ^ v2[c];
      xor1 = v2[b + 1] ^ v2[c + 1];
      v2[b] = xor0 >>> 24 ^ xor1 << 8;
      v2[b + 1] = xor1 >>> 24 ^ xor0 << 8;
      ADD64AA(v2, a, b);
      ADD64AC(v2, a, y0, y1);
      xor0 = v2[d] ^ v2[a];
      xor1 = v2[d + 1] ^ v2[a + 1];
      v2[d] = xor0 >>> 16 ^ xor1 << 16;
      v2[d + 1] = xor1 >>> 16 ^ xor0 << 16;
      ADD64AA(v2, c, d);
      xor0 = v2[b] ^ v2[c];
      xor1 = v2[b + 1] ^ v2[c + 1];
      v2[b] = xor1 >>> 31 ^ xor0 << 1;
      v2[b + 1] = xor0 >>> 31 ^ xor1 << 1;
    }
    var BLAKE2B_IV32 = new Uint32Array([
      4089235720,
      1779033703,
      2227873595,
      3144134277,
      4271175723,
      1013904242,
      1595750129,
      2773480762,
      2917565137,
      1359893119,
      725511199,
      2600822924,
      4215389547,
      528734635,
      327033209,
      1541459225
    ]);
    var SIGMA8 = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3,
      11,
      8,
      12,
      0,
      5,
      2,
      15,
      13,
      10,
      14,
      3,
      6,
      7,
      1,
      9,
      4,
      7,
      9,
      3,
      1,
      13,
      12,
      11,
      14,
      2,
      6,
      5,
      10,
      4,
      0,
      15,
      8,
      9,
      0,
      5,
      7,
      2,
      4,
      10,
      15,
      14,
      1,
      11,
      12,
      6,
      8,
      3,
      13,
      2,
      12,
      6,
      10,
      0,
      11,
      8,
      3,
      4,
      13,
      7,
      5,
      15,
      14,
      1,
      9,
      12,
      5,
      1,
      15,
      14,
      13,
      4,
      10,
      0,
      7,
      6,
      3,
      9,
      2,
      8,
      11,
      13,
      11,
      7,
      14,
      12,
      1,
      3,
      9,
      5,
      0,
      15,
      4,
      8,
      6,
      2,
      10,
      6,
      15,
      14,
      9,
      11,
      3,
      0,
      8,
      12,
      2,
      13,
      7,
      1,
      4,
      10,
      5,
      10,
      2,
      8,
      4,
      7,
      6,
      1,
      5,
      15,
      11,
      9,
      14,
      3,
      12,
      13,
      0,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3
    ];
    var SIGMA82 = new Uint8Array(
      SIGMA8.map(function(x2) {
        return x2 * 2;
      })
    );
    var v2 = new Uint32Array(32);
    var m3 = new Uint32Array(32);
    function blake2bCompress(ctx, last) {
      let i2 = 0;
      for (i2 = 0; i2 < 16; i2++) {
        v2[i2] = ctx.h[i2];
        v2[i2 + 16] = BLAKE2B_IV32[i2];
      }
      v2[24] = v2[24] ^ ctx.t;
      v2[25] = v2[25] ^ ctx.t / 4294967296;
      if (last) {
        v2[28] = ~v2[28];
        v2[29] = ~v2[29];
      }
      for (i2 = 0; i2 < 32; i2++) {
        m3[i2] = B2B_GET32(ctx.b, 4 * i2);
      }
      for (i2 = 0; i2 < 12; i2++) {
        B2B_G(0, 8, 16, 24, SIGMA82[i2 * 16 + 0], SIGMA82[i2 * 16 + 1]);
        B2B_G(2, 10, 18, 26, SIGMA82[i2 * 16 + 2], SIGMA82[i2 * 16 + 3]);
        B2B_G(4, 12, 20, 28, SIGMA82[i2 * 16 + 4], SIGMA82[i2 * 16 + 5]);
        B2B_G(6, 14, 22, 30, SIGMA82[i2 * 16 + 6], SIGMA82[i2 * 16 + 7]);
        B2B_G(0, 10, 20, 30, SIGMA82[i2 * 16 + 8], SIGMA82[i2 * 16 + 9]);
        B2B_G(2, 12, 22, 24, SIGMA82[i2 * 16 + 10], SIGMA82[i2 * 16 + 11]);
        B2B_G(4, 14, 16, 26, SIGMA82[i2 * 16 + 12], SIGMA82[i2 * 16 + 13]);
        B2B_G(6, 8, 18, 28, SIGMA82[i2 * 16 + 14], SIGMA82[i2 * 16 + 15]);
      }
      for (i2 = 0; i2 < 16; i2++) {
        ctx.h[i2] = ctx.h[i2] ^ v2[i2] ^ v2[i2 + 16];
      }
    }
    var parameterBlock = new Uint8Array([
      0,
      0,
      0,
      0,
      //  0: outlen, keylen, fanout, depth
      0,
      0,
      0,
      0,
      //  4: leaf length, sequential mode
      0,
      0,
      0,
      0,
      //  8: node offset
      0,
      0,
      0,
      0,
      // 12: node offset
      0,
      0,
      0,
      0,
      // 16: node depth, inner length, rfu
      0,
      0,
      0,
      0,
      // 20: rfu
      0,
      0,
      0,
      0,
      // 24: rfu
      0,
      0,
      0,
      0,
      // 28: rfu
      0,
      0,
      0,
      0,
      // 32: salt
      0,
      0,
      0,
      0,
      // 36: salt
      0,
      0,
      0,
      0,
      // 40: salt
      0,
      0,
      0,
      0,
      // 44: salt
      0,
      0,
      0,
      0,
      // 48: personal
      0,
      0,
      0,
      0,
      // 52: personal
      0,
      0,
      0,
      0,
      // 56: personal
      0,
      0,
      0,
      0
      // 60: personal
    ]);
    function blake2bInit2(outlen, key, salt, personal) {
      if (outlen === 0 || outlen > 64) {
        throw new Error("Illegal output length, expected 0 < length <= 64");
      }
      if (key && key.length > 64) {
        throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64");
      }
      if (salt && salt.length !== 16) {
        throw new Error("Illegal salt, expected Uint8Array with length is 16");
      }
      if (personal && personal.length !== 16) {
        throw new Error("Illegal personal, expected Uint8Array with length is 16");
      }
      const ctx = {
        b: new Uint8Array(128),
        h: new Uint32Array(16),
        t: 0,
        // input count
        c: 0,
        // pointer within buffer
        outlen
        // output length in bytes
      };
      parameterBlock.fill(0);
      parameterBlock[0] = outlen;
      if (key) parameterBlock[1] = key.length;
      parameterBlock[2] = 1;
      parameterBlock[3] = 1;
      if (salt) parameterBlock.set(salt, 32);
      if (personal) parameterBlock.set(personal, 48);
      for (let i2 = 0; i2 < 16; i2++) {
        ctx.h[i2] = BLAKE2B_IV32[i2] ^ B2B_GET32(parameterBlock, i2 * 4);
      }
      if (key) {
        blake2bUpdate2(ctx, key);
        ctx.c = 128;
      }
      return ctx;
    }
    function blake2bUpdate2(ctx, input) {
      for (let i2 = 0; i2 < input.length; i2++) {
        if (ctx.c === 128) {
          ctx.t += ctx.c;
          blake2bCompress(ctx, false);
          ctx.c = 0;
        }
        ctx.b[ctx.c++] = input[i2];
      }
    }
    function blake2bFinal2(ctx) {
      ctx.t += ctx.c;
      while (ctx.c < 128) {
        ctx.b[ctx.c++] = 0;
      }
      blake2bCompress(ctx, true);
      const out = new Uint8Array(ctx.outlen);
      for (let i2 = 0; i2 < ctx.outlen; i2++) {
        out[i2] = ctx.h[i2 >> 2] >> 8 * (i2 & 3);
      }
      return out;
    }
    function blake2b3(input, key, outlen, salt, personal) {
      outlen = outlen || 64;
      input = util2.normalizeInput(input);
      if (salt) {
        salt = util2.normalizeInput(salt);
      }
      if (personal) {
        personal = util2.normalizeInput(personal);
      }
      const ctx = blake2bInit2(outlen, key, salt, personal);
      blake2bUpdate2(ctx, input);
      return blake2bFinal2(ctx);
    }
    function blake2bHex(input, key, outlen, salt, personal) {
      const output = blake2b3(input, key, outlen, salt, personal);
      return util2.toHex(output);
    }
    module.exports = {
      blake2b: blake2b3,
      blake2bHex,
      blake2bInit: blake2bInit2,
      blake2bUpdate: blake2bUpdate2,
      blake2bFinal: blake2bFinal2
    };
  }
});

// node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/blake2s.js
var require_blake2s = __commonJS({
  "node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/blake2s.js"(exports, module) {
    var util2 = require_util();
    function B2S_GET32(v3, i2) {
      return v3[i2] ^ v3[i2 + 1] << 8 ^ v3[i2 + 2] << 16 ^ v3[i2 + 3] << 24;
    }
    function B2S_G(a, b, c, d, x2, y) {
      v2[a] = v2[a] + v2[b] + x2;
      v2[d] = ROTR32(v2[d] ^ v2[a], 16);
      v2[c] = v2[c] + v2[d];
      v2[b] = ROTR32(v2[b] ^ v2[c], 12);
      v2[a] = v2[a] + v2[b] + y;
      v2[d] = ROTR32(v2[d] ^ v2[a], 8);
      v2[c] = v2[c] + v2[d];
      v2[b] = ROTR32(v2[b] ^ v2[c], 7);
    }
    function ROTR32(x2, y) {
      return x2 >>> y ^ x2 << 32 - y;
    }
    var BLAKE2S_IV = new Uint32Array([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    var SIGMA = new Uint8Array([
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      14,
      10,
      4,
      8,
      9,
      15,
      13,
      6,
      1,
      12,
      0,
      2,
      11,
      7,
      5,
      3,
      11,
      8,
      12,
      0,
      5,
      2,
      15,
      13,
      10,
      14,
      3,
      6,
      7,
      1,
      9,
      4,
      7,
      9,
      3,
      1,
      13,
      12,
      11,
      14,
      2,
      6,
      5,
      10,
      4,
      0,
      15,
      8,
      9,
      0,
      5,
      7,
      2,
      4,
      10,
      15,
      14,
      1,
      11,
      12,
      6,
      8,
      3,
      13,
      2,
      12,
      6,
      10,
      0,
      11,
      8,
      3,
      4,
      13,
      7,
      5,
      15,
      14,
      1,
      9,
      12,
      5,
      1,
      15,
      14,
      13,
      4,
      10,
      0,
      7,
      6,
      3,
      9,
      2,
      8,
      11,
      13,
      11,
      7,
      14,
      12,
      1,
      3,
      9,
      5,
      0,
      15,
      4,
      8,
      6,
      2,
      10,
      6,
      15,
      14,
      9,
      11,
      3,
      0,
      8,
      12,
      2,
      13,
      7,
      1,
      4,
      10,
      5,
      10,
      2,
      8,
      4,
      7,
      6,
      1,
      5,
      15,
      11,
      9,
      14,
      3,
      12,
      13,
      0
    ]);
    var v2 = new Uint32Array(16);
    var m3 = new Uint32Array(16);
    function blake2sCompress(ctx, last) {
      let i2 = 0;
      for (i2 = 0; i2 < 8; i2++) {
        v2[i2] = ctx.h[i2];
        v2[i2 + 8] = BLAKE2S_IV[i2];
      }
      v2[12] ^= ctx.t;
      v2[13] ^= ctx.t / 4294967296;
      if (last) {
        v2[14] = ~v2[14];
      }
      for (i2 = 0; i2 < 16; i2++) {
        m3[i2] = B2S_GET32(ctx.b, 4 * i2);
      }
      for (i2 = 0; i2 < 10; i2++) {
        B2S_G(0, 4, 8, 12, m3[SIGMA[i2 * 16 + 0]], m3[SIGMA[i2 * 16 + 1]]);
        B2S_G(1, 5, 9, 13, m3[SIGMA[i2 * 16 + 2]], m3[SIGMA[i2 * 16 + 3]]);
        B2S_G(2, 6, 10, 14, m3[SIGMA[i2 * 16 + 4]], m3[SIGMA[i2 * 16 + 5]]);
        B2S_G(3, 7, 11, 15, m3[SIGMA[i2 * 16 + 6]], m3[SIGMA[i2 * 16 + 7]]);
        B2S_G(0, 5, 10, 15, m3[SIGMA[i2 * 16 + 8]], m3[SIGMA[i2 * 16 + 9]]);
        B2S_G(1, 6, 11, 12, m3[SIGMA[i2 * 16 + 10]], m3[SIGMA[i2 * 16 + 11]]);
        B2S_G(2, 7, 8, 13, m3[SIGMA[i2 * 16 + 12]], m3[SIGMA[i2 * 16 + 13]]);
        B2S_G(3, 4, 9, 14, m3[SIGMA[i2 * 16 + 14]], m3[SIGMA[i2 * 16 + 15]]);
      }
      for (i2 = 0; i2 < 8; i2++) {
        ctx.h[i2] ^= v2[i2] ^ v2[i2 + 8];
      }
    }
    function blake2sInit(outlen, key) {
      if (!(outlen > 0 && outlen <= 32)) {
        throw new Error("Incorrect output length, should be in [1, 32]");
      }
      const keylen = key ? key.length : 0;
      if (key && !(keylen > 0 && keylen <= 32)) {
        throw new Error("Incorrect key length, should be in [1, 32]");
      }
      const ctx = {
        h: new Uint32Array(BLAKE2S_IV),
        // hash state
        b: new Uint8Array(64),
        // input block
        c: 0,
        // pointer within block
        t: 0,
        // input count
        outlen
        // output length in bytes
      };
      ctx.h[0] ^= 16842752 ^ keylen << 8 ^ outlen;
      if (keylen > 0) {
        blake2sUpdate(ctx, key);
        ctx.c = 64;
      }
      return ctx;
    }
    function blake2sUpdate(ctx, input) {
      for (let i2 = 0; i2 < input.length; i2++) {
        if (ctx.c === 64) {
          ctx.t += ctx.c;
          blake2sCompress(ctx, false);
          ctx.c = 0;
        }
        ctx.b[ctx.c++] = input[i2];
      }
    }
    function blake2sFinal(ctx) {
      ctx.t += ctx.c;
      while (ctx.c < 64) {
        ctx.b[ctx.c++] = 0;
      }
      blake2sCompress(ctx, true);
      const out = new Uint8Array(ctx.outlen);
      for (let i2 = 0; i2 < ctx.outlen; i2++) {
        out[i2] = ctx.h[i2 >> 2] >> 8 * (i2 & 3) & 255;
      }
      return out;
    }
    function blake2s(input, key, outlen) {
      outlen = outlen || 32;
      input = util2.normalizeInput(input);
      const ctx = blake2sInit(outlen, key);
      blake2sUpdate(ctx, input);
      return blake2sFinal(ctx);
    }
    function blake2sHex(input, key, outlen) {
      const output = blake2s(input, key, outlen);
      return util2.toHex(output);
    }
    module.exports = {
      blake2s,
      blake2sHex,
      blake2sInit,
      blake2sUpdate,
      blake2sFinal
    };
  }
});

// node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/index.js
var require_blakejs = __commonJS({
  "node_modules/.deno/blakejs@1.2.1/node_modules/blakejs/index.js"(exports, module) {
    var b2b = require_blake2b();
    var b2s = require_blake2s();
    module.exports = {
      blake2b: b2b.blake2b,
      blake2bHex: b2b.blake2bHex,
      blake2bInit: b2b.blake2bInit,
      blake2bUpdate: b2b.blake2bUpdate,
      blake2bFinal: b2b.blake2bFinal,
      blake2s: b2s.blake2s,
      blake2sHex: b2s.blake2sHex,
      blake2sInit: b2s.blake2sInit,
      blake2sUpdate: b2s.blake2sUpdate,
      blake2sFinal: b2s.blake2sFinal
    };
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/vendor/varint.mjs
function encode2(num, out, offset) {
  out = out || [];
  offset = offset || 0;
  var oldOffset = offset;
  while (num >= INT) {
    out[offset++] = num & 255 | MSB;
    num /= 128;
  }
  while (num & MSBALL) {
    out[offset++] = num & 255 | MSB;
    num >>>= 7;
  }
  out[offset] = num | 0;
  encode2.bytes = offset - oldOffset + 1;
  return out;
}
function read(buf, offset) {
  var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
  do {
    if (counter >= l) {
      read.bytes = 0;
      throw new RangeError("Could not decode varint");
    }
    b = buf[counter++];
    res += shift < 28 ? (b & REST$1) << shift : (b & REST$1) * Math.pow(2, shift);
    shift += 7;
  } while (b >= MSB$1);
  read.bytes = counter - offset;
  return res;
}
var encode_1, MSB, REST, MSBALL, INT, decode2, MSB$1, REST$1, N1, N2, N3, N4, N5, N6, N7, N8, N9, length, varint, _brrp_varint, varint_default;
var init_varint = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/vendor/varint.mjs"() {
    encode_1 = encode2;
    MSB = 128;
    REST = 127;
    MSBALL = ~REST;
    INT = Math.pow(2, 31);
    decode2 = read;
    MSB$1 = 128;
    REST$1 = 127;
    N1 = Math.pow(2, 7);
    N2 = Math.pow(2, 14);
    N3 = Math.pow(2, 21);
    N4 = Math.pow(2, 28);
    N5 = Math.pow(2, 35);
    N6 = Math.pow(2, 42);
    N7 = Math.pow(2, 49);
    N8 = Math.pow(2, 56);
    N9 = Math.pow(2, 63);
    length = function(value) {
      return value < N1 ? 1 : value < N2 ? 2 : value < N3 ? 3 : value < N4 ? 4 : value < N5 ? 5 : value < N6 ? 6 : value < N7 ? 7 : value < N8 ? 8 : value < N9 ? 9 : 10;
    };
    varint = {
      encode: encode_1,
      decode: decode2,
      encodingLength: length
    };
    _brrp_varint = varint;
    varint_default = _brrp_varint;
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/varint.mjs
function decode3(data, offset = 0) {
  const code = varint_default.decode(data, offset);
  return [code, varint_default.decode.bytes];
}
function encodeTo(int, target, offset = 0) {
  varint_default.encode(int, target, offset);
  return target;
}
function encodingLength(int) {
  return varint_default.encodingLength(int);
}
var init_varint2 = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/varint.mjs"() {
    init_varint();
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/hashes/digest.mjs
function create(code, digest) {
  const size = digest.byteLength;
  const sizeOffset = encodingLength(code);
  const digestOffset = sizeOffset + encodingLength(size);
  const bytes = new Uint8Array(digestOffset + size);
  encodeTo(code, bytes, 0);
  encodeTo(size, bytes, sizeOffset);
  bytes.set(digest, digestOffset);
  return new Digest(code, size, digest, bytes);
}
function decode4(multihash) {
  const bytes = coerce(multihash);
  const [code, sizeOffset] = decode3(bytes);
  const [size, digestOffset] = decode3(bytes.subarray(sizeOffset));
  const digest = bytes.subarray(sizeOffset + digestOffset);
  if (digest.byteLength !== size) {
    throw new Error("Incorrect length");
  }
  return new Digest(code, size, digest, bytes);
}
function equals2(a, b) {
  if (a === b) {
    return true;
  } else {
    const data = b;
    return a.code === data.code && a.size === data.size && data.bytes instanceof Uint8Array && equals(a.bytes, data.bytes);
  }
}
var Digest;
var init_digest = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/hashes/digest.mjs"() {
    init_bytes();
    init_varint2();
    Digest = class {
      /**
       * Creates a multihash digest.
       */
      constructor(code, size, digest, bytes) {
        this.code = code;
        this.size = size;
        this.digest = digest;
        this.bytes = bytes;
      }
    };
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/hasher.mjs
function from2({ name, code, encode: encode3 }) {
  return new Hasher(name, code, encode3);
}
var Hasher;
var init_hasher = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/hasher.mjs"() {
    init_digest();
    Hasher = class {
      constructor(name, code, encode3) {
        this.name = name;
        this.code = code;
        this.encode = encode3;
      }
      digest(input) {
        if (input instanceof Uint8Array || input instanceof ReadableStream) {
          const result = this.encode(input);
          return result instanceof Uint8Array ? create(this.code, result) : result.then((digest) => create(this.code, digest));
        } else {
          throw Error("Unknown type, must be binary type");
        }
      }
    };
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/blake2b.mjs
var import_blakejs, blake2b, blake2b8, blake2b16, blake2b24, blake2b32, blake2b40, blake2b48, blake2b56, blake2b64, blake2b72, blake2b80, blake2b88, blake2b96, blake2b104, blake2b112, blake2b120, blake2b128, blake2b136, blake2b144, blake2b152, blake2b160, blake2b168, blake2b176, blake2b184, blake2b192, blake2b200, blake2b208, blake2b216, blake2b224, blake2b232, blake2b240, blake2b248, blake2b256, blake2b264, blake2b272, blake2b280, blake2b288, blake2b296, blake2b304, blake2b312, blake2b320, blake2b328, blake2b336, blake2b344, blake2b352, blake2b360, blake2b368, blake2b376, blake2b384, blake2b392, blake2b400, blake2b408, blake2b416, blake2b424, blake2b432, blake2b440, blake2b448, blake2b456, blake2b464, blake2b472, blake2b480, blake2b488, blake2b496, blake2b504, blake2b512;
var init_blake2b = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/blake2b.mjs"() {
    import_blakejs = __toESM(require_blakejs(), 1);
    init_bytes();
    init_hasher();
    ({ blake2b } = import_blakejs.default);
    blake2b8 = from2({
      name: "blake2b-8",
      code: 45569,
      encode: (input) => coerce(blake2b(input, void 0, 1))
    });
    blake2b16 = from2({
      name: "blake2b-16",
      code: 45570,
      encode: (input) => coerce(blake2b(input, void 0, 2))
    });
    blake2b24 = from2({
      name: "blake2b-24",
      code: 45571,
      encode: (input) => coerce(blake2b(input, void 0, 3))
    });
    blake2b32 = from2({
      name: "blake2b-32",
      code: 45572,
      encode: (input) => coerce(blake2b(input, void 0, 4))
    });
    blake2b40 = from2({
      name: "blake2b-40",
      code: 45573,
      encode: (input) => coerce(blake2b(input, void 0, 5))
    });
    blake2b48 = from2({
      name: "blake2b-48",
      code: 45574,
      encode: (input) => coerce(blake2b(input, void 0, 6))
    });
    blake2b56 = from2({
      name: "blake2b-56",
      code: 45575,
      encode: (input) => coerce(blake2b(input, void 0, 7))
    });
    blake2b64 = from2({
      name: "blake2b-64",
      code: 45576,
      encode: (input) => coerce(blake2b(input, void 0, 8))
    });
    blake2b72 = from2({
      name: "blake2b-72",
      code: 45577,
      encode: (input) => coerce(blake2b(input, void 0, 9))
    });
    blake2b80 = from2({
      name: "blake2b-80",
      code: 45578,
      encode: (input) => coerce(blake2b(input, void 0, 10))
    });
    blake2b88 = from2({
      name: "blake2b-88",
      code: 45579,
      encode: (input) => coerce(blake2b(input, void 0, 11))
    });
    blake2b96 = from2({
      name: "blake2b-96",
      code: 45580,
      encode: (input) => coerce(blake2b(input, void 0, 12))
    });
    blake2b104 = from2({
      name: "blake2b-104",
      code: 45581,
      encode: (input) => coerce(blake2b(input, void 0, 13))
    });
    blake2b112 = from2({
      name: "blake2b-112",
      code: 45582,
      encode: (input) => coerce(blake2b(input, void 0, 14))
    });
    blake2b120 = from2({
      name: "blake2b-120",
      code: 45583,
      encode: (input) => coerce(blake2b(input, void 0, 15))
    });
    blake2b128 = from2({
      name: "blake2b-128",
      code: 45584,
      encode: (input) => coerce(blake2b(input, void 0, 16))
    });
    blake2b136 = from2({
      name: "blake2b-136",
      code: 45585,
      encode: (input) => coerce(blake2b(input, void 0, 17))
    });
    blake2b144 = from2({
      name: "blake2b-144",
      code: 45586,
      encode: (input) => coerce(blake2b(input, void 0, 18))
    });
    blake2b152 = from2({
      name: "blake2b-152",
      code: 45587,
      encode: (input) => coerce(blake2b(input, void 0, 19))
    });
    blake2b160 = from2({
      name: "blake2b-160",
      code: 45588,
      encode: (input) => coerce(blake2b(input, void 0, 20))
    });
    blake2b168 = from2({
      name: "blake2b-168",
      code: 45589,
      encode: (input) => coerce(blake2b(input, void 0, 21))
    });
    blake2b176 = from2({
      name: "blake2b-176",
      code: 45590,
      encode: (input) => coerce(blake2b(input, void 0, 22))
    });
    blake2b184 = from2({
      name: "blake2b-184",
      code: 45591,
      encode: (input) => coerce(blake2b(input, void 0, 23))
    });
    blake2b192 = from2({
      name: "blake2b-192",
      code: 45592,
      encode: (input) => coerce(blake2b(input, void 0, 24))
    });
    blake2b200 = from2({
      name: "blake2b-200",
      code: 45593,
      encode: (input) => coerce(blake2b(input, void 0, 25))
    });
    blake2b208 = from2({
      name: "blake2b-208",
      code: 45594,
      encode: (input) => coerce(blake2b(input, void 0, 26))
    });
    blake2b216 = from2({
      name: "blake2b-216",
      code: 45595,
      encode: (input) => coerce(blake2b(input, void 0, 27))
    });
    blake2b224 = from2({
      name: "blake2b-224",
      code: 45596,
      encode: (input) => coerce(blake2b(input, void 0, 28))
    });
    blake2b232 = from2({
      name: "blake2b-232",
      code: 45597,
      encode: (input) => coerce(blake2b(input, void 0, 29))
    });
    blake2b240 = from2({
      name: "blake2b-240",
      code: 45598,
      encode: (input) => coerce(blake2b(input, void 0, 30))
    });
    blake2b248 = from2({
      name: "blake2b-248",
      code: 45599,
      encode: (input) => coerce(blake2b(input, void 0, 31))
    });
    blake2b256 = from2({
      name: "blake2b-256",
      code: 45600,
      encode: (input) => coerce(blake2b(input, void 0, 32))
    });
    blake2b264 = from2({
      name: "blake2b-264",
      code: 45601,
      encode: (input) => coerce(blake2b(input, void 0, 33))
    });
    blake2b272 = from2({
      name: "blake2b-272",
      code: 45602,
      encode: (input) => coerce(blake2b(input, void 0, 34))
    });
    blake2b280 = from2({
      name: "blake2b-280",
      code: 45603,
      encode: (input) => coerce(blake2b(input, void 0, 35))
    });
    blake2b288 = from2({
      name: "blake2b-288",
      code: 45604,
      encode: (input) => coerce(blake2b(input, void 0, 36))
    });
    blake2b296 = from2({
      name: "blake2b-296",
      code: 45605,
      encode: (input) => coerce(blake2b(input, void 0, 37))
    });
    blake2b304 = from2({
      name: "blake2b-304",
      code: 45606,
      encode: (input) => coerce(blake2b(input, void 0, 38))
    });
    blake2b312 = from2({
      name: "blake2b-312",
      code: 45607,
      encode: (input) => coerce(blake2b(input, void 0, 39))
    });
    blake2b320 = from2({
      name: "blake2b-320",
      code: 45608,
      encode: (input) => coerce(blake2b(input, void 0, 40))
    });
    blake2b328 = from2({
      name: "blake2b-328",
      code: 45609,
      encode: (input) => coerce(blake2b(input, void 0, 41))
    });
    blake2b336 = from2({
      name: "blake2b-336",
      code: 45610,
      encode: (input) => coerce(blake2b(input, void 0, 42))
    });
    blake2b344 = from2({
      name: "blake2b-344",
      code: 45611,
      encode: (input) => coerce(blake2b(input, void 0, 43))
    });
    blake2b352 = from2({
      name: "blake2b-352",
      code: 45612,
      encode: (input) => coerce(blake2b(input, void 0, 44))
    });
    blake2b360 = from2({
      name: "blake2b-360",
      code: 45613,
      encode: (input) => coerce(blake2b(input, void 0, 45))
    });
    blake2b368 = from2({
      name: "blake2b-368",
      code: 45614,
      encode: (input) => coerce(blake2b(input, void 0, 46))
    });
    blake2b376 = from2({
      name: "blake2b-376",
      code: 45615,
      encode: (input) => coerce(blake2b(input, void 0, 47))
    });
    blake2b384 = from2({
      name: "blake2b-384",
      code: 45616,
      encode: (input) => coerce(blake2b(input, void 0, 48))
    });
    blake2b392 = from2({
      name: "blake2b-392",
      code: 45617,
      encode: (input) => coerce(blake2b(input, void 0, 49))
    });
    blake2b400 = from2({
      name: "blake2b-400",
      code: 45618,
      encode: (input) => coerce(blake2b(input, void 0, 50))
    });
    blake2b408 = from2({
      name: "blake2b-408",
      code: 45619,
      encode: (input) => coerce(blake2b(input, void 0, 51))
    });
    blake2b416 = from2({
      name: "blake2b-416",
      code: 45620,
      encode: (input) => coerce(blake2b(input, void 0, 52))
    });
    blake2b424 = from2({
      name: "blake2b-424",
      code: 45621,
      encode: (input) => coerce(blake2b(input, void 0, 53))
    });
    blake2b432 = from2({
      name: "blake2b-432",
      code: 45622,
      encode: (input) => coerce(blake2b(input, void 0, 54))
    });
    blake2b440 = from2({
      name: "blake2b-440",
      code: 45623,
      encode: (input) => coerce(blake2b(input, void 0, 55))
    });
    blake2b448 = from2({
      name: "blake2b-448",
      code: 45624,
      encode: (input) => coerce(blake2b(input, void 0, 56))
    });
    blake2b456 = from2({
      name: "blake2b-456",
      code: 45625,
      encode: (input) => coerce(blake2b(input, void 0, 57))
    });
    blake2b464 = from2({
      name: "blake2b-464",
      code: 45626,
      encode: (input) => coerce(blake2b(input, void 0, 58))
    });
    blake2b472 = from2({
      name: "blake2b-472",
      code: 45627,
      encode: (input) => coerce(blake2b(input, void 0, 59))
    });
    blake2b480 = from2({
      name: "blake2b-480",
      code: 45628,
      encode: (input) => coerce(blake2b(input, void 0, 60))
    });
    blake2b488 = from2({
      name: "blake2b-488",
      code: 45629,
      encode: (input) => coerce(blake2b(input, void 0, 61))
    });
    blake2b496 = from2({
      name: "blake2b-496",
      code: 45630,
      encode: (input) => coerce(blake2b(input, void 0, 62))
    });
    blake2b504 = from2({
      name: "blake2b-504",
      code: 45631,
      encode: (input) => coerce(blake2b(input, void 0, 63))
    });
    blake2b512 = from2({
      name: "blake2b-512",
      code: 45632,
      encode: (input) => coerce(blake2b(input, void 0, 64))
    });
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/blake2bstream.mjs
var import_blakejs2, __awaiter, blake2b2, blake2bInit, blake2bUpdate, blake2bFinal, blake2b256stream;
var init_blake2bstream = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/blake2bstream.mjs"() {
    import_blakejs2 = __toESM(require_blakejs(), 1);
    init_bytes();
    init_hasher();
    __awaiter = function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve4) {
          resolve4(value);
        });
      }
      return new (P || (P = Promise))(function(resolve4, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e2) {
            reject(e2);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e2) {
            reject(e2);
          }
        }
        function step(result) {
          result.done ? resolve4(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    ({ blake2b: blake2b2, blake2bInit, blake2bUpdate, blake2bFinal } = import_blakejs2.default);
    blake2b256stream = from2({
      name: "blake2b-256",
      code: 45600,
      encode: (input) => __awaiter(void 0, void 0, void 0, function* () {
        if (input instanceof ReadableStream) {
          const ctx = blake2bInit(32);
          const reader = input.getReader();
          for (; ; ) {
            const result = yield reader.read();
            if (result.done)
              break;
            blake2bUpdate(ctx, coerce(result.value));
          }
          return blake2bFinal(ctx);
        } else {
          return coerce(blake2b2(input, void 0, 32));
        }
      })
    });
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bases/base32.mjs
var base32, base32upper, base32pad, base32padupper, base32hex, base32hexupper, base32hexpad, base32hexpadupper, base32z;
var init_base32 = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/bases/base32.mjs"() {
    init_base();
    base32 = rfc4648({
      prefix: "b",
      name: "base32",
      alphabet: "abcdefghijklmnopqrstuvwxyz234567",
      bitsPerChar: 5
    });
    base32upper = rfc4648({
      prefix: "B",
      name: "base32upper",
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
      bitsPerChar: 5
    });
    base32pad = rfc4648({
      prefix: "c",
      name: "base32pad",
      alphabet: "abcdefghijklmnopqrstuvwxyz234567=",
      bitsPerChar: 5
    });
    base32padupper = rfc4648({
      prefix: "C",
      name: "base32padupper",
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",
      bitsPerChar: 5
    });
    base32hex = rfc4648({
      prefix: "v",
      name: "base32hex",
      alphabet: "0123456789abcdefghijklmnopqrstuv",
      bitsPerChar: 5
    });
    base32hexupper = rfc4648({
      prefix: "V",
      name: "base32hexupper",
      alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV",
      bitsPerChar: 5
    });
    base32hexpad = rfc4648({
      prefix: "t",
      name: "base32hexpad",
      alphabet: "0123456789abcdefghijklmnopqrstuv=",
      bitsPerChar: 5
    });
    base32hexpadupper = rfc4648({
      prefix: "T",
      name: "base32hexpadupper",
      alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=",
      bitsPerChar: 5
    });
    base32z = rfc4648({
      prefix: "h",
      name: "base32z",
      alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769",
      bitsPerChar: 5
    });
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/link/interface.mjs
var init_interface = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/link/interface.mjs"() {
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/cid.mjs
function format(link, base2) {
  const { bytes, version: version2 } = link;
  switch (version2) {
    case 0:
      return toStringV0(bytes, baseCache(link), base2 !== null && base2 !== void 0 ? base2 : base58btc2.encoder);
    default:
      return toStringV1(bytes, baseCache(link), base2 !== null && base2 !== void 0 ? base2 : base32.encoder);
  }
}
function baseCache(cid) {
  const baseCache2 = cache.get(cid);
  if (baseCache2 == null) {
    const baseCache3 = /* @__PURE__ */ new Map();
    cache.set(cid, baseCache3);
    return baseCache3;
  }
  return baseCache2;
}
function parseCIDtoBytes(source, base2) {
  switch (source[0]) {
    // CIDv0 is parsed differently
    case "Q": {
      const decoder = base2 !== null && base2 !== void 0 ? base2 : base58btc2;
      return [
        base58btc2.prefix,
        decoder.decode(`${base58btc2.prefix}${source}`)
      ];
    }
    case base58btc2.prefix: {
      const decoder = base2 !== null && base2 !== void 0 ? base2 : base58btc2;
      return [base58btc2.prefix, decoder.decode(source)];
    }
    case base32.prefix: {
      const decoder = base2 !== null && base2 !== void 0 ? base2 : base32;
      return [base32.prefix, decoder.decode(source)];
    }
    default: {
      if (base2 == null) {
        throw Error("To parse non base32 or base58btc encoded CID multibase decoder must be provided");
      }
      return [source[0], base2.decode(source)];
    }
  }
}
function toStringV0(bytes, cache2, base2) {
  const { prefix } = base2;
  if (prefix !== base58btc2.prefix) {
    throw Error(`Cannot string encode V0 in ${base2.name} encoding`);
  }
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base2.encode(bytes).slice(1);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function toStringV1(bytes, cache2, base2) {
  const { prefix } = base2;
  const cid = cache2.get(prefix);
  if (cid == null) {
    const cid2 = base2.encode(bytes);
    cache2.set(prefix, cid2);
    return cid2;
  } else {
    return cid;
  }
}
function encodeCID(version2, code, multihash) {
  const codeOffset = encodingLength(version2);
  const hashOffset = codeOffset + encodingLength(code);
  const bytes = new Uint8Array(hashOffset + multihash.byteLength);
  encodeTo(version2, bytes, 0);
  encodeTo(code, bytes, codeOffset);
  bytes.set(multihash, hashOffset);
  return bytes;
}
var _a, cache, CID2, DAG_PB_CODE, SHA_256_CODE, cidSymbol;
var init_cid = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/cid.mjs"() {
    init_base32();
    init_base58();
    init_bytes();
    init_digest();
    init_varint2();
    init_interface();
    cache = /* @__PURE__ */ new WeakMap();
    CID2 = class _CID {
      /**
       * @param version - Version of the CID
       * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
       * @param multihash - (Multi)hash of the of the content.
       */
      constructor(version2, code, multihash, bytes) {
        this[_a] = "CID";
        this.code = code;
        this.version = version2;
        this.multihash = multihash;
        this.bytes = bytes;
        this["/"] = bytes;
      }
      /**
       * Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
       * please either use `CID.asCID(cid)` or switch to new signalling mechanism
       *
       * @deprecated
       */
      get asCID() {
        return this;
      }
      // ArrayBufferView
      get byteOffset() {
        return this.bytes.byteOffset;
      }
      // ArrayBufferView
      get byteLength() {
        return this.bytes.byteLength;
      }
      toV0() {
        switch (this.version) {
          case 0: {
            return this;
          }
          case 1: {
            const { code, multihash } = this;
            if (code !== DAG_PB_CODE) {
              throw new Error("Cannot convert a non dag-pb CID to CIDv0");
            }
            if (multihash.code !== SHA_256_CODE) {
              throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");
            }
            return _CID.createV0(multihash);
          }
          default: {
            throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
          }
        }
      }
      toV1() {
        switch (this.version) {
          case 0: {
            const { code, digest } = this.multihash;
            const multihash = create(code, digest);
            return _CID.createV1(this.code, multihash);
          }
          case 1: {
            return this;
          }
          default: {
            throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`);
          }
        }
      }
      equals(other) {
        return _CID.equals(this, other);
      }
      static equals(self2, other) {
        const unknown = other;
        return unknown != null && self2.code === unknown.code && self2.version === unknown.version && equals2(self2.multihash, unknown.multihash);
      }
      toString(base2) {
        return format(this, base2);
      }
      toJSON() {
        return { "/": format(this) };
      }
      link() {
        return this;
      }
      // Legacy
      [(_a = Symbol.toStringTag, Symbol.for("nodejs.util.inspect.custom"))]() {
        return `CID(${this.toString()})`;
      }
      /**
       * Takes any input `value` and returns a `CID` instance if it was
       * a `CID` otherwise returns `null`. If `value` is instanceof `CID`
       * it will return value back. If `value` is not instance of this CID
       * class, but is compatible CID it will return new instance of this
       * `CID` class. Otherwise returns null.
       *
       * This allows two different incompatible versions of CID library to
       * co-exist and interop as long as binary interface is compatible.
       */
      static asCID(input) {
        if (input == null) {
          return null;
        }
        const value = input;
        if (value instanceof _CID) {
          return value;
        } else if (value["/"] != null && value["/"] === value.bytes || value.asCID === value) {
          const { version: version2, code, multihash, bytes } = value;
          return new _CID(version2, code, multihash, bytes !== null && bytes !== void 0 ? bytes : encodeCID(version2, code, multihash.bytes));
        } else if (value[cidSymbol] === true) {
          const { version: version2, multihash, code } = value;
          const digest = decode4(multihash);
          return _CID.create(version2, code, digest);
        } else {
          return null;
        }
      }
      /**
       * @param version - Version of the CID
       * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
       * @param digest - (Multi)hash of the of the content.
       */
      static create(version2, code, digest) {
        if (typeof code !== "number") {
          throw new Error("String codecs are no longer supported");
        }
        if (!(digest.bytes instanceof Uint8Array)) {
          throw new Error("Invalid digest");
        }
        switch (version2) {
          case 0: {
            if (code !== DAG_PB_CODE) {
              throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
            } else {
              return new _CID(version2, code, digest, digest.bytes);
            }
          }
          case 1: {
            const bytes = encodeCID(version2, code, digest.bytes);
            return new _CID(version2, code, digest, bytes);
          }
          default: {
            throw new Error("Invalid version");
          }
        }
      }
      /**
       * Simplified version of `create` for CIDv0.
       */
      static createV0(digest) {
        return _CID.create(0, DAG_PB_CODE, digest);
      }
      /**
       * Simplified version of `create` for CIDv1.
       *
       * @param code - Content encoding format code.
       * @param digest - Multihash of the content.
       */
      static createV1(code, digest) {
        return _CID.create(1, code, digest);
      }
      /**
       * Decoded a CID from its binary representation. The byte array must contain
       * only the CID with no additional bytes.
       *
       * An error will be thrown if the bytes provided do not contain a valid
       * binary representation of a CID.
       */
      static decode(bytes) {
        const [cid, remainder] = _CID.decodeFirst(bytes);
        if (remainder.length !== 0) {
          throw new Error("Incorrect length");
        }
        return cid;
      }
      /**
       * Decoded a CID from its binary representation at the beginning of a byte
       * array.
       *
       * Returns an array with the first element containing the CID and the second
       * element containing the remainder of the original byte array. The remainder
       * will be a zero-length byte array if the provided bytes only contained a
       * binary CID representation.
       */
      static decodeFirst(bytes) {
        const specs = _CID.inspectBytes(bytes);
        const prefixSize = specs.size - specs.multihashSize;
        const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
        if (multihashBytes.byteLength !== specs.multihashSize) {
          throw new Error("Incorrect length");
        }
        const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
        const digest = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
        const cid = specs.version === 0 ? _CID.createV0(digest) : _CID.createV1(specs.codec, digest);
        return [cid, bytes.subarray(specs.size)];
      }
      /**
       * Inspect the initial bytes of a CID to determine its properties.
       *
       * Involves decoding up to 4 varints. Typically this will require only 4 to 6
       * bytes but for larger multicodec code values and larger multihash digest
       * lengths these varints can be quite large. It is recommended that at least
       * 10 bytes be made available in the `initialBytes` argument for a complete
       * inspection.
       */
      static inspectBytes(initialBytes) {
        let offset = 0;
        const next = () => {
          const [i2, length2] = decode3(initialBytes.subarray(offset));
          offset += length2;
          return i2;
        };
        let version2 = next();
        let codec = DAG_PB_CODE;
        if (version2 === 18) {
          version2 = 0;
          offset = 0;
        } else {
          codec = next();
        }
        if (version2 !== 0 && version2 !== 1) {
          throw new RangeError(`Invalid CID version ${version2}`);
        }
        const prefixSize = offset;
        const multihashCode = next();
        const digestSize = next();
        const size = offset + digestSize;
        const multihashSize = size - prefixSize;
        return { version: version2, codec, multihashCode, digestSize, multihashSize, size };
      }
      /**
       * Takes cid in a string representation and creates an instance. If `base`
       * decoder is not provided will use a default from the configuration. It will
       * throw an error if encoding of the CID is not compatible with supplied (or
       * a default decoder).
       */
      static parse(source, base2) {
        const [prefix, bytes] = parseCIDtoBytes(source, base2);
        const cid = _CID.decode(bytes);
        if (cid.version === 0 && source[0] !== "Q") {
          throw Error("Version 0 CID string must not include multibase prefix");
        }
        baseCache(cid).set(prefix, source);
        return cid;
      }
    };
    DAG_PB_CODE = 112;
    SHA_256_CODE = 18;
    cidSymbol = Symbol.for("@ipld/js-cid/CID");
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/functions.mjs
import { Buffer as Buffer2 } from "node:buffer";
async function createCIDfromStream(data, multicode = multicodes3.RAW) {
  const uint8array = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const digest = await blake2b256stream.digest(uint8array);
  return CID2.create(1, multicode, digest).toString(base58btc2);
}
function createCID3(data, multicode = multicodes3.RAW) {
  const uint8array = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const digest = blake2b256.digest(uint8array);
  return CID2.create(1, multicode, digest).toString(base58btc2);
}
function blake32Hash2(data) {
  const uint8array = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const digest = blake2b256.digest(uint8array);
  return base58btc2.encode(digest.bytes);
}
var multicodes3, parseCID2, b64ToBuf, b64ToStr;
var init_functions = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/functions.mjs"() {
    init_base58();
    init_blake2b();
    init_blake2bstream();
    init_cid();
    multicodes3 = {
      RAW: 0,
      JSON: 512,
      SHELTER_CONTRACT_MANIFEST: 5316096,
      SHELTER_CONTRACT_TEXT: 5316097,
      SHELTER_CONTRACT_DATA: 5316098,
      SHELTER_FILE_MANIFEST: 5316099,
      SHELTER_FILE_CHUNK: 5316100
    };
    parseCID2 = (cid) => {
      if (!cid || cid.length < 52 || cid.length > 64) {
        throw new RangeError("CID length too short or too long");
      }
      const parsed = CID2.parse(cid, base58btc2);
      if (parsed.version !== 1 || parsed.multihash.code !== blake2b256.code || !Object.values(multicodes3).includes(parsed.code)) {
        throw new Error("Invalid CID");
      }
      return parsed;
    };
    b64ToBuf = (b64) => Buffer2.from(b64, "base64");
    b64ToStr = (b64) => b64ToBuf(b64).toString("utf8");
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/pubsub/index.mjs
function createClient2(url, options2 = {}) {
  const client = {
    customEventHandlers: options2.handlers || {},
    // The current number of connection attempts that failed.
    // Reset to 0 upon successful connection.
    // Used to compute how long to wait before the next reconnection attempt.
    failedConnectionAttempts: 0,
    isLocal: /\/\/(localhost|127\.0\.0\.1)([:?/]|$)/.test(url),
    // True if this client has never been connected yet.
    isNew: true,
    listeners: /* @__PURE__ */ Object.create(null),
    messageHandlers: { ...defaultMessageHandlers, ...options2.messageHandlers },
    nextConnectionAttemptDelayID: void 0,
    options: { ...defaultOptions, ...options2 },
    // Requested subscriptions for which we didn't receive a response yet.
    pendingSubscriptionSet: /* @__PURE__ */ new Set(),
    pendingUnsubscriptionSet: /* @__PURE__ */ new Set(),
    pingTimeoutID: void 0,
    shouldReconnect: true,
    // The underlying WebSocket object.
    // A new one is necessary for every connection or reconnection attempt.
    socket: null,
    subscriptionSet: /* @__PURE__ */ new Set(),
    kvFilter: /* @__PURE__ */ new Map(),
    connectionTimeoutID: void 0,
    url: url.replace(/^http/, "ws"),
    ...publicMethods
  };
  for (const name of Object.keys(defaultClientEventHandlers)) {
    client.listeners[name] = (event) => {
      try {
        ;
        defaultClientEventHandlers[name].call(client, event);
        client.customEventHandlers[name]?.call(client, event);
      } catch (error) {
        esm_default("okTurtles.events/emit", PUBSUB_ERROR, client, error?.message);
      }
    };
  }
  if (typeof self === "object" && self instanceof EventTarget) {
    for (const name of globalEventNames) {
      globalEventMap.set(name, client.listeners[name]);
    }
  }
  if (!client.options.manual) {
    client.connect();
  }
  return client;
}
function createMessage2(type, data, meta) {
  const message = { ...meta, type, data };
  let string;
  const stringify = function() {
    if (!string)
      string = JSON.stringify(this);
    return string;
  };
  Object.defineProperties(message, {
    [Symbol.toPrimitive]: {
      value: stringify
    }
  });
  return message;
}
function createPubMessage(channelID, data) {
  return JSON.stringify({ type: NOTIFICATION_TYPE2.PUB, channelID, data });
}
function createRequest(type, data) {
  return JSON.stringify(Object.assign({ type }, data));
}
var NOTIFICATION_TYPE2, REQUEST_TYPE2, RESPONSE_TYPE2, PUSH_SERVER_ACTION_TYPE2, defaultOptions, PUBSUB_ERROR, PUBSUB_RECONNECTION_ATTEMPT, PUBSUB_RECONNECTION_FAILED, PUBSUB_RECONNECTION_SCHEDULED, PUBSUB_RECONNECTION_SUCCEEDED, PUBSUB_SUBSCRIPTION_SUCCEEDED, defaultClientEventHandlers, defaultMessageHandlers, globalEventNames, socketEventNames, globalEventMap, isDefinetelyOffline, messageParser2, publicMethods;
var init_pubsub = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/pubsub/index.mjs"() {
    init_esm4();
    init_esm();
    NOTIFICATION_TYPE2 = Object.freeze({
      ENTRY: "entry",
      DELETION: "deletion",
      KV: "kv",
      KV_FILTER: "kv_filter",
      PING: "ping",
      PONG: "pong",
      PUB: "pub",
      SUB: "sub",
      UNSUB: "unsub",
      VERSION_INFO: "version_info"
    });
    REQUEST_TYPE2 = Object.freeze({
      PUB: "pub",
      SUB: "sub",
      UNSUB: "unsub",
      PUSH_ACTION: "push_action",
      KV_FILTER: "kv_filter"
    });
    RESPONSE_TYPE2 = Object.freeze({
      ERROR: "error",
      OK: "ok"
    });
    PUSH_SERVER_ACTION_TYPE2 = Object.freeze({
      SEND_PUBLIC_KEY: "send-public-key",
      STORE_SUBSCRIPTION: "store-subscription",
      DELETE_SUBSCRIPTION: "delete-subscription",
      SEND_PUSH_NOTIFICATION: "send-push-notification"
    });
    defaultOptions = {
      logPingMessages: process.env.NODE_ENV === "development" && !process.env.CI,
      pingTimeout: 45e3,
      maxReconnectionDelay: 6e4,
      maxRetries: 10,
      minReconnectionDelay: 500,
      reconnectOnDisconnection: true,
      reconnectOnOnline: true,
      // Defaults to false to avoid reconnection attempts in case the server doesn't
      // respond because of a failed authentication.
      reconnectOnTimeout: false,
      reconnectionDelayGrowFactor: 2,
      timeout: 6e4
    };
    PUBSUB_ERROR = "pubsub-error";
    PUBSUB_RECONNECTION_ATTEMPT = "pubsub-reconnection-attempt";
    PUBSUB_RECONNECTION_FAILED = "pubsub-reconnection-failed";
    PUBSUB_RECONNECTION_SCHEDULED = "pubsub-reconnection-scheduled";
    PUBSUB_RECONNECTION_SUCCEEDED = "pubsub-reconnection-succeeded";
    PUBSUB_SUBSCRIPTION_SUCCEEDED = "pubsub-subscription-succeeded";
    defaultClientEventHandlers = {
      // Emitted when the connection is closed.
      close(event) {
        const client = this;
        console.debug("[pubsub] Event: close", event.code, event.reason);
        client.failedConnectionAttempts++;
        if (client.socket) {
          for (const name of socketEventNames) {
            client.socket.removeEventListener(name, client.listeners[name]);
          }
        }
        client.socket = null;
        client.clearAllTimers();
        if (client.shouldReconnect) {
          client.subscriptionSet.forEach((channelID) => {
            if (!client.pendingUnsubscriptionSet.has(channelID)) {
              client.pendingSubscriptionSet.add(channelID);
            }
          });
        }
        client.subscriptionSet.clear();
        client.pendingUnsubscriptionSet.clear();
        if (client.shouldReconnect && client.options.reconnectOnDisconnection) {
          if (client.failedConnectionAttempts > client.options.maxRetries) {
            esm_default("okTurtles.events/emit", PUBSUB_RECONNECTION_FAILED, client);
          } else {
            if (!isDefinetelyOffline() || client.isLocal) {
              client.scheduleConnectionAttempt();
            }
          }
        }
      },
      // Emitted when an error has occured.
      // The socket will be closed automatically by the engine if necessary.
      error(event) {
        const client = this;
        console.warn("[pubsub] Event: error", event);
        clearTimeout(client.pingTimeoutID);
      },
      // Emitted when a message is received.
      // The connection will be terminated if the message is malformed or has an
      // unexpected data type (e.g. binary instead of text).
      message(event) {
        const client = this;
        const { data } = event;
        if (typeof data !== "string") {
          esm_default("okTurtles.events/emit", PUBSUB_ERROR, client, {
            message: `Wrong data type: ${typeof data}`
          });
          return client.destroy();
        }
        let msg = { type: "" };
        try {
          msg = messageParser2(data);
        } catch (error) {
          esm_default("okTurtles.events/emit", PUBSUB_ERROR, client, {
            message: `Malformed message: ${error?.message}`
          });
          return client.destroy();
        }
        const handler = client.messageHandlers[msg.type];
        if (handler) {
          handler.call(client, msg);
        } else {
          throw new Error(`Unhandled message type: ${msg.type}`);
        }
      },
      offline() {
        console.info("[pubsub] Event: offline");
        const client = this;
        client.clearAllTimers();
        client.failedConnectionAttempts = 0;
        client.socket?.close();
      },
      online() {
        console.info("[pubsub] Event: online");
        const client = this;
        if (client.options.reconnectOnOnline && client.shouldReconnect) {
          if (!client.socket) {
            client.failedConnectionAttempts = 0;
            client.scheduleConnectionAttempt();
          }
        }
      },
      // Emitted when the connection is established.
      open() {
        console.debug("[pubsub] Event: open");
        const client = this;
        const { options: options2 } = this;
        client.connectionTimeUsed = void 0;
        client.clearAllTimers();
        esm_default("okTurtles.events/emit", PUBSUB_RECONNECTION_SUCCEEDED, client);
        client.failedConnectionAttempts = -1;
        client.isNew = false;
        if (options2.pingTimeout > 0 && options2.pingTimeout < Infinity) {
          client.pingTimeoutID = setTimeout(() => {
            client.socket?.close();
          }, options2.pingTimeout);
        }
        client.pendingSubscriptionSet.forEach((channelID) => {
          const kvFilter = this.kvFilter.get(channelID);
          client.socket?.send(createRequest(REQUEST_TYPE2.SUB, kvFilter ? { channelID, kvFilter } : { channelID }));
        });
      },
      "reconnection-attempt"() {
        console.info("[pubsub] Trying to reconnect...");
      },
      "reconnection-succeeded"() {
        console.info("[pubsub] Connection re-established");
      },
      "reconnection-failed"() {
        console.warn("[pubsub] Reconnection failed");
        const client = this;
        client.destroy();
      },
      "reconnection-scheduled"(event) {
        const { delay: delay2, nth } = event.detail;
        console.info(`[pubsub] Scheduled connection attempt ${nth} in ~${delay2} ms`);
      },
      "subscription-succeeded"(event) {
        const { channelID } = event.detail;
        console.debug(`[pubsub] Subscribed to channel ${channelID}`);
      }
    };
    defaultMessageHandlers = {
      [NOTIFICATION_TYPE2.ENTRY](msg) {
        console.debug("[pubsub] Received ENTRY:", msg);
      },
      [NOTIFICATION_TYPE2.PING]({ data }) {
        const client = this;
        if (client.options.logPingMessages) {
          console.debug(`[pubsub] Ping received in ${Date.now() - Number(data)} ms`);
        }
        client.socket?.send(createMessage2(NOTIFICATION_TYPE2.PONG, data));
        clearTimeout(client.pingTimeoutID);
        client.pingTimeoutID = setTimeout(() => {
          client.socket?.close();
        }, client.options.pingTimeout);
      },
      [NOTIFICATION_TYPE2.PUB]({ channelID, data }) {
        console.log(`[pubsub] Received data from channel ${channelID}:`, data);
      },
      [NOTIFICATION_TYPE2.KV]({ channelID, key, data }) {
        console.log(`[pubsub] Received KV update from channel ${channelID} ${key}:`, data);
      },
      [NOTIFICATION_TYPE2.SUB](msg) {
        console.debug(`[pubsub] Ignoring ${msg.type} message:`, msg.data);
      },
      [NOTIFICATION_TYPE2.UNSUB](msg) {
        console.debug(`[pubsub] Ignoring ${msg.type} message:`, msg.data);
      },
      [RESPONSE_TYPE2.ERROR]({ data }) {
        const { type, channelID, reason } = data;
        console.warn(`[pubsub] Received ERROR response for ${type} request to ${channelID}`);
        const client = this;
        switch (type) {
          case REQUEST_TYPE2.SUB: {
            console.warn(`[pubsub] Could not subscribe to ${channelID}: ${reason}`);
            client.pendingSubscriptionSet.delete(channelID);
            break;
          }
          case REQUEST_TYPE2.UNSUB: {
            console.warn(`[pubsub] Could not unsubscribe from ${channelID}: ${reason}`);
            client.pendingUnsubscriptionSet.delete(channelID);
            break;
          }
          case REQUEST_TYPE2.PUSH_ACTION: {
            const { actionType, message } = data;
            console.warn(`[pubsub] Received ERROR for PUSH_ACTION request with the action type '${actionType}' and the following message: ${message}`);
            break;
          }
          default: {
            console.error(`[pubsub] Malformed response: invalid request type ${type}`);
          }
        }
      },
      [RESPONSE_TYPE2.OK]({ data: { type, channelID } }) {
        const client = this;
        switch (type) {
          case REQUEST_TYPE2.SUB: {
            client.pendingSubscriptionSet.delete(channelID);
            client.subscriptionSet.add(channelID);
            esm_default("okTurtles.events/emit", PUBSUB_SUBSCRIPTION_SUCCEEDED, client, { channelID });
            break;
          }
          case REQUEST_TYPE2.UNSUB: {
            console.debug(`[pubsub] Unsubscribed from ${channelID}`);
            client.pendingUnsubscriptionSet.delete(channelID);
            client.subscriptionSet.delete(channelID);
            client.kvFilter.delete(channelID);
            break;
          }
          case REQUEST_TYPE2.KV_FILTER: {
            console.debug(`[pubsub] Set KV filter for ${channelID}`);
            break;
          }
          default: {
            console.error(`[pubsub] Malformed response: invalid request type ${type}`);
          }
        }
      }
    };
    globalEventNames = ["offline", "online"];
    socketEventNames = ["close", "error", "message", "open"];
    globalEventMap = /* @__PURE__ */ new Map();
    if (typeof self === "object" && self instanceof EventTarget) {
      for (const name of globalEventNames) {
        const handler = (ev) => {
          const h2 = globalEventMap.get(name);
          return h2?.(ev);
        };
        self.addEventListener(name, handler, false);
      }
    }
    isDefinetelyOffline = () => typeof navigator === "object" && navigator.onLine === false;
    messageParser2 = (data) => {
      const msg = JSON.parse(data);
      if (typeof msg !== "object" || msg === null) {
        throw new TypeError("Message is null or not an object");
      }
      const { type } = msg;
      if (typeof type !== "string" || type === "") {
        throw new TypeError("Message type must be a non-empty string");
      }
      return msg;
    };
    publicMethods = {
      clearAllTimers() {
        const client = this;
        clearTimeout(client.connectionTimeoutID);
        clearTimeout(client.nextConnectionAttemptDelayID);
        clearTimeout(client.pingTimeoutID);
        client.connectionTimeoutID = void 0;
        client.nextConnectionAttemptDelayID = void 0;
        client.pingTimeoutID = void 0;
      },
      // Performs a connection or reconnection attempt.
      connect() {
        const client = this;
        if (client.socket !== null) {
          throw new Error("connect() can only be called if there is no current socket.");
        }
        if (client.nextConnectionAttemptDelayID) {
          throw new Error("connect() must not be called during a reconnection delay.");
        }
        if (!client.shouldReconnect) {
          throw new Error("connect() should no longer be called on this instance.");
        }
        client.socket = new WebSocket(client.url);
        client.socket.send = function(data) {
          const send = WebSocket.prototype.send.bind(this);
          if (typeof data === "object" && typeof data[Symbol.toPrimitive] === "function") {
            return send(data[Symbol.toPrimitive]());
          }
          return send(data);
        };
        if (client.options.timeout) {
          const start = performance.now();
          client.connectionTimeoutID = setTimeout(() => {
            client.connectionTimeoutID = void 0;
            if (client.options.reconnectOnTimeout) {
              client.connectionTimeUsed = performance.now() - start;
            }
            client.socket?.close(4e3, "timeout");
          }, client.options.timeout);
        }
        for (const name of socketEventNames) {
          client.socket.addEventListener(name, client.listeners[name]);
        }
      },
      /**
       * Immediately close the socket, stop listening for events and clear any cache.
       *
       * This method is used in unit tests.
       * - In particular, no 'close' event handler will be called.
       * - Any incoming or outgoing buffered data will be discarded.
       * - Any pending messages will be discarded.
       */
      destroy() {
        const client = this;
        client.clearAllTimers();
        client.pendingSubscriptionSet.clear();
        client.pendingUnsubscriptionSet.clear();
        client.subscriptionSet.clear();
        if (typeof self === "object" && self instanceof EventTarget) {
          for (const name of globalEventNames) {
            globalEventMap.delete(name);
          }
        }
        if (client.socket) {
          for (const name of socketEventNames) {
            client.socket.removeEventListener(name, client.listeners[name]);
          }
          client.socket.close();
        }
        client.listeners = /* @__PURE__ */ Object.create(null);
        client.socket = null;
        client.shouldReconnect = false;
      },
      getNextRandomDelay() {
        const client = this;
        const { maxReconnectionDelay, minReconnectionDelay, reconnectionDelayGrowFactor } = client.options;
        const minDelay = minReconnectionDelay * reconnectionDelayGrowFactor ** client.failedConnectionAttempts;
        const maxDelay = minDelay * reconnectionDelayGrowFactor;
        const connectionTimeUsed = client.connectionTimeUsed;
        client.connectionTimeUsed = void 0;
        return Math.min(
          // See issue #1943: Have the connection time used 'eat into' the
          // reconnection time used
          Math.max(minReconnectionDelay, connectionTimeUsed ? maxReconnectionDelay - connectionTimeUsed : maxReconnectionDelay),
          Math.round(minDelay + (0, Math.random)() * (maxDelay - minDelay))
        );
      },
      // Schedules a connection attempt to happen after a delay computed according to
      // a randomized exponential backoff algorithm variant.
      scheduleConnectionAttempt() {
        const client = this;
        if (!client.shouldReconnect) {
          throw new Error("Cannot call `scheduleConnectionAttempt()` when `shouldReconnect` is false.");
        }
        if (client.nextConnectionAttemptDelayID) {
          return console.warn("[pubsub] A reconnection attempt is already scheduled.");
        }
        const delay2 = client.getNextRandomDelay();
        const nth = client.failedConnectionAttempts + 1;
        client.nextConnectionAttemptDelayID = setTimeout(() => {
          esm_default("okTurtles.events/emit", PUBSUB_RECONNECTION_ATTEMPT, client);
          client.nextConnectionAttemptDelayID = void 0;
          client.connect();
        }, delay2);
        esm_default("okTurtles.events/emit", PUBSUB_RECONNECTION_SCHEDULED, client, { delay: delay2, nth });
      },
      // Can be used to send ephemeral messages outside of any contract log.
      // Does nothing if the socket is not in the OPEN state.
      pub(channelID, data) {
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.socket.send(createPubMessage(channelID, data));
        }
      },
      /**
       * Sends a SUB request to the server as soon as possible.
       *
       * - The given channel ID will be cached until we get a relevant server
       * response, allowing us to resend the same request if necessary.
       * - Any identical UNSUB request that has not been sent yet will be cancelled.
       * - Calling this method again before the server has responded has no effect.
       * @param channelID - The ID of the channel whose updates we want to subscribe to.
       */
      sub(channelID) {
        const client = this;
        const { socket } = this;
        if (!client.pendingSubscriptionSet.has(channelID)) {
          client.pendingSubscriptionSet.add(channelID);
          client.pendingUnsubscriptionSet.delete(channelID);
          if (socket?.readyState === WebSocket.OPEN) {
            const kvFilter = client.kvFilter.get(channelID);
            socket.send(createRequest(REQUEST_TYPE2.SUB, kvFilter ? { channelID, kvFilter } : { channelID }));
          }
        }
      },
      /**
       * Sends a KV_FILTER request to the server as soon as possible.
       */
      setKvFilter(channelID, kvFilter) {
        const client = this;
        const { socket } = this;
        if (kvFilter) {
          client.kvFilter.set(channelID, kvFilter);
        } else {
          client.kvFilter.delete(channelID);
        }
        if (client.subscriptionSet.has(channelID)) {
          if (socket?.readyState === WebSocket.OPEN) {
            socket.send(createRequest(REQUEST_TYPE2.KV_FILTER, kvFilter ? { channelID, kvFilter } : { channelID }));
          }
        }
      },
      /**
       * Sends an UNSUB request to the server as soon as possible.
       *
       * - The given channel ID will be cached until we get a relevant server
       * response, allowing us to resend the same request if necessary.
       * - Any identical SUB request that has not been sent yet will be cancelled.
       * - Calling this method again before the server has responded has no effect.
       * @param channelID - The ID of the channel whose updates we want to unsubscribe from.
       */
      unsub(channelID) {
        const client = this;
        const { socket } = this;
        if (!client.pendingUnsubscriptionSet.has(channelID)) {
          client.pendingSubscriptionSet.delete(channelID);
          client.pendingUnsubscriptionSet.add(channelID);
          if (socket?.readyState === WebSocket.OPEN) {
            socket.send(createRequest(REQUEST_TYPE2.UNSUB, { channelID }));
          }
        }
      }
    };
    for (const name of Object.keys(defaultClientEventHandlers)) {
      if (name === "error" || !socketEventNames.includes(name)) {
        esm_default("okTurtles.events/on", `pubsub-${name}`, (target, detail) => {
          const ev = new CustomEvent(name, { detail });
          target.listeners[name].call(target, ev);
        });
      }
    }
  }
});

// node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/index.mjs
var init_esm6 = __esm({
  "node_modules/.deno/@chelonia+multiformats@1.0.0/node_modules/@chelonia/multiformats/dist/esm/index.mjs"() {
    init_base();
    init_base32();
    init_base58();
    init_blake2b();
    init_blake2bstream();
    init_cid();
    init_hasher();
    init_digest();
  }
});

// node_modules/.deno/scrypt-async@2.0.1/node_modules/scrypt-async/scrypt-async.js
var require_scrypt_async = __commonJS({
  "node_modules/.deno/scrypt-async@2.0.1/node_modules/scrypt-async/scrypt-async.js"(exports, module) {
    function scrypt3(password, salt, logN, r, dkLen, interruptStep, callback, encoding) {
      "use strict";
      function SHA256(m3) {
        var K2 = [
          1116352408,
          1899447441,
          3049323471,
          3921009573,
          961987163,
          1508970993,
          2453635748,
          2870763221,
          3624381080,
          310598401,
          607225278,
          1426881987,
          1925078388,
          2162078206,
          2614888103,
          3248222580,
          3835390401,
          4022224774,
          264347078,
          604807628,
          770255983,
          1249150122,
          1555081692,
          1996064986,
          2554220882,
          2821834349,
          2952996808,
          3210313671,
          3336571891,
          3584528711,
          113926993,
          338241895,
          666307205,
          773529912,
          1294757372,
          1396182291,
          1695183700,
          1986661051,
          2177026350,
          2456956037,
          2730485921,
          2820302411,
          3259730800,
          3345764771,
          3516065817,
          3600352804,
          4094571909,
          275423344,
          430227734,
          506948616,
          659060556,
          883997877,
          958139571,
          1322822218,
          1537002063,
          1747873779,
          1955562222,
          2024104815,
          2227730452,
          2361852424,
          2428436474,
          2756734187,
          3204031479,
          3329325298
        ];
        var h0 = 1779033703, h1 = 3144134277, h2 = 1013904242, h3 = 2773480762, h4 = 1359893119, h5 = 2600822924, h6 = 528734635, h7 = 1541459225, w3 = new Array(64);
        function blocks(p3) {
          var off = 0, len = p3.length;
          while (len >= 64) {
            var a = h0, b = h1, c = h2, d = h3, e2 = h4, f = h5, g2 = h6, h8 = h7, u2, i3, j, t1, t2;
            for (i3 = 0; i3 < 16; i3++) {
              j = off + i3 * 4;
              w3[i3] = (p3[j] & 255) << 24 | (p3[j + 1] & 255) << 16 | (p3[j + 2] & 255) << 8 | p3[j + 3] & 255;
            }
            for (i3 = 16; i3 < 64; i3++) {
              u2 = w3[i3 - 2];
              t1 = (u2 >>> 17 | u2 << 32 - 17) ^ (u2 >>> 19 | u2 << 32 - 19) ^ u2 >>> 10;
              u2 = w3[i3 - 15];
              t2 = (u2 >>> 7 | u2 << 32 - 7) ^ (u2 >>> 18 | u2 << 32 - 18) ^ u2 >>> 3;
              w3[i3] = (t1 + w3[i3 - 7] | 0) + (t2 + w3[i3 - 16] | 0) | 0;
            }
            for (i3 = 0; i3 < 64; i3++) {
              t1 = (((e2 >>> 6 | e2 << 32 - 6) ^ (e2 >>> 11 | e2 << 32 - 11) ^ (e2 >>> 25 | e2 << 32 - 25)) + (e2 & f ^ ~e2 & g2) | 0) + (h8 + (K2[i3] + w3[i3] | 0) | 0) | 0;
              t2 = ((a >>> 2 | a << 32 - 2) ^ (a >>> 13 | a << 32 - 13) ^ (a >>> 22 | a << 32 - 22)) + (a & b ^ a & c ^ b & c) | 0;
              h8 = g2;
              g2 = f;
              f = e2;
              e2 = d + t1 | 0;
              d = c;
              c = b;
              b = a;
              a = t1 + t2 | 0;
            }
            h0 = h0 + a | 0;
            h1 = h1 + b | 0;
            h2 = h2 + c | 0;
            h3 = h3 + d | 0;
            h4 = h4 + e2 | 0;
            h5 = h5 + f | 0;
            h6 = h6 + g2 | 0;
            h7 = h7 + h8 | 0;
            off += 64;
            len -= 64;
          }
        }
        blocks(m3);
        var i2, bytesLeft = m3.length % 64, bitLenHi = m3.length / 536870912 | 0, bitLenLo = m3.length << 3, numZeros = bytesLeft < 56 ? 56 : 120, p2 = m3.slice(m3.length - bytesLeft, m3.length);
        p2.push(128);
        for (i2 = bytesLeft + 1; i2 < numZeros; i2++) p2.push(0);
        p2.push(bitLenHi >>> 24 & 255);
        p2.push(bitLenHi >>> 16 & 255);
        p2.push(bitLenHi >>> 8 & 255);
        p2.push(bitLenHi >>> 0 & 255);
        p2.push(bitLenLo >>> 24 & 255);
        p2.push(bitLenLo >>> 16 & 255);
        p2.push(bitLenLo >>> 8 & 255);
        p2.push(bitLenLo >>> 0 & 255);
        blocks(p2);
        return [
          h0 >>> 24 & 255,
          h0 >>> 16 & 255,
          h0 >>> 8 & 255,
          h0 >>> 0 & 255,
          h1 >>> 24 & 255,
          h1 >>> 16 & 255,
          h1 >>> 8 & 255,
          h1 >>> 0 & 255,
          h2 >>> 24 & 255,
          h2 >>> 16 & 255,
          h2 >>> 8 & 255,
          h2 >>> 0 & 255,
          h3 >>> 24 & 255,
          h3 >>> 16 & 255,
          h3 >>> 8 & 255,
          h3 >>> 0 & 255,
          h4 >>> 24 & 255,
          h4 >>> 16 & 255,
          h4 >>> 8 & 255,
          h4 >>> 0 & 255,
          h5 >>> 24 & 255,
          h5 >>> 16 & 255,
          h5 >>> 8 & 255,
          h5 >>> 0 & 255,
          h6 >>> 24 & 255,
          h6 >>> 16 & 255,
          h6 >>> 8 & 255,
          h6 >>> 0 & 255,
          h7 >>> 24 & 255,
          h7 >>> 16 & 255,
          h7 >>> 8 & 255,
          h7 >>> 0 & 255
        ];
      }
      function PBKDF2_HMAC_SHA256_OneIter(password2, salt2, dkLen2) {
        if (password2.length > 64) {
          password2 = SHA256(password2.push ? password2 : Array.prototype.slice.call(password2, 0));
        }
        var i2, innerLen = 64 + salt2.length + 4, inner = new Array(innerLen), outerKey = new Array(64), dk = [];
        for (i2 = 0; i2 < 64; i2++) inner[i2] = 54;
        for (i2 = 0; i2 < password2.length; i2++) inner[i2] ^= password2[i2];
        for (i2 = 0; i2 < salt2.length; i2++) inner[64 + i2] = salt2[i2];
        for (i2 = innerLen - 4; i2 < innerLen; i2++) inner[i2] = 0;
        for (i2 = 0; i2 < 64; i2++) outerKey[i2] = 92;
        for (i2 = 0; i2 < password2.length; i2++) outerKey[i2] ^= password2[i2];
        function incrementCounter() {
          for (var i3 = innerLen - 1; i3 >= innerLen - 4; i3--) {
            inner[i3]++;
            if (inner[i3] <= 255) return;
            inner[i3] = 0;
          }
        }
        while (dkLen2 >= 32) {
          incrementCounter();
          dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))));
          dkLen2 -= 32;
        }
        if (dkLen2 > 0) {
          incrementCounter();
          dk = dk.concat(SHA256(outerKey.concat(SHA256(inner))).slice(0, dkLen2));
        }
        return dk;
      }
      function salsaXOR(tmp2, B4, bin, bout) {
        var j0 = tmp2[0] ^ B4[bin++], j1 = tmp2[1] ^ B4[bin++], j2 = tmp2[2] ^ B4[bin++], j3 = tmp2[3] ^ B4[bin++], j4 = tmp2[4] ^ B4[bin++], j5 = tmp2[5] ^ B4[bin++], j6 = tmp2[6] ^ B4[bin++], j7 = tmp2[7] ^ B4[bin++], j8 = tmp2[8] ^ B4[bin++], j9 = tmp2[9] ^ B4[bin++], j10 = tmp2[10] ^ B4[bin++], j11 = tmp2[11] ^ B4[bin++], j12 = tmp2[12] ^ B4[bin++], j13 = tmp2[13] ^ B4[bin++], j14 = tmp2[14] ^ B4[bin++], j15 = tmp2[15] ^ B4[bin++], u2, i2;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15;
        for (i2 = 0; i2 < 8; i2 += 2) {
          u2 = x0 + x12;
          x4 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x4 + x0;
          x8 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x8 + x4;
          x12 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x12 + x8;
          x0 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x5 + x1;
          x9 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x9 + x5;
          x13 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x13 + x9;
          x1 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x1 + x13;
          x5 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x10 + x6;
          x14 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x14 + x10;
          x2 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x2 + x14;
          x6 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x6 + x2;
          x10 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x15 + x11;
          x3 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x3 + x15;
          x7 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x7 + x3;
          x11 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x11 + x7;
          x15 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x0 + x3;
          x1 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x1 + x0;
          x2 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x2 + x1;
          x3 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x3 + x2;
          x0 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x5 + x4;
          x6 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x6 + x5;
          x7 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x7 + x6;
          x4 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x4 + x7;
          x5 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x10 + x9;
          x11 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x11 + x10;
          x8 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x8 + x11;
          x9 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x9 + x8;
          x10 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x15 + x14;
          x12 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x12 + x15;
          x13 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x13 + x12;
          x14 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x14 + x13;
          x15 ^= u2 << 18 | u2 >>> 32 - 18;
        }
        B4[bout++] = tmp2[0] = x0 + j0 | 0;
        B4[bout++] = tmp2[1] = x1 + j1 | 0;
        B4[bout++] = tmp2[2] = x2 + j2 | 0;
        B4[bout++] = tmp2[3] = x3 + j3 | 0;
        B4[bout++] = tmp2[4] = x4 + j4 | 0;
        B4[bout++] = tmp2[5] = x5 + j5 | 0;
        B4[bout++] = tmp2[6] = x6 + j6 | 0;
        B4[bout++] = tmp2[7] = x7 + j7 | 0;
        B4[bout++] = tmp2[8] = x8 + j8 | 0;
        B4[bout++] = tmp2[9] = x9 + j9 | 0;
        B4[bout++] = tmp2[10] = x10 + j10 | 0;
        B4[bout++] = tmp2[11] = x11 + j11 | 0;
        B4[bout++] = tmp2[12] = x12 + j12 | 0;
        B4[bout++] = tmp2[13] = x13 + j13 | 0;
        B4[bout++] = tmp2[14] = x14 + j14 | 0;
        B4[bout++] = tmp2[15] = x15 + j15 | 0;
      }
      function blockCopy(dst, di, src2, si, len) {
        while (len--) dst[di++] = src2[si++];
      }
      function blockXOR(dst, di, src2, si, len) {
        while (len--) dst[di++] ^= src2[si++];
      }
      function blockMix(tmp2, B4, bin, bout, r2) {
        blockCopy(tmp2, 0, B4, bin + (2 * r2 - 1) * 16, 16);
        for (var i2 = 0; i2 < 2 * r2; i2 += 2) {
          salsaXOR(tmp2, B4, bin + i2 * 16, bout + i2 * 8);
          salsaXOR(tmp2, B4, bin + i2 * 16 + 16, bout + i2 * 8 + r2 * 16);
        }
      }
      function integerify(B4, bi, r2) {
        return B4[bi + (2 * r2 - 1) * 16];
      }
      function stringToUTF8Bytes(s) {
        var arr = [];
        for (var i2 = 0; i2 < s.length; i2++) {
          var c = s.charCodeAt(i2);
          if (c < 128) {
            arr.push(c);
          } else if (c < 2048) {
            arr.push(192 | c >> 6);
            arr.push(128 | c & 63);
          } else if (c < 55296) {
            arr.push(224 | c >> 12);
            arr.push(128 | c >> 6 & 63);
            arr.push(128 | c & 63);
          } else {
            if (i2 >= s.length - 1) {
              throw new Error("invalid string");
            }
            i2++;
            c = (c & 1023) << 10;
            c |= s.charCodeAt(i2) & 1023;
            c += 65536;
            arr.push(240 | c >> 18);
            arr.push(128 | c >> 12 & 63);
            arr.push(128 | c >> 6 & 63);
            arr.push(128 | c & 63);
          }
        }
        return arr;
      }
      function bytesToHex(p2) {
        var enc = "0123456789abcdef".split("");
        var len = p2.length, arr = [], i2 = 0;
        for (; i2 < len; i2++) {
          arr.push(enc[p2[i2] >>> 4 & 15]);
          arr.push(enc[p2[i2] >>> 0 & 15]);
        }
        return arr.join("");
      }
      function bytesToBase64(p2) {
        var enc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
        var len = p2.length, arr = [], i2 = 0, a, b, c, t;
        while (i2 < len) {
          a = i2 < len ? p2[i2++] : 0;
          b = i2 < len ? p2[i2++] : 0;
          c = i2 < len ? p2[i2++] : 0;
          t = (a << 16) + (b << 8) + c;
          arr.push(enc[t >>> 3 * 6 & 63]);
          arr.push(enc[t >>> 2 * 6 & 63]);
          arr.push(enc[t >>> 1 * 6 & 63]);
          arr.push(enc[t >>> 0 * 6 & 63]);
        }
        if (len % 3 > 0) {
          arr[arr.length - 1] = "=";
          if (len % 3 === 1) arr[arr.length - 2] = "=";
        }
        return arr.join("");
      }
      var MAX_UINT = -1 >>> 0, p = 1;
      if (typeof logN === "object") {
        if (arguments.length > 4) {
          throw new Error("scrypt: incorrect number of arguments");
        }
        var opts = logN;
        callback = r;
        logN = opts.logN;
        if (typeof logN === "undefined") {
          if (typeof opts.N !== "undefined") {
            if (opts.N < 2 || opts.N > MAX_UINT)
              throw new Error("scrypt: N is out of range");
            if ((opts.N & opts.N - 1) !== 0)
              throw new Error("scrypt: N is not a power of 2");
            logN = Math.log(opts.N) / Math.LN2;
          } else {
            throw new Error("scrypt: missing N parameter");
          }
        }
        p = opts.p || 1;
        r = opts.r;
        dkLen = opts.dkLen || 32;
        interruptStep = opts.interruptStep || 0;
        encoding = opts.encoding;
      }
      if (p < 1)
        throw new Error("scrypt: invalid p");
      if (r <= 0)
        throw new Error("scrypt: invalid r");
      if (logN < 1 || logN > 31)
        throw new Error("scrypt: logN must be between 1 and 31");
      var N10 = 1 << logN >>> 0, XY, V, B3, tmp;
      if (r * p >= 1 << 30 || r > MAX_UINT / 128 / p || r > MAX_UINT / 256 || N10 > MAX_UINT / 128 / r)
        throw new Error("scrypt: parameters are too large");
      if (typeof password === "string")
        password = stringToUTF8Bytes(password);
      if (typeof salt === "string")
        salt = stringToUTF8Bytes(salt);
      if (typeof Int32Array !== "undefined") {
        XY = new Int32Array(64 * r);
        V = new Int32Array(32 * N10 * r);
        tmp = new Int32Array(16);
      } else {
        XY = [];
        V = [];
        tmp = new Array(16);
      }
      B3 = PBKDF2_HMAC_SHA256_OneIter(password, salt, p * 128 * r);
      var xi = 0, yi = 32 * r;
      function smixStart(pos) {
        for (var i2 = 0; i2 < 32 * r; i2++) {
          var j = pos + i2 * 4;
          XY[xi + i2] = (B3[j + 3] & 255) << 24 | (B3[j + 2] & 255) << 16 | (B3[j + 1] & 255) << 8 | (B3[j + 0] & 255) << 0;
        }
      }
      function smixStep1(start, end) {
        for (var i2 = start; i2 < end; i2 += 2) {
          blockCopy(V, i2 * (32 * r), XY, xi, 32 * r);
          blockMix(tmp, XY, xi, yi, r);
          blockCopy(V, (i2 + 1) * (32 * r), XY, yi, 32 * r);
          blockMix(tmp, XY, yi, xi, r);
        }
      }
      function smixStep2(start, end) {
        for (var i2 = start; i2 < end; i2 += 2) {
          var j = integerify(XY, xi, r) & N10 - 1;
          blockXOR(XY, xi, V, j * (32 * r), 32 * r);
          blockMix(tmp, XY, xi, yi, r);
          j = integerify(XY, yi, r) & N10 - 1;
          blockXOR(XY, yi, V, j * (32 * r), 32 * r);
          blockMix(tmp, XY, yi, xi, r);
        }
      }
      function smixFinish(pos) {
        for (var i2 = 0; i2 < 32 * r; i2++) {
          var j = XY[xi + i2];
          B3[pos + i2 * 4 + 0] = j >>> 0 & 255;
          B3[pos + i2 * 4 + 1] = j >>> 8 & 255;
          B3[pos + i2 * 4 + 2] = j >>> 16 & 255;
          B3[pos + i2 * 4 + 3] = j >>> 24 & 255;
        }
      }
      var nextTick = typeof setImmediate !== "undefined" ? setImmediate : setTimeout;
      function interruptedFor(start, end, step, fn, donefn) {
        (function performStep() {
          nextTick(function() {
            fn(start, start + step < end ? start + step : end);
            start += step;
            if (start < end)
              performStep();
            else
              donefn();
          });
        })();
      }
      function getResult(enc) {
        var result = PBKDF2_HMAC_SHA256_OneIter(password, B3, dkLen);
        if (enc === "base64")
          return bytesToBase64(result);
        else if (enc === "hex")
          return bytesToHex(result);
        else if (enc === "binary")
          return new Uint8Array(result);
        else
          return result;
      }
      function calculateSync() {
        for (var i2 = 0; i2 < p; i2++) {
          smixStart(i2 * 128 * r);
          smixStep1(0, N10);
          smixStep2(0, N10);
          smixFinish(i2 * 128 * r);
        }
        callback(getResult(encoding));
      }
      function calculateAsync(i2) {
        smixStart(i2 * 128 * r);
        interruptedFor(0, N10, interruptStep * 2, smixStep1, function() {
          interruptedFor(0, N10, interruptStep * 2, smixStep2, function() {
            smixFinish(i2 * 128 * r);
            if (i2 + 1 < p) {
              nextTick(function() {
                calculateAsync(i2 + 1);
              });
            } else {
              callback(getResult(encoding));
            }
          });
        });
      }
      if (typeof interruptStep === "function") {
        encoding = callback;
        callback = interruptStep;
        interruptStep = 1e3;
      }
      if (interruptStep <= 0) {
        calculateSync();
      } else {
        calculateAsync(0);
      }
    }
    if (typeof module !== "undefined") module.exports = scrypt3;
  }
});

// node_modules/.deno/tweetnacl@1.0.3/node_modules/tweetnacl/nacl-fast.js
var require_nacl_fast = __commonJS({
  "node_modules/.deno/tweetnacl@1.0.3/node_modules/tweetnacl/nacl-fast.js"(exports, module) {
    (function(nacl4) {
      "use strict";
      var gf = function(init) {
        var i2, r = new Float64Array(16);
        if (init) for (i2 = 0; i2 < init.length; i2++) r[i2] = init[i2];
        return r;
      };
      var randombytes = function() {
        throw new Error("no PRNG");
      };
      var _0 = new Uint8Array(16);
      var _9 = new Uint8Array(32);
      _9[0] = 9;
      var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]), D2 = gf([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]), X = gf([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]), Y = gf([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]), I2 = gf([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);
      function ts64(x2, i2, h2, l) {
        x2[i2] = h2 >> 24 & 255;
        x2[i2 + 1] = h2 >> 16 & 255;
        x2[i2 + 2] = h2 >> 8 & 255;
        x2[i2 + 3] = h2 & 255;
        x2[i2 + 4] = l >> 24 & 255;
        x2[i2 + 5] = l >> 16 & 255;
        x2[i2 + 6] = l >> 8 & 255;
        x2[i2 + 7] = l & 255;
      }
      function vn(x2, xi, y, yi, n) {
        var i2, d = 0;
        for (i2 = 0; i2 < n; i2++) d |= x2[xi + i2] ^ y[yi + i2];
        return (1 & d - 1 >>> 8) - 1;
      }
      function crypto_verify_16(x2, xi, y, yi) {
        return vn(x2, xi, y, yi, 16);
      }
      function crypto_verify_32(x2, xi, y, yi) {
        return vn(x2, xi, y, yi, 32);
      }
      function core_salsa20(o2, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u2;
        for (var i2 = 0; i2 < 20; i2 += 2) {
          u2 = x0 + x12 | 0;
          x4 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x4 + x0 | 0;
          x8 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x8 + x4 | 0;
          x12 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x12 + x8 | 0;
          x0 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x5 + x1 | 0;
          x9 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x9 + x5 | 0;
          x13 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x13 + x9 | 0;
          x1 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x1 + x13 | 0;
          x5 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x10 + x6 | 0;
          x14 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x14 + x10 | 0;
          x2 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x2 + x14 | 0;
          x6 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x6 + x2 | 0;
          x10 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x15 + x11 | 0;
          x3 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x3 + x15 | 0;
          x7 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x7 + x3 | 0;
          x11 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x11 + x7 | 0;
          x15 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x0 + x3 | 0;
          x1 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x1 + x0 | 0;
          x2 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x2 + x1 | 0;
          x3 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x3 + x2 | 0;
          x0 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x5 + x4 | 0;
          x6 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x6 + x5 | 0;
          x7 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x7 + x6 | 0;
          x4 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x4 + x7 | 0;
          x5 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x10 + x9 | 0;
          x11 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x11 + x10 | 0;
          x8 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x8 + x11 | 0;
          x9 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x9 + x8 | 0;
          x10 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x15 + x14 | 0;
          x12 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x12 + x15 | 0;
          x13 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x13 + x12 | 0;
          x14 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x14 + x13 | 0;
          x15 ^= u2 << 18 | u2 >>> 32 - 18;
        }
        x0 = x0 + j0 | 0;
        x1 = x1 + j1 | 0;
        x2 = x2 + j2 | 0;
        x3 = x3 + j3 | 0;
        x4 = x4 + j4 | 0;
        x5 = x5 + j5 | 0;
        x6 = x6 + j6 | 0;
        x7 = x7 + j7 | 0;
        x8 = x8 + j8 | 0;
        x9 = x9 + j9 | 0;
        x10 = x10 + j10 | 0;
        x11 = x11 + j11 | 0;
        x12 = x12 + j12 | 0;
        x13 = x13 + j13 | 0;
        x14 = x14 + j14 | 0;
        x15 = x15 + j15 | 0;
        o2[0] = x0 >>> 0 & 255;
        o2[1] = x0 >>> 8 & 255;
        o2[2] = x0 >>> 16 & 255;
        o2[3] = x0 >>> 24 & 255;
        o2[4] = x1 >>> 0 & 255;
        o2[5] = x1 >>> 8 & 255;
        o2[6] = x1 >>> 16 & 255;
        o2[7] = x1 >>> 24 & 255;
        o2[8] = x2 >>> 0 & 255;
        o2[9] = x2 >>> 8 & 255;
        o2[10] = x2 >>> 16 & 255;
        o2[11] = x2 >>> 24 & 255;
        o2[12] = x3 >>> 0 & 255;
        o2[13] = x3 >>> 8 & 255;
        o2[14] = x3 >>> 16 & 255;
        o2[15] = x3 >>> 24 & 255;
        o2[16] = x4 >>> 0 & 255;
        o2[17] = x4 >>> 8 & 255;
        o2[18] = x4 >>> 16 & 255;
        o2[19] = x4 >>> 24 & 255;
        o2[20] = x5 >>> 0 & 255;
        o2[21] = x5 >>> 8 & 255;
        o2[22] = x5 >>> 16 & 255;
        o2[23] = x5 >>> 24 & 255;
        o2[24] = x6 >>> 0 & 255;
        o2[25] = x6 >>> 8 & 255;
        o2[26] = x6 >>> 16 & 255;
        o2[27] = x6 >>> 24 & 255;
        o2[28] = x7 >>> 0 & 255;
        o2[29] = x7 >>> 8 & 255;
        o2[30] = x7 >>> 16 & 255;
        o2[31] = x7 >>> 24 & 255;
        o2[32] = x8 >>> 0 & 255;
        o2[33] = x8 >>> 8 & 255;
        o2[34] = x8 >>> 16 & 255;
        o2[35] = x8 >>> 24 & 255;
        o2[36] = x9 >>> 0 & 255;
        o2[37] = x9 >>> 8 & 255;
        o2[38] = x9 >>> 16 & 255;
        o2[39] = x9 >>> 24 & 255;
        o2[40] = x10 >>> 0 & 255;
        o2[41] = x10 >>> 8 & 255;
        o2[42] = x10 >>> 16 & 255;
        o2[43] = x10 >>> 24 & 255;
        o2[44] = x11 >>> 0 & 255;
        o2[45] = x11 >>> 8 & 255;
        o2[46] = x11 >>> 16 & 255;
        o2[47] = x11 >>> 24 & 255;
        o2[48] = x12 >>> 0 & 255;
        o2[49] = x12 >>> 8 & 255;
        o2[50] = x12 >>> 16 & 255;
        o2[51] = x12 >>> 24 & 255;
        o2[52] = x13 >>> 0 & 255;
        o2[53] = x13 >>> 8 & 255;
        o2[54] = x13 >>> 16 & 255;
        o2[55] = x13 >>> 24 & 255;
        o2[56] = x14 >>> 0 & 255;
        o2[57] = x14 >>> 8 & 255;
        o2[58] = x14 >>> 16 & 255;
        o2[59] = x14 >>> 24 & 255;
        o2[60] = x15 >>> 0 & 255;
        o2[61] = x15 >>> 8 & 255;
        o2[62] = x15 >>> 16 & 255;
        o2[63] = x15 >>> 24 & 255;
      }
      function core_hsalsa20(o2, p, k, c) {
        var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
        var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u2;
        for (var i2 = 0; i2 < 20; i2 += 2) {
          u2 = x0 + x12 | 0;
          x4 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x4 + x0 | 0;
          x8 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x8 + x4 | 0;
          x12 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x12 + x8 | 0;
          x0 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x5 + x1 | 0;
          x9 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x9 + x5 | 0;
          x13 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x13 + x9 | 0;
          x1 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x1 + x13 | 0;
          x5 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x10 + x6 | 0;
          x14 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x14 + x10 | 0;
          x2 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x2 + x14 | 0;
          x6 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x6 + x2 | 0;
          x10 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x15 + x11 | 0;
          x3 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x3 + x15 | 0;
          x7 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x7 + x3 | 0;
          x11 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x11 + x7 | 0;
          x15 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x0 + x3 | 0;
          x1 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x1 + x0 | 0;
          x2 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x2 + x1 | 0;
          x3 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x3 + x2 | 0;
          x0 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x5 + x4 | 0;
          x6 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x6 + x5 | 0;
          x7 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x7 + x6 | 0;
          x4 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x4 + x7 | 0;
          x5 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x10 + x9 | 0;
          x11 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x11 + x10 | 0;
          x8 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x8 + x11 | 0;
          x9 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x9 + x8 | 0;
          x10 ^= u2 << 18 | u2 >>> 32 - 18;
          u2 = x15 + x14 | 0;
          x12 ^= u2 << 7 | u2 >>> 32 - 7;
          u2 = x12 + x15 | 0;
          x13 ^= u2 << 9 | u2 >>> 32 - 9;
          u2 = x13 + x12 | 0;
          x14 ^= u2 << 13 | u2 >>> 32 - 13;
          u2 = x14 + x13 | 0;
          x15 ^= u2 << 18 | u2 >>> 32 - 18;
        }
        o2[0] = x0 >>> 0 & 255;
        o2[1] = x0 >>> 8 & 255;
        o2[2] = x0 >>> 16 & 255;
        o2[3] = x0 >>> 24 & 255;
        o2[4] = x5 >>> 0 & 255;
        o2[5] = x5 >>> 8 & 255;
        o2[6] = x5 >>> 16 & 255;
        o2[7] = x5 >>> 24 & 255;
        o2[8] = x10 >>> 0 & 255;
        o2[9] = x10 >>> 8 & 255;
        o2[10] = x10 >>> 16 & 255;
        o2[11] = x10 >>> 24 & 255;
        o2[12] = x15 >>> 0 & 255;
        o2[13] = x15 >>> 8 & 255;
        o2[14] = x15 >>> 16 & 255;
        o2[15] = x15 >>> 24 & 255;
        o2[16] = x6 >>> 0 & 255;
        o2[17] = x6 >>> 8 & 255;
        o2[18] = x6 >>> 16 & 255;
        o2[19] = x6 >>> 24 & 255;
        o2[20] = x7 >>> 0 & 255;
        o2[21] = x7 >>> 8 & 255;
        o2[22] = x7 >>> 16 & 255;
        o2[23] = x7 >>> 24 & 255;
        o2[24] = x8 >>> 0 & 255;
        o2[25] = x8 >>> 8 & 255;
        o2[26] = x8 >>> 16 & 255;
        o2[27] = x8 >>> 24 & 255;
        o2[28] = x9 >>> 0 & 255;
        o2[29] = x9 >>> 8 & 255;
        o2[30] = x9 >>> 16 & 255;
        o2[31] = x9 >>> 24 & 255;
      }
      function crypto_core_salsa20(out, inp, k, c) {
        core_salsa20(out, inp, k, c);
      }
      function crypto_core_hsalsa20(out, inp, k, c) {
        core_hsalsa20(out, inp, k, c);
      }
      var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
      function crypto_stream_salsa20_xor(c, cpos, m3, mpos, b, n, k) {
        var z2 = new Uint8Array(16), x2 = new Uint8Array(64);
        var u2, i2;
        for (i2 = 0; i2 < 16; i2++) z2[i2] = 0;
        for (i2 = 0; i2 < 8; i2++) z2[i2] = n[i2];
        while (b >= 64) {
          crypto_core_salsa20(x2, z2, k, sigma);
          for (i2 = 0; i2 < 64; i2++) c[cpos + i2] = m3[mpos + i2] ^ x2[i2];
          u2 = 1;
          for (i2 = 8; i2 < 16; i2++) {
            u2 = u2 + (z2[i2] & 255) | 0;
            z2[i2] = u2 & 255;
            u2 >>>= 8;
          }
          b -= 64;
          cpos += 64;
          mpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x2, z2, k, sigma);
          for (i2 = 0; i2 < b; i2++) c[cpos + i2] = m3[mpos + i2] ^ x2[i2];
        }
        return 0;
      }
      function crypto_stream_salsa20(c, cpos, b, n, k) {
        var z2 = new Uint8Array(16), x2 = new Uint8Array(64);
        var u2, i2;
        for (i2 = 0; i2 < 16; i2++) z2[i2] = 0;
        for (i2 = 0; i2 < 8; i2++) z2[i2] = n[i2];
        while (b >= 64) {
          crypto_core_salsa20(x2, z2, k, sigma);
          for (i2 = 0; i2 < 64; i2++) c[cpos + i2] = x2[i2];
          u2 = 1;
          for (i2 = 8; i2 < 16; i2++) {
            u2 = u2 + (z2[i2] & 255) | 0;
            z2[i2] = u2 & 255;
            u2 >>>= 8;
          }
          b -= 64;
          cpos += 64;
        }
        if (b > 0) {
          crypto_core_salsa20(x2, z2, k, sigma);
          for (i2 = 0; i2 < b; i2++) c[cpos + i2] = x2[i2];
        }
        return 0;
      }
      function crypto_stream(c, cpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i2 = 0; i2 < 8; i2++) sn[i2] = n[i2 + 16];
        return crypto_stream_salsa20(c, cpos, d, sn, s);
      }
      function crypto_stream_xor(c, cpos, m3, mpos, d, n, k) {
        var s = new Uint8Array(32);
        crypto_core_hsalsa20(s, n, k, sigma);
        var sn = new Uint8Array(8);
        for (var i2 = 0; i2 < 8; i2++) sn[i2] = n[i2 + 16];
        return crypto_stream_salsa20_xor(c, cpos, m3, mpos, d, sn, s);
      }
      var poly1305 = function(key) {
        this.buffer = new Uint8Array(16);
        this.r = new Uint16Array(10);
        this.h = new Uint16Array(10);
        this.pad = new Uint16Array(8);
        this.leftover = 0;
        this.fin = 0;
        var t0, t1, t2, t3, t4, t5, t6, t7;
        t0 = key[0] & 255 | (key[1] & 255) << 8;
        this.r[0] = t0 & 8191;
        t1 = key[2] & 255 | (key[3] & 255) << 8;
        this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
        t2 = key[4] & 255 | (key[5] & 255) << 8;
        this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
        t3 = key[6] & 255 | (key[7] & 255) << 8;
        this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
        t4 = key[8] & 255 | (key[9] & 255) << 8;
        this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
        this.r[5] = t4 >>> 1 & 8190;
        t5 = key[10] & 255 | (key[11] & 255) << 8;
        this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
        t6 = key[12] & 255 | (key[13] & 255) << 8;
        this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
        t7 = key[14] & 255 | (key[15] & 255) << 8;
        this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
        this.r[9] = t7 >>> 5 & 127;
        this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
        this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
        this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
        this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
        this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
        this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
        this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
        this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
      };
      poly1305.prototype.blocks = function(m3, mpos, bytes) {
        var hibit = this.fin ? 0 : 1 << 11;
        var t0, t1, t2, t3, t4, t5, t6, t7, c;
        var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
        var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
        var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
        while (bytes >= 16) {
          t0 = m3[mpos + 0] & 255 | (m3[mpos + 1] & 255) << 8;
          h0 += t0 & 8191;
          t1 = m3[mpos + 2] & 255 | (m3[mpos + 3] & 255) << 8;
          h1 += (t0 >>> 13 | t1 << 3) & 8191;
          t2 = m3[mpos + 4] & 255 | (m3[mpos + 5] & 255) << 8;
          h2 += (t1 >>> 10 | t2 << 6) & 8191;
          t3 = m3[mpos + 6] & 255 | (m3[mpos + 7] & 255) << 8;
          h3 += (t2 >>> 7 | t3 << 9) & 8191;
          t4 = m3[mpos + 8] & 255 | (m3[mpos + 9] & 255) << 8;
          h4 += (t3 >>> 4 | t4 << 12) & 8191;
          h5 += t4 >>> 1 & 8191;
          t5 = m3[mpos + 10] & 255 | (m3[mpos + 11] & 255) << 8;
          h6 += (t4 >>> 14 | t5 << 2) & 8191;
          t6 = m3[mpos + 12] & 255 | (m3[mpos + 13] & 255) << 8;
          h7 += (t5 >>> 11 | t6 << 5) & 8191;
          t7 = m3[mpos + 14] & 255 | (m3[mpos + 15] & 255) << 8;
          h8 += (t6 >>> 8 | t7 << 8) & 8191;
          h9 += t7 >>> 5 | hibit;
          c = 0;
          d0 = c;
          d0 += h0 * r0;
          d0 += h1 * (5 * r9);
          d0 += h2 * (5 * r8);
          d0 += h3 * (5 * r7);
          d0 += h4 * (5 * r6);
          c = d0 >>> 13;
          d0 &= 8191;
          d0 += h5 * (5 * r5);
          d0 += h6 * (5 * r4);
          d0 += h7 * (5 * r3);
          d0 += h8 * (5 * r2);
          d0 += h9 * (5 * r1);
          c += d0 >>> 13;
          d0 &= 8191;
          d1 = c;
          d1 += h0 * r1;
          d1 += h1 * r0;
          d1 += h2 * (5 * r9);
          d1 += h3 * (5 * r8);
          d1 += h4 * (5 * r7);
          c = d1 >>> 13;
          d1 &= 8191;
          d1 += h5 * (5 * r6);
          d1 += h6 * (5 * r5);
          d1 += h7 * (5 * r4);
          d1 += h8 * (5 * r3);
          d1 += h9 * (5 * r2);
          c += d1 >>> 13;
          d1 &= 8191;
          d2 = c;
          d2 += h0 * r2;
          d2 += h1 * r1;
          d2 += h2 * r0;
          d2 += h3 * (5 * r9);
          d2 += h4 * (5 * r8);
          c = d2 >>> 13;
          d2 &= 8191;
          d2 += h5 * (5 * r7);
          d2 += h6 * (5 * r6);
          d2 += h7 * (5 * r5);
          d2 += h8 * (5 * r4);
          d2 += h9 * (5 * r3);
          c += d2 >>> 13;
          d2 &= 8191;
          d3 = c;
          d3 += h0 * r3;
          d3 += h1 * r2;
          d3 += h2 * r1;
          d3 += h3 * r0;
          d3 += h4 * (5 * r9);
          c = d3 >>> 13;
          d3 &= 8191;
          d3 += h5 * (5 * r8);
          d3 += h6 * (5 * r7);
          d3 += h7 * (5 * r6);
          d3 += h8 * (5 * r5);
          d3 += h9 * (5 * r4);
          c += d3 >>> 13;
          d3 &= 8191;
          d4 = c;
          d4 += h0 * r4;
          d4 += h1 * r3;
          d4 += h2 * r2;
          d4 += h3 * r1;
          d4 += h4 * r0;
          c = d4 >>> 13;
          d4 &= 8191;
          d4 += h5 * (5 * r9);
          d4 += h6 * (5 * r8);
          d4 += h7 * (5 * r7);
          d4 += h8 * (5 * r6);
          d4 += h9 * (5 * r5);
          c += d4 >>> 13;
          d4 &= 8191;
          d5 = c;
          d5 += h0 * r5;
          d5 += h1 * r4;
          d5 += h2 * r3;
          d5 += h3 * r2;
          d5 += h4 * r1;
          c = d5 >>> 13;
          d5 &= 8191;
          d5 += h5 * r0;
          d5 += h6 * (5 * r9);
          d5 += h7 * (5 * r8);
          d5 += h8 * (5 * r7);
          d5 += h9 * (5 * r6);
          c += d5 >>> 13;
          d5 &= 8191;
          d6 = c;
          d6 += h0 * r6;
          d6 += h1 * r5;
          d6 += h2 * r4;
          d6 += h3 * r3;
          d6 += h4 * r2;
          c = d6 >>> 13;
          d6 &= 8191;
          d6 += h5 * r1;
          d6 += h6 * r0;
          d6 += h7 * (5 * r9);
          d6 += h8 * (5 * r8);
          d6 += h9 * (5 * r7);
          c += d6 >>> 13;
          d6 &= 8191;
          d7 = c;
          d7 += h0 * r7;
          d7 += h1 * r6;
          d7 += h2 * r5;
          d7 += h3 * r4;
          d7 += h4 * r3;
          c = d7 >>> 13;
          d7 &= 8191;
          d7 += h5 * r2;
          d7 += h6 * r1;
          d7 += h7 * r0;
          d7 += h8 * (5 * r9);
          d7 += h9 * (5 * r8);
          c += d7 >>> 13;
          d7 &= 8191;
          d8 = c;
          d8 += h0 * r8;
          d8 += h1 * r7;
          d8 += h2 * r6;
          d8 += h3 * r5;
          d8 += h4 * r4;
          c = d8 >>> 13;
          d8 &= 8191;
          d8 += h5 * r3;
          d8 += h6 * r2;
          d8 += h7 * r1;
          d8 += h8 * r0;
          d8 += h9 * (5 * r9);
          c += d8 >>> 13;
          d8 &= 8191;
          d9 = c;
          d9 += h0 * r9;
          d9 += h1 * r8;
          d9 += h2 * r7;
          d9 += h3 * r6;
          d9 += h4 * r5;
          c = d9 >>> 13;
          d9 &= 8191;
          d9 += h5 * r4;
          d9 += h6 * r3;
          d9 += h7 * r2;
          d9 += h8 * r1;
          d9 += h9 * r0;
          c += d9 >>> 13;
          d9 &= 8191;
          c = (c << 2) + c | 0;
          c = c + d0 | 0;
          d0 = c & 8191;
          c = c >>> 13;
          d1 += c;
          h0 = d0;
          h1 = d1;
          h2 = d2;
          h3 = d3;
          h4 = d4;
          h5 = d5;
          h6 = d6;
          h7 = d7;
          h8 = d8;
          h9 = d9;
          mpos += 16;
          bytes -= 16;
        }
        this.h[0] = h0;
        this.h[1] = h1;
        this.h[2] = h2;
        this.h[3] = h3;
        this.h[4] = h4;
        this.h[5] = h5;
        this.h[6] = h6;
        this.h[7] = h7;
        this.h[8] = h8;
        this.h[9] = h9;
      };
      poly1305.prototype.finish = function(mac, macpos) {
        var g2 = new Uint16Array(10);
        var c, mask, f, i2;
        if (this.leftover) {
          i2 = this.leftover;
          this.buffer[i2++] = 1;
          for (; i2 < 16; i2++) this.buffer[i2] = 0;
          this.fin = 1;
          this.blocks(this.buffer, 0, 16);
        }
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        for (i2 = 2; i2 < 10; i2++) {
          this.h[i2] += c;
          c = this.h[i2] >>> 13;
          this.h[i2] &= 8191;
        }
        this.h[0] += c * 5;
        c = this.h[0] >>> 13;
        this.h[0] &= 8191;
        this.h[1] += c;
        c = this.h[1] >>> 13;
        this.h[1] &= 8191;
        this.h[2] += c;
        g2[0] = this.h[0] + 5;
        c = g2[0] >>> 13;
        g2[0] &= 8191;
        for (i2 = 1; i2 < 10; i2++) {
          g2[i2] = this.h[i2] + c;
          c = g2[i2] >>> 13;
          g2[i2] &= 8191;
        }
        g2[9] -= 1 << 13;
        mask = (c ^ 1) - 1;
        for (i2 = 0; i2 < 10; i2++) g2[i2] &= mask;
        mask = ~mask;
        for (i2 = 0; i2 < 10; i2++) this.h[i2] = this.h[i2] & mask | g2[i2];
        this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
        this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
        this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
        this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
        this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
        this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
        this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
        this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
        f = this.h[0] + this.pad[0];
        this.h[0] = f & 65535;
        for (i2 = 1; i2 < 8; i2++) {
          f = (this.h[i2] + this.pad[i2] | 0) + (f >>> 16) | 0;
          this.h[i2] = f & 65535;
        }
        mac[macpos + 0] = this.h[0] >>> 0 & 255;
        mac[macpos + 1] = this.h[0] >>> 8 & 255;
        mac[macpos + 2] = this.h[1] >>> 0 & 255;
        mac[macpos + 3] = this.h[1] >>> 8 & 255;
        mac[macpos + 4] = this.h[2] >>> 0 & 255;
        mac[macpos + 5] = this.h[2] >>> 8 & 255;
        mac[macpos + 6] = this.h[3] >>> 0 & 255;
        mac[macpos + 7] = this.h[3] >>> 8 & 255;
        mac[macpos + 8] = this.h[4] >>> 0 & 255;
        mac[macpos + 9] = this.h[4] >>> 8 & 255;
        mac[macpos + 10] = this.h[5] >>> 0 & 255;
        mac[macpos + 11] = this.h[5] >>> 8 & 255;
        mac[macpos + 12] = this.h[6] >>> 0 & 255;
        mac[macpos + 13] = this.h[6] >>> 8 & 255;
        mac[macpos + 14] = this.h[7] >>> 0 & 255;
        mac[macpos + 15] = this.h[7] >>> 8 & 255;
      };
      poly1305.prototype.update = function(m3, mpos, bytes) {
        var i2, want;
        if (this.leftover) {
          want = 16 - this.leftover;
          if (want > bytes)
            want = bytes;
          for (i2 = 0; i2 < want; i2++)
            this.buffer[this.leftover + i2] = m3[mpos + i2];
          bytes -= want;
          mpos += want;
          this.leftover += want;
          if (this.leftover < 16)
            return;
          this.blocks(this.buffer, 0, 16);
          this.leftover = 0;
        }
        if (bytes >= 16) {
          want = bytes - bytes % 16;
          this.blocks(m3, mpos, want);
          mpos += want;
          bytes -= want;
        }
        if (bytes) {
          for (i2 = 0; i2 < bytes; i2++)
            this.buffer[this.leftover + i2] = m3[mpos + i2];
          this.leftover += bytes;
        }
      };
      function crypto_onetimeauth(out, outpos, m3, mpos, n, k) {
        var s = new poly1305(k);
        s.update(m3, mpos, n);
        s.finish(out, outpos);
        return 0;
      }
      function crypto_onetimeauth_verify(h2, hpos, m3, mpos, n, k) {
        var x2 = new Uint8Array(16);
        crypto_onetimeauth(x2, 0, m3, mpos, n, k);
        return crypto_verify_16(h2, hpos, x2, 0);
      }
      function crypto_secretbox(c, m3, d, n, k) {
        var i2;
        if (d < 32) return -1;
        crypto_stream_xor(c, 0, m3, 0, d, n, k);
        crypto_onetimeauth(c, 16, c, 32, d - 32, c);
        for (i2 = 0; i2 < 16; i2++) c[i2] = 0;
        return 0;
      }
      function crypto_secretbox_open(m3, c, d, n, k) {
        var i2;
        var x2 = new Uint8Array(32);
        if (d < 32) return -1;
        crypto_stream(x2, 0, 32, n, k);
        if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x2) !== 0) return -1;
        crypto_stream_xor(m3, 0, c, 0, d, n, k);
        for (i2 = 0; i2 < 32; i2++) m3[i2] = 0;
        return 0;
      }
      function set25519(r, a) {
        var i2;
        for (i2 = 0; i2 < 16; i2++) r[i2] = a[i2] | 0;
      }
      function car25519(o2) {
        var i2, v2, c = 1;
        for (i2 = 0; i2 < 16; i2++) {
          v2 = o2[i2] + c + 65535;
          c = Math.floor(v2 / 65536);
          o2[i2] = v2 - c * 65536;
        }
        o2[0] += c - 1 + 37 * (c - 1);
      }
      function sel25519(p, q, b) {
        var t, c = ~(b - 1);
        for (var i2 = 0; i2 < 16; i2++) {
          t = c & (p[i2] ^ q[i2]);
          p[i2] ^= t;
          q[i2] ^= t;
        }
      }
      function pack25519(o2, n) {
        var i2, j, b;
        var m3 = gf(), t = gf();
        for (i2 = 0; i2 < 16; i2++) t[i2] = n[i2];
        car25519(t);
        car25519(t);
        car25519(t);
        for (j = 0; j < 2; j++) {
          m3[0] = t[0] - 65517;
          for (i2 = 1; i2 < 15; i2++) {
            m3[i2] = t[i2] - 65535 - (m3[i2 - 1] >> 16 & 1);
            m3[i2 - 1] &= 65535;
          }
          m3[15] = t[15] - 32767 - (m3[14] >> 16 & 1);
          b = m3[15] >> 16 & 1;
          m3[14] &= 65535;
          sel25519(t, m3, 1 - b);
        }
        for (i2 = 0; i2 < 16; i2++) {
          o2[2 * i2] = t[i2] & 255;
          o2[2 * i2 + 1] = t[i2] >> 8;
        }
      }
      function neq25519(a, b) {
        var c = new Uint8Array(32), d = new Uint8Array(32);
        pack25519(c, a);
        pack25519(d, b);
        return crypto_verify_32(c, 0, d, 0);
      }
      function par25519(a) {
        var d = new Uint8Array(32);
        pack25519(d, a);
        return d[0] & 1;
      }
      function unpack25519(o2, n) {
        var i2;
        for (i2 = 0; i2 < 16; i2++) o2[i2] = n[2 * i2] + (n[2 * i2 + 1] << 8);
        o2[15] &= 32767;
      }
      function A2(o2, a, b) {
        for (var i2 = 0; i2 < 16; i2++) o2[i2] = a[i2] + b[i2];
      }
      function Z(o2, a, b) {
        for (var i2 = 0; i2 < 16; i2++) o2[i2] = a[i2] - b[i2];
      }
      function M2(o2, a, b) {
        var v2, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
        v2 = a[0];
        t0 += v2 * b0;
        t1 += v2 * b1;
        t2 += v2 * b2;
        t3 += v2 * b3;
        t4 += v2 * b4;
        t5 += v2 * b5;
        t6 += v2 * b6;
        t7 += v2 * b7;
        t8 += v2 * b8;
        t9 += v2 * b9;
        t10 += v2 * b10;
        t11 += v2 * b11;
        t12 += v2 * b12;
        t13 += v2 * b13;
        t14 += v2 * b14;
        t15 += v2 * b15;
        v2 = a[1];
        t1 += v2 * b0;
        t2 += v2 * b1;
        t3 += v2 * b2;
        t4 += v2 * b3;
        t5 += v2 * b4;
        t6 += v2 * b5;
        t7 += v2 * b6;
        t8 += v2 * b7;
        t9 += v2 * b8;
        t10 += v2 * b9;
        t11 += v2 * b10;
        t12 += v2 * b11;
        t13 += v2 * b12;
        t14 += v2 * b13;
        t15 += v2 * b14;
        t16 += v2 * b15;
        v2 = a[2];
        t2 += v2 * b0;
        t3 += v2 * b1;
        t4 += v2 * b2;
        t5 += v2 * b3;
        t6 += v2 * b4;
        t7 += v2 * b5;
        t8 += v2 * b6;
        t9 += v2 * b7;
        t10 += v2 * b8;
        t11 += v2 * b9;
        t12 += v2 * b10;
        t13 += v2 * b11;
        t14 += v2 * b12;
        t15 += v2 * b13;
        t16 += v2 * b14;
        t17 += v2 * b15;
        v2 = a[3];
        t3 += v2 * b0;
        t4 += v2 * b1;
        t5 += v2 * b2;
        t6 += v2 * b3;
        t7 += v2 * b4;
        t8 += v2 * b5;
        t9 += v2 * b6;
        t10 += v2 * b7;
        t11 += v2 * b8;
        t12 += v2 * b9;
        t13 += v2 * b10;
        t14 += v2 * b11;
        t15 += v2 * b12;
        t16 += v2 * b13;
        t17 += v2 * b14;
        t18 += v2 * b15;
        v2 = a[4];
        t4 += v2 * b0;
        t5 += v2 * b1;
        t6 += v2 * b2;
        t7 += v2 * b3;
        t8 += v2 * b4;
        t9 += v2 * b5;
        t10 += v2 * b6;
        t11 += v2 * b7;
        t12 += v2 * b8;
        t13 += v2 * b9;
        t14 += v2 * b10;
        t15 += v2 * b11;
        t16 += v2 * b12;
        t17 += v2 * b13;
        t18 += v2 * b14;
        t19 += v2 * b15;
        v2 = a[5];
        t5 += v2 * b0;
        t6 += v2 * b1;
        t7 += v2 * b2;
        t8 += v2 * b3;
        t9 += v2 * b4;
        t10 += v2 * b5;
        t11 += v2 * b6;
        t12 += v2 * b7;
        t13 += v2 * b8;
        t14 += v2 * b9;
        t15 += v2 * b10;
        t16 += v2 * b11;
        t17 += v2 * b12;
        t18 += v2 * b13;
        t19 += v2 * b14;
        t20 += v2 * b15;
        v2 = a[6];
        t6 += v2 * b0;
        t7 += v2 * b1;
        t8 += v2 * b2;
        t9 += v2 * b3;
        t10 += v2 * b4;
        t11 += v2 * b5;
        t12 += v2 * b6;
        t13 += v2 * b7;
        t14 += v2 * b8;
        t15 += v2 * b9;
        t16 += v2 * b10;
        t17 += v2 * b11;
        t18 += v2 * b12;
        t19 += v2 * b13;
        t20 += v2 * b14;
        t21 += v2 * b15;
        v2 = a[7];
        t7 += v2 * b0;
        t8 += v2 * b1;
        t9 += v2 * b2;
        t10 += v2 * b3;
        t11 += v2 * b4;
        t12 += v2 * b5;
        t13 += v2 * b6;
        t14 += v2 * b7;
        t15 += v2 * b8;
        t16 += v2 * b9;
        t17 += v2 * b10;
        t18 += v2 * b11;
        t19 += v2 * b12;
        t20 += v2 * b13;
        t21 += v2 * b14;
        t22 += v2 * b15;
        v2 = a[8];
        t8 += v2 * b0;
        t9 += v2 * b1;
        t10 += v2 * b2;
        t11 += v2 * b3;
        t12 += v2 * b4;
        t13 += v2 * b5;
        t14 += v2 * b6;
        t15 += v2 * b7;
        t16 += v2 * b8;
        t17 += v2 * b9;
        t18 += v2 * b10;
        t19 += v2 * b11;
        t20 += v2 * b12;
        t21 += v2 * b13;
        t22 += v2 * b14;
        t23 += v2 * b15;
        v2 = a[9];
        t9 += v2 * b0;
        t10 += v2 * b1;
        t11 += v2 * b2;
        t12 += v2 * b3;
        t13 += v2 * b4;
        t14 += v2 * b5;
        t15 += v2 * b6;
        t16 += v2 * b7;
        t17 += v2 * b8;
        t18 += v2 * b9;
        t19 += v2 * b10;
        t20 += v2 * b11;
        t21 += v2 * b12;
        t22 += v2 * b13;
        t23 += v2 * b14;
        t24 += v2 * b15;
        v2 = a[10];
        t10 += v2 * b0;
        t11 += v2 * b1;
        t12 += v2 * b2;
        t13 += v2 * b3;
        t14 += v2 * b4;
        t15 += v2 * b5;
        t16 += v2 * b6;
        t17 += v2 * b7;
        t18 += v2 * b8;
        t19 += v2 * b9;
        t20 += v2 * b10;
        t21 += v2 * b11;
        t22 += v2 * b12;
        t23 += v2 * b13;
        t24 += v2 * b14;
        t25 += v2 * b15;
        v2 = a[11];
        t11 += v2 * b0;
        t12 += v2 * b1;
        t13 += v2 * b2;
        t14 += v2 * b3;
        t15 += v2 * b4;
        t16 += v2 * b5;
        t17 += v2 * b6;
        t18 += v2 * b7;
        t19 += v2 * b8;
        t20 += v2 * b9;
        t21 += v2 * b10;
        t22 += v2 * b11;
        t23 += v2 * b12;
        t24 += v2 * b13;
        t25 += v2 * b14;
        t26 += v2 * b15;
        v2 = a[12];
        t12 += v2 * b0;
        t13 += v2 * b1;
        t14 += v2 * b2;
        t15 += v2 * b3;
        t16 += v2 * b4;
        t17 += v2 * b5;
        t18 += v2 * b6;
        t19 += v2 * b7;
        t20 += v2 * b8;
        t21 += v2 * b9;
        t22 += v2 * b10;
        t23 += v2 * b11;
        t24 += v2 * b12;
        t25 += v2 * b13;
        t26 += v2 * b14;
        t27 += v2 * b15;
        v2 = a[13];
        t13 += v2 * b0;
        t14 += v2 * b1;
        t15 += v2 * b2;
        t16 += v2 * b3;
        t17 += v2 * b4;
        t18 += v2 * b5;
        t19 += v2 * b6;
        t20 += v2 * b7;
        t21 += v2 * b8;
        t22 += v2 * b9;
        t23 += v2 * b10;
        t24 += v2 * b11;
        t25 += v2 * b12;
        t26 += v2 * b13;
        t27 += v2 * b14;
        t28 += v2 * b15;
        v2 = a[14];
        t14 += v2 * b0;
        t15 += v2 * b1;
        t16 += v2 * b2;
        t17 += v2 * b3;
        t18 += v2 * b4;
        t19 += v2 * b5;
        t20 += v2 * b6;
        t21 += v2 * b7;
        t22 += v2 * b8;
        t23 += v2 * b9;
        t24 += v2 * b10;
        t25 += v2 * b11;
        t26 += v2 * b12;
        t27 += v2 * b13;
        t28 += v2 * b14;
        t29 += v2 * b15;
        v2 = a[15];
        t15 += v2 * b0;
        t16 += v2 * b1;
        t17 += v2 * b2;
        t18 += v2 * b3;
        t19 += v2 * b4;
        t20 += v2 * b5;
        t21 += v2 * b6;
        t22 += v2 * b7;
        t23 += v2 * b8;
        t24 += v2 * b9;
        t25 += v2 * b10;
        t26 += v2 * b11;
        t27 += v2 * b12;
        t28 += v2 * b13;
        t29 += v2 * b14;
        t30 += v2 * b15;
        t0 += 38 * t16;
        t1 += 38 * t17;
        t2 += 38 * t18;
        t3 += 38 * t19;
        t4 += 38 * t20;
        t5 += 38 * t21;
        t6 += 38 * t22;
        t7 += 38 * t23;
        t8 += 38 * t24;
        t9 += 38 * t25;
        t10 += 38 * t26;
        t11 += 38 * t27;
        t12 += 38 * t28;
        t13 += 38 * t29;
        t14 += 38 * t30;
        c = 1;
        v2 = t0 + c + 65535;
        c = Math.floor(v2 / 65536);
        t0 = v2 - c * 65536;
        v2 = t1 + c + 65535;
        c = Math.floor(v2 / 65536);
        t1 = v2 - c * 65536;
        v2 = t2 + c + 65535;
        c = Math.floor(v2 / 65536);
        t2 = v2 - c * 65536;
        v2 = t3 + c + 65535;
        c = Math.floor(v2 / 65536);
        t3 = v2 - c * 65536;
        v2 = t4 + c + 65535;
        c = Math.floor(v2 / 65536);
        t4 = v2 - c * 65536;
        v2 = t5 + c + 65535;
        c = Math.floor(v2 / 65536);
        t5 = v2 - c * 65536;
        v2 = t6 + c + 65535;
        c = Math.floor(v2 / 65536);
        t6 = v2 - c * 65536;
        v2 = t7 + c + 65535;
        c = Math.floor(v2 / 65536);
        t7 = v2 - c * 65536;
        v2 = t8 + c + 65535;
        c = Math.floor(v2 / 65536);
        t8 = v2 - c * 65536;
        v2 = t9 + c + 65535;
        c = Math.floor(v2 / 65536);
        t9 = v2 - c * 65536;
        v2 = t10 + c + 65535;
        c = Math.floor(v2 / 65536);
        t10 = v2 - c * 65536;
        v2 = t11 + c + 65535;
        c = Math.floor(v2 / 65536);
        t11 = v2 - c * 65536;
        v2 = t12 + c + 65535;
        c = Math.floor(v2 / 65536);
        t12 = v2 - c * 65536;
        v2 = t13 + c + 65535;
        c = Math.floor(v2 / 65536);
        t13 = v2 - c * 65536;
        v2 = t14 + c + 65535;
        c = Math.floor(v2 / 65536);
        t14 = v2 - c * 65536;
        v2 = t15 + c + 65535;
        c = Math.floor(v2 / 65536);
        t15 = v2 - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        c = 1;
        v2 = t0 + c + 65535;
        c = Math.floor(v2 / 65536);
        t0 = v2 - c * 65536;
        v2 = t1 + c + 65535;
        c = Math.floor(v2 / 65536);
        t1 = v2 - c * 65536;
        v2 = t2 + c + 65535;
        c = Math.floor(v2 / 65536);
        t2 = v2 - c * 65536;
        v2 = t3 + c + 65535;
        c = Math.floor(v2 / 65536);
        t3 = v2 - c * 65536;
        v2 = t4 + c + 65535;
        c = Math.floor(v2 / 65536);
        t4 = v2 - c * 65536;
        v2 = t5 + c + 65535;
        c = Math.floor(v2 / 65536);
        t5 = v2 - c * 65536;
        v2 = t6 + c + 65535;
        c = Math.floor(v2 / 65536);
        t6 = v2 - c * 65536;
        v2 = t7 + c + 65535;
        c = Math.floor(v2 / 65536);
        t7 = v2 - c * 65536;
        v2 = t8 + c + 65535;
        c = Math.floor(v2 / 65536);
        t8 = v2 - c * 65536;
        v2 = t9 + c + 65535;
        c = Math.floor(v2 / 65536);
        t9 = v2 - c * 65536;
        v2 = t10 + c + 65535;
        c = Math.floor(v2 / 65536);
        t10 = v2 - c * 65536;
        v2 = t11 + c + 65535;
        c = Math.floor(v2 / 65536);
        t11 = v2 - c * 65536;
        v2 = t12 + c + 65535;
        c = Math.floor(v2 / 65536);
        t12 = v2 - c * 65536;
        v2 = t13 + c + 65535;
        c = Math.floor(v2 / 65536);
        t13 = v2 - c * 65536;
        v2 = t14 + c + 65535;
        c = Math.floor(v2 / 65536);
        t14 = v2 - c * 65536;
        v2 = t15 + c + 65535;
        c = Math.floor(v2 / 65536);
        t15 = v2 - c * 65536;
        t0 += c - 1 + 37 * (c - 1);
        o2[0] = t0;
        o2[1] = t1;
        o2[2] = t2;
        o2[3] = t3;
        o2[4] = t4;
        o2[5] = t5;
        o2[6] = t6;
        o2[7] = t7;
        o2[8] = t8;
        o2[9] = t9;
        o2[10] = t10;
        o2[11] = t11;
        o2[12] = t12;
        o2[13] = t13;
        o2[14] = t14;
        o2[15] = t15;
      }
      function S2(o2, a) {
        M2(o2, a, a);
      }
      function inv25519(o2, i2) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++) c[a] = i2[a];
        for (a = 253; a >= 0; a--) {
          S2(c, c);
          if (a !== 2 && a !== 4) M2(c, c, i2);
        }
        for (a = 0; a < 16; a++) o2[a] = c[a];
      }
      function pow2523(o2, i2) {
        var c = gf();
        var a;
        for (a = 0; a < 16; a++) c[a] = i2[a];
        for (a = 250; a >= 0; a--) {
          S2(c, c);
          if (a !== 1) M2(c, c, i2);
        }
        for (a = 0; a < 16; a++) o2[a] = c[a];
      }
      function crypto_scalarmult(q, n, p) {
        var z2 = new Uint8Array(32);
        var x2 = new Float64Array(80), r, i2;
        var a = gf(), b = gf(), c = gf(), d = gf(), e2 = gf(), f = gf();
        for (i2 = 0; i2 < 31; i2++) z2[i2] = n[i2];
        z2[31] = n[31] & 127 | 64;
        z2[0] &= 248;
        unpack25519(x2, p);
        for (i2 = 0; i2 < 16; i2++) {
          b[i2] = x2[i2];
          d[i2] = a[i2] = c[i2] = 0;
        }
        a[0] = d[0] = 1;
        for (i2 = 254; i2 >= 0; --i2) {
          r = z2[i2 >>> 3] >>> (i2 & 7) & 1;
          sel25519(a, b, r);
          sel25519(c, d, r);
          A2(e2, a, c);
          Z(a, a, c);
          A2(c, b, d);
          Z(b, b, d);
          S2(d, e2);
          S2(f, a);
          M2(a, c, a);
          M2(c, b, e2);
          A2(e2, a, c);
          Z(a, a, c);
          S2(b, a);
          Z(c, d, f);
          M2(a, c, _121665);
          A2(a, a, d);
          M2(c, c, a);
          M2(a, d, f);
          M2(d, b, x2);
          S2(b, e2);
          sel25519(a, b, r);
          sel25519(c, d, r);
        }
        for (i2 = 0; i2 < 16; i2++) {
          x2[i2 + 16] = a[i2];
          x2[i2 + 32] = c[i2];
          x2[i2 + 48] = b[i2];
          x2[i2 + 64] = d[i2];
        }
        var x32 = x2.subarray(32);
        var x16 = x2.subarray(16);
        inv25519(x32, x32);
        M2(x16, x16, x32);
        pack25519(q, x16);
        return 0;
      }
      function crypto_scalarmult_base(q, n) {
        return crypto_scalarmult(q, n, _9);
      }
      function crypto_box_keypair(y, x2) {
        randombytes(x2, 32);
        return crypto_scalarmult_base(y, x2);
      }
      function crypto_box_beforenm(k, y, x2) {
        var s = new Uint8Array(32);
        crypto_scalarmult(s, x2, y);
        return crypto_core_hsalsa20(k, _0, s, sigma);
      }
      var crypto_box_afternm = crypto_secretbox;
      var crypto_box_open_afternm = crypto_secretbox_open;
      function crypto_box(c, m3, d, n, y, x2) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x2);
        return crypto_box_afternm(c, m3, d, n, k);
      }
      function crypto_box_open(m3, c, d, n, y, x2) {
        var k = new Uint8Array(32);
        crypto_box_beforenm(k, y, x2);
        return crypto_box_open_afternm(m3, c, d, n, k);
      }
      var K2 = [
        1116352408,
        3609767458,
        1899447441,
        602891725,
        3049323471,
        3964484399,
        3921009573,
        2173295548,
        961987163,
        4081628472,
        1508970993,
        3053834265,
        2453635748,
        2937671579,
        2870763221,
        3664609560,
        3624381080,
        2734883394,
        310598401,
        1164996542,
        607225278,
        1323610764,
        1426881987,
        3590304994,
        1925078388,
        4068182383,
        2162078206,
        991336113,
        2614888103,
        633803317,
        3248222580,
        3479774868,
        3835390401,
        2666613458,
        4022224774,
        944711139,
        264347078,
        2341262773,
        604807628,
        2007800933,
        770255983,
        1495990901,
        1249150122,
        1856431235,
        1555081692,
        3175218132,
        1996064986,
        2198950837,
        2554220882,
        3999719339,
        2821834349,
        766784016,
        2952996808,
        2566594879,
        3210313671,
        3203337956,
        3336571891,
        1034457026,
        3584528711,
        2466948901,
        113926993,
        3758326383,
        338241895,
        168717936,
        666307205,
        1188179964,
        773529912,
        1546045734,
        1294757372,
        1522805485,
        1396182291,
        2643833823,
        1695183700,
        2343527390,
        1986661051,
        1014477480,
        2177026350,
        1206759142,
        2456956037,
        344077627,
        2730485921,
        1290863460,
        2820302411,
        3158454273,
        3259730800,
        3505952657,
        3345764771,
        106217008,
        3516065817,
        3606008344,
        3600352804,
        1432725776,
        4094571909,
        1467031594,
        275423344,
        851169720,
        430227734,
        3100823752,
        506948616,
        1363258195,
        659060556,
        3750685593,
        883997877,
        3785050280,
        958139571,
        3318307427,
        1322822218,
        3812723403,
        1537002063,
        2003034995,
        1747873779,
        3602036899,
        1955562222,
        1575990012,
        2024104815,
        1125592928,
        2227730452,
        2716904306,
        2361852424,
        442776044,
        2428436474,
        593698344,
        2756734187,
        3733110249,
        3204031479,
        2999351573,
        3329325298,
        3815920427,
        3391569614,
        3928383900,
        3515267271,
        566280711,
        3940187606,
        3454069534,
        4118630271,
        4000239992,
        116418474,
        1914138554,
        174292421,
        2731055270,
        289380356,
        3203993006,
        460393269,
        320620315,
        685471733,
        587496836,
        852142971,
        1086792851,
        1017036298,
        365543100,
        1126000580,
        2618297676,
        1288033470,
        3409855158,
        1501505948,
        4234509866,
        1607167915,
        987167468,
        1816402316,
        1246189591
      ];
      function crypto_hashblocks_hl(hh, hl, m3, n) {
        var wh = new Int32Array(16), wl = new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i2, j, h2, l, a, b, c, d;
        var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
        var pos = 0;
        while (n >= 128) {
          for (i2 = 0; i2 < 16; i2++) {
            j = 8 * i2 + pos;
            wh[i2] = m3[j + 0] << 24 | m3[j + 1] << 16 | m3[j + 2] << 8 | m3[j + 3];
            wl[i2] = m3[j + 4] << 24 | m3[j + 5] << 16 | m3[j + 6] << 8 | m3[j + 7];
          }
          for (i2 = 0; i2 < 80; i2++) {
            bh0 = ah0;
            bh1 = ah1;
            bh2 = ah2;
            bh3 = ah3;
            bh4 = ah4;
            bh5 = ah5;
            bh6 = ah6;
            bh7 = ah7;
            bl0 = al0;
            bl1 = al1;
            bl2 = al2;
            bl3 = al3;
            bl4 = al4;
            bl5 = al5;
            bl6 = al6;
            bl7 = al7;
            h2 = ah7;
            l = al7;
            a = l & 65535;
            b = l >>> 16;
            c = h2 & 65535;
            d = h2 >>> 16;
            h2 = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
            l = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h2 & 65535;
            d += h2 >>> 16;
            h2 = ah4 & ah5 ^ ~ah4 & ah6;
            l = al4 & al5 ^ ~al4 & al6;
            a += l & 65535;
            b += l >>> 16;
            c += h2 & 65535;
            d += h2 >>> 16;
            h2 = K2[i2 * 2];
            l = K2[i2 * 2 + 1];
            a += l & 65535;
            b += l >>> 16;
            c += h2 & 65535;
            d += h2 >>> 16;
            h2 = wh[i2 % 16];
            l = wl[i2 % 16];
            a += l & 65535;
            b += l >>> 16;
            c += h2 & 65535;
            d += h2 >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            th = c & 65535 | d << 16;
            tl = a & 65535 | b << 16;
            h2 = th;
            l = tl;
            a = l & 65535;
            b = l >>> 16;
            c = h2 & 65535;
            d = h2 >>> 16;
            h2 = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
            l = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
            a += l & 65535;
            b += l >>> 16;
            c += h2 & 65535;
            d += h2 >>> 16;
            h2 = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
            l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
            a += l & 65535;
            b += l >>> 16;
            c += h2 & 65535;
            d += h2 >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh7 = c & 65535 | d << 16;
            bl7 = a & 65535 | b << 16;
            h2 = bh3;
            l = bl3;
            a = l & 65535;
            b = l >>> 16;
            c = h2 & 65535;
            d = h2 >>> 16;
            h2 = th;
            l = tl;
            a += l & 65535;
            b += l >>> 16;
            c += h2 & 65535;
            d += h2 >>> 16;
            b += a >>> 16;
            c += b >>> 16;
            d += c >>> 16;
            bh3 = c & 65535 | d << 16;
            bl3 = a & 65535 | b << 16;
            ah1 = bh0;
            ah2 = bh1;
            ah3 = bh2;
            ah4 = bh3;
            ah5 = bh4;
            ah6 = bh5;
            ah7 = bh6;
            ah0 = bh7;
            al1 = bl0;
            al2 = bl1;
            al3 = bl2;
            al4 = bl3;
            al5 = bl4;
            al6 = bl5;
            al7 = bl6;
            al0 = bl7;
            if (i2 % 16 === 15) {
              for (j = 0; j < 16; j++) {
                h2 = wh[j];
                l = wl[j];
                a = l & 65535;
                b = l >>> 16;
                c = h2 & 65535;
                d = h2 >>> 16;
                h2 = wh[(j + 9) % 16];
                l = wl[(j + 9) % 16];
                a += l & 65535;
                b += l >>> 16;
                c += h2 & 65535;
                d += h2 >>> 16;
                th = wh[(j + 1) % 16];
                tl = wl[(j + 1) % 16];
                h2 = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
                l = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
                a += l & 65535;
                b += l >>> 16;
                c += h2 & 65535;
                d += h2 >>> 16;
                th = wh[(j + 14) % 16];
                tl = wl[(j + 14) % 16];
                h2 = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
                l = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
                a += l & 65535;
                b += l >>> 16;
                c += h2 & 65535;
                d += h2 >>> 16;
                b += a >>> 16;
                c += b >>> 16;
                d += c >>> 16;
                wh[j] = c & 65535 | d << 16;
                wl[j] = a & 65535 | b << 16;
              }
            }
          }
          h2 = ah0;
          l = al0;
          a = l & 65535;
          b = l >>> 16;
          c = h2 & 65535;
          d = h2 >>> 16;
          h2 = hh[0];
          l = hl[0];
          a += l & 65535;
          b += l >>> 16;
          c += h2 & 65535;
          d += h2 >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[0] = ah0 = c & 65535 | d << 16;
          hl[0] = al0 = a & 65535 | b << 16;
          h2 = ah1;
          l = al1;
          a = l & 65535;
          b = l >>> 16;
          c = h2 & 65535;
          d = h2 >>> 16;
          h2 = hh[1];
          l = hl[1];
          a += l & 65535;
          b += l >>> 16;
          c += h2 & 65535;
          d += h2 >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[1] = ah1 = c & 65535 | d << 16;
          hl[1] = al1 = a & 65535 | b << 16;
          h2 = ah2;
          l = al2;
          a = l & 65535;
          b = l >>> 16;
          c = h2 & 65535;
          d = h2 >>> 16;
          h2 = hh[2];
          l = hl[2];
          a += l & 65535;
          b += l >>> 16;
          c += h2 & 65535;
          d += h2 >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[2] = ah2 = c & 65535 | d << 16;
          hl[2] = al2 = a & 65535 | b << 16;
          h2 = ah3;
          l = al3;
          a = l & 65535;
          b = l >>> 16;
          c = h2 & 65535;
          d = h2 >>> 16;
          h2 = hh[3];
          l = hl[3];
          a += l & 65535;
          b += l >>> 16;
          c += h2 & 65535;
          d += h2 >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[3] = ah3 = c & 65535 | d << 16;
          hl[3] = al3 = a & 65535 | b << 16;
          h2 = ah4;
          l = al4;
          a = l & 65535;
          b = l >>> 16;
          c = h2 & 65535;
          d = h2 >>> 16;
          h2 = hh[4];
          l = hl[4];
          a += l & 65535;
          b += l >>> 16;
          c += h2 & 65535;
          d += h2 >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[4] = ah4 = c & 65535 | d << 16;
          hl[4] = al4 = a & 65535 | b << 16;
          h2 = ah5;
          l = al5;
          a = l & 65535;
          b = l >>> 16;
          c = h2 & 65535;
          d = h2 >>> 16;
          h2 = hh[5];
          l = hl[5];
          a += l & 65535;
          b += l >>> 16;
          c += h2 & 65535;
          d += h2 >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[5] = ah5 = c & 65535 | d << 16;
          hl[5] = al5 = a & 65535 | b << 16;
          h2 = ah6;
          l = al6;
          a = l & 65535;
          b = l >>> 16;
          c = h2 & 65535;
          d = h2 >>> 16;
          h2 = hh[6];
          l = hl[6];
          a += l & 65535;
          b += l >>> 16;
          c += h2 & 65535;
          d += h2 >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[6] = ah6 = c & 65535 | d << 16;
          hl[6] = al6 = a & 65535 | b << 16;
          h2 = ah7;
          l = al7;
          a = l & 65535;
          b = l >>> 16;
          c = h2 & 65535;
          d = h2 >>> 16;
          h2 = hh[7];
          l = hl[7];
          a += l & 65535;
          b += l >>> 16;
          c += h2 & 65535;
          d += h2 >>> 16;
          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;
          hh[7] = ah7 = c & 65535 | d << 16;
          hl[7] = al7 = a & 65535 | b << 16;
          pos += 128;
          n -= 128;
        }
        return n;
      }
      function crypto_hash(out, m3, n) {
        var hh = new Int32Array(8), hl = new Int32Array(8), x2 = new Uint8Array(256), i2, b = n;
        hh[0] = 1779033703;
        hh[1] = 3144134277;
        hh[2] = 1013904242;
        hh[3] = 2773480762;
        hh[4] = 1359893119;
        hh[5] = 2600822924;
        hh[6] = 528734635;
        hh[7] = 1541459225;
        hl[0] = 4089235720;
        hl[1] = 2227873595;
        hl[2] = 4271175723;
        hl[3] = 1595750129;
        hl[4] = 2917565137;
        hl[5] = 725511199;
        hl[6] = 4215389547;
        hl[7] = 327033209;
        crypto_hashblocks_hl(hh, hl, m3, n);
        n %= 128;
        for (i2 = 0; i2 < n; i2++) x2[i2] = m3[b - n + i2];
        x2[n] = 128;
        n = 256 - 128 * (n < 112 ? 1 : 0);
        x2[n - 9] = 0;
        ts64(x2, n - 8, b / 536870912 | 0, b << 3);
        crypto_hashblocks_hl(hh, hl, x2, n);
        for (i2 = 0; i2 < 8; i2++) ts64(out, 8 * i2, hh[i2], hl[i2]);
        return 0;
      }
      function add(p, q) {
        var a = gf(), b = gf(), c = gf(), d = gf(), e2 = gf(), f = gf(), g2 = gf(), h2 = gf(), t = gf();
        Z(a, p[1], p[0]);
        Z(t, q[1], q[0]);
        M2(a, a, t);
        A2(b, p[0], p[1]);
        A2(t, q[0], q[1]);
        M2(b, b, t);
        M2(c, p[3], q[3]);
        M2(c, c, D2);
        M2(d, p[2], q[2]);
        A2(d, d, d);
        Z(e2, b, a);
        Z(f, d, c);
        A2(g2, d, c);
        A2(h2, b, a);
        M2(p[0], e2, f);
        M2(p[1], h2, g2);
        M2(p[2], g2, f);
        M2(p[3], e2, h2);
      }
      function cswap(p, q, b) {
        var i2;
        for (i2 = 0; i2 < 4; i2++) {
          sel25519(p[i2], q[i2], b);
        }
      }
      function pack(r, p) {
        var tx = gf(), ty = gf(), zi = gf();
        inv25519(zi, p[2]);
        M2(tx, p[0], zi);
        M2(ty, p[1], zi);
        pack25519(r, ty);
        r[31] ^= par25519(tx) << 7;
      }
      function scalarmult(p, q, s) {
        var b, i2;
        set25519(p[0], gf0);
        set25519(p[1], gf1);
        set25519(p[2], gf1);
        set25519(p[3], gf0);
        for (i2 = 255; i2 >= 0; --i2) {
          b = s[i2 / 8 | 0] >> (i2 & 7) & 1;
          cswap(p, q, b);
          add(q, p);
          add(p, p);
          cswap(p, q, b);
        }
      }
      function scalarbase(p, s) {
        var q = [gf(), gf(), gf(), gf()];
        set25519(q[0], X);
        set25519(q[1], Y);
        set25519(q[2], gf1);
        M2(q[3], X, Y);
        scalarmult(p, q, s);
      }
      function crypto_sign_keypair(pk, sk, seeded) {
        var d = new Uint8Array(64);
        var p = [gf(), gf(), gf(), gf()];
        var i2;
        if (!seeded) randombytes(sk, 32);
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        scalarbase(p, d);
        pack(pk, p);
        for (i2 = 0; i2 < 32; i2++) sk[i2 + 32] = pk[i2];
        return 0;
      }
      var L = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);
      function modL(r, x2) {
        var carry, i2, j, k;
        for (i2 = 63; i2 >= 32; --i2) {
          carry = 0;
          for (j = i2 - 32, k = i2 - 12; j < k; ++j) {
            x2[j] += carry - 16 * x2[i2] * L[j - (i2 - 32)];
            carry = Math.floor((x2[j] + 128) / 256);
            x2[j] -= carry * 256;
          }
          x2[j] += carry;
          x2[i2] = 0;
        }
        carry = 0;
        for (j = 0; j < 32; j++) {
          x2[j] += carry - (x2[31] >> 4) * L[j];
          carry = x2[j] >> 8;
          x2[j] &= 255;
        }
        for (j = 0; j < 32; j++) x2[j] -= carry * L[j];
        for (i2 = 0; i2 < 32; i2++) {
          x2[i2 + 1] += x2[i2] >> 8;
          r[i2] = x2[i2] & 255;
        }
      }
      function reduce(r) {
        var x2 = new Float64Array(64), i2;
        for (i2 = 0; i2 < 64; i2++) x2[i2] = r[i2];
        for (i2 = 0; i2 < 64; i2++) r[i2] = 0;
        modL(r, x2);
      }
      function crypto_sign(sm, m3, n, sk) {
        var d = new Uint8Array(64), h2 = new Uint8Array(64), r = new Uint8Array(64);
        var i2, j, x2 = new Float64Array(64);
        var p = [gf(), gf(), gf(), gf()];
        crypto_hash(d, sk, 32);
        d[0] &= 248;
        d[31] &= 127;
        d[31] |= 64;
        var smlen = n + 64;
        for (i2 = 0; i2 < n; i2++) sm[64 + i2] = m3[i2];
        for (i2 = 0; i2 < 32; i2++) sm[32 + i2] = d[32 + i2];
        crypto_hash(r, sm.subarray(32), n + 32);
        reduce(r);
        scalarbase(p, r);
        pack(sm, p);
        for (i2 = 32; i2 < 64; i2++) sm[i2] = sk[i2];
        crypto_hash(h2, sm, n + 64);
        reduce(h2);
        for (i2 = 0; i2 < 64; i2++) x2[i2] = 0;
        for (i2 = 0; i2 < 32; i2++) x2[i2] = r[i2];
        for (i2 = 0; i2 < 32; i2++) {
          for (j = 0; j < 32; j++) {
            x2[i2 + j] += h2[i2] * d[j];
          }
        }
        modL(sm.subarray(32), x2);
        return smlen;
      }
      function unpackneg(r, p) {
        var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
        set25519(r[2], gf1);
        unpack25519(r[1], p);
        S2(num, r[1]);
        M2(den, num, D);
        Z(num, num, r[2]);
        A2(den, r[2], den);
        S2(den2, den);
        S2(den4, den2);
        M2(den6, den4, den2);
        M2(t, den6, num);
        M2(t, t, den);
        pow2523(t, t);
        M2(t, t, num);
        M2(t, t, den);
        M2(t, t, den);
        M2(r[0], t, den);
        S2(chk, r[0]);
        M2(chk, chk, den);
        if (neq25519(chk, num)) M2(r[0], r[0], I2);
        S2(chk, r[0]);
        M2(chk, chk, den);
        if (neq25519(chk, num)) return -1;
        if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0]);
        M2(r[3], r[0], r[1]);
        return 0;
      }
      function crypto_sign_open(m3, sm, n, pk) {
        var i2;
        var t = new Uint8Array(32), h2 = new Uint8Array(64);
        var p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()];
        if (n < 64) return -1;
        if (unpackneg(q, pk)) return -1;
        for (i2 = 0; i2 < n; i2++) m3[i2] = sm[i2];
        for (i2 = 0; i2 < 32; i2++) m3[i2 + 32] = pk[i2];
        crypto_hash(h2, m3, n);
        reduce(h2);
        scalarmult(p, q, h2);
        scalarbase(q, sm.subarray(32));
        add(p, q);
        pack(t, p);
        n -= 64;
        if (crypto_verify_32(sm, 0, t, 0)) {
          for (i2 = 0; i2 < n; i2++) m3[i2] = 0;
          return -1;
        }
        for (i2 = 0; i2 < n; i2++) m3[i2] = sm[i2 + 64];
        return n;
      }
      var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
      nacl4.lowlevel = {
        crypto_core_hsalsa20,
        crypto_stream_xor,
        crypto_stream,
        crypto_stream_salsa20_xor,
        crypto_stream_salsa20,
        crypto_onetimeauth,
        crypto_onetimeauth_verify,
        crypto_verify_16,
        crypto_verify_32,
        crypto_secretbox,
        crypto_secretbox_open,
        crypto_scalarmult,
        crypto_scalarmult_base,
        crypto_box_beforenm,
        crypto_box_afternm,
        crypto_box,
        crypto_box_open,
        crypto_box_keypair,
        crypto_hash,
        crypto_sign,
        crypto_sign_keypair,
        crypto_sign_open,
        crypto_secretbox_KEYBYTES,
        crypto_secretbox_NONCEBYTES,
        crypto_secretbox_ZEROBYTES,
        crypto_secretbox_BOXZEROBYTES,
        crypto_scalarmult_BYTES,
        crypto_scalarmult_SCALARBYTES,
        crypto_box_PUBLICKEYBYTES,
        crypto_box_SECRETKEYBYTES,
        crypto_box_BEFORENMBYTES,
        crypto_box_NONCEBYTES,
        crypto_box_ZEROBYTES,
        crypto_box_BOXZEROBYTES,
        crypto_sign_BYTES,
        crypto_sign_PUBLICKEYBYTES,
        crypto_sign_SECRETKEYBYTES,
        crypto_sign_SEEDBYTES,
        crypto_hash_BYTES,
        gf,
        D,
        L,
        pack25519,
        unpack25519,
        M: M2,
        A: A2,
        S: S2,
        Z,
        pow2523,
        add,
        set25519,
        modL,
        scalarmult,
        scalarbase
      };
      function checkLengths(k, n) {
        if (k.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
        if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
      }
      function checkBoxLengths(pk, sk) {
        if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
        if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
      }
      function checkArrayTypes() {
        for (var i2 = 0; i2 < arguments.length; i2++) {
          if (!(arguments[i2] instanceof Uint8Array))
            throw new TypeError("unexpected type, use Uint8Array");
        }
      }
      function cleanup(arr) {
        for (var i2 = 0; i2 < arr.length; i2++) arr[i2] = 0;
      }
      nacl4.randomBytes = function(n) {
        var b = new Uint8Array(n);
        randombytes(b, n);
        return b;
      };
      nacl4.secretbox = function(msg, nonce, key) {
        checkArrayTypes(msg, nonce, key);
        checkLengths(key, nonce);
        var m3 = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
        var c = new Uint8Array(m3.length);
        for (var i2 = 0; i2 < msg.length; i2++) m3[i2 + crypto_secretbox_ZEROBYTES] = msg[i2];
        crypto_secretbox(c, m3, m3.length, nonce, key);
        return c.subarray(crypto_secretbox_BOXZEROBYTES);
      };
      nacl4.secretbox.open = function(box, nonce, key) {
        checkArrayTypes(box, nonce, key);
        checkLengths(key, nonce);
        var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
        var m3 = new Uint8Array(c.length);
        for (var i2 = 0; i2 < box.length; i2++) c[i2 + crypto_secretbox_BOXZEROBYTES] = box[i2];
        if (c.length < 32) return null;
        if (crypto_secretbox_open(m3, c, c.length, nonce, key) !== 0) return null;
        return m3.subarray(crypto_secretbox_ZEROBYTES);
      };
      nacl4.secretbox.keyLength = crypto_secretbox_KEYBYTES;
      nacl4.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
      nacl4.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
      nacl4.scalarMult = function(n, p) {
        checkArrayTypes(n, p);
        if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
        if (p.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult(q, n, p);
        return q;
      };
      nacl4.scalarMult.base = function(n) {
        checkArrayTypes(n);
        if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
        var q = new Uint8Array(crypto_scalarmult_BYTES);
        crypto_scalarmult_base(q, n);
        return q;
      };
      nacl4.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
      nacl4.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
      nacl4.box = function(msg, nonce, publicKey, secretKey) {
        var k = nacl4.box.before(publicKey, secretKey);
        return nacl4.secretbox(msg, nonce, k);
      };
      nacl4.box.before = function(publicKey, secretKey) {
        checkArrayTypes(publicKey, secretKey);
        checkBoxLengths(publicKey, secretKey);
        var k = new Uint8Array(crypto_box_BEFORENMBYTES);
        crypto_box_beforenm(k, publicKey, secretKey);
        return k;
      };
      nacl4.box.after = nacl4.secretbox;
      nacl4.box.open = function(msg, nonce, publicKey, secretKey) {
        var k = nacl4.box.before(publicKey, secretKey);
        return nacl4.secretbox.open(msg, nonce, k);
      };
      nacl4.box.open.after = nacl4.secretbox.open;
      nacl4.box.keyPair = function() {
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
        crypto_box_keypair(pk, sk);
        return { publicKey: pk, secretKey: sk };
      };
      nacl4.box.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_box_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
        crypto_scalarmult_base(pk, secretKey);
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
      };
      nacl4.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
      nacl4.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
      nacl4.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
      nacl4.box.nonceLength = crypto_box_NONCEBYTES;
      nacl4.box.overheadLength = nacl4.secretbox.overheadLength;
      nacl4.sign = function(msg, secretKey) {
        checkArrayTypes(msg, secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
        crypto_sign(signedMsg, msg, msg.length, secretKey);
        return signedMsg;
      };
      nacl4.sign.open = function(signedMsg, publicKey) {
        checkArrayTypes(signedMsg, publicKey);
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        var tmp = new Uint8Array(signedMsg.length);
        var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
        if (mlen < 0) return null;
        var m3 = new Uint8Array(mlen);
        for (var i2 = 0; i2 < m3.length; i2++) m3[i2] = tmp[i2];
        return m3;
      };
      nacl4.sign.detached = function(msg, secretKey) {
        var signedMsg = nacl4.sign(msg, secretKey);
        var sig = new Uint8Array(crypto_sign_BYTES);
        for (var i2 = 0; i2 < sig.length; i2++) sig[i2] = signedMsg[i2];
        return sig;
      };
      nacl4.sign.detached.verify = function(msg, sig, publicKey) {
        checkArrayTypes(msg, sig, publicKey);
        if (sig.length !== crypto_sign_BYTES)
          throw new Error("bad signature size");
        if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
          throw new Error("bad public key size");
        var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
        var m3 = new Uint8Array(crypto_sign_BYTES + msg.length);
        var i2;
        for (i2 = 0; i2 < crypto_sign_BYTES; i2++) sm[i2] = sig[i2];
        for (i2 = 0; i2 < msg.length; i2++) sm[i2 + crypto_sign_BYTES] = msg[i2];
        return crypto_sign_open(m3, sm, sm.length, publicKey) >= 0;
      };
      nacl4.sign.keyPair = function() {
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        crypto_sign_keypair(pk, sk);
        return { publicKey: pk, secretKey: sk };
      };
      nacl4.sign.keyPair.fromSecretKey = function(secretKey) {
        checkArrayTypes(secretKey);
        if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
          throw new Error("bad secret key size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        for (var i2 = 0; i2 < pk.length; i2++) pk[i2] = secretKey[32 + i2];
        return { publicKey: pk, secretKey: new Uint8Array(secretKey) };
      };
      nacl4.sign.keyPair.fromSeed = function(seed) {
        checkArrayTypes(seed);
        if (seed.length !== crypto_sign_SEEDBYTES)
          throw new Error("bad seed size");
        var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
        var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
        for (var i2 = 0; i2 < 32; i2++) sk[i2] = seed[i2];
        crypto_sign_keypair(pk, sk, true);
        return { publicKey: pk, secretKey: sk };
      };
      nacl4.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
      nacl4.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
      nacl4.sign.seedLength = crypto_sign_SEEDBYTES;
      nacl4.sign.signatureLength = crypto_sign_BYTES;
      nacl4.hash = function(msg) {
        checkArrayTypes(msg);
        var h2 = new Uint8Array(crypto_hash_BYTES);
        crypto_hash(h2, msg, msg.length);
        return h2;
      };
      nacl4.hash.hashLength = crypto_hash_BYTES;
      nacl4.verify = function(x2, y) {
        checkArrayTypes(x2, y);
        if (x2.length === 0 || y.length === 0) return false;
        if (x2.length !== y.length) return false;
        return vn(x2, 0, y, 0, x2.length) === 0 ? true : false;
      };
      nacl4.setPRNG = function(fn) {
        randombytes = fn;
      };
      (function() {
        var crypto2 = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
        if (crypto2 && crypto2.getRandomValues) {
          var QUOTA = 65536;
          nacl4.setPRNG(function(x2, n) {
            var i2, v2 = new Uint8Array(n);
            for (i2 = 0; i2 < n; i2 += QUOTA) {
              crypto2.getRandomValues(v2.subarray(i2, i2 + Math.min(n - i2, QUOTA)));
            }
            for (i2 = 0; i2 < n; i2++) x2[i2] = v2[i2];
            cleanup(v2);
          });
        } else if (typeof __require !== "undefined") {
          crypto2 = __require("crypto");
          if (crypto2 && crypto2.randomBytes) {
            nacl4.setPRNG(function(x2, n) {
              var i2, v2 = crypto2.randomBytes(n);
              for (i2 = 0; i2 < n; i2++) x2[i2] = v2[i2];
              cleanup(v2);
            });
          }
        }
      })();
    })(typeof module !== "undefined" && module.exports ? module.exports : self.nacl = self.nacl || {});
  }
});

// node_modules/.deno/@chelonia+crypto@1.0.1/node_modules/@chelonia/crypto/dist/esm/index.mjs
var import_scrypt_async, import_tweetnacl, bufToStr, strToBuf, blake32Hash3, b64ToBuf2, ENULL, SNULL, EDWARDS25519SHA512BATCH2, CURVE25519XSALSA20POLY13052, XSALSA20POLY13052, EXTERNALKM32, bytesOrObjectToB64, keygen3, generateSalt2, serializeKey2, deserializeKey2, keyId2, sign2, verifySignature2, encrypt2, decrypt2;
var init_esm7 = __esm({
  "node_modules/.deno/@chelonia+crypto@1.0.1/node_modules/@chelonia/crypto/dist/esm/index.mjs"() {
    init_esm6();
    import_scrypt_async = __toESM(require_scrypt_async(), 1);
    import_tweetnacl = __toESM(require_nacl_fast(), 1);
    bufToStr = (() => {
      const textDecoder = new TextDecoder();
      return (buf) => {
        return textDecoder.decode(buf);
      };
    })();
    strToBuf = (() => {
      const textEncoder = new TextEncoder();
      return (str) => {
        return textEncoder.encode(str);
      };
    })();
    blake32Hash3 = (data) => {
      const uint8array = typeof data === "string" ? strToBuf(data) : data;
      const digest = blake2b256.digest(uint8array);
      return base58btc2.encode(digest.bytes);
    };
    b64ToBuf2 = (data) => new Uint8Array(atob(data).split("").map((b) => b.charCodeAt(0)));
    ENULL = "eNULL";
    SNULL = "sNULL";
    EDWARDS25519SHA512BATCH2 = "edwards25519sha512batch";
    CURVE25519XSALSA20POLY13052 = "curve25519xsalsa20poly1305";
    XSALSA20POLY13052 = "xsalsa20poly1305";
    EXTERNALKM32 = "externalkm32";
    if (process.env.NODE_ENV === "production" && process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true") {
      throw new Error("ENABLE_UNSAFE_NULL_CRYPTO cannot be enabled in production mode");
    }
    bytesOrObjectToB64 = (ary) => {
      if (!(ary instanceof Uint8Array)) {
        throw TypeError("Unsupported type");
      }
      return btoa(Array.from(ary).map((c) => String.fromCharCode(c)).join(""));
    };
    keygen3 = (type) => {
      if (process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true" && (type === ENULL || type === SNULL)) {
        const res = {
          type,
          publicKey: bytesOrObjectToB64(import_tweetnacl.default.randomBytes(18))
        };
        Object.defineProperty(res, "secretKey", { value: res.publicKey });
        return res;
      }
      if (type === EDWARDS25519SHA512BATCH2) {
        const key = import_tweetnacl.default.sign.keyPair();
        const res = {
          type,
          publicKey: key.publicKey
        };
        Object.defineProperty(res, "secretKey", { value: key.secretKey });
        return res;
      } else if (type === CURVE25519XSALSA20POLY13052) {
        const key = import_tweetnacl.default.box.keyPair();
        const res = {
          type,
          publicKey: key.publicKey
        };
        Object.defineProperty(res, "secretKey", { value: key.secretKey });
        return res;
      } else if (type === XSALSA20POLY13052) {
        const res = {
          type
        };
        Object.defineProperty(res, "secretKey", { value: import_tweetnacl.default.randomBytes(import_tweetnacl.default.secretbox.keyLength) });
        return res;
      } else if (type === EXTERNALKM32) {
        const res = {
          type
        };
        Object.defineProperty(res, "secretKey", { value: import_tweetnacl.default.randomBytes(32) });
        return res;
      }
      throw new Error("Unsupported key type");
    };
    generateSalt2 = () => {
      return bytesOrObjectToB64(import_tweetnacl.default.randomBytes(18));
    };
    serializeKey2 = (key, saveSecretKey) => {
      if (process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true" && (key.type === ENULL || key.type === SNULL)) {
        return JSON.stringify([
          key.type,
          saveSecretKey ? null : key.publicKey,
          saveSecretKey ? key.secretKey : null
        ], void 0, 0);
      }
      if (key.type === EDWARDS25519SHA512BATCH2 || key.type === CURVE25519XSALSA20POLY13052) {
        if (!saveSecretKey) {
          if (!key.publicKey) {
            throw new Error("Unsupported operation: no public key to export");
          }
          return JSON.stringify([
            key.type,
            bytesOrObjectToB64(key.publicKey),
            null
          ], void 0, 0);
        }
        if (!key.secretKey) {
          throw new Error("Unsupported operation: no secret key to export");
        }
        return JSON.stringify([
          key.type,
          null,
          bytesOrObjectToB64(key.secretKey)
        ], void 0, 0);
      } else if (key.type === XSALSA20POLY13052) {
        if (!saveSecretKey) {
          throw new Error("Unsupported operation: no public key to export");
        }
        if (!key.secretKey) {
          throw new Error("Unsupported operation: no secret key to export");
        }
        return JSON.stringify([
          key.type,
          null,
          bytesOrObjectToB64(key.secretKey)
        ], void 0, 0);
      }
      throw new Error("Unsupported key type");
    };
    deserializeKey2 = (data) => {
      const keyData = JSON.parse(data);
      if (!keyData || keyData.length !== 3) {
        throw new Error("Invalid key object");
      }
      if (process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true" && (keyData[0] === ENULL || keyData[0] === SNULL)) {
        const res = {
          type: keyData[0]
        };
        if (keyData[2]) {
          Object.defineProperty(res, "secretKey", { value: keyData[2] });
          res.publicKey = keyData[2];
        } else {
          res.publicKey = keyData[1];
        }
        return res;
      }
      if (keyData[0] === EDWARDS25519SHA512BATCH2) {
        if (keyData[2]) {
          const key = import_tweetnacl.default.sign.keyPair.fromSecretKey(b64ToBuf2(keyData[2]));
          const res = {
            type: keyData[0],
            publicKey: key.publicKey
          };
          Object.defineProperty(res, "secretKey", { value: key.secretKey });
          return res;
        } else if (keyData[1]) {
          return {
            type: keyData[0],
            publicKey: new Uint8Array(b64ToBuf2(keyData[1]))
          };
        }
        throw new Error("Missing secret or public key");
      } else if (keyData[0] === CURVE25519XSALSA20POLY13052) {
        if (keyData[2]) {
          const key = import_tweetnacl.default.box.keyPair.fromSecretKey(b64ToBuf2(keyData[2]));
          const res = {
            type: keyData[0],
            publicKey: key.publicKey
          };
          Object.defineProperty(res, "secretKey", { value: key.secretKey });
          return res;
        } else if (keyData[1]) {
          return {
            type: keyData[0],
            publicKey: new Uint8Array(b64ToBuf2(keyData[1]))
          };
        }
        throw new Error("Missing secret or public key");
      } else if (keyData[0] === XSALSA20POLY13052) {
        if (!keyData[2]) {
          throw new Error("Secret key missing");
        }
        const res = {
          type: keyData[0]
        };
        Object.defineProperty(res, "secretKey", { value: new Uint8Array(b64ToBuf2(keyData[2])) });
        return res;
      }
      throw new Error("Unsupported key type");
    };
    keyId2 = (inKey) => {
      const key = typeof inKey === "string" ? deserializeKey2(inKey) : inKey;
      const serializedKey = serializeKey2(key, !key.publicKey);
      return blake32Hash3(serializedKey);
    };
    sign2 = (inKey, data) => {
      const key = typeof inKey === "string" ? deserializeKey2(inKey) : inKey;
      if (process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true" && key.type === SNULL) {
        if (!key.secretKey) {
          throw new Error("Secret key missing");
        }
        return key.secretKey + ";" + blake32Hash3(data);
      }
      if (key.type !== EDWARDS25519SHA512BATCH2) {
        throw new Error("Unsupported algorithm");
      }
      if (!key.secretKey) {
        throw new Error("Secret key missing");
      }
      const messageUint8 = strToBuf(data);
      const signature = import_tweetnacl.default.sign.detached(messageUint8, key.secretKey);
      const base64Signature = bytesOrObjectToB64(signature);
      return base64Signature;
    };
    verifySignature2 = (inKey, data, signature) => {
      const key = typeof inKey === "string" ? deserializeKey2(inKey) : inKey;
      if (process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true" && key.type === SNULL) {
        if (!key.publicKey) {
          throw new Error("Public key missing");
        }
        if (key.publicKey + ";" + blake32Hash3(data) !== signature) {
          throw new Error("Invalid signature");
        }
        return;
      }
      if (key.type !== EDWARDS25519SHA512BATCH2) {
        throw new Error("Unsupported algorithm");
      }
      if (!key.publicKey) {
        throw new Error("Public key missing");
      }
      const decodedSignature = b64ToBuf2(signature);
      const messageUint8 = strToBuf(data);
      const result = import_tweetnacl.default.sign.detached.verify(messageUint8, decodedSignature, key.publicKey);
      if (!result) {
        throw new Error("Invalid signature");
      }
    };
    encrypt2 = (inKey, data, ad) => {
      const key = typeof inKey === "string" ? deserializeKey2(inKey) : inKey;
      if (process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true" && key.type === ENULL) {
        if (!key.publicKey) {
          throw new Error("Public key missing");
        }
        return `${key.publicKey};${data};${ad !== null && ad !== void 0 ? ad : ""}`;
      }
      if (key.type === XSALSA20POLY13052) {
        if (!key.secretKey) {
          throw new Error("Secret key missing");
        }
        const nonce = import_tweetnacl.default.randomBytes(import_tweetnacl.default.secretbox.nonceLength);
        let encryptionNonce;
        if (ad) {
          encryptionNonce = new Uint8Array(nonce);
          const adHash = import_tweetnacl.default.hash(strToBuf(ad));
          const len = Math.min(adHash.length, nonce.length);
          for (let i2 = 0; i2 < len; i2++) {
            encryptionNonce[i2] ^= adHash[i2];
          }
        } else {
          encryptionNonce = nonce;
        }
        const messageUint8 = strToBuf(data);
        const box = import_tweetnacl.default.secretbox(messageUint8, encryptionNonce, key.secretKey);
        const fullMessage = new Uint8Array(nonce.length + box.length);
        fullMessage.set(nonce);
        fullMessage.set(box, nonce.length);
        const base64FullMessage = bytesOrObjectToB64(fullMessage);
        return base64FullMessage;
      } else if (key.type === CURVE25519XSALSA20POLY13052) {
        if (!key.publicKey) {
          throw new Error("Public key missing");
        }
        const nonce = import_tweetnacl.default.randomBytes(import_tweetnacl.default.box.nonceLength);
        let encryptionNonce;
        if (ad) {
          encryptionNonce = new Uint8Array(nonce);
          const adHash = import_tweetnacl.default.hash(strToBuf(ad));
          const len = Math.min(adHash.length, nonce.length);
          for (let i2 = 0; i2 < len; i2++) {
            encryptionNonce[i2] ^= adHash[i2];
          }
        } else {
          encryptionNonce = nonce;
        }
        const messageUint8 = strToBuf(data);
        const ephemeralKey = import_tweetnacl.default.box.keyPair();
        const box = import_tweetnacl.default.box(messageUint8, encryptionNonce, key.publicKey, ephemeralKey.secretKey);
        crypto.getRandomValues(ephemeralKey.secretKey);
        ephemeralKey.secretKey.fill(0);
        const fullMessage = new Uint8Array(import_tweetnacl.default.box.publicKeyLength + nonce.length + box.length);
        fullMessage.set(ephemeralKey.publicKey);
        fullMessage.set(nonce, import_tweetnacl.default.box.publicKeyLength);
        fullMessage.set(box, import_tweetnacl.default.box.publicKeyLength + nonce.length);
        const base64FullMessage = bytesOrObjectToB64(fullMessage);
        return base64FullMessage;
      }
      throw new Error("Unsupported algorithm");
    };
    decrypt2 = (inKey, data, ad) => {
      const key = typeof inKey === "string" ? deserializeKey2(inKey) : inKey;
      if (process.env.ENABLE_UNSAFE_NULL_CRYPTO === "true" && key.type === ENULL) {
        if (!key.secretKey) {
          throw new Error("Secret key missing");
        }
        if (!data.startsWith(key.secretKey + ";") || !data.endsWith(";" + (ad !== null && ad !== void 0 ? ad : ""))) {
          throw new Error("Additional data mismatch");
        }
        return data.slice(String(key.secretKey).length + 1, data.length - 1 - (ad !== null && ad !== void 0 ? ad : "").length);
      }
      if (key.type === XSALSA20POLY13052) {
        if (!key.secretKey) {
          throw new Error("Secret key missing");
        }
        const messageWithNonceAsUint8Array = b64ToBuf2(data);
        const nonce = messageWithNonceAsUint8Array.slice(0, import_tweetnacl.default.secretbox.nonceLength);
        const message = messageWithNonceAsUint8Array.slice(import_tweetnacl.default.secretbox.nonceLength, messageWithNonceAsUint8Array.length);
        if (ad) {
          const adHash = import_tweetnacl.default.hash(strToBuf(ad));
          const len = Math.min(adHash.length, nonce.length);
          for (let i2 = 0; i2 < len; i2++) {
            nonce[i2] ^= adHash[i2];
          }
        }
        const decrypted = import_tweetnacl.default.secretbox.open(message, nonce, key.secretKey);
        if (!decrypted) {
          throw new Error("Could not decrypt message");
        }
        return bufToStr(decrypted);
      } else if (key.type === CURVE25519XSALSA20POLY13052) {
        if (!key.secretKey) {
          throw new Error("Secret key missing");
        }
        const messageWithNonceAsUint8Array = b64ToBuf2(data);
        const ephemeralPublicKey = messageWithNonceAsUint8Array.slice(0, import_tweetnacl.default.box.publicKeyLength);
        const nonce = messageWithNonceAsUint8Array.slice(import_tweetnacl.default.box.publicKeyLength, import_tweetnacl.default.box.publicKeyLength + import_tweetnacl.default.box.nonceLength);
        const message = messageWithNonceAsUint8Array.slice(import_tweetnacl.default.box.publicKeyLength + import_tweetnacl.default.box.nonceLength);
        if (ad) {
          const adHash = import_tweetnacl.default.hash(strToBuf(ad));
          const len = Math.min(adHash.length, nonce.length);
          for (let i2 = 0; i2 < len; i2++) {
            nonce[i2] ^= adHash[i2];
          }
        }
        const decrypted = import_tweetnacl.default.box.open(message, nonce, ephemeralPublicKey, key.secretKey);
        if (!decrypted) {
          throw new Error("Could not decrypt message");
        }
        return bufToStr(decrypted);
      }
      throw new Error("Unsupported algorithm");
    };
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/errors.mjs
var ChelErrorGenerator2, ChelErrorWarning, ChelErrorAlreadyProcessed, ChelErrorDBBadPreviousHEAD, ChelErrorDBConnection, ChelErrorUnexpected, ChelErrorKeyAlreadyExists, ChelErrorUnrecoverable, ChelErrorForkedChain, ChelErrorDecryptionError, ChelErrorDecryptionKeyNotFound, ChelErrorSignatureError, ChelErrorSignatureKeyUnauthorized, ChelErrorSignatureKeyNotFound, ChelErrorFetchServerTimeFailed, ChelErrorUnexpectedHttpResponseCode, ChelErrorResourceGone;
var init_errors = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/errors.mjs"() {
    ChelErrorGenerator2 = (name, base2 = Error) => class extends base2 {
      constructor(...params) {
        super(...params);
        this.name = name;
        if (params[1]?.cause !== this.cause) {
          Object.defineProperty(this, "cause", { configurable: true, writable: true, value: params[1]?.cause });
        }
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
      }
    };
    ChelErrorWarning = ChelErrorGenerator2("ChelErrorWarning");
    ChelErrorAlreadyProcessed = ChelErrorGenerator2("ChelErrorAlreadyProcessed");
    ChelErrorDBBadPreviousHEAD = ChelErrorGenerator2("ChelErrorDBBadPreviousHEAD");
    ChelErrorDBConnection = ChelErrorGenerator2("ChelErrorDBConnection");
    ChelErrorUnexpected = ChelErrorGenerator2("ChelErrorUnexpected");
    ChelErrorKeyAlreadyExists = ChelErrorGenerator2("ChelErrorKeyAlreadyExists");
    ChelErrorUnrecoverable = ChelErrorGenerator2("ChelErrorUnrecoverable");
    ChelErrorForkedChain = ChelErrorGenerator2("ChelErrorForkedChain");
    ChelErrorDecryptionError = ChelErrorGenerator2("ChelErrorDecryptionError");
    ChelErrorDecryptionKeyNotFound = ChelErrorGenerator2("ChelErrorDecryptionKeyNotFound", ChelErrorDecryptionError);
    ChelErrorSignatureError = ChelErrorGenerator2("ChelErrorSignatureError");
    ChelErrorSignatureKeyUnauthorized = ChelErrorGenerator2("ChelErrorSignatureKeyUnauthorized", ChelErrorSignatureError);
    ChelErrorSignatureKeyNotFound = ChelErrorGenerator2("ChelErrorSignatureKeyNotFound", ChelErrorSignatureError);
    ChelErrorFetchServerTimeFailed = ChelErrorGenerator2("ChelErrorFetchServerTimeFailed");
    ChelErrorUnexpectedHttpResponseCode = ChelErrorGenerator2("ChelErrorUnexpectedHttpResponseCode");
    ChelErrorResourceGone = ChelErrorGenerator2("ChelErrorResourceGone", ChelErrorUnexpectedHttpResponseCode);
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/events.mjs
var CHELONIA_RESET, CONTRACT_IS_SYNCING, CONTRACTS_MODIFIED, EVENT_HANDLED, EVENT_PUBLISHED, EVENT_PUBLISHING_ERROR, CONTRACT_REGISTERED, CONTRACT_IS_PENDING_KEY_REQUESTS, CONTRACT_HAS_RECEIVED_KEYS, PERSISTENT_ACTION_FAILURE, PERSISTENT_ACTION_SUCCESS, PERSISTENT_ACTION_TOTAL_FAILURE;
var init_events2 = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/events.mjs"() {
    CHELONIA_RESET = "chelonia-reset";
    CONTRACT_IS_SYNCING = "contract-is-syncing";
    CONTRACTS_MODIFIED = "contracts-modified";
    EVENT_HANDLED = "event-handled";
    EVENT_PUBLISHED = "event-published";
    EVENT_PUBLISHING_ERROR = "event-publishing-error";
    CONTRACT_REGISTERED = "contract-registered";
    CONTRACT_IS_PENDING_KEY_REQUESTS = "contract-is-pending-key-requests";
    CONTRACT_HAS_RECEIVED_KEYS = "contract-has-received-keys";
    PERSISTENT_ACTION_FAILURE = "persistent-action-failure";
    PERSISTENT_ACTION_SUCCESS = "persistent-action-success";
    PERSISTENT_ACTION_TOTAL_FAILURE = "persistent-action-total_failure";
  }
});

// node_modules/.deno/@chelonia+serdes@1.0.0/node_modules/@chelonia/serdes/dist/esm/index.js
var serdesTagSymbol, serdesSerializeSymbol, serdesDeserializeSymbol, rawResult, serializer, deserializerTable, deserializer;
var init_esm8 = __esm({
  "node_modules/.deno/@chelonia+serdes@1.0.0/node_modules/@chelonia/serdes/dist/esm/index.js"() {
    serdesTagSymbol = Symbol("tag");
    serdesSerializeSymbol = Symbol("serialize");
    serdesDeserializeSymbol = Symbol("deserialize");
    rawResult = (rawResultSet, obj) => {
      rawResultSet.add(obj);
      return obj;
    };
    serializer = (data) => {
      const rawResultSet = /* @__PURE__ */ new WeakSet();
      const verbatim = [];
      const transferables = /* @__PURE__ */ new Set();
      const revokables = /* @__PURE__ */ new Set();
      const result = JSON.parse(JSON.stringify(data, (_key, value) => {
        if (value && typeof value === "object" && rawResultSet.has(value))
          return value;
        if (value === void 0)
          return rawResult(rawResultSet, ["_", "_"]);
        if (!value)
          return value;
        if (Array.isArray(value) && value[0] === "_")
          return rawResult(rawResultSet, ["_", "_", ...value]);
        if (value instanceof Map) {
          return rawResult(rawResultSet, ["_", "Map", Array.from(value.entries())]);
        }
        if (value instanceof Set) {
          return rawResult(rawResultSet, ["_", "Set", Array.from(value.values())]);
        }
        if (value instanceof Blob || value instanceof File) {
          const pos = verbatim.length;
          verbatim[verbatim.length] = value;
          return rawResult(rawResultSet, ["_", "_ref", pos]);
        }
        if (value instanceof Error) {
          const pos = verbatim.length;
          verbatim[verbatim.length] = value;
          if (value.cause) {
            value.cause = serializer(value.cause).data;
          }
          return rawResult(rawResultSet, ["_", "_err", rawResult(rawResultSet, ["_", "_ref", pos]), value.name]);
        }
        if (value instanceof MessagePort || value instanceof ReadableStream || value instanceof WritableStream || value instanceof ArrayBuffer) {
          const pos = verbatim.length;
          verbatim[verbatim.length] = value;
          transferables.add(value);
          return rawResult(rawResultSet, ["_", "_ref", pos]);
        }
        if (ArrayBuffer.isView(value)) {
          const pos = verbatim.length;
          verbatim[verbatim.length] = value;
          transferables.add(value.buffer);
          return rawResult(rawResultSet, ["_", "_ref", pos]);
        }
        if (typeof value === "function") {
          const mc = new MessageChannel();
          mc.port1.onmessage = async (ev) => {
            try {
              try {
                const result2 = await value(...deserializer(ev.data[1]));
                const { data: data2, transferables: transferables2 } = serializer(result2);
                ev.data[0].postMessage([true, data2], transferables2);
              } catch (e2) {
                const { data: data2, transferables: transferables2 } = serializer(e2);
                ev.data[0].postMessage([false, data2], transferables2);
              }
            } catch (e2) {
              console.error("Async error on onmessage handler", e2);
            }
          };
          transferables.add(mc.port2);
          revokables.add(mc.port1);
          return rawResult(rawResultSet, ["_", "_fn", mc.port2]);
        }
        const proto3 = Object.getPrototypeOf(value);
        if (proto3?.constructor?.[serdesTagSymbol] && proto3.constructor[serdesSerializeSymbol]) {
          return rawResult(rawResultSet, ["_", "_custom", proto3.constructor[serdesTagSymbol], proto3.constructor[serdesSerializeSymbol](value)]);
        }
        return value;
      }), (_key, value) => {
        if (Array.isArray(value) && value[0] === "_" && value[1] === "_ref") {
          return verbatim[value[2]];
        }
        return value;
      });
      return {
        data: result,
        transferables: Array.from(transferables),
        revokables: Array.from(revokables)
      };
    };
    deserializerTable = /* @__PURE__ */ Object.create(null);
    deserializer = (data) => {
      const rawResultSet = /* @__PURE__ */ new WeakSet();
      const verbatim = [];
      return JSON.parse(JSON.stringify(data, (_key, value) => {
        if (value && typeof value === "object" && !rawResultSet.has(value) && !Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) {
          const pos = verbatim.length;
          verbatim[verbatim.length] = value;
          return rawResult(rawResultSet, ["_", "_ref", pos]);
        }
        return value;
      }), (_key, value) => {
        if (Array.isArray(value) && value[0] === "_") {
          switch (value[1]) {
            case "_":
              if (value.length >= 3) {
                return value.slice(2);
              } else {
                return;
              }
            // Map input (reconstruct Map)
            case "Map":
              return new Map(value[2]);
            // Set input (reconstruct Set)
            case "Set":
              return new Set(value[2]);
            // Custom object type (reconstruct if possible, otherwise throw an error)
            case "_custom":
              if (deserializerTable[value[2]]) {
                return deserializerTable[value[2]](value[3]);
              } else {
                throw new Error("Invalid or unknown tag: " + value[2]);
              }
            // These are literal values, return them
            case "_ref":
              return verbatim[value[2]];
            case "_err": {
              if (value[2].name !== value[3]) {
                value[2].name = value[3];
              }
              if (value[2].cause) {
                value[2].cause = deserializer(value[2].cause);
              }
              return value[2];
            }
            // These were functions converted to a MessagePort. Convert them on this
            // end back into functions using that port.
            case "_fn": {
              const mp = value[2];
              return (...args) => {
                return new Promise((resolve4, reject) => {
                  const mc = new MessageChannel();
                  const { data: data2, transferables } = serializer(args);
                  mc.port1.onmessage = (ev) => {
                    if (ev.data[0]) {
                      resolve4(deserializer(ev.data[1]));
                    } else {
                      reject(deserializer(ev.data[1]));
                    }
                  };
                  mp.postMessage([mc.port2, data2], [mc.port2, ...transferables]);
                });
              };
            }
          }
        }
        return value;
      });
    };
    deserializer.register = (ctor) => {
      if (typeof ctor === "function" && typeof ctor[serdesTagSymbol] === "string" && typeof ctor[serdesDeserializeSymbol] === "function") {
        deserializerTable[ctor[serdesTagSymbol]] = ctor[serdesDeserializeSymbol].bind(ctor);
      }
    };
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/signedData.mjs
var rootStateFn, proto, wrapper, isSignedData, signData, verifySignatureData, signedOutgoingData, signedOutgoingDataWithRawKey, signedIncomingData, signedDataKeyId, isRawSignedData, rawSignedIncomingData;
var init_signedData = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/signedData.mjs"() {
    init_esm7();
    init_esm();
    init_esm5();
    init_errors();
    init_functions();
    rootStateFn = () => esm_default("chelonia/rootState");
    proto = Object.create(null, {
      _isSignedData: {
        value: true
      }
    });
    wrapper = (o2) => {
      return Object.setPrototypeOf(o2, proto);
    };
    isSignedData = (o2) => {
      return !!o2 && !!Object.getPrototypeOf(o2)?._isSignedData;
    };
    signData = function(stateOrContractID, sKeyId, data, extraFields, additionalKeys, additionalData) {
      const state = typeof stateOrContractID === "string" ? rootStateFn()[stateOrContractID] : stateOrContractID;
      if (!additionalData) {
        throw new ChelErrorSignatureError("Signature additional data must be provided");
      }
      const designatedKey = state?._vm?.authorizedKeys?.[sKeyId];
      if (!designatedKey?.purpose.includes("sig")) {
        throw new ChelErrorSignatureKeyNotFound(`Signing key ID ${sKeyId} is missing or is missing signing purpose`);
      }
      if (designatedKey._notAfterHeight != null) {
        const name = state._vm.authorizedKeys[sKeyId].name;
        const newKeyId = Object.values(state._vm?.authorizedKeys).find((v2) => v2._notAfterHeight == null && v2.name === name && v2.purpose.includes("sig"))?.id;
        if (!newKeyId) {
          throw new ChelErrorSignatureKeyNotFound(`Signing key ID ${sKeyId} has been revoked and no new key exists by the same name (${name})`);
        }
        sKeyId = newKeyId;
      }
      const key = additionalKeys[sKeyId];
      if (!key) {
        throw new ChelErrorSignatureKeyNotFound(`Missing signing key ${sKeyId}`);
      }
      const deserializedKey = typeof key === "string" ? deserializeKey2(key) : key;
      const serializedData = JSON.stringify(data, (_, v2) => {
        if (v2 && has(v2, "serialize") && typeof v2.serialize === "function") {
          if (v2.serialize.length === 1) {
            return v2.serialize(additionalData);
          } else {
            return v2.serialize();
          }
        }
        return v2;
      });
      const payloadToSign = blake32Hash2(`${blake32Hash2(additionalData)}${blake32Hash2(serializedData)}`);
      return {
        ...extraFields,
        _signedData: [
          serializedData,
          keyId2(deserializedKey),
          sign2(deserializedKey, payloadToSign)
        ]
      };
    };
    verifySignatureData = function(state, height, data, additionalData) {
      if (!state) {
        throw new ChelErrorSignatureError("Missing contract state");
      }
      if (!isRawSignedData(data)) {
        throw new ChelErrorSignatureError("Invalid message format");
      }
      if (!Number.isSafeInteger(height) || height < 0) {
        throw new ChelErrorSignatureError(`Height ${height} is invalid or out of range`);
      }
      const [serializedMessage, sKeyId, signature] = data._signedData;
      const designatedKey = state._vm?.authorizedKeys?.[sKeyId];
      if (!designatedKey || height > designatedKey._notAfterHeight || height < designatedKey._notBeforeHeight || !designatedKey.purpose.includes("sig")) {
        if (process.env.CI) {
          console.error(`Key ${sKeyId} is unauthorized or expired for the current contract`, { designatedKey, height, state: JSON.parse(JSON.stringify(esm_default("state/vuex/state"))) });
          Promise.reject(new ChelErrorSignatureKeyUnauthorized(`Key ${sKeyId} is unauthorized or expired for the current contract`));
        }
        throw new ChelErrorSignatureKeyUnauthorized(`Key ${sKeyId} is unauthorized or expired for the current contract`);
      }
      const deserializedKey = designatedKey.data;
      const payloadToSign = blake32Hash2(`${blake32Hash2(additionalData)}${blake32Hash2(serializedMessage)}`);
      try {
        verifySignature2(deserializedKey, payloadToSign, signature);
        const message = JSON.parse(serializedMessage);
        return [sKeyId, message];
      } catch (e2) {
        throw new ChelErrorSignatureError(e2?.message || e2);
      }
    };
    signedOutgoingData = (stateOrContractID, sKeyId, data, additionalKeys) => {
      if (!stateOrContractID || data === void 0 || !sKeyId)
        throw new TypeError("Invalid invocation");
      if (!additionalKeys) {
        additionalKeys = rootStateFn().secretKeys;
      }
      const extraFields = /* @__PURE__ */ Object.create(null);
      const boundStringValueFn = signData.bind(null, stateOrContractID, sKeyId, data, extraFields, additionalKeys);
      const serializefn = (additionalData) => boundStringValueFn(additionalData || "");
      return wrapper({
        get signingKeyId() {
          return sKeyId;
        },
        get serialize() {
          return serializefn;
        },
        get toString() {
          return (additionalData) => JSON.stringify(this.serialize(additionalData));
        },
        get valueOf() {
          return () => data;
        },
        get recreate() {
          return (data2) => signedOutgoingData(stateOrContractID, sKeyId, data2, additionalKeys);
        },
        get get() {
          return (k) => extraFields[k];
        },
        get set() {
          return (k, v2) => {
            extraFields[k] = v2;
          };
        }
      });
    };
    signedOutgoingDataWithRawKey = (key, data) => {
      const sKeyId = keyId2(key);
      const state = {
        _vm: {
          authorizedKeys: {
            [sKeyId]: {
              purpose: ["sig"],
              data: serializeKey2(key, false),
              _notBeforeHeight: 0,
              _notAfterHeight: void 0
            }
          }
        }
      };
      const extraFields = /* @__PURE__ */ Object.create(null);
      const boundStringValueFn = signData.bind(null, state, sKeyId, data, extraFields, { [sKeyId]: key });
      const serializefn = (additionalData) => boundStringValueFn(additionalData || "");
      return wrapper({
        get signingKeyId() {
          return sKeyId;
        },
        get serialize() {
          return serializefn;
        },
        get toString() {
          return (additionalData) => JSON.stringify(this.serialize(additionalData));
        },
        get valueOf() {
          return () => data;
        },
        get recreate() {
          return (data2) => signedOutgoingDataWithRawKey(key, data2);
        },
        get get() {
          return (k) => extraFields[k];
        },
        get set() {
          return (k, v2) => {
            extraFields[k] = v2;
          };
        }
      });
    };
    signedIncomingData = (contractID, state, data, height, additionalData, mapperFn) => {
      const stringValueFn = () => data;
      let verifySignedValue;
      const verifySignedValueFn = () => {
        if (verifySignedValue) {
          return verifySignedValue[1];
        }
        verifySignedValue = verifySignatureData(state || rootStateFn()[contractID], height, data, additionalData);
        if (mapperFn)
          verifySignedValue[1] = mapperFn(verifySignedValue[1]);
        return verifySignedValue[1];
      };
      return wrapper({
        get signingKeyId() {
          if (verifySignedValue)
            return verifySignedValue[0];
          return signedDataKeyId(data);
        },
        get serialize() {
          return stringValueFn;
        },
        get context() {
          return [contractID, data, height, additionalData];
        },
        get toString() {
          return () => JSON.stringify(this.serialize());
        },
        get valueOf() {
          return verifySignedValueFn;
        },
        get toJSON() {
          return this.serialize;
        },
        get get() {
          return (k) => k !== "_signedData" ? data[k] : void 0;
        }
      });
    };
    signedDataKeyId = (data) => {
      if (!isRawSignedData(data)) {
        throw new ChelErrorSignatureError("Invalid message format");
      }
      return data._signedData[1];
    };
    isRawSignedData = (data) => {
      if (!data || typeof data !== "object" || !has(data, "_signedData") || !Array.isArray(data._signedData) || data._signedData.length !== 3 || data._signedData.map((v2) => typeof v2).filter((v2) => v2 !== "string").length !== 0) {
        return false;
      }
      return true;
    };
    rawSignedIncomingData = (data) => {
      if (!isRawSignedData(data)) {
        throw new ChelErrorSignatureError("Invalid message format");
      }
      const stringValueFn = () => data;
      let verifySignedValue;
      const verifySignedValueFn = () => {
        if (verifySignedValue) {
          return verifySignedValue[1];
        }
        verifySignedValue = [data._signedData[1], JSON.parse(data._signedData[0])];
        return verifySignedValue[1];
      };
      return wrapper({
        get signingKeyId() {
          if (verifySignedValue)
            return verifySignedValue[0];
          return signedDataKeyId(data);
        },
        get serialize() {
          return stringValueFn;
        },
        get toString() {
          return () => JSON.stringify(this.serialize());
        },
        get valueOf() {
          return verifySignedValueFn;
        },
        get toJSON() {
          return this.serialize;
        },
        get get() {
          return (k) => k !== "_signedData" ? data[k] : void 0;
        }
      });
    };
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/encryptedData.mjs
var rootStateFn2, proto2, wrapper2, isEncryptedData, encryptData, decryptData, encryptedOutgoingData, encryptedOutgoingDataWithRawKey, encryptedIncomingData, encryptedIncomingForeignData, encryptedDataKeyId, isRawEncryptedData, unwrapMaybeEncryptedData, maybeEncryptedIncomingData;
var init_encryptedData = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/encryptedData.mjs"() {
    init_esm7();
    init_esm();
    init_esm5();
    init_errors();
    init_signedData();
    rootStateFn2 = () => esm_default("chelonia/rootState");
    proto2 = Object.create(null, {
      _isEncryptedData: {
        value: true
      }
    });
    wrapper2 = (o2) => {
      return Object.setPrototypeOf(o2, proto2);
    };
    isEncryptedData = (o2) => {
      return !!o2 && !!Object.getPrototypeOf(o2)?._isEncryptedData;
    };
    encryptData = function(stateOrContractID, eKeyId, data, additionalData) {
      const state = typeof stateOrContractID === "string" ? rootStateFn2()[stateOrContractID] : stateOrContractID;
      const designatedKey = state?._vm?.authorizedKeys?.[eKeyId];
      if (!designatedKey?.purpose.includes("enc")) {
        throw new Error(`Encryption key ID ${eKeyId} is missing or is missing encryption purpose`);
      }
      if (designatedKey._notAfterHeight != null) {
        const name = state._vm.authorizedKeys[eKeyId].name;
        const newKeyId = Object.values(state._vm?.authorizedKeys).find((v2) => v2._notAfterHeight == null && v2.name === name && v2.purpose.includes("enc"))?.id;
        if (!newKeyId) {
          throw new Error(`Encryption key ID ${eKeyId} has been revoked and no new key exists by the same name (${name})`);
        }
        eKeyId = newKeyId;
      }
      const key = state._vm?.authorizedKeys?.[eKeyId].data;
      if (!key) {
        throw new Error(`Missing encryption key ${eKeyId}`);
      }
      const deserializedKey = typeof key === "string" ? deserializeKey2(key) : key;
      return [
        keyId2(deserializedKey),
        encrypt2(deserializedKey, JSON.stringify(data, (_, v2) => {
          if (v2 && has(v2, "serialize") && typeof v2.serialize === "function") {
            if (v2.serialize.length === 1) {
              return v2.serialize(additionalData);
            } else {
              return v2.serialize();
            }
          }
          return v2;
        }), additionalData)
      ];
    };
    decryptData = function(state, height, data, additionalKeys, additionalData, validatorFn) {
      if (!state) {
        throw new ChelErrorDecryptionError("Missing contract state");
      }
      if (typeof data.valueOf === "function")
        data = data.valueOf();
      if (!isRawEncryptedData(data)) {
        throw new ChelErrorDecryptionError("Invalid message format");
      }
      const [eKeyId, message] = data;
      const key = additionalKeys[eKeyId];
      if (!key) {
        throw new ChelErrorDecryptionKeyNotFound(`Key ${eKeyId} not found`, { cause: eKeyId });
      }
      const designatedKey = state._vm?.authorizedKeys?.[eKeyId];
      if (!designatedKey || height > designatedKey._notAfterHeight || height < designatedKey._notBeforeHeight || !designatedKey.purpose.includes("enc")) {
        throw new ChelErrorUnexpected(`Key ${eKeyId} is unauthorized or expired for the current contract`);
      }
      const deserializedKey = typeof key === "string" ? deserializeKey2(key) : key;
      try {
        const result = JSON.parse(decrypt2(deserializedKey, message, additionalData));
        if (typeof validatorFn === "function")
          validatorFn(result, eKeyId);
        return result;
      } catch (e2) {
        throw new ChelErrorDecryptionError(e2?.message || e2);
      }
    };
    encryptedOutgoingData = (stateOrContractID, eKeyId, data) => {
      if (!stateOrContractID || data === void 0 || !eKeyId)
        throw new TypeError("Invalid invocation");
      const boundStringValueFn = encryptData.bind(null, stateOrContractID, eKeyId, data);
      return wrapper2({
        get encryptionKeyId() {
          return eKeyId;
        },
        get serialize() {
          return (additionalData) => boundStringValueFn(additionalData || "");
        },
        get toString() {
          return (additionalData) => JSON.stringify(this.serialize(additionalData));
        },
        get valueOf() {
          return () => data;
        }
      });
    };
    encryptedOutgoingDataWithRawKey = (key, data) => {
      if (data === void 0 || !key)
        throw new TypeError("Invalid invocation");
      const eKeyId = keyId2(key);
      const state = {
        _vm: {
          authorizedKeys: {
            [eKeyId]: {
              purpose: ["enc"],
              data: serializeKey2(key, false),
              _notBeforeHeight: 0,
              _notAfterHeight: void 0
            }
          }
        }
      };
      const boundStringValueFn = encryptData.bind(null, state, eKeyId, data);
      return wrapper2({
        get encryptionKeyId() {
          return eKeyId;
        },
        get serialize() {
          return (additionalData) => boundStringValueFn(additionalData || "");
        },
        get toString() {
          return (additionalData) => JSON.stringify(this.serialize(additionalData));
        },
        get valueOf() {
          return () => data;
        }
      });
    };
    encryptedIncomingData = (contractID, state, data, height, additionalKeys, additionalData, validatorFn) => {
      let decryptedValue;
      const decryptedValueFn = () => {
        if (decryptedValue) {
          return decryptedValue;
        }
        if (!state || !additionalKeys) {
          const rootState = rootStateFn2();
          state = state || rootState[contractID];
          additionalKeys = additionalKeys ?? rootState.secretKeys;
        }
        decryptedValue = decryptData(state, height, data, additionalKeys, additionalData || "", validatorFn);
        if (isRawSignedData(decryptedValue)) {
          decryptedValue = signedIncomingData(contractID, state, decryptedValue, height, additionalData || "");
        }
        return decryptedValue;
      };
      return wrapper2({
        get encryptionKeyId() {
          return encryptedDataKeyId(data);
        },
        get serialize() {
          return () => data;
        },
        get toString() {
          return () => JSON.stringify(this.serialize());
        },
        get valueOf() {
          return decryptedValueFn;
        },
        get toJSON() {
          return this.serialize;
        }
      });
    };
    encryptedIncomingForeignData = (contractID, _0, data, _1, additionalKeys, additionalData, validatorFn) => {
      let decryptedValue;
      const decryptedValueFn = () => {
        if (decryptedValue) {
          return decryptedValue;
        }
        const rootState = rootStateFn2();
        const state = rootState[contractID];
        decryptedValue = decryptData(state, NaN, data, additionalKeys ?? rootState.secretKeys, additionalData || "", validatorFn);
        if (isRawSignedData(decryptedValue)) {
          return signedIncomingData(contractID, state, decryptedValue, NaN, additionalData || "");
        }
        return decryptedValue;
      };
      return wrapper2({
        get encryptionKeyId() {
          return encryptedDataKeyId(data);
        },
        get serialize() {
          return () => data;
        },
        get toString() {
          return () => JSON.stringify(this.serialize());
        },
        get valueOf() {
          return decryptedValueFn;
        },
        get toJSON() {
          return this.serialize;
        }
      });
    };
    encryptedDataKeyId = (data) => {
      if (!isRawEncryptedData(data)) {
        throw new ChelErrorDecryptionError("Invalid message format");
      }
      return data[0];
    };
    isRawEncryptedData = (data) => {
      if (!Array.isArray(data) || data.length !== 2 || data.map((v2) => typeof v2).filter((v2) => v2 !== "string").length !== 0) {
        return false;
      }
      return true;
    };
    unwrapMaybeEncryptedData = (data) => {
      if (data == null)
        return;
      if (isEncryptedData(data)) {
        try {
          return {
            encryptionKeyId: data.encryptionKeyId,
            data: data.valueOf()
          };
        } catch (e2) {
          console.warn("unwrapMaybeEncryptedData: Unable to decrypt", e2);
        }
      } else {
        return {
          encryptionKeyId: null,
          data
        };
      }
    };
    maybeEncryptedIncomingData = (contractID, state, data, height, additionalKeys, additionalData, validatorFn) => {
      if (isRawEncryptedData(data)) {
        return encryptedIncomingData(contractID, state, data, height, additionalKeys, additionalData, validatorFn);
      } else {
        validatorFn?.(data, "");
        return data;
      }
    };
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/SPMessage.mjs
function messageToParams(head, message) {
  let mapping;
  return {
    direction: has(message, "recreate") ? "outgoing" : "incoming",
    // Lazy computation of mapping to prevent us from serializing outgoing
    // atomic operations
    get mapping() {
      if (!mapping) {
        const headJSON = JSON.stringify(head);
        const messageJSON = { ...message.serialize(headJSON), head: headJSON };
        const value = JSON.stringify(messageJSON);
        mapping = {
          key: createCID3(value, multicodes3.SHELTER_CONTRACT_DATA),
          value
        };
      }
      return mapping;
    },
    head,
    signedMessageData: message
  };
}
var decryptedAndVerifiedDeserializedMessage, SPMessage2, keyOps;
var init_SPMessage = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/SPMessage.mjs"() {
    init_esm7();
    init_esm8();
    init_esm5();
    init_encryptedData();
    init_functions();
    init_signedData();
    decryptedAndVerifiedDeserializedMessage = (head, headJSON, contractID, parsedMessage, additionalKeys, state) => {
      const op = head.op;
      const height = head.height;
      const message = op === SPMessage2.OP_ACTION_ENCRYPTED ? encryptedIncomingData(contractID, state, parsedMessage, height, additionalKeys, headJSON, void 0) : parsedMessage;
      if ([SPMessage2.OP_KEY_ADD, SPMessage2.OP_KEY_UPDATE].includes(op)) {
        return message.map((key) => {
          return maybeEncryptedIncomingData(contractID, state, key, height, additionalKeys, headJSON, (key2) => {
            if (key2.meta?.private?.content) {
              key2.meta.private.content = encryptedIncomingData(contractID, state, key2.meta.private.content, height, additionalKeys, headJSON, (value) => {
                const computedKeyId = keyId2(value);
                if (computedKeyId !== key2.id) {
                  throw new Error(`Key ID mismatch. Expected to decrypt key ID ${key2.id} but got ${computedKeyId}`);
                }
              });
            }
            if (key2.meta?.keyRequest?.reference) {
              try {
                key2.meta.keyRequest.reference = maybeEncryptedIncomingData(contractID, state, key2.meta.keyRequest.reference, height, additionalKeys, headJSON)?.valueOf();
              } catch {
                delete key2.meta.keyRequest.reference;
              }
            }
            if (key2.meta?.keyRequest?.contractID) {
              try {
                key2.meta.keyRequest.contractID = maybeEncryptedIncomingData(contractID, state, key2.meta.keyRequest.contractID, height, additionalKeys, headJSON)?.valueOf();
              } catch {
                delete key2.meta.keyRequest.contractID;
              }
            }
          });
        });
      }
      if (op === SPMessage2.OP_CONTRACT) {
        message.keys = message.keys?.map((key) => {
          return maybeEncryptedIncomingData(contractID, state, key, height, additionalKeys, headJSON, (key2) => {
            if (!key2.meta?.private?.content)
              return;
            const decryptionFn = encryptedIncomingData;
            const decryptionContract = contractID;
            key2.meta.private.content = decryptionFn(decryptionContract, state, key2.meta.private.content, height, additionalKeys, headJSON, (value) => {
              const computedKeyId = keyId2(value);
              if (computedKeyId !== key2.id) {
                throw new Error(`Key ID mismatch. Expected to decrypt key ID ${key2.id} but got ${computedKeyId}`);
              }
            });
          });
        });
      }
      if (op === SPMessage2.OP_KEY_SHARE) {
        return maybeEncryptedIncomingData(contractID, state, message, height, additionalKeys, headJSON, (message2) => {
          message2.keys?.forEach((key) => {
            if (!key.meta?.private?.content)
              return;
            const decryptionFn = message2.foreignContractID ? encryptedIncomingForeignData : encryptedIncomingData;
            const decryptionContract = message2.foreignContractID || contractID;
            key.meta.private.content = decryptionFn(decryptionContract, state, key.meta.private.content, height, additionalKeys, headJSON, (value) => {
              const computedKeyId = keyId2(value);
              if (computedKeyId !== key.id) {
                throw new Error(`Key ID mismatch. Expected to decrypt key ID ${key.id} but got ${computedKeyId}`);
              }
            });
          });
        });
      }
      if (op === SPMessage2.OP_KEY_REQUEST) {
        return maybeEncryptedIncomingData(contractID, state, message, height, additionalKeys, headJSON, (msg) => {
          msg.replyWith = signedIncomingData(msg.contractID, void 0, msg.replyWith, msg.height, headJSON);
        });
      }
      if (op === SPMessage2.OP_ACTION_UNENCRYPTED && isRawSignedData(message)) {
        return signedIncomingData(contractID, state, message, height, headJSON);
      }
      if (op === SPMessage2.OP_ACTION_ENCRYPTED) {
        return message;
      }
      if (op === SPMessage2.OP_KEY_DEL) {
        return message.map((key) => {
          return maybeEncryptedIncomingData(contractID, state, key, height, additionalKeys, headJSON, void 0);
        });
      }
      if (op === SPMessage2.OP_KEY_REQUEST_SEEN) {
        return maybeEncryptedIncomingData(contractID, state, parsedMessage, height, additionalKeys, headJSON, void 0);
      }
      if (op === SPMessage2.OP_ATOMIC) {
        return message.map(([opT, opV]) => [
          opT,
          decryptedAndVerifiedDeserializedMessage({ ...head, op: opT }, headJSON, contractID, opV, additionalKeys, state)
        ]);
      }
      return message;
    };
    SPMessage2 = class _SPMessage {
      // flow type annotations to make flow happy
      _mapping;
      _head;
      _message;
      _signedMessageData;
      _direction;
      _decryptedValue;
      _innerSigningKeyId;
      static OP_CONTRACT = "c";
      static OP_ACTION_ENCRYPTED = "ae";
      // e2e-encrypted action
      static OP_ACTION_UNENCRYPTED = "au";
      // publicly readable action
      static OP_KEY_ADD = "ka";
      // add this key to the list of keys allowed to write to this contract, or update an existing key
      static OP_KEY_DEL = "kd";
      // remove this key from authorized keys
      static OP_KEY_UPDATE = "ku";
      // update key in authorized keys
      static OP_PROTOCOL_UPGRADE = "pu";
      static OP_PROP_SET = "ps";
      // set a public key/value pair
      static OP_PROP_DEL = "pd";
      // delete a public key/value pair
      static OP_CONTRACT_AUTH = "ca";
      // authorize a contract
      static OP_CONTRACT_DEAUTH = "cd";
      // deauthorize a contract
      static OP_ATOMIC = "a";
      // atomic op
      static OP_KEY_SHARE = "ks";
      // key share
      static OP_KEY_REQUEST = "kr";
      // key request
      static OP_KEY_REQUEST_SEEN = "krs";
      // key request response
      // eslint-disable-next-line camelcase
      static createV1_0({
        contractID,
        previousHEAD = null,
        previousKeyOp = null,
        // Height will be automatically set to the correct value when sending
        // The reason to set it to Number.MAX_SAFE_INTEGER is so that we can
        // temporarily process outgoing messages with signature validation
        // still working
        height = Number.MAX_SAFE_INTEGER,
        op,
        manifest: manifest2
      }) {
        const head = {
          version: "1.0.0",
          previousHEAD,
          previousKeyOp,
          height,
          contractID,
          op: op[0],
          manifest: manifest2
        };
        return new this(messageToParams(head, op[1]));
      }
      // SPMessage.cloneWith could be used when make a SPMessage object having the same id()
      // https://github.com/okTurtles/group-income/issues/1503
      static cloneWith(targetHead, targetOp, sources) {
        const head = Object.assign({}, targetHead, sources);
        return new this(messageToParams(head, targetOp[1]));
      }
      static deserialize(value, additionalKeys, state, unwrapMaybeEncryptedDataFn = unwrapMaybeEncryptedData) {
        if (!value)
          throw new Error(`deserialize bad value: ${value}`);
        const { head: headJSON, ...parsedValue } = JSON.parse(value);
        const head = JSON.parse(headJSON);
        const contractID = head.op === _SPMessage.OP_CONTRACT ? createCID3(value, multicodes3.SHELTER_CONTRACT_DATA) : head.contractID;
        if (!state?._vm?.authorizedKeys && head.op === _SPMessage.OP_CONTRACT) {
          const value2 = rawSignedIncomingData(parsedValue);
          const authorizedKeys = Object.fromEntries(value2.valueOf()?.keys.map((wk) => {
            const k = unwrapMaybeEncryptedDataFn(wk);
            if (!k)
              return null;
            return [k.data.id, k.data];
          }).filter(Boolean));
          state = {
            _vm: {
              type: head.type,
              authorizedKeys
            }
          };
        }
        const signedMessageData = signedIncomingData(contractID, state, parsedValue, head.height, headJSON, (message) => decryptedAndVerifiedDeserializedMessage(head, headJSON, contractID, message, additionalKeys, state));
        return new this({
          direction: "incoming",
          mapping: { key: createCID3(value, multicodes3.SHELTER_CONTRACT_DATA), value },
          head,
          signedMessageData
        });
      }
      static deserializeHEAD(value) {
        if (!value)
          throw new Error(`deserialize bad value: ${value}`);
        let head, hash3;
        const result = {
          get head() {
            if (head === void 0) {
              head = JSON.parse(JSON.parse(value).head);
            }
            return head;
          },
          get hash() {
            if (!hash3) {
              hash3 = createCID3(value, multicodes3.SHELTER_CONTRACT_DATA);
            }
            return hash3;
          },
          get contractID() {
            return result.head?.contractID ?? result.hash;
          },
          // `description` is not a getter to prevent the value from being copied
          // if the object is cloned or serialized
          description() {
            const type = this.head.op;
            return `<op_${type}|${this.hash} of ${this.contractID}>`;
          },
          get isFirstMessage() {
            return !result.head?.contractID;
          }
        };
        return result;
      }
      constructor(params) {
        this._direction = params.direction;
        this._mapping = params.mapping;
        this._head = params.head;
        this._signedMessageData = params.signedMessageData;
        const type = this.opType();
        let atomicTopLevel = true;
        const validate = (type2, message) => {
          switch (type2) {
            case _SPMessage.OP_CONTRACT:
              if (!this.isFirstMessage() || !atomicTopLevel)
                throw new Error("OP_CONTRACT: must be first message");
              break;
            case _SPMessage.OP_ATOMIC:
              if (!atomicTopLevel) {
                throw new Error("OP_ATOMIC not allowed inside of OP_ATOMIC");
              }
              if (!Array.isArray(message)) {
                throw new TypeError("OP_ATOMIC must be of an array type");
              }
              atomicTopLevel = false;
              message.forEach(([t, m3]) => validate(t, m3));
              break;
            case _SPMessage.OP_KEY_ADD:
            case _SPMessage.OP_KEY_DEL:
            case _SPMessage.OP_KEY_UPDATE:
              if (!Array.isArray(message))
                throw new TypeError("OP_KEY_{ADD|DEL|UPDATE} must be of an array type");
              break;
            case _SPMessage.OP_KEY_SHARE:
            case _SPMessage.OP_KEY_REQUEST:
            case _SPMessage.OP_KEY_REQUEST_SEEN:
            case _SPMessage.OP_ACTION_ENCRYPTED:
            case _SPMessage.OP_ACTION_UNENCRYPTED:
              break;
            default:
              throw new Error(`unsupported op: ${type2}`);
          }
        };
        Object.defineProperty(this, "_message", {
          get: /* @__PURE__ */ ((validated) => () => {
            const message = this._signedMessageData.valueOf();
            if (!validated) {
              validate(type, message);
              validated = true;
            }
            return message;
          })()
        });
      }
      decryptedValue() {
        if (this._decryptedValue)
          return this._decryptedValue;
        try {
          const value = this.message();
          const data = unwrapMaybeEncryptedData(value);
          if (data?.data) {
            if (isSignedData(data.data)) {
              this._innerSigningKeyId = data.data.signingKeyId;
              this._decryptedValue = data.data.valueOf();
            } else {
              this._decryptedValue = data.data;
            }
          }
          return this._decryptedValue;
        } catch {
          return void 0;
        }
      }
      innerSigningKeyId() {
        if (!this._decryptedValue) {
          this.decryptedValue();
        }
        return this._innerSigningKeyId;
      }
      head() {
        return this._head;
      }
      message() {
        return this._message;
      }
      op() {
        return [this.head().op, this.message()];
      }
      rawOp() {
        return [this.head().op, this._signedMessageData];
      }
      opType() {
        return this.head().op;
      }
      opValue() {
        return this.message();
      }
      signingKeyId() {
        return this._signedMessageData.signingKeyId;
      }
      manifest() {
        return this.head().manifest;
      }
      description() {
        const type = this.opType();
        let desc = `<op_${type}`;
        if (type === _SPMessage.OP_ACTION_UNENCRYPTED) {
          try {
            const value = this.opValue().valueOf();
            if (typeof value.action === "string") {
              desc += `|${value.action}`;
            }
          } catch (e2) {
            console.warn("Error on .description()", this.hash(), e2);
          }
        }
        return `${desc}|${this.hash()} of ${this.contractID()}>`;
      }
      isFirstMessage() {
        return !this.head().contractID;
      }
      contractID() {
        return this.head().contractID || this.hash();
      }
      serialize() {
        return this._mapping.value;
      }
      hash() {
        return this._mapping.key;
      }
      previousKeyOp() {
        return this._head.previousKeyOp;
      }
      height() {
        return this._head.height;
      }
      id() {
        throw new Error("SPMessage.id() was called but it has been removed");
      }
      direction() {
        return this._direction;
      }
      // `isKeyOp` is used to filter out non-key operations for providing an
      // abbreviated chain fo snapshot validation
      isKeyOp() {
        let value;
        return !!(keyOps.includes(this.opType()) || this.opType() === _SPMessage.OP_ATOMIC && Array.isArray(value = this.opValue()) && value.some(([opT]) => {
          return keyOps.includes(opT);
        }));
      }
      static get [serdesTagSymbol]() {
        return "SPMessage";
      }
      static [serdesSerializeSymbol](m3) {
        return [m3.serialize(), m3.direction(), m3.decryptedValue(), m3.innerSigningKeyId()];
      }
      static [serdesDeserializeSymbol]([serialized, direction, decryptedValue, innerSigningKeyId]) {
        const m3 = _SPMessage.deserialize(serialized);
        m3._direction = direction;
        m3._decryptedValue = decryptedValue;
        m3._innerSigningKeyId = innerSigningKeyId;
        return m3;
      }
    };
    keyOps = [SPMessage2.OP_CONTRACT, SPMessage2.OP_KEY_ADD, SPMessage2.OP_KEY_DEL, SPMessage2.OP_KEY_UPDATE];
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/chelonia-utils.mjs
var chelonia_utils_default;
var init_chelonia_utils = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/chelonia-utils.mjs"() {
    init_esm();
    chelonia_utils_default = esm_default("sbp/selectors/register", {
      // This selector is a wrapper for the `chelonia/kv/set` selector that uses
      // the contract queue and allows referring to keys by name, with default key
      // names set to `csk` and `cek` for signatures and encryption, respectively.
      // For most 'simple' use cases, this selector is a better choice than
      // `chelonia/kv/set`. However, the `chelonia/kv/set` primitive is needed if
      // the queueing logic needs to be more advanced, the key to use requires
      // custom logic or _if the `onconflict` callback also needs to be queued_.
      "chelonia/kv/queuedSet": ({ contractID, key, data, onconflict, ifMatch, encryptionKeyName = "cek", signingKeyName = "csk" }) => {
        return esm_default("chelonia/queueInvocation", contractID, () => {
          return esm_default("chelonia/kv/set", contractID, key, data, {
            ifMatch,
            encryptionKeyId: esm_default("chelonia/contract/currentKeyIdByName", contractID, encryptionKeyName),
            signingKeyId: esm_default("chelonia/contract/currentKeyIdByName", contractID, signingKeyName),
            onconflict
          });
        });
      }
    });
  }
});

// node_modules/.deno/@apeleghq+multipart-parser@1.0.18/node_modules/@apeleghq/multipart-parser/dist/encodeMultipartMessage.mjs
async function* g(a, s, r) {
  let d = new TextEncoder(), y = d.encode(`\r
--${a}`);
  if (Array.isArray(s) && s.length < 1) {
    await r.abort(Error("At least one part is required"));
    return;
  }
  let l = 0;
  for await (let e2 of s) {
    l++;
    let n, t;
    if (!e2.body && e2.parts) if (t = e2.headers.get("content-type"), !t) n = A(), t = `multipart/mixed; boundary="${n}"`;
    else if (!t.startsWith("multipart/") || !T.test(t)) {
      await r.abort(Error("Invalid multipart content type: " + t));
      return;
    } else {
      let o2 = t.match(m);
      (!o2 || !(n = o2[1] || o2[2])) && (n = A(), t = t.replace(T, `; boundary="${n}"`));
    }
    await u(y).pipeTo(r, i), yield;
    {
      let o2 = [""];
      if (t) {
        let p = false;
        e2.headers.forEach((f, c) => {
          c !== "content-type" ? o2.push(`${c}: ${f}`) : (p = true, o2.push(`${c}: ${t}`));
        }), p || o2.push(`content-type: ${t}`);
      } else e2.headers.forEach((p, f) => {
        o2.push(`${f}: ${p}`);
      });
      e2.parts || !e2.body ? o2.push("") : o2.push("", "");
      let B3 = d.encode(o2.join(`\r
`));
      o2.length = 0, await u(B3).pipeTo(r, i), yield;
    }
    if (e2.body) {
      if (e2.body instanceof ArrayBuffer || ArrayBuffer.isView(e2.body)) await u(e2.body).pipeTo(r, i);
      else if (e2.body instanceof Blob) await e2.body.stream().pipeTo(r, i);
      else if (e2.body instanceof ReadableStream) await e2.body.pipeTo(r, i);
      else {
        await r.abort(Error("Invalid body type"));
        return;
      }
      yield;
    } else if (e2.parts) {
      if (!n) {
        await r.abort(Error("Runtime exception: undefined part boundary"));
        return;
      }
      yield* g(n, e2.parts, r), yield;
    }
  }
  if (!l) {
    await r.abort(Error("At least one part is required"));
    return;
  }
  let b = d.encode(`\r
--${a}--`);
  await u(b).pipeTo(r, i);
}
var m, M, u, T, h, A, i, w, x;
var init_encodeMultipartMessage = __esm({
  "node_modules/.deno/@apeleghq+multipart-parser@1.0.18/node_modules/@apeleghq/multipart-parser/dist/encodeMultipartMessage.mjs"() {
    m = /;\s*boundary=(?:"([0-9a-zA-Z'()+_,\-./:=? ]{0,69}[0-9a-zA-Z'()+_,\-./:=?])"|([0-9a-zA-Z'+_\-.]{0,69}[0-9a-zA-Z'+_\-.]))/;
    M = (a) => new ReadableStream({ pull(r) {
      if (ArrayBuffer.isView(a)) r.enqueue(a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength));
      else if (a instanceof ArrayBuffer) r.enqueue(a);
      else throw new TypeError("Expected ArrayBuffer or an ArrayBuffer view.");
      r.close();
    } });
    u = M;
    T = /;\s*boundary=(?:"([^"]+)"|([^;",]+))/;
    h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+_-.";
    A = () => {
      let a = new Uint8Array(24);
      return globalThis.crypto.getRandomValues(a), Array.from(a).map((s) => h[s % h.length]).join("");
    };
    i = { preventClose: true };
    w = (a, s) => {
      let r = new TransformStream(), d = g(a, s, r.writable), y = false, l = r.readable.getReader();
      return new ReadableStream({ start(e2) {
        (async () => {
          for (; ; ) try {
            let n = await l.read();
            if (n.done) {
              let t = new Uint8Array([13, 10]);
              e2.enqueue(t.buffer.slice(t.byteOffset, t.byteOffset + t.byteLength)), e2.close();
              return;
            }
            e2.enqueue(n.value);
          } catch (n) {
            e2.error(n);
            return;
          }
        })().catch(() => {
        });
      }, async pull() {
        if (y) return;
        (await d.next()).done && (y = true, await r.writable.close());
      } });
    };
    x = w;
  }
});

// node_modules/.deno/@apeleghq+rfc8188@1.0.8/node_modules/@apeleghq/rfc8188/dist/decrypt.mjs
var v, I, B, m2, o, R, S;
var init_decrypt = __esm({
  "node_modules/.deno/@apeleghq+rfc8188@1.0.8/node_modules/@apeleghq/rfc8188/dist/decrypt.mjs"() {
    v = async (n, T2, w3, L) => {
      let u2 = await globalThis.crypto.subtle.importKey("raw", T2, "HKDF", false, ["deriveKey", "deriveBits"]), d = await globalThis.crypto.subtle.deriveKey({ name: "HKDF", hash: "SHA-256", info: n.cek_info, salt: w3 }, u2, n.params, false, L), A2 = await globalThis.crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", info: n.nonce_info, salt: w3 }, u2, n.nonce_length << 3);
      return [d, function* () {
        let s = new ArrayBuffer(n.nonce_length), e2 = new DataView(s), y = new Uint8Array(s), i2 = new Uint8Array(A2), b = 4294967295, f = (n.nonce_length >> 2) - 1, l = new Array(f).fill(0);
        for (; ; ) {
          for (let a = 0; a <= b; a++) {
            e2.setUint32(e2.byteLength - 4, a, false);
            let t = new Uint8Array(n.nonce_length);
            for (let r = 0; r < t.length; r++) t[r] = i2[r] ^ y[r];
            yield t;
          }
          for (let a = 0; a < f; a++) {
            if (a === f - 1 && l[a] === b) throw new RangeError("Maximum number of segments exceeded");
            if (l[a] = (l[a] + 1) % (b + 1), e2.setUint32(e2.byteLength - 4 * (a + 2), l[a], false), l[a] !== 0) break;
          }
        }
      }()];
    };
    I = v;
    B = (n) => ArrayBuffer.isView(n) ? new Uint8Array(n.buffer).subarray(n.byteOffset, n.byteOffset + n.byteLength) : new Uint8Array(n);
    m2 = B;
    o = { salt: {}, recordSize: {}, keyIdLen: {}, keyId: {}, payload: {}, done: {} };
    R = (n, T2, w3, L) => {
      let u2 = new Uint8Array(16), d, A2, E2, s = 0, e2 = 0, y = new Uint8Array(256), i2 = o.salt, b = new TransformStream({ start: () => {
      }, transform: async (f, l) => {
        let a = m2(f), t = 0;
        for (; t < f.byteLength; ) switch (i2) {
          case o.salt: {
            let r = a.subarray(t, t + u2.byteLength - e2);
            if (u2.set(r, e2), e2 += r.byteLength, t += r.byteLength, e2 === u2.byteLength) {
              e2 = 0, i2 = o.recordSize;
              continue;
            }
            break;
          }
          case o.recordSize: {
            let r = a.subarray(t, t + 4 - e2), g2 = new ArrayBuffer(4), h2 = new Uint8Array(g2), c = new DataView(g2);
            if (h2.set(r, e2), s |= c.getUint32(0, false), e2 += r.byteLength, t += r.byteLength, e2 === 4) {
              if (s <= n.tag_length + 1 || s > (L == null ? 4294967295 : Math.min(4294967295, L))) throw new RangeError("Invalid record size: " + s);
              e2 = 0, i2 = o.keyIdLen;
              continue;
            }
            break;
          }
          case o.keyIdLen: {
            y[0] = a[t++], i2 = o.keyId;
            continue;
          }
          case o.keyId: {
            let r = a.subarray(t, t + y[0] - e2);
            if (y.set(r, 1 + e2), e2 += r.byteLength, t += r.byteLength, e2 === y[0]) {
              let g2 = await w3(y.subarray(1, 1 + y[0]));
              w3 = void 0;
              let h2 = await I(n, g2, u2, ["decrypt"]);
              A2 = h2[0], E2 = h2[1], d = new Uint8Array(s), e2 = 0, i2 = o.payload;
              continue;
            }
            break;
          }
          case o.payload: {
            let r = a.subarray(t, t + s - e2);
            if (d.set(r, e2), e2 += r.byteLength, t += r.byteLength, e2 === s) {
              let h2 = E2.next().value, c = m2(await globalThis.crypto.subtle.decrypt({ name: n.params.name, iv: h2, tagLength: n.tag_length << 3 }, A2, d.subarray(0, e2))), p = c.byteLength - 1;
              for (; p > 0 && c[p] === 0; p--) ;
              if (c[p] === 2) {
                if (t !== f.byteLength) throw new Error("Unexpected terminal padding delimiter");
                i2 = o.done;
              } else if (c[p] !== 1) throw new Error("Invalid padding delimiter");
              l.enqueue(c.buffer.slice(0, p)), c.fill(0), e2 = 0;
              continue;
            }
            break;
          }
          default:
            throw new Error("Invalid state");
        }
      }, flush: async (f) => {
        switch (i2) {
          case o.done:
            return;
          case o.payload: {
            if (e2 < 1 + n.tag_length) throw new Error("Unexpected end of data");
            let a = E2.next().value, t = m2(await globalThis.crypto.subtle.decrypt({ name: n.params.name, iv: a, tagLength: n.tag_length << 3 }, A2, d.subarray(0, e2))), r = t.byteLength - 1;
            for (; r > 0 && t[r] === 0; r--) ;
            if (t[r] !== 2) throw new Error("Unexpected non-terminal padding delimiter");
            f.enqueue(t.buffer.slice(0, r)), t.fill(0);
            return;
          }
          default:
            throw new Error("Invalid state");
        }
      } });
      return T2.pipeThrough(b), b.readable;
    };
    S = R;
  }
});

// node_modules/.deno/@apeleghq+rfc8188@1.0.8/node_modules/@apeleghq/rfc8188/dist/encodings.mjs
var e;
var init_encodings = __esm({
  "node_modules/.deno/@apeleghq+rfc8188@1.0.8/node_modules/@apeleghq/rfc8188/dist/encodings.mjs"() {
    e = { params: { name: "AES-GCM", length: 256 }, get cek_info() {
      return new Uint8Array([67, 111, 110, 116, 101, 110, 116, 45, 69, 110, 99, 111, 100, 105, 110, 103, 58, 32, 97, 101, 115, 50, 53, 54, 103, 99, 109, 0]);
    }, get nonce_info() {
      return new Uint8Array([67, 111, 110, 116, 101, 110, 116, 45, 69, 110, 99, 111, 100, 105, 110, 103, 58, 32, 110, 111, 110, 99, 101, 0]);
    }, block_size: 16, tag_length: 16, nonce_length: 12 };
  }
});

// node_modules/.deno/@apeleghq+rfc8188@1.0.8/node_modules/@apeleghq/rfc8188/dist/encrypt.mjs
var R2, E, B2, w2, N, U, K;
var init_encrypt = __esm({
  "node_modules/.deno/@apeleghq+rfc8188@1.0.8/node_modules/@apeleghq/rfc8188/dist/encrypt.mjs"() {
    R2 = async (e2, b, f, i2) => {
      let A2 = await globalThis.crypto.subtle.importKey("raw", b, "HKDF", false, ["deriveKey", "deriveBits"]), y = await globalThis.crypto.subtle.deriveKey({ name: "HKDF", hash: "SHA-256", info: e2.cek_info, salt: f }, A2, e2.params, false, i2), u2 = await globalThis.crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", info: e2.nonce_info, salt: f }, A2, e2.nonce_length << 3);
      return [y, function* () {
        let L = new ArrayBuffer(e2.nonce_length), c = new DataView(L), h2 = new Uint8Array(L), a = new Uint8Array(u2), g2 = 4294967295, o2 = (e2.nonce_length >> 2) - 1, s = new Array(o2).fill(0);
        for (; ; ) {
          for (let t = 0; t <= g2; t++) {
            c.setUint32(c.byteLength - 4, t, false);
            let n = new Uint8Array(e2.nonce_length);
            for (let r = 0; r < n.length; r++) n[r] = a[r] ^ h2[r];
            yield n;
          }
          for (let t = 0; t < o2; t++) {
            if (t === o2 - 1 && s[t] === g2) throw new RangeError("Maximum number of segments exceeded");
            if (s[t] = (s[t] + 1) % (g2 + 1), c.setUint32(c.byteLength - 4 * (t + 2), s[t], false), s[t] !== 0) break;
          }
        }
      }()];
    };
    E = R2;
    B2 = (e2) => ArrayBuffer.isView(e2) ? new Uint8Array(e2.buffer).subarray(e2.byteOffset, e2.byteOffset + e2.byteLength) : new Uint8Array(e2);
    w2 = B2;
    N = () => {
      let e2 = new Uint8Array(16);
      return globalThis.crypto.getRandomValues(e2), e2;
    };
    U = async (e2, b, f, i2, A2, y) => {
      if (f <= e2.tag_length + 1 || f > 4294967295) throw new RangeError("Invalid record size: " + f);
      if (i2.byteLength > 255) throw new RangeError("Key ID too long");
      if (y && y.byteLength !== 16) throw new RangeError("Invald salt length: " + y.byteLength);
      let u2 = f - e2.tag_length - 1, l = y ? w2(y) : N(), [L, c] = await E(e2, A2, l, ["encrypt"]);
      A2 = void 0;
      let h2 = new Uint8Array(u2), a = 0, g2 = new TransformStream({ start: (o2) => {
        let s = l.byteLength + 4 + 1 + i2.byteLength, t = new ArrayBuffer(s);
        new Uint8Array(t, 0, l.byteLength).set(l);
        let r = new DataView(t, l.byteLength, 5);
        r.setUint32(0, f, false), r.setUint8(4, i2.byteLength);
        let d = new Uint8Array(t, l.byteLength + 4 + 1, i2.byteLength), m3 = w2(i2);
        d.set(m3), o2.enqueue(t);
      }, transform: async (o2, s) => {
        let t = w2(o2), n = 0;
        for (; n < o2.byteLength; ) {
          let r = t.subarray(n, n + u2 - a);
          if (h2.set(r, a), a += r.byteLength, n += r.byteLength, a === u2) {
            let m3 = c.next().value, p = new Uint8Array(u2 + 1);
            p.set(h2.subarray(0, a)), p[a] = 1;
            let T2 = await globalThis.crypto.subtle.encrypt({ name: e2.params.name, iv: m3, tagLength: e2.tag_length << 3 }, L, p);
            s.enqueue(T2), a = 0;
          }
        }
      }, flush: async (o2) => {
        let t = c.next().value, n = new Uint8Array(a + 1);
        n.set(h2.subarray(0, a)), n[a] = 2;
        let r = await globalThis.crypto.subtle.encrypt({ name: e2.params.name, iv: t, tagLength: e2.tag_length << 3 }, L, n);
        o2.enqueue(r), h2.fill(0), n.fill(0);
      } });
      return b.pipeThrough(g2), g2.readable;
    };
    K = U;
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/Secret.mjs
var wm, Secret;
var init_Secret = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/Secret.mjs"() {
    init_esm8();
    wm = /* @__PURE__ */ new WeakMap();
    Secret = class {
      static [serdesDeserializeSymbol](secret) {
        return new this(secret);
      }
      static [serdesSerializeSymbol](secret) {
        return wm.get(secret);
      }
      static get [serdesTagSymbol]() {
        return "__chelonia_Secret";
      }
      constructor(value) {
        wm.set(this, value);
      }
      valueOf() {
        return wm.get(this);
      }
    };
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/constants.mjs
var INVITE_STATUS;
var init_constants = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/constants.mjs"() {
    INVITE_STATUS = {
      REVOKED: "revoked",
      VALID: "valid",
      USED: "used"
    };
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/utils.mjs
import { Buffer as Buffer3 } from "node:buffer";
function eventsAfter2(contractID, { sinceHeight, limit, sinceHash, stream = true }) {
  if (!contractID) {
    throw new Error("Missing contract ID");
  }
  let lastUrl;
  const fetchEventsStreamReader = async () => {
    requestLimit = Math.min(limit ?? MAX_EVENTS_AFTER, remainingEvents);
    lastUrl = `${this.config.connectionURL}/eventsAfter/${contractID}/${sinceHeight}${Number.isInteger(requestLimit) ? `/${requestLimit}` : ""}`;
    const eventsResponse = await this.config.fetch(lastUrl, { signal });
    if (!eventsResponse.ok) {
      const msg = `${eventsResponse.status}: ${eventsResponse.statusText}`;
      if (eventsResponse.status === 404 || eventsResponse.status === 410)
        throw new ChelErrorResourceGone(msg, { cause: eventsResponse.status });
      throw new ChelErrorUnexpectedHttpResponseCode(msg, { cause: eventsResponse.status });
    }
    if (!eventsResponse.body)
      throw new Error("Missing body");
    latestHeight = parseInt(eventsResponse.headers.get("shelter-headinfo-height"), 10);
    if (!Number.isSafeInteger(latestHeight))
      throw new Error("Invalid latest height");
    requestCount++;
    return eventsResponse.body.getReader();
  };
  if (!Number.isSafeInteger(sinceHeight) || sinceHeight < 0) {
    throw new TypeError("Invalid since height value. Expected positive integer.");
  }
  const signal = this.abortController.signal;
  let requestCount = 0;
  let remainingEvents = limit ?? Number.POSITIVE_INFINITY;
  let eventsStreamReader;
  let latestHeight;
  let state = "fetch";
  let requestLimit;
  let count3;
  let buffer = "";
  let currentEvent;
  const s = new ReadableStream({
    // The pull function is called whenever the internal buffer of the stream
    // becomes empty and needs more data.
    async pull(controller) {
      try {
        for (; ; ) {
          switch (state) {
            // When in 'fetch' state, initiate a new fetch request to obtain a
            // stream reader for events.
            case "fetch": {
              eventsStreamReader = await fetchEventsStreamReader();
              state = "read-new-response";
              count3 = 0;
              break;
            }
            case "read-eos":
            // End of stream case
            case "read-new-response":
            // Just started reading a new response
            case "read": {
              const { done, value } = await eventsStreamReader.read();
              if (done) {
                if (remainingEvents === 0 || sinceHeight >= latestHeight) {
                  controller.close();
                  return;
                } else if (state === "read-new-response" || buffer) {
                  throw new Error("Invalid response: done too early");
                } else {
                  state = "fetch";
                  break;
                }
              }
              if (!value) {
                throw new Error("Invalid response: missing body");
              }
              buffer = buffer + Buffer3.from(value).toString().trim();
              if (!buffer)
                break;
              if (state === "read-new-response") {
                if (buffer[0] !== "[") {
                  throw new Error("Invalid response: no array start delimiter");
                }
                buffer = buffer.slice(1);
              } else if (state === "read-eos") {
                throw new Error("Invalid data at the end of response");
              }
              state = "events";
              break;
            }
            case "events": {
              const nextIdx = buffer.search(/(?<=\s*)[,\]]/);
              if (nextIdx < 0) {
                state = "read";
                break;
              }
              let enqueued = false;
              try {
                const eventValue = buffer.slice(0, nextIdx).trim();
                if (eventValue) {
                  if (count3 === requestLimit) {
                    throw new Error("Received too many events");
                  }
                  currentEvent = JSON.parse(b64ToStr(JSON.parse(eventValue))).message;
                  if (count3 === 0) {
                    const hash3 = SPMessage2.deserializeHEAD(currentEvent).hash;
                    const height = SPMessage2.deserializeHEAD(currentEvent).head.height;
                    if (height !== sinceHeight || sinceHash && sinceHash !== hash3) {
                      if (height === sinceHeight && sinceHash && sinceHash !== hash3) {
                        throw new ChelErrorForkedChain(`Forked chain: hash(${hash3}) !== since(${sinceHash})`);
                      } else {
                        throw new Error(`Unexpected data: hash(${hash3}) !== since(${sinceHash || ""}) or height(${height}) !== since(${sinceHeight})`);
                      }
                    }
                  }
                  if (count3++ !== 0 || requestCount !== 0) {
                    controller.enqueue(currentEvent);
                    enqueued = true;
                    remainingEvents--;
                  }
                }
                if (buffer[nextIdx] === "]") {
                  if (currentEvent) {
                    const deserialized = SPMessage2.deserializeHEAD(currentEvent);
                    sinceHeight = deserialized.head.height;
                    sinceHash = deserialized.hash;
                    state = "read-eos";
                  } else {
                    state = "eod";
                  }
                  buffer = buffer.slice(nextIdx + 1).trim();
                } else if (currentEvent) {
                  buffer = buffer.slice(nextIdx + 1).trimStart();
                } else {
                  throw new Error("Missing end delimiter");
                }
                if (enqueued) {
                  return;
                }
              } catch (e2) {
                console.error("[chelonia] Error during event parsing", e2);
                throw e2;
              }
              break;
            }
            case "eod": {
              if (remainingEvents === 0 || sinceHeight >= latestHeight) {
                controller.close();
              } else {
                throw new Error("Unexpected end of data");
              }
              return;
            }
          }
        }
      } catch (e2) {
        console.error("[eventsAfter] Error", { lastUrl }, e2);
        eventsStreamReader?.cancel("Error during pull").catch((e22) => {
          console.error("Error canceling underlying event stream reader on error", e2, e22);
        });
        throw e2;
      }
    }
  });
  if (stream)
    return s;
  return collectEventStream(s);
}
function buildShelterAuthorizationHeader(contractID, state) {
  if (!state)
    state = esm_default(this.config.stateSelector)[contractID];
  const SAKid = findKeyIdByName(state, "#sak");
  if (!SAKid) {
    throw new Error(`Missing #sak in ${contractID}`);
  }
  const SAK = this.transientSecretKeys[SAKid];
  if (!SAK) {
    throw new Error(`Missing secret #sak (${SAKid}) in ${contractID}`);
  }
  const deserializedSAK = typeof SAK === "string" ? deserializeKey2(SAK) : SAK;
  const nonceBytes = new Uint8Array(15);
  globalThis.crypto.getRandomValues(nonceBytes);
  const data = `${contractID} ${esm_default("chelonia/time")}.${Buffer3.from(nonceBytes).toString("base64")}`;
  return `shelter ${data}.${sign2(deserializedSAK, data)}`;
}
var MAX_EVENTS_AFTER, findKeyIdByName, findForeignKeysByContractID, findRevokedKeyIdsByName, findSuitableSecretKeyId, findSuitablePublicKeyIds, validateActionPermissions, validateKeyPermissions, validateKeyAddPermissions, validateKeyDelPermissions, validateKeyUpdatePermissions, keyAdditionProcessor, subscribeToForeignKeyContracts, recreateEvent, getContractIDfromKeyId, clearObject, reactiveClearObject, checkCanBeGarbageCollected, collectEventStream, logEvtError, handleFetchResult2;
var init_utils2 = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/utils.mjs"() {
    init_esm7();
    init_esm();
    init_esm5();
    init_SPMessage();
    init_Secret();
    init_constants();
    init_errors();
    init_events2();
    init_functions();
    init_signedData();
    MAX_EVENTS_AFTER = Number.parseInt(process.env.MAX_EVENTS_AFTER || "", 10) || Infinity;
    findKeyIdByName = (state, name) => state._vm?.authorizedKeys && Object.values(state._vm.authorizedKeys).find((k) => k.name === name && k._notAfterHeight == null)?.id;
    findForeignKeysByContractID = (state, contractID) => state._vm?.authorizedKeys && Object.values(state._vm.authorizedKeys).filter((k) => k._notAfterHeight == null && k.foreignKey?.includes(contractID)).map((k) => k.id);
    findRevokedKeyIdsByName = (state, name) => state._vm?.authorizedKeys && Object.values(state._vm.authorizedKeys || {}).filter((k) => k.name === name && k._notAfterHeight != null).map((k) => k.id);
    findSuitableSecretKeyId = (state, permissions, purposes, ringLevel, allowedActions) => {
      return state._vm?.authorizedKeys && Object.values(state._vm.authorizedKeys).filter((k) => {
        return k._notAfterHeight == null && k.ringLevel <= (ringLevel ?? Number.POSITIVE_INFINITY) && esm_default("chelonia/haveSecretKey", k.id) && (Array.isArray(permissions) ? permissions.reduce((acc, permission) => acc && (k.permissions === "*" || k.permissions.includes(permission)), true) : permissions === k.permissions) && purposes.reduce((acc, purpose) => acc && k.purpose.includes(purpose), true) && (Array.isArray(allowedActions) ? allowedActions.reduce((acc, action) => acc && (k.allowedActions === "*" || !!k.allowedActions?.includes(action)), true) : allowedActions ? allowedActions === k.allowedActions : true);
      }).sort((a, b) => b.ringLevel - a.ringLevel)[0]?.id;
    };
    findSuitablePublicKeyIds = (state, permissions, purposes, ringLevel) => {
      return state._vm?.authorizedKeys && Object.values(state._vm.authorizedKeys).filter((k) => k._notAfterHeight == null && k.ringLevel <= (ringLevel ?? Number.POSITIVE_INFINITY) && (Array.isArray(permissions) ? permissions.reduce((acc, permission) => acc && (k.permissions === "*" || k.permissions.includes(permission)), true) : permissions === k.permissions) && purposes.reduce((acc, purpose) => acc && k.purpose.includes(purpose), true)).sort((a, b) => b.ringLevel - a.ringLevel).map((k) => k.id);
    };
    validateActionPermissions = (msg, signingKey, state, opT, opV) => {
      const data = isSignedData(opV) ? opV.valueOf() : opV;
      if (signingKey.allowedActions !== "*" && (!Array.isArray(signingKey.allowedActions) || !signingKey.allowedActions.includes(data.action))) {
        logEvtError(msg, `Signing key ${signingKey.id} is not allowed for action ${data.action}`);
        return false;
      }
      if (isSignedData(opV)) {
        const s = opV;
        const innerSigningKey = state._vm?.authorizedKeys?.[s.signingKeyId];
        if (!innerSigningKey && msg._direction === "outgoing")
          return true;
        if (!innerSigningKey || !Array.isArray(innerSigningKey.purpose) || !innerSigningKey.purpose.includes("sig") || innerSigningKey.permissions !== "*" && (!Array.isArray(innerSigningKey.permissions) || !innerSigningKey.permissions.includes(opT + "#inner"))) {
          logEvtError(msg, `Signing key ${s.signingKeyId} is missing permissions for operation ${opT}`);
          return false;
        }
        if (innerSigningKey.allowedActions !== "*" && (!Array.isArray(innerSigningKey.allowedActions) || !innerSigningKey.allowedActions.includes(data.action + "#inner"))) {
          logEvtError(msg, `Signing key ${innerSigningKey.id} is not allowed for action ${data.action}`);
          return false;
        }
      }
      return true;
    };
    validateKeyPermissions = (msg, config, state, signingKeyId, opT, opV) => {
      const signingKey = state._vm?.authorizedKeys?.[signingKeyId];
      if (!signingKey || !Array.isArray(signingKey.purpose) || !signingKey.purpose.includes("sig") || signingKey.permissions !== "*" && (!Array.isArray(signingKey.permissions) || !signingKey.permissions.includes(opT))) {
        logEvtError(msg, `Signing key ${signingKeyId} is missing permissions for operation ${opT}`);
        return false;
      }
      if (opT === SPMessage2.OP_ACTION_UNENCRYPTED && !validateActionPermissions(msg, signingKey, state, opT, opV)) {
        return false;
      }
      if (!config.skipActionProcessing && opT === SPMessage2.OP_ACTION_ENCRYPTED && !validateActionPermissions(msg, signingKey, state, opT, opV.valueOf())) {
        return false;
      }
      return true;
    };
    validateKeyAddPermissions = function(contractID, signingKey, state, v2, skipPrivateCheck) {
      const signingKeyPermissions = Array.isArray(signingKey.permissions) ? new Set(signingKey.permissions) : signingKey.permissions;
      const signingKeyAllowedActions = Array.isArray(signingKey.allowedActions) ? new Set(signingKey.allowedActions) : signingKey.allowedActions;
      if (!state._vm?.authorizedKeys?.[signingKey.id])
        throw new Error("Singing key for OP_KEY_ADD or OP_KEY_UPDATE must exist in _vm.authorizedKeys. contractID=" + contractID + " signingKeyId=" + signingKey.id);
      const localSigningKey = state._vm.authorizedKeys[signingKey.id];
      v2.forEach((wk) => {
        const data = this.config.unwrapMaybeEncryptedData(wk);
        if (!data)
          return;
        const k = data.data;
        if (!skipPrivateCheck && signingKey._private && !data.encryptionKeyId) {
          throw new Error("Signing key is private but it tried adding a public key");
        }
        if (!Number.isSafeInteger(k.ringLevel) || k.ringLevel < localSigningKey.ringLevel) {
          throw new Error("Signing key has ringLevel " + localSigningKey.ringLevel + " but attempted to add or update a key with ringLevel " + k.ringLevel);
        }
        if (signingKeyPermissions !== "*") {
          if (!Array.isArray(k.permissions) || !k.permissions.reduce((acc, cv) => acc && signingKeyPermissions.has(cv), true)) {
            throw new Error("Unable to add or update a key with more permissions than the signing key. signingKey permissions: " + String(signingKey?.permissions) + "; key add permissions: " + String(k.permissions));
          }
        }
        if (signingKeyAllowedActions !== "*" && k.allowedActions) {
          if (!signingKeyAllowedActions || !Array.isArray(k.allowedActions) || !k.allowedActions.reduce((acc, cv) => acc && signingKeyAllowedActions.has(cv), true)) {
            throw new Error("Unable to add or update a key with more allowed actions than the signing key. signingKey allowed actions: " + String(signingKey?.allowedActions) + "; key add allowed actions: " + String(k.allowedActions));
          }
        }
      });
    };
    validateKeyDelPermissions = function(contractID, signingKey, state, v2) {
      if (!state._vm?.authorizedKeys?.[signingKey.id])
        throw new Error("Singing key for OP_KEY_DEL must exist in _vm.authorizedKeys. contractID=" + contractID + " signingKeyId=" + signingKey.id);
      const localSigningKey = state._vm.authorizedKeys[signingKey.id];
      v2.forEach((wid) => {
        const data = this.config.unwrapMaybeEncryptedData(wid);
        if (!data)
          return;
        const id = data.data;
        const k = state._vm.authorizedKeys[id];
        if (!k) {
          throw new Error("Nonexisting key ID " + id);
        }
        if (signingKey._private) {
          throw new Error("Signing key is private");
        }
        if (!k._private !== !data.encryptionKeyId) {
          throw new Error("_private attribute must be preserved");
        }
        if (!Number.isSafeInteger(k.ringLevel) || k.ringLevel < localSigningKey.ringLevel) {
          throw new Error("Signing key has ringLevel " + localSigningKey.ringLevel + " but attempted to remove a key with ringLevel " + k.ringLevel);
        }
      });
    };
    validateKeyUpdatePermissions = function(contractID, signingKey, state, v2) {
      const updatedMap = /* @__PURE__ */ Object.create(null);
      const keys = v2.map((wuk) => {
        const data = this.config.unwrapMaybeEncryptedData(wuk);
        if (!data)
          return void 0;
        const uk = data.data;
        const existingKey = state._vm.authorizedKeys[uk.oldKeyId];
        if (!existingKey) {
          throw new ChelErrorWarning("Missing old key ID " + uk.oldKeyId);
        }
        if (!existingKey._private !== !data.encryptionKeyId) {
          throw new Error("_private attribute must be preserved");
        }
        if (uk.name !== existingKey.name) {
          throw new Error("Name cannot be updated");
        }
        if (!uk.id !== !uk.data) {
          throw new Error("Both or none of the id and data attributes must be provided. Old key ID: " + uk.oldKeyId);
        }
        if (uk.data && existingKey.meta?.private && !uk.meta?.private) {
          throw new Error("Missing private key. Old key ID: " + uk.oldKeyId);
        }
        if (uk.id && uk.id !== uk.oldKeyId) {
          updatedMap[uk.id] = uk.oldKeyId;
        }
        const updatedKey = omit2(existingKey, ["_notAfterHeight", "_notBeforeHeight"]);
        if (uk.permissions) {
          updatedKey.permissions = uk.permissions;
        }
        if (uk.allowedActions) {
          updatedKey.allowedActions = uk.allowedActions;
        }
        if (uk.purpose) {
          updatedKey.purpose = uk.purpose;
        }
        if (uk.meta) {
          updatedKey.meta = uk.meta;
        }
        if (uk.id) {
          updatedKey.id = uk.id;
        }
        if (uk.data) {
          updatedKey.data = uk.data;
        }
        return updatedKey;
      }).filter(Boolean);
      validateKeyAddPermissions.call(this, contractID, signingKey, state, keys, true);
      return [keys, updatedMap];
    };
    keyAdditionProcessor = function(_msg, hash3, keys, state, contractID, _signingKey, internalSideEffectStack) {
      const decryptedKeys = [];
      const keysToPersist = [];
      const storeSecretKey = (key, decryptedKey) => {
        const decryptedDeserializedKey = deserializeKey2(decryptedKey);
        const transient = !!key.meta?.private?.transient;
        esm_default("chelonia/storeSecretKeys", new Secret([{
          key: decryptedDeserializedKey,
          // We always set this to true because this could be done from
          // an outgoing message
          transient: true
        }]));
        if (!transient) {
          keysToPersist.push({ key: decryptedDeserializedKey, transient });
        }
      };
      for (const wkey of keys) {
        const data = this.config.unwrapMaybeEncryptedData(wkey);
        if (!data)
          continue;
        const key = data.data;
        let decryptedKey;
        if (key.meta?.private && key.meta.private.content) {
          if (key.id && key.meta.private.content && !esm_default("chelonia/haveSecretKey", key.id, !key.meta.private.transient)) {
            const decryptedKeyResult = this.config.unwrapMaybeEncryptedData(key.meta.private.content);
            if (decryptedKeyResult) {
              if (decryptedKeyResult.encryptionKeyId == null) {
                throw new Error("Expected encrypted data but got unencrypted data for key with ID: " + key.id);
              }
              decryptedKey = decryptedKeyResult.data;
              decryptedKeys.push([key.id, decryptedKey]);
              storeSecretKey(key, decryptedKey);
            }
          }
        }
        if (key.name === "#sak") {
          if (data.encryptionKeyId) {
            throw new Error("#sak may not be encrypted");
          }
          if (key.permissions && (!Array.isArray(key.permissions) || key.permissions.length !== 0)) {
            throw new Error("#sak may not have permissions");
          }
          if (!Array.isArray(key.purpose) || key.purpose.length !== 1 || key.purpose[0] !== "sak") {
            throw new Error("#sak must have exactly one purpose: 'sak'");
          }
          if (key.ringLevel !== 0) {
            throw new Error("#sak must have ringLevel 0");
          }
        }
        if (key.name.startsWith("#inviteKey-")) {
          if (!state._vm.invites)
            state._vm.invites = /* @__PURE__ */ Object.create(null);
          const inviteSecret = decryptedKey || (has(this.transientSecretKeys, key.id) ? serializeKey2(this.transientSecretKeys[key.id], true) : void 0);
          state._vm.invites[key.id] = {
            status: INVITE_STATUS.VALID,
            initialQuantity: key.meta.quantity,
            quantity: key.meta.quantity,
            expires: key.meta.expires,
            inviteSecret,
            responses: []
          };
        }
        if (key.meta?.keyRequest?.contractID && findSuitableSecretKeyId(state, [SPMessage2.OP_KEY_ADD], ["sig"])) {
          const data2 = this.config.unwrapMaybeEncryptedData(key.meta.keyRequest.contractID);
          if (data2 && internalSideEffectStack) {
            const keyRequestContractID = data2.data;
            const reference = this.config.unwrapMaybeEncryptedData(key.meta.keyRequest.reference);
            internalSideEffectStack.push(() => {
              esm_default("chelonia/private/queueEvent", keyRequestContractID, () => {
                const rootState = esm_default(this.config.stateSelector);
                const originatingContractState = rootState[contractID];
                if (esm_default("chelonia/contract/hasKeyShareBeenRespondedBy", originatingContractState, keyRequestContractID, reference)) {
                  return;
                }
                if (!has(rootState, keyRequestContractID))
                  this.config.reactiveSet(rootState, keyRequestContractID, /* @__PURE__ */ Object.create(null));
                const targetState = rootState[keyRequestContractID];
                if (!targetState._volatile) {
                  this.config.reactiveSet(targetState, "_volatile", /* @__PURE__ */ Object.create(null));
                }
                if (!targetState._volatile.pendingKeyRequests) {
                  this.config.reactiveSet(rootState[keyRequestContractID]._volatile, "pendingKeyRequests", []);
                }
                if (targetState._volatile.pendingKeyRequests.some((pkr) => {
                  return pkr && pkr.contractID === contractID && pkr.hash === hash3;
                })) {
                  return;
                }
                targetState._volatile.pendingKeyRequests.push({ contractID, name: key.name, hash: hash3, reference: reference?.data });
                this.setPostSyncOp(contractID, "pending-keys-for-" + keyRequestContractID, ["okTurtles.events/emit", CONTRACT_IS_PENDING_KEY_REQUESTS, { contractID: keyRequestContractID }]);
              }).catch((e2) => {
                console.error("Error while setting or updating pendingKeyRequests", { contractID, keyRequestContractID, reference }, e2);
              });
            });
          }
        }
      }
      if (keysToPersist.length) {
        internalSideEffectStack?.push(() => {
          esm_default("chelonia/storeSecretKeys", new Secret(keysToPersist));
        });
      }
      internalSideEffectStack?.push(() => subscribeToForeignKeyContracts.call(this, contractID, state));
    };
    subscribeToForeignKeyContracts = function(contractID, state) {
      try {
        Object.values(state._vm.authorizedKeys).filter((key) => !!key.foreignKey && findKeyIdByName(state, key.name) != null).forEach((key) => {
          const foreignKey = String(key.foreignKey);
          const fkUrl = new URL(foreignKey);
          const foreignContract = fkUrl.pathname;
          const foreignKeyName = fkUrl.searchParams.get("keyName");
          if (!foreignContract || !foreignKeyName) {
            console.warn("Invalid foreign key: missing contract or key name", { contractID, keyId: key.id });
            return;
          }
          const rootState = esm_default(this.config.stateSelector);
          const signingKey = findSuitableSecretKeyId(state, [SPMessage2.OP_KEY_DEL], ["sig"], key.ringLevel);
          const canMirrorOperations = !!signingKey;
          if (!canMirrorOperations)
            return;
          if (Array.isArray(rootState?.[foreignContract]?._volatile?.watch)) {
            if (rootState[foreignContract]._volatile.watch.find((v2) => v2[0] === key.name && v2[1] === contractID))
              return;
          }
          if (!has(state._vm, "pendingWatch"))
            this.config.reactiveSet(state._vm, "pendingWatch", /* @__PURE__ */ Object.create(null));
          if (!has(state._vm.pendingWatch, foreignContract))
            this.config.reactiveSet(state._vm.pendingWatch, foreignContract, []);
          if (!state._vm.pendingWatch[foreignContract].find(([n]) => n === foreignKeyName)) {
            state._vm.pendingWatch[foreignContract].push([foreignKeyName, key.id]);
          }
          this.setPostSyncOp(contractID, `watchForeignKeys-${contractID}`, ["chelonia/private/watchForeignKeys", contractID]);
        });
      } catch (e2) {
        console.warn("Error at subscribeToForeignKeyContracts: " + (e2.message || e2));
      }
    };
    recreateEvent = (entry, state, contractsState) => {
      const { HEAD: previousHEAD, height: previousHeight, previousKeyOp } = contractsState || {};
      if (!previousHEAD) {
        throw new Error("recreateEvent: Giving up because the contract has been removed");
      }
      const head = entry.head();
      const [opT, rawOpV] = entry.rawOp();
      const recreateOperation = (opT2, rawOpV2) => {
        const opV = rawOpV2.valueOf();
        const recreateOperationInternal = (opT3, opV2) => {
          let newOpV2;
          if (opT3 === SPMessage2.OP_KEY_ADD) {
            if (!Array.isArray(opV2))
              throw new Error("Invalid message format");
            newOpV2 = opV2.filter((k) => {
              const kId = k.valueOf().id;
              return !has(state._vm.authorizedKeys, kId) || state._vm.authorizedKeys[kId]._notAfterHeight != null;
            });
            if (newOpV2.length === 0) {
              console.info("Omitting empty OP_KEY_ADD", { head });
            } else if (newOpV2.length === opV2.length) {
              return opV2;
            }
          } else if (opT3 === SPMessage2.OP_KEY_DEL) {
            if (!Array.isArray(opV2))
              throw new Error("Invalid message format");
            newOpV2 = opV2.filter((keyId3) => {
              const kId = Object(keyId3).valueOf();
              return has(state._vm.authorizedKeys, kId) && state._vm.authorizedKeys[kId]._notAfterHeight == null;
            });
            if (newOpV2.length === 0) {
              console.info("Omitting empty OP_KEY_DEL", { head });
            } else if (newOpV2.length === opV2.length) {
              return opV2;
            }
          } else if (opT3 === SPMessage2.OP_KEY_UPDATE) {
            if (!Array.isArray(opV2))
              throw new Error("Invalid message format");
            newOpV2 = opV2.filter((k) => {
              const oKId = k.valueOf().oldKeyId;
              const nKId = k.valueOf().id;
              return nKId == null || has(state._vm.authorizedKeys, oKId) && state._vm.authorizedKeys[oKId]._notAfterHeight == null;
            });
            if (newOpV2.length === 0) {
              console.info("Omitting empty OP_KEY_UPDATE", { head });
            } else if (newOpV2.length === opV2.length) {
              return opV2;
            }
          } else if (opT3 === SPMessage2.OP_ATOMIC) {
            if (!Array.isArray(opV2))
              throw new Error("Invalid message format");
            newOpV2 = opV2.map(([t, v2]) => [t, recreateOperationInternal(t, v2)]).filter(([, v2]) => !!v2);
            if (newOpV2.length === 0) {
              console.info("Omitting empty OP_ATOMIC", { head });
            } else if (newOpV2.length === opV2.length && newOpV2.reduce((acc, cv, i2) => acc && cv === opV2[i2], true)) {
              return opV2;
            } else {
              return newOpV2;
            }
          } else {
            return opV2;
          }
        };
        const newOpV = recreateOperationInternal(opT2, opV);
        if (newOpV === opV) {
          return rawOpV2;
        } else if (newOpV === void 0) {
          return;
        }
        if (typeof rawOpV2.recreate !== "function") {
          throw new Error("Unable to recreate operation");
        }
        return rawOpV2.recreate(newOpV);
      };
      const newRawOpV = recreateOperation(opT, rawOpV);
      if (!newRawOpV)
        return;
      const newOp = [opT, newRawOpV];
      entry = SPMessage2.cloneWith(head, newOp, { previousKeyOp, previousHEAD, height: previousHeight + 1 });
      return entry;
    };
    getContractIDfromKeyId = (contractID, signingKeyId, state) => {
      if (!signingKeyId)
        return;
      return signingKeyId && state._vm?.authorizedKeys?.[signingKeyId]?.foreignKey ? new URL(state._vm.authorizedKeys[signingKeyId].foreignKey).pathname : contractID;
    };
    clearObject = (o2) => {
      Object.keys(o2).forEach((k) => delete o2[k]);
    };
    reactiveClearObject = (o2, fn) => {
      Object.keys(o2).forEach((k) => fn(o2, k));
    };
    checkCanBeGarbageCollected = function(id) {
      const rootState = esm_default(this.config.stateSelector);
      return (
        // Check persistent references
        (!has(rootState.contracts, id) || !rootState.contracts[id] || !has(rootState.contracts[id], "references")) && // Check ephemeral references
        !has(this.ephemeralReferenceCount, id) && // Check foreign keys (i.e., that no keys from this contract are being watched)
        (!has(rootState, id) || !has(rootState[id], "_volatile") || !has(rootState[id]._volatile, "watch") || rootState[id]._volatile.watch.length === 0 || rootState[id]._volatile.watch.filter(([, cID]) => this.subscriptionSet.has(cID)).length === 0)
      );
    };
    collectEventStream = async (s) => {
      const reader = s.getReader();
      const r = [];
      for (; ; ) {
        const { done, value } = await reader.read();
        if (done)
          break;
        r.push(value);
      }
      return r;
    };
    logEvtError = (msg, ...args) => {
      if (msg._direction === "outgoing") {
        console.warn(...args);
      } else {
        console.error(...args);
      }
    };
    handleFetchResult2 = (type) => {
      return function(r) {
        if (!r.ok) {
          const msg = `${r.status}: ${r.statusText}`;
          if (r.status === 404 || r.status === 410)
            throw new ChelErrorResourceGone(msg, { cause: r.status });
          throw new ChelErrorUnexpectedHttpResponseCode(msg, { cause: r.status });
        }
        return r[type]();
      };
    };
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/files.mjs
import { Buffer as Buffer4 } from "node:buffer";
var supportsRequestStreams, streamToUint8Array, ArrayBufferToUint8ArrayStream, computeChunkDescriptors, fileStream, aes256gcmHandlers, noneHandlers, cipherHandlers, files_default;
var init_files = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/files.mjs"() {
    init_encodeMultipartMessage();
    init_decrypt();
    init_encodings();
    init_encrypt();
    init_esm7();
    init_bytes();
    init_esm();
    init_esm5();
    init_functions();
    init_utils2();
    supportsRequestStreams = typeof window !== "object" || (() => {
      let duplexAccessed = false;
      const hasContentType = new Request("", {
        body: new ReadableStream(),
        method: "POST",
        get duplex() {
          duplexAccessed = true;
          return "half";
        }
      }).headers.has("content-type");
      return duplexAccessed && !hasContentType;
    })();
    streamToUint8Array = async (s) => {
      const reader = s.getReader();
      const chunks = [];
      let length2 = 0;
      for (; ; ) {
        const result = await reader.read();
        if (result.done)
          break;
        chunks.push(coerce(result.value));
        length2 += result.value.byteLength;
      }
      const body = new Uint8Array(length2);
      chunks.reduce((offset, chunk) => {
        body.set(chunk, offset);
        return offset + chunk.byteLength;
      }, 0);
      return body;
    };
    ArrayBufferToUint8ArrayStream = async function(connectionURL, s) {
      if (supportsRequestStreams === true) {
        await this.config.fetch(`${connectionURL}/streams-test`, {
          method: "POST",
          body: new ReadableStream({ start(c) {
            c.enqueue(Buffer4.from("ok"));
            c.close();
          } }),
          duplex: "half"
        }).then((r) => {
          if (!r.ok)
            throw new Error("Unexpected response");
          supportsRequestStreams = 2;
        }).catch(() => {
          console.info("files: Disabling streams support because the streams test failed");
          supportsRequestStreams = false;
        });
      }
      if (!supportsRequestStreams) {
        return await streamToUint8Array(s);
      }
      return s.pipeThrough(
        // eslint-disable-next-line no-undef
        new TransformStream({
          transform(chunk, controller) {
            controller.enqueue(coerce(chunk));
          }
        })
      );
    };
    computeChunkDescriptors = (inStream) => {
      let length2 = 0;
      const [lengthStream, cidStream] = inStream.tee();
      const lengthPromise = new Promise((resolve4, reject) => {
        lengthStream.pipeTo(new WritableStream({
          write(chunk) {
            length2 += chunk.byteLength;
          },
          close() {
            resolve4(length2);
          },
          abort(reason) {
            reject(reason);
          }
        }));
      });
      const cidPromise = createCIDfromStream(cidStream, multicodes3.SHELTER_FILE_CHUNK);
      return Promise.all([lengthPromise, cidPromise]);
    };
    fileStream = (chelonia, manifest2) => {
      const dataGenerator = async function* () {
        let readSize = 0;
        for (const chunk of manifest2.chunks) {
          if (!Array.isArray(chunk) || typeof chunk[0] !== "number" || typeof chunk[1] !== "string") {
            throw new Error("Invalid chunk descriptor");
          }
          const chunkResponse = await chelonia.config.fetch(`${chelonia.config.connectionURL}/file/${chunk[1]}`, {
            method: "GET",
            signal: chelonia.abortController.signal
          });
          if (!chunkResponse.ok) {
            throw new Error("Unable to retrieve manifest");
          }
          const chunkBinary = await chunkResponse.arrayBuffer();
          if (chunkBinary.byteLength !== chunk[0])
            throw new Error("mismatched chunk size");
          readSize += chunkBinary.byteLength;
          if (readSize > manifest2.size)
            throw new Error("read size exceeds declared size");
          if (createCID3(coerce(chunkBinary), multicodes3.SHELTER_FILE_CHUNK) !== chunk[1])
            throw new Error("mismatched chunk hash");
          yield chunkBinary;
        }
        if (readSize !== manifest2.size)
          throw new Error("mismatched size");
      };
      const dataIterator = dataGenerator();
      return new ReadableStream({
        async pull(controller) {
          try {
            const chunk = await dataIterator.next();
            if (chunk.done) {
              controller.close();
              return;
            }
            controller.enqueue(chunk.value);
          } catch (e2) {
            controller.error(e2);
          }
        }
      });
    };
    aes256gcmHandlers = {
      upload: (_chelonia, manifestOptions) => {
        const params = manifestOptions["cipher-params"];
        let IKM = params?.IKM;
        const recordSize = params?.rs ?? 1 << 16;
        if (!IKM) {
          IKM = new Uint8Array(33);
          self.crypto.getRandomValues(IKM);
        }
        const keyId3 = blake32Hash2("aes256gcm-keyId" + blake32Hash2(IKM)).slice(-8);
        const binaryKeyId = Buffer4.from(keyId3);
        return {
          cipherParams: {
            keyId: keyId3
          },
          streamHandler: async (stream) => {
            return await K(e, stream, recordSize, binaryKeyId, IKM);
          },
          downloadParams: {
            IKM: Buffer4.from(IKM).toString("base64"),
            rs: recordSize
          }
        };
      },
      download: (chelonia, downloadParams, manifest2) => {
        const IKMb64 = downloadParams.IKM;
        if (!IKMb64) {
          throw new Error("Missing IKM in downloadParams");
        }
        const IKM = Buffer4.from(IKMb64, "base64");
        const keyId3 = blake32Hash2("aes256gcm-keyId" + blake32Hash2(IKM)).slice(-8);
        if (!manifest2["cipher-params"] || !manifest2["cipher-params"].keyId) {
          throw new Error("Missing cipher-params");
        }
        if (keyId3 !== manifest2["cipher-params"].keyId) {
          throw new Error("Key ID mismatch");
        }
        const maxRecordSize = downloadParams.rs ?? 1 << 27;
        return {
          payloadHandler: async () => {
            const bytes = await streamToUint8Array(S(e, fileStream(chelonia, manifest2), (actualKeyId) => {
              if (Buffer4.from(actualKeyId).toString() !== keyId3) {
                throw new Error("Invalid key ID");
              }
              return IKM;
            }, maxRecordSize));
            return new Blob([bytes], { type: manifest2.type || "application/octet-stream" });
          }
        };
      }
    };
    noneHandlers = {
      upload: () => {
        return {
          cipherParams: void 0,
          streamHandler: (stream) => {
            return stream;
          },
          downloadParams: void 0
        };
      },
      download: (chelonia, _downloadParams, manifest2) => {
        return {
          payloadHandler: async () => {
            const bytes = await streamToUint8Array(fileStream(chelonia, manifest2));
            return new Blob([bytes], { type: manifest2.type || "application/octet-stream" });
          }
        };
      }
    };
    cipherHandlers = {
      aes256gcm: aes256gcmHandlers,
      none: noneHandlers
    };
    files_default = esm_default("sbp/selectors/register", {
      "chelonia/fileUpload": async function(chunks, manifestOptions, { billableContractID } = {}) {
        if (!Array.isArray(chunks))
          chunks = [chunks];
        const chunkDescriptors = [];
        const cipherHandler = await cipherHandlers[manifestOptions.cipher]?.upload?.(this, manifestOptions);
        if (!cipherHandler)
          throw new Error("Unsupported cipher");
        const cipherParams = cipherHandler.cipherParams;
        const transferParts = await Promise.all(chunks.map(async (chunk, i2) => {
          const stream2 = chunk.stream();
          const encryptedStream = await cipherHandler.streamHandler(stream2);
          const [body, s] = encryptedStream.tee();
          chunkDescriptors.push(computeChunkDescriptors(s));
          return {
            headers: new Headers([
              ["content-disposition", `form-data; name="${i2}"; filename="${i2}"`],
              ["content-type", "application/octet-stream"]
            ]),
            body
          };
        }));
        transferParts.push({
          headers: new Headers([
            ["content-disposition", 'form-data; name="manifest"; filename="manifest.json"'],
            ["content-type", "application/vnd.shelter.filemanifest"]
          ]),
          body: new ReadableStream({
            async start(controller) {
              const chunks2 = await Promise.all(chunkDescriptors);
              const manifest2 = {
                version: "1.0.0",
                // ?? undefined coerces null and undefined to undefined
                // This ensures that null or undefined values don't make it to the
                // JSON (otherwise, null values _would_ be stringified as 'null')
                type: manifestOptions.type ?? void 0,
                meta: manifestOptions.meta ?? void 0,
                cipher: manifestOptions.cipher,
                "cipher-params": cipherParams,
                size: chunks2.reduce((acc, [cv]) => acc + cv, 0),
                chunks: chunks2,
                "name-map": manifestOptions["name-map"] ?? void 0,
                alternatives: manifestOptions.alternatives ?? void 0
              };
              controller.enqueue(Buffer4.from(JSON.stringify(manifest2)));
              controller.close();
            }
          })
        });
        const boundary = typeof self.crypto?.randomUUID === "function" ? self.crypto.randomUUID() : new Array(36).fill("").map(() => "abcdefghijklmnopqrstuvwxyz"[(0, Math.random)() * 26 | 0]).join("");
        const stream = x(boundary, transferParts);
        const deletionToken = "deletionToken" + generateSalt2();
        const deletionTokenHash = blake32Hash2(deletionToken);
        const uploadResponse = await this.config.fetch(`${this.config.connectionURL}/file`, {
          method: "POST",
          signal: this.abortController.signal,
          body: await ArrayBufferToUint8ArrayStream.call(this, this.config.connectionURL, stream),
          headers: new Headers([
            ...billableContractID ? [["authorization", buildShelterAuthorizationHeader.call(this, billableContractID)]] : [],
            ["content-type", `multipart/form-data; boundary=${boundary}`],
            ["shelter-deletion-token-digest", deletionTokenHash]
          ]),
          duplex: "half"
        });
        if (!uploadResponse.ok)
          throw new Error("Error uploading file");
        return {
          download: {
            manifestCid: await uploadResponse.text(),
            downloadParams: cipherHandler.downloadParams
          },
          delete: deletionToken
        };
      },
      "chelonia/fileDownload": async function(downloadOptions, manifestChecker) {
        const { manifestCid, downloadParams } = downloadOptions.valueOf();
        const manifestResponse = await this.config.fetch(`${this.config.connectionURL}/file/${manifestCid}`, {
          method: "GET",
          signal: this.abortController.signal
        });
        if (!manifestResponse.ok) {
          throw new Error("Unable to retrieve manifest");
        }
        const manifestBinary = await manifestResponse.arrayBuffer();
        if (createCID3(coerce(manifestBinary), multicodes3.SHELTER_FILE_MANIFEST) !== manifestCid)
          throw new Error("mismatched manifest hash");
        const manifest2 = JSON.parse(Buffer4.from(manifestBinary).toString());
        if (typeof manifest2 !== "object")
          throw new Error("manifest format is invalid");
        if (manifest2.version !== "1.0.0")
          throw new Error("unsupported manifest version");
        if (!Array.isArray(manifest2.chunks))
          throw new Error("missing required field: chunks");
        if (manifestChecker) {
          const proceed = await manifestChecker?.(manifest2);
          if (!proceed)
            return false;
        }
        const cipherHandler = await cipherHandlers[manifest2.cipher]?.download?.(this, downloadParams, manifest2);
        if (!cipherHandler)
          throw new Error("Unsupported cipher");
        return cipherHandler.payloadHandler();
      },
      "chelonia/fileDelete": async function(manifestCid, credentials = {}) {
        if (!manifestCid) {
          throw new TypeError("A manifest CID must be provided");
        }
        if (!Array.isArray(manifestCid))
          manifestCid = [manifestCid];
        return await Promise.allSettled(manifestCid.map(async (cid) => {
          const hasCredential = has(credentials, cid);
          const hasToken = has(credentials[cid], "token") && credentials[cid].token;
          const hasBillableContractID = has(credentials[cid], "billableContractID") && credentials[cid].billableContractID;
          if (!hasCredential || hasToken === hasBillableContractID) {
            throw new TypeError(`Either a token or a billable contract ID must be provided for ${cid}`);
          }
          const response = await this.config.fetch(`${this.config.connectionURL}/deleteFile/${cid}`, {
            method: "POST",
            signal: this.abortController.signal,
            headers: new Headers([
              [
                "authorization",
                hasToken ? `bearer ${credentials[cid].token.valueOf()}` : buildShelterAuthorizationHeader.call(this, credentials[cid].billableContractID)
              ]
            ])
          });
          if (!response.ok) {
            throw new Error(`Unable to delete file ${cid}`);
          }
        }));
      }
    });
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/db.mjs
import { Buffer as Buffer5 } from "node:buffer";
var headPrefix2, getContractIdFromLogHead, getLogHead, checkKey3, parsePrefixableKey2, prefixHandlers2, dbPrimitiveSelectors, db_default;
var init_db = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/db.mjs"() {
    init_esm3();
    init_esm2();
    init_esm();
    init_SPMessage();
    init_errors();
    headPrefix2 = "head=";
    getContractIdFromLogHead = (key) => {
      if (!key.startsWith(headPrefix2))
        return;
      return key.slice(headPrefix2.length);
    };
    getLogHead = (contractID) => `${headPrefix2}${contractID}`;
    checkKey3 = (key) => {
      if (/[\x00-\x1f\x7f\t\\/<>:"|?*]/.test(key)) {
        throw new Error(`bad key: ${JSON.stringify(key)}`);
      }
    };
    parsePrefixableKey2 = (key) => {
      const i2 = key.indexOf(":");
      if (i2 === -1) {
        return ["", key];
      }
      const prefix = key.slice(0, i2 + 1);
      if (prefix in prefixHandlers2) {
        return [prefix, key.slice(prefix.length)];
      }
      throw new ChelErrorDBConnection(`Unknown prefix in '${key}'.`);
    };
    prefixHandlers2 = {
      // Decode buffers, but don't transform other values.
      "": (value) => Buffer5.isBuffer(value) ? value.toString("utf8") : value,
      "any:": (value) => value
      /*
      // 2025-03-24: Commented out because it's not used; currently, only `any:`
      // is used in the `/file` route.
      // Throw if the value if not a buffer.
      'blob:': value => {
        if (Buffer.isBuffer(value)) {
          return value
        }
        throw new ChelErrorDBConnection('Unexpected value: expected a buffer.')
      }
      */
    };
    esm_default("sbp/selectors/unsafe", ["chelonia.db/get", "chelonia.db/set", "chelonia.db/delete"]);
    dbPrimitiveSelectors = process.env.LIGHTWEIGHT_CLIENT === "true" ? {
      "chelonia.db/get": function(key) {
        const id = getContractIdFromLogHead(key);
        if (!id)
          return Promise.resolve();
        const state = esm_default("chelonia/rootState").contracts[id];
        const value = state?.HEAD ? JSON.stringify({
          HEAD: state.HEAD,
          height: state.height,
          previousKeyOp: state.previousKeyOp
        }) : void 0;
        return Promise.resolve(value);
      },
      "chelonia.db/set": function() {
        return Promise.resolve();
      },
      "chelonia.db/delete": function() {
        return Promise.resolve(true);
      }
    } : {
      // eslint-disable-next-line require-await
      "chelonia.db/get": async function(prefixableKey) {
        const [prefix, key] = parsePrefixableKey2(prefixableKey);
        const value = esm_default("okTurtles.data/get", key);
        if (value === void 0) {
          return;
        }
        return prefixHandlers2[prefix](value);
      },
      // eslint-disable-next-line require-await
      "chelonia.db/set": async function(key, value) {
        checkKey3(key);
        return esm_default("okTurtles.data/set", key, value);
      },
      // eslint-disable-next-line require-await
      "chelonia.db/delete": async function(key) {
        return esm_default("okTurtles.data/delete", key);
      }
    };
    db_default = esm_default("sbp/selectors/register", {
      ...dbPrimitiveSelectors,
      "chelonia/db/getEntryMeta": async (contractID, height) => {
        const entryMetaJson = await esm_default("chelonia.db/get", `_private_hidx=${contractID}#${height}`);
        if (!entryMetaJson)
          return;
        return JSON.parse(entryMetaJson);
      },
      "chelonia/db/setEntryMeta": async (contractID, height, entryMeta) => {
        const entryMetaJson = JSON.stringify(entryMeta);
        await esm_default("chelonia.db/set", `_private_hidx=${contractID}#${height}`, entryMetaJson);
      },
      "chelonia/db/latestHEADinfo": async (contractID) => {
        const r = await esm_default("chelonia.db/get", getLogHead(contractID));
        return r && JSON.parse(r);
      },
      "chelonia/db/deleteLatestHEADinfo": (contractID) => {
        return esm_default("chelonia.db/set", getLogHead(contractID), "");
      },
      "chelonia/db/getEntry": async function(hash3) {
        try {
          const value = await esm_default("chelonia.db/get", hash3);
          if (!value)
            throw new Error(`no entry for ${hash3}!`);
          return SPMessage2.deserialize(value, this.transientSecretKeys, void 0, this.config.unwrapMaybeEncryptedData);
        } catch (e2) {
          throw new ChelErrorDBConnection(`${e2.name} during getEntry: ${e2.message}`);
        }
      },
      "chelonia/db/addEntry": function(entry) {
        return esm_default("okTurtles.eventQueue/queueEvent", `chelonia/db/${entry.contractID()}`, [
          "chelonia/private/db/addEntry",
          entry
        ]);
      },
      // NEVER call this directly yourself! _always_ call 'chelonia/db/addEntry' instead
      "chelonia/private/db/addEntry": async function(entry) {
        try {
          const { previousHEAD: entryPreviousHEAD, previousKeyOp: entryPreviousKeyOp, height: entryHeight } = entry.head();
          const contractID = entry.contractID();
          if (await esm_default("chelonia.db/get", entry.hash())) {
            console.warn(`[chelonia.db] entry exists: ${entry.hash()}`);
            return entry.hash();
          }
          const HEADinfo = await esm_default("chelonia/db/latestHEADinfo", contractID);
          if (!entry.isFirstMessage()) {
            if (!HEADinfo) {
              throw new Error(`No latest HEAD for ${contractID} when attempting to process entry with previous HEAD ${entryPreviousHEAD} at height ${entryHeight}`);
            }
            const { HEAD: contractHEAD, previousKeyOp: contractPreviousKeyOp, height: contractHeight } = HEADinfo;
            if (entryPreviousHEAD !== contractHEAD) {
              console.warn(`[chelonia.db] bad previousHEAD: ${entryPreviousHEAD}! Expected: ${contractHEAD} for contractID: ${contractID}`);
              throw new ChelErrorDBBadPreviousHEAD(`bad previousHEAD: ${entryPreviousHEAD}. Expected ${contractHEAD} for contractID: ${contractID}`);
            } else if (entryPreviousKeyOp !== contractPreviousKeyOp) {
              console.error(`[chelonia.db] bad previousKeyOp: ${entryPreviousKeyOp}! Expected: ${contractPreviousKeyOp} for contractID: ${contractID}`);
              throw new ChelErrorDBBadPreviousHEAD(`bad previousKeyOp: ${entryPreviousKeyOp}. Expected ${contractPreviousKeyOp} for contractID: ${contractID}`);
            } else if (!Number.isSafeInteger(entryHeight) || entryHeight !== contractHeight + 1) {
              console.error(`[chelonia.db] bad height: ${entryHeight}! Expected: ${contractHeight + 1} for contractID: ${contractID}`);
              throw new ChelErrorDBBadPreviousHEAD(`[chelonia.db] bad height: ${entryHeight}! Expected: ${contractHeight + 1} for contractID: ${contractID}`);
            }
          } else {
            if (HEADinfo) {
              console.error(`[chelonia.db] bad previousHEAD: ${entryPreviousHEAD}! Expected: <null> for contractID: ${contractID}`);
              throw new ChelErrorDBBadPreviousHEAD(`bad previousHEAD: ${entryPreviousHEAD}. Expected <null> for contractID: ${contractID}`);
            } else if (entryHeight !== 0) {
              console.error(`[chelonia.db] bad height: ${entryHeight}! Expected: 0 for contractID: ${contractID}`);
              throw new ChelErrorDBBadPreviousHEAD(`[chelonia.db] bad height: ${entryHeight}! Expected: 0 for contractID: ${contractID}`);
            }
          }
          await esm_default("chelonia.db/set", entry.hash(), entry.serialize());
          await esm_default("chelonia.db/set", getLogHead(contractID), JSON.stringify({
            HEAD: entry.hash(),
            previousKeyOp: entry.isKeyOp() ? entry.hash() : entry.previousKeyOp(),
            height: entry.height()
          }));
          console.debug(`[chelonia.db] HEAD for ${contractID} updated to:`, entry.hash());
          await esm_default("chelonia/db/setEntryMeta", contractID, entryHeight, {
            // The hash is used for reverse lookups (height to CID)
            hash: entry.hash(),
            // The date isn't currently used, but will be used for filtering messages
            date: (/* @__PURE__ */ new Date()).toISOString(),
            // isKeyOp is used for filtering messages (the actual filtering is
            // done more efficiently a separate index key, but `isKeyOp` allows
            // us to bootstrap this process without having to load the full message)
            // The separate index key bears the prefix `_private_keyop_idx_`.
            ...entry.isKeyOp() && { isKeyOp: true }
          });
          return entry.hash();
        } catch (e2) {
          if (e2.name.includes("ErrorDB")) {
            throw e2;
          }
          throw new ChelErrorDBConnection(`${e2.name} during addEntry: ${e2.message}`);
        }
      },
      "chelonia/db/lastEntry": async function(contractID) {
        try {
          const latestHEADinfo = await esm_default("chelonia/db/latestHEADinfo", contractID);
          if (!latestHEADinfo)
            throw new Error(`contract ${contractID} has no latest hash!`);
          return esm_default("chelonia/db/getEntry", latestHEADinfo.HEAD);
        } catch (e2) {
          throw new ChelErrorDBConnection(`${e2.name} during lastEntry: ${e2.message}`);
        }
      }
    });
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/internals.mjs
var missingDecryptionKeyIdsMap, getMsgMeta, keysToMap, keyRotationHelper, internals_default, eventsToReingest, reprocessDebounced, handleEvent, notImplemented;
var init_internals = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/internals.mjs"() {
    init_esm();
    init_functions();
    init_esm5();
    init_SPMessage();
    init_Secret();
    init_constants();
    init_esm7();
    init_db();
    init_encryptedData();
    init_errors();
    init_events2();
    init_utils2();
    init_signedData();
    missingDecryptionKeyIdsMap = /* @__PURE__ */ new WeakMap();
    getMsgMeta = function(message, contractID, state, index) {
      const signingKeyId = message.signingKeyId();
      let innerSigningKeyId = null;
      const config = this.config;
      const result = {
        signingKeyId,
        get signingContractID() {
          return getContractIDfromKeyId(contractID, signingKeyId, state);
        },
        get innerSigningKeyId() {
          if (innerSigningKeyId === null) {
            const value = message.message();
            const data = config.unwrapMaybeEncryptedData(value);
            if (data?.data && isSignedData(data.data)) {
              innerSigningKeyId = data.data.signingKeyId;
            } else {
              innerSigningKeyId = void 0;
            }
            return innerSigningKeyId;
          }
        },
        get innerSigningContractID() {
          return getContractIDfromKeyId(contractID, result.innerSigningKeyId, state);
        },
        index
      };
      return result;
    };
    keysToMap = function(keys_, height, authorizedKeys) {
      const keys = keys_.map((key) => {
        const data = this.config.unwrapMaybeEncryptedData(key);
        if (!data)
          return void 0;
        if (data.encryptionKeyId) {
          data.data._private = data.encryptionKeyId;
        }
        return data.data;
      }).filter(Boolean);
      const keysCopy = cloneDeep2(keys);
      return Object.fromEntries(keysCopy.map((key) => {
        key._notBeforeHeight = height;
        if (authorizedKeys?.[key.id]) {
          if (authorizedKeys[key.id]._notAfterHeight == null) {
            throw new ChelErrorKeyAlreadyExists(`Cannot set existing unrevoked key: ${key.id}`);
          }
          key._notBeforeHeight = Math.min(height, authorizedKeys[key.id]._notBeforeHeight ?? 0);
        } else {
          key._notBeforeHeight = height;
        }
        delete key._notAfterHeight;
        return [key.id, key];
      }));
    };
    keyRotationHelper = (contractID, state, config, updatedKeysMap, requiredPermissions, outputSelector, outputMapper, internalSideEffectStack) => {
      if (!internalSideEffectStack || !Array.isArray(state._volatile?.watch))
        return;
      const rootState = esm_default(config.stateSelector);
      const watchMap = /* @__PURE__ */ Object.create(null);
      state._volatile.watch.forEach(([name, cID]) => {
        if (!updatedKeysMap[name] || watchMap[cID] === null) {
          return;
        }
        if (!watchMap[cID]) {
          if (!rootState.contracts[cID]?.type || !findSuitableSecretKeyId(rootState[cID], [SPMessage2.OP_KEY_UPDATE], ["sig"])) {
            watchMap[cID] = null;
            return;
          }
          watchMap[cID] = [];
        }
        watchMap[cID].push(name);
      });
      Object.entries(watchMap).forEach(([cID, names]) => {
        if (!Array.isArray(names) || !names.length)
          return;
        const [keyNamesToUpdate, signingKeyId] = names.map((name) => {
          const foreignContractKey = rootState[cID]?._vm?.authorizedKeys?.[updatedKeysMap[name].oldKeyId];
          if (!foreignContractKey)
            return void 0;
          const signingKeyId2 = findSuitableSecretKeyId(rootState[cID], requiredPermissions, ["sig"], foreignContractKey.ringLevel);
          if (signingKeyId2) {
            return [[name, foreignContractKey.name], signingKeyId2, rootState[cID]._vm.authorizedKeys[signingKeyId2].ringLevel];
          }
          return void 0;
        }).filter(Boolean).reduce((acc, [name, signingKeyId2, ringLevel]) => {
          acc[0].push(name);
          return ringLevel < acc[2] ? [acc[0], signingKeyId2, ringLevel] : acc;
        }, [[], void 0, Number.POSITIVE_INFINITY]);
        if (!signingKeyId)
          return;
        const contractName = rootState.contracts[cID]?.type;
        internalSideEffectStack?.push(() => {
          esm_default(outputSelector, {
            contractID: cID,
            contractName,
            data: keyNamesToUpdate.map(outputMapper).map((v2) => {
              return v2;
            }),
            signingKeyId
          }).catch((e2) => {
            console.warn(`Error mirroring key operation (${outputSelector}) from ${contractID} to ${cID}: ${e2?.message || e2}`);
          });
        });
      });
    };
    internals_default = esm_default("sbp/selectors/register", {
      //     DO NOT CALL ANY OF THESE YOURSELF!
      "chelonia/private/state": function() {
        return this.state;
      },
      "chelonia/private/invoke": function(instance, invocation) {
        if (this._instance !== instance) {
          console.info("['chelonia/private/invoke] Not proceeding with invocation as Chelonia was restarted", { invocation });
          return;
        }
        if (Array.isArray(invocation)) {
          return esm_default(...invocation);
        } else if (typeof invocation === "function") {
          return invocation();
        } else {
          throw new TypeError(`[chelonia/private/invoke] Expected invocation to be an array or a function. Saw ${typeof invocation} instead.`);
        }
      },
      "chelonia/private/queueEvent": function(queueName, invocation) {
        return esm_default("okTurtles.eventQueue/queueEvent", queueName, ["chelonia/private/invoke", this._instance, invocation]);
      },
      "chelonia/private/verifyManifestSignature": function(contractName, manifestHash, manifest2) {
        if (!has(manifest2, "signature") || typeof manifest2.signature.keyId !== "string" || typeof manifest2.signature.value !== "string") {
          throw new Error(`Invalid or missing signature field for manifest ${manifestHash} (named ${contractName})`);
        }
        const rootState = esm_default(this.config.stateSelector);
        if (!has(rootState, "contractSigningKeys")) {
          this.config.reactiveSet(rootState, "contractSigningKeys", /* @__PURE__ */ Object.create(null));
        }
        const contractNameLookupKey = `name:${contractName}`;
        let signatureValidated = false;
        if (process.env.UNSAFE_TRUST_ALL_MANIFEST_SIGNING_KEYS !== "true" && has(rootState.contractSigningKeys, contractNameLookupKey)) {
          console.info(`[chelonia] verifying signature for ${manifestHash} with an existing key`);
          if (!has(rootState.contractSigningKeys[contractNameLookupKey], manifest2.signature.keyId)) {
            console.error(`The manifest with ${manifestHash} (named ${contractName}) claims to be signed with a key with ID ${manifest2.signature.keyId}, which is not trusted. The trusted key IDs for this name are:`, Object.keys(rootState.contractSigningKeys[contractNameLookupKey]));
            throw new Error(`Invalid or missing signature in manifest ${manifestHash} (named ${contractName}). It claims to be signed with a key with ID ${manifest2.signature.keyId}, which has not been authorized for this contract before.`);
          }
          const signingKey = rootState.contractSigningKeys[contractNameLookupKey][manifest2.signature.keyId];
          verifySignature2(signingKey, manifest2.body + manifest2.head, manifest2.signature.value);
          console.info(`[chelonia] successful signature verification for ${manifestHash} (named ${contractName}) using the already-trusted key ${manifest2.signature.keyId}.`);
          signatureValidated = true;
        }
        const body = JSON.parse(manifest2.body);
        if (!signatureValidated) {
          console.info(`[chelonia] verifying signature for ${manifestHash} (named ${contractName}) for the first time`);
          if (!has(body, "signingKeys") || !Array.isArray(body.signingKeys)) {
            throw new Error(`Invalid manifest file ${manifestHash} (named ${contractName}). Its body doesn't contain a 'signingKeys' list'`);
          }
          let contractSigningKeys;
          try {
            contractSigningKeys = Object.fromEntries(body.signingKeys.map((serializedKey) => {
              return [
                keyId2(serializedKey),
                serializedKey
              ];
            }));
          } catch (e2) {
            console.error(`[chelonia] Error parsing the public keys list for ${manifestHash} (named ${contractName})`, e2);
            throw e2;
          }
          if (!has(contractSigningKeys, manifest2.signature.keyId)) {
            throw new Error(`Invalid or missing signature in manifest ${manifestHash} (named ${contractName}). It claims to be signed with a key with ID ${manifest2.signature.keyId}, which is not listed in its 'signingKeys' field.`);
          }
          verifySignature2(contractSigningKeys[manifest2.signature.keyId], manifest2.body + manifest2.head, manifest2.signature.value);
          console.info(`[chelonia] successful signature verification for ${manifestHash} (named ${contractName}) using ${manifest2.signature.keyId}. The following key IDs will now be trusted for this contract name`, Object.keys(contractSigningKeys));
          signatureValidated = true;
          rootState.contractSigningKeys[contractNameLookupKey] = contractSigningKeys;
        }
        return body;
      },
      "chelonia/private/loadManifest": async function(contractName, manifestHash) {
        if (!contractName || typeof contractName !== "string") {
          throw new Error("Invalid or missing contract name");
        }
        if (this.manifestToContract[manifestHash]) {
          console.warn("[chelonia]: already loaded manifest", manifestHash);
          return;
        }
        const manifestSource = await esm_default("chelonia/out/fetchResource", manifestHash, { code: multicodes3.SHELTER_CONTRACT_MANIFEST });
        const manifest2 = JSON.parse(manifestSource);
        const body = esm_default("chelonia/private/verifyManifestSignature", contractName, manifestHash, manifest2);
        if (body.name !== contractName) {
          throw new Error(`Mismatched contract name. Expected ${contractName} but got ${body.name}`);
        }
        const contractInfo = this.config.contracts.defaults.preferSlim && body.contractSlim || body.contract;
        console.info(`[chelonia] loading contract '${contractInfo.file}'@'${body.version}' from manifest: ${manifestHash}`);
        const source = await esm_default("chelonia/out/fetchResource", contractInfo.hash, { code: multicodes3.SHELTER_CONTRACT_TEXT });
        const reduceAllow = (acc, v2) => {
          acc[v2] = true;
          return acc;
        };
        const allowedSels = ["okTurtles.events/on", "chelonia/defineContract", "chelonia/out/keyRequest"].concat(this.config.contracts.defaults.allowedSelectors).reduce(reduceAllow, {});
        const allowedDoms = this.config.contracts.defaults.allowedDomains.reduce(reduceAllow, {});
        const contractSBP = (selector, ...args) => {
          const domain = domainFromSelector(selector);
          if (selector.startsWith(contractName + "/")) {
            selector = `${manifestHash}/${selector}`;
          }
          if (allowedSels[selector] || allowedDoms[domain]) {
            return esm_default(selector, ...args);
          } else {
            console.error("[chelonia] selector not on allowlist", { selector, allowedSels, allowedDoms });
            throw new Error(`[chelonia] selector not on allowlist: '${selector}'`);
          }
        };
        const saferEval = new Function(`
      return function (globals) {
        // almost a real sandbox
        // stops (() => this)().fetch
        // needs additional step of locking down Function constructor to stop:
        // new (()=>{}).constructor("console.log(typeof this.fetch)")()
        globals.self = globals
        globals.globalThis = globals
        with (new Proxy(globals, {
          get (o, p) { return o[p] },
          has (o, p) { /* console.log('has', p); */ return true }
        })) {
          (function () {
            'use strict'
            ${source}
          })()
        }
      }
    `)();
        this.defContractSBP = contractSBP;
        this.defContractManifest = manifestHash;
        saferEval({
          // pass in globals that we want access to by default in the sandbox
          // note: you can undefine these by setting them to undefined in exposedGlobals
          crypto: {
            getRandomValues: (v2) => globalThis.crypto.getRandomValues(v2)
          },
          ...typeof window === "object" && window && {
            alert: window.alert.bind(window),
            confirm: window.confirm.bind(window),
            prompt: window.prompt.bind(window)
          },
          isNaN,
          console,
          Object,
          Error,
          TypeError,
          RangeError,
          Math,
          Symbol,
          Date,
          Array,
          BigInt,
          Boolean,
          String,
          Number,
          Int8Array,
          Int16Array,
          Int32Array,
          Uint8Array,
          Uint16Array,
          Uint32Array,
          Float32Array,
          Float64Array,
          ArrayBuffer,
          JSON,
          RegExp,
          parseFloat,
          parseInt,
          Promise,
          Function,
          Map,
          WeakMap,
          ...this.config.contracts.defaults.exposedGlobals,
          require: (dep) => {
            return dep === "@sbp/sbp" ? contractSBP : this.config.contracts.defaults.modules[dep];
          },
          sbp: contractSBP,
          fetchServerTime: async (fallback = true) => {
            try {
              const response = await this.config.fetch(`${this.config.connectionURL}/time`, { signal: this.abortController.signal });
              return handleFetchResult2("text")(response);
            } catch (e2) {
              console.warn("[fetchServerTime] Error", e2);
              if (fallback) {
                return new Date(esm_default("chelonia/time")).toISOString();
              }
              throw new ChelErrorFetchServerTimeFailed("Can not fetch server time. Please check your internet connection.");
            }
          }
        });
        if (contractName !== this.defContract.name) {
          throw new Error(`Invalid contract name for manifest ${manifestHash}. Expected ${contractName} but got ${this.defContract.name}`);
        }
        this.defContractSelectors.forEach((s) => {
          allowedSels[s] = true;
        });
        this.manifestToContract[manifestHash] = {
          slim: contractInfo === body.contractSlim,
          info: contractInfo,
          contract: this.defContract
        };
      },
      // Warning: avoid using this unless you know what you're doing. Prefer using /remove.
      "chelonia/private/removeImmediately": function(contractID, params) {
        const state = esm_default(this.config.stateSelector);
        const contractName = state.contracts[contractID]?.type;
        if (!contractName) {
          console.error("[chelonia/private/removeImmediately] Missing contract name for contract", { contractID });
          return;
        }
        const manifestHash = this.config.contracts.manifests[contractName];
        if (manifestHash) {
          const destructor = `${manifestHash}/${contractName}/_cleanup`;
          if (esm_default("sbp/selectors/fn", destructor)) {
            try {
              esm_default(destructor, { contractID, resync: !!params?.resync, state: state[contractID] });
            } catch (e2) {
              console.error(`[chelonia/private/removeImmediately] Error at destructor for ${contractID}`, e2);
            }
          }
        }
        if (params?.resync) {
          Object.keys(state.contracts[contractID]).filter((k) => k !== "references").forEach((k) => this.config.reactiveDel(state.contracts[contractID], k));
          Object.keys(state[contractID]).filter((k) => k !== "_volatile").forEach((k) => this.config.reactiveDel(state[contractID], k));
          if (state[contractID]._volatile) {
            Object.keys(state[contractID]._volatile).filter((k) => k !== "watch").forEach((k) => this.config.reactiveDel(state[contractID]._volatile, k));
          }
        } else {
          delete this.ephemeralReferenceCount[contractID];
          if (params?.permanent) {
            this.config.reactiveSet(state.contracts, contractID, null);
          } else {
            this.config.reactiveDel(state.contracts, contractID);
          }
          this.config.reactiveDel(state, contractID);
        }
        this.subscriptionSet.delete(contractID);
        esm_default("okTurtles.events/emit", CONTRACTS_MODIFIED, Array.from(this.subscriptionSet), {
          added: [],
          removed: [contractID],
          permanent: params?.permanent,
          resync: params?.resync
        });
      },
      // used by, e.g. 'chelonia/contract/wait'
      "chelonia/private/noop": function() {
      },
      "chelonia/private/out/sync": function(contractIDs, params) {
        const listOfIds = typeof contractIDs === "string" ? [contractIDs] : contractIDs;
        const forcedSync = !!params?.force;
        return Promise.all(listOfIds.map((contractID) => {
          if (!forcedSync && this.subscriptionSet.has(contractID)) {
            const rootState = esm_default(this.config.stateSelector);
            if (!rootState[contractID]?._volatile?.dirty) {
              return esm_default("chelonia/private/queueEvent", contractID, ["chelonia/private/noop"]);
            }
          }
          return esm_default("chelonia/private/queueEvent", contractID, [
            "chelonia/private/in/syncContract",
            contractID,
            params
          ]).catch((err) => {
            console.error(`[chelonia] failed to sync ${contractID}:`, err);
            throw err;
          });
        }));
      },
      "chelonia/private/out/publishEvent": function(entry, { maxAttempts = 5, headers, billableContractID, bearer } = {}, hooks) {
        const contractID = entry.contractID();
        const originalEntry = entry;
        return esm_default("chelonia/private/queueEvent", `publish:${contractID}`, async () => {
          let attempt = 1;
          let lastAttemptedHeight;
          await hooks?.prepublish?.(entry);
          const onreceivedHandler = (_contractID, message) => {
            if (entry.hash() === message.hash()) {
              esm_default("okTurtles.events/off", EVENT_HANDLED, onreceivedHandler);
              hooks.onprocessed(entry);
            }
          };
          if (typeof hooks?.onprocessed === "function") {
            esm_default("okTurtles.events/on", EVENT_HANDLED, onreceivedHandler);
          }
          while (true) {
            lastAttemptedHeight = entry.height();
            const newEntry = await esm_default("chelonia/private/queueEvent", contractID, async () => {
              const rootState = esm_default(this.config.stateSelector);
              const state = rootState[contractID];
              const isFirstMessage = entry.isFirstMessage();
              if (!state && !isFirstMessage) {
                console.info(`[chelonia] Not sending message as contract state has been removed: ${entry.description()}`);
                return;
              }
              if (hooks?.preSendCheck) {
                if (!await hooks.preSendCheck(entry, state)) {
                  console.info(`[chelonia] Not sending message as preSendCheck hook returned non-truish value: ${entry.description()}`);
                  return;
                }
              }
              await esm_default("chelonia/private/in/processMessage", entry, cloneDeep2(state || {}));
              if (!isFirstMessage) {
                return recreateEvent(entry, state, rootState.contracts[contractID]);
              }
              return entry;
            });
            if (!newEntry)
              return;
            await hooks?.beforeRequest?.(newEntry, entry);
            entry = newEntry;
            const r = await this.config.fetch(`${this.config.connectionURL}/event`, {
              method: "POST",
              body: entry.serialize(),
              headers: {
                ...headers,
                ...bearer && {
                  Authorization: `Bearer ${bearer}`
                },
                ...billableContractID && {
                  Authorization: buildShelterAuthorizationHeader.call(this, billableContractID)
                },
                "Content-Type": "text/plain"
              },
              signal: this.abortController.signal
            });
            if (r.ok) {
              await hooks?.postpublish?.(entry);
              return entry;
            }
            try {
              if (r.status === 409) {
                if (attempt + 1 > maxAttempts) {
                  console.error(`[chelonia] failed to publish ${entry.description()} after ${attempt} attempts`, entry);
                  throw new Error(`publishEvent: ${r.status} - ${r.statusText}. attempt ${attempt}`);
                }
                const randDelay = randomIntFromRange(0, 1500);
                console.warn(`[chelonia] publish attempt ${attempt} of ${maxAttempts} failed. Waiting ${randDelay} msec before resending ${entry.description()}`);
                attempt += 1;
                await delay(randDelay);
                if (!entry.isFirstMessage() && entry.height() === lastAttemptedHeight) {
                  await esm_default("chelonia/private/out/sync", contractID, { force: true });
                }
              } else {
                const message = (await r.json())?.message;
                console.error(`[chelonia] ERROR: failed to publish ${entry.description()}: ${r.status} - ${r.statusText}: ${message}`, entry);
                throw new Error(`publishEvent: ${r.status} - ${r.statusText}: ${message}`);
              }
            } catch (e2) {
              esm_default("okTurtles.events/off", EVENT_HANDLED, onreceivedHandler);
              throw e2;
            }
          }
        }).then((entry2) => {
          esm_default("okTurtles.events/emit", EVENT_PUBLISHED, { contractID, message: entry2, originalMessage: originalEntry });
          return entry2;
        }).catch((e2) => {
          esm_default("okTurtles.events/emit", EVENT_PUBLISHING_ERROR, { contractID, message: entry, originalMessage: originalEntry, error: e2 });
          throw e2;
        });
      },
      "chelonia/private/out/latestHEADinfo": function(contractID) {
        return this.config.fetch(`${this.config.connectionURL}/latestHEADinfo/${contractID}`, {
          cache: "no-store",
          signal: this.abortController.signal
        }).then(handleFetchResult2("json"));
      },
      "chelonia/private/postKeyShare": function(contractID, previousVolatileState, signingKey) {
        const cheloniaState = esm_default(this.config.stateSelector);
        const targetState = cheloniaState[contractID];
        if (!targetState)
          return;
        if (previousVolatileState && has(previousVolatileState, "watch")) {
          if (!targetState._volatile)
            this.config.reactiveSet(targetState, "_volatile", /* @__PURE__ */ Object.create(null));
          if (!targetState._volatile.watch) {
            this.config.reactiveSet(targetState._volatile, "watch", previousVolatileState.watch);
          } else if (targetState._volatile.watch !== previousVolatileState.watch) {
            previousVolatileState.watch.forEach((pWatch) => {
              if (!targetState._volatile.watch.some((tWatch) => {
                return tWatch[0] === pWatch[0] && tWatch[1] === pWatch[1];
              })) {
                targetState._volatile.watch.push(pWatch);
              }
            });
          }
        }
        if (!Array.isArray(targetState._volatile?.pendingKeyRequests))
          return;
        this.config.reactiveSet(targetState._volatile, "pendingKeyRequests", targetState._volatile.pendingKeyRequests.filter((pkr) => pkr?.name !== signingKey.name));
      },
      "chelonia/private/in/processMessage": async function(message, state, internalSideEffectStack, contractName) {
        const [opT, opV] = message.op();
        const hash3 = message.hash();
        const height = message.height();
        const contractID = message.contractID();
        const manifestHash = message.manifest();
        const signingKeyId = message.signingKeyId();
        const direction = message.direction();
        const config = this.config;
        const self2 = this;
        const opName = Object.entries(SPMessage2).find(([, y]) => y === opT)?.[0];
        console.debug("PROCESSING OPCODE:", opName, "to", contractID);
        if (state?._volatile?.dirty) {
          console.debug("IGNORING OPCODE BECAUSE CONTRACT STATE IS MARKED AS DIRTY.", "OPCODE:", opName, "CONTRACT:", contractID);
          return;
        }
        if (!state._vm)
          state._vm = /* @__PURE__ */ Object.create(null);
        const opFns = {
          /*
            There are two types of "errors" that we need to consider:
            1. "Ignoring" errors
            2. "Failure" errors
            Example: OP_KEY_ADD
            1. IGNORING: an error is thrown because we wanted to add a key but the key we wanted to add is already there. This is not a hard error, it's an ignoring error. We don't care that the operation failed in this case because the intent was accomplished.
            2. FAILURE: an error is thrown while attempting to add a key that doesn't exist.
            Example: OP_ACTION_ENCRYPTED
            1. IGNORING: An error is thrown because we don't have the key to decrypt the action. We ignore it.
            2. FAILURE: An error is thrown by the process function during processing.
            Handling these in OP_ATOMIC
            • ALL errors of class "IGNORING" should be ignored. They should not impact our ability to process the rest of the operations in the OP_ATOMIC. No matter how many of these are thrown, it doesn't affect the rest of the operations.
            • ANY error of class "FAILURE" will call the rest of the operations to fail and the state to be reverted to prior to the OP_ATOMIC. No side-effects should be run. Because an intention failed.
          */
          async [SPMessage2.OP_ATOMIC](v2) {
            for (let i2 = 0; i2 < v2.length; i2++) {
              const u2 = v2[i2];
              try {
                if (u2[0] === SPMessage2.OP_ATOMIC)
                  throw new Error("Cannot nest OP_ATOMIC");
                if (!validateKeyPermissions(message, config, state, signingKeyId, u2[0], u2[1])) {
                  throw new Error("Inside OP_ATOMIC: no matching signing key was defined");
                }
                await opFns[u2[0]](u2[1]);
              } catch (e_) {
                const e2 = e_;
                if (e2 && typeof e2 === "object") {
                  if (e2.name === "ChelErrorDecryptionKeyNotFound") {
                    console.warn(`[chelonia] [OP_ATOMIC] WARN '${e2.name}' in processMessage for ${message.description()}: ${e2.message}`, e2, message.serialize());
                    if (e2.cause) {
                      const missingDecryptionKeyIds = missingDecryptionKeyIdsMap.get(message);
                      if (missingDecryptionKeyIds) {
                        missingDecryptionKeyIds.add(e2.cause);
                      } else {
                        missingDecryptionKeyIdsMap.set(message, /* @__PURE__ */ new Set([e2.cause]));
                      }
                    }
                    continue;
                  } else {
                    logEvtError(message, `[chelonia] [OP_ATOMIC] ERROR '${e2.name}' in processMessage for ${message.description()}: ${e2.message || e2}`, e2, message.serialize());
                  }
                  console.warn(`[chelonia] [OP_ATOMIC] Error processing ${message.description()}: ${message.serialize()}. Any side effects will be skipped!`);
                  if (config.strictProcessing) {
                    throw e2;
                  }
                  config.hooks.processError?.(e2, message, getMsgMeta.call(self2, message, contractID, state));
                  if (e2.name === "ChelErrorWarning")
                    continue;
                } else {
                  logEvtError(message, "Inside OP_ATOMIC: Non-object or null error thrown", contractID, message, i2, e2);
                }
                throw e2;
              }
            }
          },
          [SPMessage2.OP_CONTRACT](v2) {
            state._vm.type = v2.type;
            const keys = keysToMap.call(self2, v2.keys, height);
            state._vm.authorizedKeys = keys;
            keyAdditionProcessor.call(self2, message, hash3, v2.keys, state, contractID, signingKey, internalSideEffectStack);
          },
          [SPMessage2.OP_ACTION_ENCRYPTED](v2) {
            if (config.skipActionProcessing) {
              if (!config.skipDecryptionAttempts) {
                console.log("OP_ACTION_ENCRYPTED: skipped action processing");
              }
              return;
            }
            return opFns[SPMessage2.OP_ACTION_UNENCRYPTED](v2.valueOf());
          },
          async [SPMessage2.OP_ACTION_UNENCRYPTED](v2) {
            if (!config.skipActionProcessing) {
              let innerSigningKeyId;
              if (isSignedData(v2)) {
                innerSigningKeyId = v2.signingKeyId;
                v2 = v2.valueOf();
              }
              const { data, meta, action } = v2;
              if (!config.whitelisted(action)) {
                throw new Error(`chelonia: action not whitelisted: '${action}'`);
              }
              await esm_default(`${manifestHash}/${action}/process`, {
                data,
                meta,
                hash: hash3,
                height,
                contractID,
                direction: message.direction(),
                signingKeyId,
                get signingContractID() {
                  return getContractIDfromKeyId(contractID, signingKeyId, state);
                },
                innerSigningKeyId,
                get innerSigningContractID() {
                  return getContractIDfromKeyId(contractID, innerSigningKeyId, state);
                }
              }, state);
            }
          },
          [SPMessage2.OP_KEY_SHARE](wv) {
            const data = config.unwrapMaybeEncryptedData(wv);
            if (!data)
              return;
            const v2 = data.data;
            for (const key of v2.keys) {
              if (key.id && key.meta?.private?.content) {
                if (!has(state._vm, "sharedKeyIds"))
                  state._vm.sharedKeyIds = [];
                if (!state._vm.sharedKeyIds.some((sK) => sK.id === key.id))
                  state._vm.sharedKeyIds.push({ id: key.id, contractID: v2.contractID, height, keyRequestHash: v2.keyRequestHash, keyRequestHeight: v2.keyRequestHeight });
              }
            }
            if (has(v2, "keyRequestHash") && state._vm.authorizedKeys[signingKeyId].meta?.keyRequest) {
              state._vm.authorizedKeys[signingKeyId].meta.keyRequest.responded = hash3;
            }
            internalSideEffectStack?.push(async () => {
              delete self2.postSyncOperations[contractID]?.["pending-keys-for-" + v2.contractID];
              const cheloniaState = esm_default(self2.config.stateSelector);
              const targetState = cheloniaState[v2.contractID];
              const missingDecryptionKeyIds = cheloniaState.contracts[v2.contractID]?.missingDecryptionKeyIds;
              let newestEncryptionKeyHeight = Number.POSITIVE_INFINITY;
              for (const key of v2.keys) {
                if (key.id && key.meta?.private?.content) {
                  const transient = direction === "outgoing" || key.meta.private.transient;
                  if (!esm_default("chelonia/haveSecretKey", key.id, !transient)) {
                    try {
                      const decrypted = key.meta.private.content.valueOf();
                      esm_default("chelonia/storeSecretKeys", new Secret([{
                        key: deserializeKey2(decrypted),
                        transient
                      }]));
                      if (missingDecryptionKeyIds?.includes(key.id)) {
                        newestEncryptionKeyHeight = Number.NEGATIVE_INFINITY;
                      } else if (
                        // Otherwise, we make an educated guess on whether a re-sync
                        // is needed based on the height.
                        targetState?._vm?.authorizedKeys?.[key.id]?._notBeforeHeight != null && Array.isArray(targetState._vm.authorizedKeys[key.id].purpose) && targetState._vm.authorizedKeys[key.id].purpose.includes("enc")
                      ) {
                        newestEncryptionKeyHeight = Math.min(newestEncryptionKeyHeight, targetState._vm.authorizedKeys[key.id]._notBeforeHeight);
                      }
                    } catch (e_) {
                      const e2 = e_;
                      if (e2?.name === "ChelErrorDecryptionKeyNotFound") {
                        console.warn(`OP_KEY_SHARE (${hash3} of ${contractID}) missing secret key: ${e2.message}`, e2);
                      } else {
                        console.error(`OP_KEY_SHARE (${hash3} of ${contractID}) error '${e2.message || e2}':`, e2);
                      }
                    }
                  }
                }
              }
              const mustResync = !!(newestEncryptionKeyHeight < cheloniaState.contracts[v2.contractID]?.height);
              if (mustResync) {
                if (!has(targetState, "_volatile"))
                  config.reactiveSet(targetState, "_volatile", /* @__PURE__ */ Object.create(null));
                config.reactiveSet(targetState._volatile, "dirty", true);
                if (!Object.keys(targetState).some((k) => k !== "_volatile")) {
                  return;
                }
                const keyDict = /* @__PURE__ */ Object.create(null);
                targetState._volatile?.watch?.forEach(([keyName, contractID2]) => {
                  if (!keyDict[keyName]) {
                    keyDict[keyName] = [contractID2];
                    return;
                  }
                  keyDict[keyName].push(contractID2);
                });
                const contractIdsToUpdate = Array.from(new Set(Object.entries(keyDict).flatMap(([keyName, contractIDs]) => {
                  const keyId3 = findKeyIdByName(targetState, keyName);
                  if (
                    // Does the key exist? (i.e., is it a current key)
                    keyId3 && // Is it an encryption key? (signing keys don't build up a
                    // potentially invalid state because the private key isn't
                    // required for validation; however, missing encryption keys
                    // prevent message processing)
                    targetState._vm.authorizedKeys[keyId3].purpose.includes("enc") && // Is this a newly set key? (avoid re-syncing contracts that
                    // haven't been affected by the `OP_KEY_SHARE`)
                    targetState._vm.authorizedKeys[keyId3]._notBeforeHeight >= newestEncryptionKeyHeight
                  ) {
                    return contractIDs;
                  }
                  return [];
                })));
                contractIdsToUpdate.forEach((contractID2) => {
                  const targetState2 = cheloniaState[contractID2];
                  if (!targetState2)
                    return;
                  if (!has(targetState2, "_volatile"))
                    config.reactiveSet(targetState2, "_volatile", /* @__PURE__ */ Object.create(null));
                  config.reactiveSet(targetState2._volatile, "dirty", true);
                });
                if (self2.subscriptionSet.has(v2.contractID)) {
                  const resync = esm_default("chelonia/private/queueEvent", v2.contractID, [
                    "chelonia/private/in/syncContract",
                    v2.contractID
                  ]).then(() => {
                    esm_default("chelonia/private/out/sync", contractIdsToUpdate.filter((contractID2) => {
                      return self2.subscriptionSet.has(contractID2);
                    }), { force: true, resync: true }).catch((e2) => {
                      console.error("[chelonia] Error resyncing contracts with foreign key references after key rotation", e2);
                    });
                  }).catch((e2) => {
                    console.error(`[chelonia] Error during sync for ${v2.contractID} during OP_KEY_SHARE for ${contractID}`);
                    if (v2.contractID === contractID) {
                      throw e2;
                    }
                  });
                  if (v2.contractID !== contractID) {
                    await resync;
                  }
                }
              }
              const previousVolatileState = targetState?._volatile;
              esm_default("chelonia/private/queueEvent", v2.contractID, ["chelonia/private/postKeyShare", v2.contractID, mustResync ? previousVolatileState : null, signingKey]).then(() => {
                esm_default("chelonia/private/queueEvent", contractID, () => {
                  esm_default("okTurtles.events/emit", CONTRACT_HAS_RECEIVED_KEYS, { contractID: v2.contractID, sharedWithContractID: contractID, signingKeyId, get signingKeyName() {
                    return state._vm?.authorizedKeys?.[signingKeyId]?.name;
                  } });
                }).catch((e2) => {
                  console.error(`[chelonia] Error while emitting the CONTRACT_HAS_RECEIVED_KEYS event for ${contractID}`, e2);
                });
              });
            });
          },
          [SPMessage2.OP_KEY_REQUEST](wv) {
            const data = config.unwrapMaybeEncryptedData(wv);
            const v2 = data?.data || { contractID: "(private)", replyWith: { context: void 0 }, request: "*" };
            const originatingContractID = v2.contractID;
            if (state._vm?.invites?.[signingKeyId]?.quantity != null) {
              if (state._vm.invites[signingKeyId].quantity > 0) {
                if (--state._vm.invites[signingKeyId].quantity <= 0) {
                  state._vm.invites[signingKeyId].status = INVITE_STATUS.USED;
                }
              } else {
                logEvtError(message, "Ignoring OP_KEY_REQUEST because it exceeds allowed quantity: " + originatingContractID);
                return;
              }
            }
            if (state._vm?.invites?.[signingKeyId]?.expires != null) {
              if (state._vm.invites[signingKeyId].expires < Date.now()) {
                logEvtError(message, "Ignoring OP_KEY_REQUEST because it expired at " + state._vm.invites[signingKeyId].expires + ": " + originatingContractID);
                return;
              }
            }
            if (config.skipActionProcessing || direction === "outgoing") {
              return;
            }
            if (!has(v2.replyWith, "context")) {
              logEvtError(message, "Ignoring OP_KEY_REQUEST because it is missing the context attribute");
              return;
            }
            const context = v2.replyWith.context;
            if (data && (!Array.isArray(context) || context[0] !== originatingContractID)) {
              logEvtError(message, "Ignoring OP_KEY_REQUEST because it is signed by the wrong contract");
              return;
            }
            if (v2.request !== "*") {
              logEvtError(message, "Ignoring OP_KEY_REQUEST because it has an unsupported request attribute", v2.request);
              return;
            }
            if (!state._vm.pendingKeyshares)
              state._vm.pendingKeyshares = /* @__PURE__ */ Object.create(null);
            state._vm.pendingKeyshares[message.hash()] = context ? [
              // Full-encryption (i.e., KRS encryption) requires that this request
              // was encrypted and that the invite is marked as private
              !!data?.encryptionKeyId,
              message.height(),
              signingKeyId,
              context
            ] : [
              !!data?.encryptionKeyId,
              message.height(),
              signingKeyId
            ];
            if (data) {
              internalSideEffectStack?.push(() => {
                self2.setPostSyncOp(contractID, "respondToAllKeyRequests-" + message.contractID(), ["chelonia/private/respondToAllKeyRequests", contractID]);
              });
            }
          },
          [SPMessage2.OP_KEY_REQUEST_SEEN](wv) {
            if (config.skipActionProcessing) {
              return;
            }
            const data = config.unwrapMaybeEncryptedData(wv);
            if (!data)
              return;
            const v2 = data.data;
            if (state._vm.pendingKeyshares && v2.keyRequestHash in state._vm.pendingKeyshares) {
              const hash4 = v2.keyRequestHash;
              const pending = state._vm.pendingKeyshares[hash4];
              delete state._vm.pendingKeyshares[hash4];
              if (pending.length !== 4)
                return;
              const keyId3 = pending[2];
              const originatingContractID = pending[3][0];
              if (Array.isArray(state._vm?.invites?.[keyId3]?.responses)) {
                state._vm?.invites?.[keyId3]?.responses.push(originatingContractID);
              }
              if (!has(state._vm, "keyshares"))
                state._vm.keyshares = /* @__PURE__ */ Object.create(null);
              const success = v2.success;
              state._vm.keyshares[hash4] = {
                contractID: originatingContractID,
                height,
                success,
                ...success && {
                  hash: v2.keyShareHash
                }
              };
            }
          },
          [SPMessage2.OP_PROP_DEL]: notImplemented,
          [SPMessage2.OP_PROP_SET](v2) {
            if (!state._vm.props)
              state._vm.props = {};
            state._vm.props[v2.key] = v2.value;
          },
          [SPMessage2.OP_KEY_ADD](v2) {
            const keys = keysToMap.call(self2, v2, height, state._vm.authorizedKeys);
            const keysArray = Object.values(v2);
            keysArray.forEach((k) => {
              if (has(state._vm.authorizedKeys, k.id) && state._vm.authorizedKeys[k.id]._notAfterHeight == null) {
                throw new ChelErrorWarning("Cannot use OP_KEY_ADD on existing keys. Key ID: " + k.id);
              }
            });
            validateKeyAddPermissions.call(self2, contractID, signingKey, state, v2);
            state._vm.authorizedKeys = { ...state._vm.authorizedKeys, ...keys };
            keyAdditionProcessor.call(self2, message, hash3, v2, state, contractID, signingKey, internalSideEffectStack);
          },
          [SPMessage2.OP_KEY_DEL](v2) {
            if (!state._vm.authorizedKeys)
              state._vm.authorizedKeys = /* @__PURE__ */ Object.create(null);
            if (!state._volatile)
              state._volatile = /* @__PURE__ */ Object.create(null);
            if (!state._volatile.pendingKeyRevocations)
              state._volatile.pendingKeyRevocations = /* @__PURE__ */ Object.create(null);
            validateKeyDelPermissions.call(self2, contractID, signingKey, state, v2);
            const keyIds = v2.map((k) => {
              const data = config.unwrapMaybeEncryptedData(k);
              if (!data)
                return void 0;
              return data.data;
            }).filter((keyId3) => {
              if (!keyId3 || typeof keyId3 !== "string")
                return false;
              if (!has(state._vm.authorizedKeys, keyId3) || state._vm.authorizedKeys[keyId3]._notAfterHeight != null) {
                console.warn("Attempted to delete non-existent key from contract", { contractID, keyId: keyId3 });
                return false;
              }
              return true;
            });
            keyIds.forEach((keyId3) => {
              const key = state._vm.authorizedKeys[keyId3];
              state._vm.authorizedKeys[keyId3]._notAfterHeight = height;
              if (has(state._volatile.pendingKeyRevocations, keyId3)) {
                delete state._volatile.pendingKeyRevocations[keyId3];
              }
              if (key.foreignKey) {
                const fkUrl = new URL(key.foreignKey);
                const foreignContract = fkUrl.pathname;
                const foreignKeyName = fkUrl.searchParams.get("keyName");
                if (!foreignContract || !foreignKeyName)
                  throw new Error("Invalid foreign key: missing contract or key name");
                internalSideEffectStack?.push(() => {
                  esm_default("chelonia/private/queueEvent", foreignContract, () => {
                    const rootState = esm_default(config.stateSelector);
                    if (Array.isArray(rootState[foreignContract]?._volatile?.watch)) {
                      const oldWatch = rootState[foreignContract]._volatile.watch;
                      rootState[foreignContract]._volatile.watch = oldWatch.filter(([name, cID]) => name !== foreignKeyName || cID !== contractID);
                      if (oldWatch.length !== rootState[foreignContract]._volatile.watch.length) {
                        esm_default("chelonia/contract/release", foreignContract, { try: true }).catch((e2) => {
                          console.error(`[chelonia] Error at OP_KEY_DEL internalSideEffectStack while attempting to release foreign contract ${foreignContract}`, e2);
                        });
                      }
                    }
                  }).catch((e2) => {
                    console.error("Error stopping watching events after removing key", { contractID, foreignContract, foreignKeyName, fkUrl }, e2);
                  });
                });
                const pendingWatch = state._vm.pendingWatch?.[foreignContract];
                if (pendingWatch) {
                  state._vm.pendingWatch[foreignContract] = pendingWatch.filter(([, kId]) => kId !== keyId3);
                }
              }
              if (key.name.startsWith("#inviteKey-") && state._vm.invites[key.id]) {
                state._vm.invites[key.id].status = INVITE_STATUS.REVOKED;
              }
            });
            if (Array.isArray(state._volatile?.watch)) {
              const updatedKeysMap = /* @__PURE__ */ Object.create(null);
              keyIds.forEach((keyId3) => {
                updatedKeysMap[state._vm.authorizedKeys[keyId3].name] = {
                  name: state._vm.authorizedKeys[keyId3].name,
                  oldKeyId: keyId3
                };
              });
              keyRotationHelper(contractID, state, config, updatedKeysMap, [SPMessage2.OP_KEY_DEL], "chelonia/out/keyDel", (name) => updatedKeysMap[name[0]].oldKeyId, internalSideEffectStack);
            }
          },
          [SPMessage2.OP_KEY_UPDATE](v2) {
            if (!state._volatile)
              state._volatile = /* @__PURE__ */ Object.create(null);
            if (!state._volatile.pendingKeyRevocations)
              state._volatile.pendingKeyRevocations = /* @__PURE__ */ Object.create(null);
            const [updatedKeys, updatedMap] = validateKeyUpdatePermissions.call(self2, contractID, signingKey, state, v2);
            const keysToDelete = Object.values(updatedMap);
            for (const keyId3 of keysToDelete) {
              if (has(state._volatile.pendingKeyRevocations, keyId3)) {
                delete state._volatile.pendingKeyRevocations[keyId3];
              }
              state._vm.authorizedKeys[keyId3]._notAfterHeight = height;
            }
            for (const key of updatedKeys) {
              if (!has(state._vm.authorizedKeys, key.id)) {
                key._notBeforeHeight = height;
                state._vm.authorizedKeys[key.id] = cloneDeep2(key);
              }
            }
            keyAdditionProcessor.call(self2, message, hash3, updatedKeys, state, contractID, signingKey, internalSideEffectStack);
            if (Array.isArray(state._volatile?.watch)) {
              const updatedKeysMap = /* @__PURE__ */ Object.create(null);
              updatedKeys.forEach((key) => {
                if (key.data) {
                  updatedKeysMap[key.name] = cloneDeep2(key);
                  updatedKeysMap[key.name].oldKeyId = updatedMap[key.id];
                }
              });
              keyRotationHelper(contractID, state, config, updatedKeysMap, [SPMessage2.OP_KEY_UPDATE], "chelonia/out/keyUpdate", (name) => ({
                name: name[1],
                oldKeyId: updatedKeysMap[name[0]].oldKeyId,
                id: updatedKeysMap[name[0]].id,
                data: updatedKeysMap[name[0]].data
              }), internalSideEffectStack);
            }
          },
          [SPMessage2.OP_PROTOCOL_UPGRADE]: notImplemented
        };
        if (!this.config.skipActionProcessing && !this.manifestToContract[manifestHash]) {
          const rootState = esm_default(this.config.stateSelector);
          if (!contractName) {
            contractName = has(rootState.contracts, contractID) && rootState.contracts[contractID] && has(rootState.contracts[contractID], "type") ? rootState.contracts[contractID].type : opT === SPMessage2.OP_CONTRACT ? opV.type : "";
          }
          if (!contractName) {
            throw new Error(`Unable to determine the name for a contract and refusing to load it (contract ID was ${contractID} and its manifest hash was ${manifestHash})`);
          }
          await esm_default("chelonia/private/loadManifest", contractName, manifestHash);
        }
        let processOp = true;
        if (config.preOp) {
          processOp = config.preOp(message, state) !== false && processOp;
        }
        let signingKey;
        {
          const stateForValidation = opT === SPMessage2.OP_CONTRACT && !state?._vm?.authorizedKeys ? {
            _vm: {
              authorizedKeys: keysToMap.call(this, opV.keys, height)
            }
          } : state;
          if (!validateKeyPermissions(message, config, stateForValidation, signingKeyId, opT, opV)) {
            throw new Error("No matching signing key was defined");
          }
          signingKey = stateForValidation._vm.authorizedKeys[signingKeyId];
        }
        if (config[`preOp_${opT}`]) {
          processOp = config[`preOp_${opT}`](message, state) !== false && processOp;
        }
        if (processOp) {
          await opFns[opT](opV);
          config.postOp?.(message, state);
          config[`postOp_${opT}`]?.(message, state);
        }
      },
      "chelonia/private/in/enqueueHandleEvent": function(contractID, event) {
        return esm_default("chelonia/private/queueEvent", contractID, async () => {
          await esm_default("chelonia/private/in/handleEvent", contractID, event);
          esm_default("chelonia/private/enqueuePostSyncOps", contractID);
        });
      },
      "chelonia/private/in/syncContract": async function(contractID, params) {
        const state = esm_default(this.config.stateSelector);
        if (state.contracts[contractID] === null) {
          throw new ChelErrorResourceGone("Cannot sync permanently deleted contract " + contractID);
        }
        try {
          this.currentSyncs[contractID] = { firstSync: !state.contracts[contractID]?.type };
          esm_default("okTurtles.events/emit", CONTRACT_IS_SYNCING, contractID, true);
          const currentVolatileState = state[contractID]?._volatile || /* @__PURE__ */ Object.create(null);
          if (currentVolatileState?.dirty || params?.resync) {
            delete currentVolatileState.dirty;
            currentVolatileState.resyncing = true;
            esm_default("chelonia/private/removeImmediately", contractID, { resync: true });
            this.config.reactiveSet(state, contractID, /* @__PURE__ */ Object.create(null));
            this.config.reactiveSet(state[contractID], "_volatile", currentVolatileState);
          }
          const { HEAD: latestHEAD } = await esm_default("chelonia/out/latestHEADInfo", contractID);
          console.debug(`[chelonia] syncContract: ${contractID} latestHash is: ${latestHEAD}`);
          const { HEAD: recentHEAD, height: recentHeight } = state.contracts[contractID] || {};
          const isSubscribed = this.subscriptionSet.has(contractID);
          if (!isSubscribed) {
            const entry = this.pending.find((entry2) => entry2?.contractID === contractID);
            if (!entry) {
              this.pending.push({ contractID });
            }
          }
          this.postSyncOperations[contractID] = this.postSyncOperations[contractID] ?? /* @__PURE__ */ Object.create(null);
          if (latestHEAD !== recentHEAD) {
            console.debug(`[chelonia] Synchronizing Contract ${contractID}: our recent was ${recentHEAD || "undefined"} but the latest is ${latestHEAD}`);
            const eventsStream = esm_default("chelonia/out/eventsAfter", contractID, { sinceHeight: recentHeight ?? 0, sinceHash: recentHEAD ?? contractID });
            let latestHashFound = false;
            const eventReader = eventsStream.getReader();
            for (let skip = has(state.contracts, contractID) && has(state.contracts[contractID], "HEAD"); ; skip = false) {
              const { done, value: event } = await eventReader.read();
              if (done) {
                if (!latestHashFound) {
                  throw new ChelErrorForkedChain(`expected hash ${latestHEAD} in list of events for contract ${contractID}`);
                }
                break;
              }
              if (!latestHashFound) {
                latestHashFound = SPMessage2.deserializeHEAD(event).hash === latestHEAD;
              }
              if (skip)
                continue;
              await esm_default("chelonia/private/in/handleEvent", contractID, event);
            }
          } else if (!isSubscribed) {
            this.subscriptionSet.add(contractID);
            esm_default("okTurtles.events/emit", CONTRACTS_MODIFIED, Array.from(this.subscriptionSet), { added: [contractID], removed: [] });
            const entryIndex = this.pending.findIndex((entry) => entry?.contractID === contractID);
            if (entryIndex !== -1) {
              this.pending.splice(entryIndex, 1);
            }
            console.debug(`[chelonia] added already synchronized ${contractID} to subscription set`);
          } else {
            console.debug(`[chelonia] contract ${contractID} was already synchronized`);
          }
          esm_default("chelonia/private/enqueuePostSyncOps", contractID);
        } catch (e2) {
          console.error(`[chelonia] syncContract error: ${e2.message || e2}`, e2);
          this.config.hooks.syncContractError?.(e2, contractID);
          throw e2;
        } finally {
          if (state[contractID]?._volatile?.resyncing) {
            this.config.reactiveDel(state[contractID]._volatile, "resyncing");
          }
          delete this.currentSyncs[contractID];
          esm_default("okTurtles.events/emit", CONTRACT_IS_SYNCING, contractID, false);
        }
      },
      "chelonia/private/enqueuePostSyncOps": function(contractID) {
        if (!has(this.postSyncOperations, contractID))
          return;
        Object.entries(this.postSyncOperations[contractID]).forEach(([key, op]) => {
          delete this.postSyncOperations[contractID][key];
          esm_default("chelonia/private/queueEvent", contractID, op).catch((e2) => {
            console.error(`Post-sync operation for ${contractID} failed`, { contractID, op, error: e2 });
          });
        });
      },
      "chelonia/private/watchForeignKeys": function(externalContractID) {
        const state = esm_default(this.config.stateSelector);
        const externalContractState = state[externalContractID];
        const pendingWatch = externalContractState?._vm?.pendingWatch;
        if (!pendingWatch || !Object.keys(pendingWatch).length)
          return;
        const signingKey = findSuitableSecretKeyId(externalContractState, [SPMessage2.OP_KEY_DEL], ["sig"]);
        const canMirrorOperations = !!signingKey;
        if (!canMirrorOperations) {
          console.info("[chelonia/private/watchForeignKeys]: Returning as operations cannot be mirrored", { externalContractID });
          return;
        }
        Object.entries(pendingWatch).forEach(([contractID, keys]) => {
          if (!Array.isArray(keys) || // Check that the keys exist and haven't been revoked
          !keys.reduce((acc, [, id]) => {
            return acc || has(externalContractState._vm.authorizedKeys, id);
          }, false)) {
            console.info("[chelonia/private/watchForeignKeys]: Skipping as none of the keys to watch exist", {
              externalContractID,
              contractID
            });
            return;
          }
          esm_default("chelonia/private/queueEvent", contractID, ["chelonia/private/in/syncContractAndWatchKeys", contractID, externalContractID]).catch((e2) => {
            console.error(`Error at syncContractAndWatchKeys for contractID ${contractID} and externalContractID ${externalContractID}`, e2);
          });
        });
      },
      "chelonia/private/in/syncContractAndWatchKeys": async function(contractID, externalContractID) {
        const rootState = esm_default(this.config.stateSelector);
        const externalContractState = rootState[externalContractID];
        const pendingWatch = externalContractState?._vm?.pendingWatch?.[contractID]?.splice(0);
        if (!Array.isArray(pendingWatch) || // Check that the keys exist and haven't been revoked
        !pendingWatch.reduce((acc, [, id]) => {
          return acc || has(externalContractState._vm.authorizedKeys, id) && findKeyIdByName(externalContractState, externalContractState._vm.authorizedKeys[id].name) != null;
        }, false)) {
          console.info("[chelonia/private/syncContractAndWatchKeys]: Skipping as none of the keys to watch exist", {
            externalContractID,
            contractID
          });
          return;
        }
        if (!this.subscriptionSet.has(contractID)) {
          await esm_default("chelonia/private/in/syncContract", contractID);
        }
        const contractState = rootState[contractID];
        const keysToDelete = [];
        const keysToUpdate = [];
        pendingWatch.forEach(([keyName, externalId]) => {
          const keyId3 = findKeyIdByName(contractState, keyName);
          if (!keyId3) {
            keysToDelete.push(externalId);
            return;
          } else if (keyId3 !== externalId) {
            keysToUpdate.push(externalId);
          }
          if (!contractState._volatile) {
            this.config.reactiveSet(contractState, "_volatile", Object.create(null, { watch: { value: [[keyName, externalContractID]], configurable: true, enumerable: true, writable: true } }));
          } else {
            if (!contractState._volatile.watch)
              this.config.reactiveSet(contractState._volatile, "watch", [[keyName, externalContractID]]);
            if (Array.isArray(contractState._volatile.watch) && !contractState._volatile.watch.find((v2) => v2[0] === keyName && v2[1] === externalContractID))
              contractState._volatile.watch.push([keyName, externalContractID]);
          }
        });
        if (keysToDelete.length || keysToUpdate.length) {
          if (!externalContractState._volatile) {
            this.config.reactiveSet(externalContractState, "_volatile", /* @__PURE__ */ Object.create(null));
          }
          if (!externalContractState._volatile.pendingKeyRevocations) {
            this.config.reactiveSet(externalContractState._volatile, "pendingKeyRevocations", /* @__PURE__ */ Object.create(null));
          }
          keysToDelete.forEach((id) => this.config.reactiveSet(externalContractState._volatile.pendingKeyRevocations, id, "del"));
          keysToUpdate.forEach((id) => this.config.reactiveSet(externalContractState._volatile.pendingKeyRevocations, id, true));
          esm_default("chelonia/private/queueEvent", externalContractID, ["chelonia/private/deleteOrRotateRevokedKeys", externalContractID]).catch((e2) => {
            console.error(`Error at deleteOrRotateRevokedKeys for contractID ${contractID} and externalContractID ${externalContractID}`, e2);
          });
        }
      },
      // The following function gets called when we start watching a contract for
      // foreign keys for the first time, and it ensures that, at the point the
      // watching starts, keys are in sync between the two contracts (later on,
      // this will be handled automatically for incoming OP_KEY_DEL and
      // OP_KEY_UPDATE).
      // For any given foreign key, there are three possible states:
      //   1. The key is in sync with the foreign contract. In this case, there's
      //      nothing left to do.
      //   2. The key has been rotated in the foreign contract (replaced by another
      //      key of the same name). We need to mirror this operation manually
      //      since watching only affects new messages we receive.
      //   3. The key has been removed in the foreign contract. We also need to
      //      mirror the operation.
      "chelonia/private/deleteOrRotateRevokedKeys": function(contractID) {
        const rootState = esm_default(this.config.stateSelector);
        const contractState = rootState[contractID];
        const pendingKeyRevocations = contractState?._volatile?.pendingKeyRevocations;
        if (!pendingKeyRevocations || Object.keys(pendingKeyRevocations).length === 0)
          return;
        const keysToUpdate = Object.entries(pendingKeyRevocations).filter(([, v2]) => v2 === true).map(([id]) => id);
        const [, keyUpdateSigningKeyId, keyUpdateArgs] = keysToUpdate.reduce((acc, keyId3) => {
          const key = contractState._vm?.authorizedKeys?.[keyId3];
          if (!key || !key.foreignKey)
            return acc;
          const foreignKey = String(key.foreignKey);
          const fkUrl = new URL(foreignKey);
          const foreignContractID = fkUrl.pathname;
          const foreignKeyName = fkUrl.searchParams.get("keyName");
          if (!foreignKeyName)
            throw new Error("Missing foreign key name");
          const foreignState = rootState[foreignContractID];
          if (!foreignState)
            return acc;
          const fKeyId = findKeyIdByName(foreignState, foreignKeyName);
          if (!fKeyId) {
            if (pendingKeyRevocations[keyId3] === true) {
              this.config.reactiveSet(pendingKeyRevocations, keyId3, "del");
            }
            return acc;
          }
          const [currentRingLevel, currentSigningKeyId, currentKeyArgs] = acc;
          const ringLevel = Math.min(currentRingLevel, key.ringLevel ?? Number.POSITIVE_INFINITY);
          if (ringLevel >= currentRingLevel) {
            currentKeyArgs.push({
              name: key.name,
              oldKeyId: keyId3,
              id: fKeyId,
              data: foreignState._vm.authorizedKeys[fKeyId].data
            });
            return [currentRingLevel, currentSigningKeyId, currentKeyArgs];
          } else if (Number.isFinite(ringLevel)) {
            const signingKeyId = findSuitableSecretKeyId(contractState, [SPMessage2.OP_KEY_UPDATE], ["sig"], ringLevel);
            if (signingKeyId) {
              currentKeyArgs.push({
                name: key.name,
                oldKeyId: keyId3,
                id: fKeyId,
                data: foreignState._vm.authorizedKeys[fKeyId].data
              });
              return [ringLevel, signingKeyId, currentKeyArgs];
            }
          }
          return acc;
        }, [Number.POSITIVE_INFINITY, "", []]);
        if (keyUpdateArgs.length !== 0) {
          const contractName = contractState._vm.type;
          esm_default("chelonia/out/keyUpdate", { contractID, contractName, data: keyUpdateArgs, signingKeyId: keyUpdateSigningKeyId }).catch((e2) => {
            console.error(`[chelonia/private/deleteOrRotateRevokedKeys] Error sending OP_KEY_UPDATE for ${contractID}`, e2.message);
          });
        }
        const keysToDelete = Object.entries(pendingKeyRevocations).filter(([, v2]) => v2 === "del").map(([id]) => id);
        const [, keyDelSigningKeyId, keyIdsToDelete] = keysToDelete.reduce((acc, keyId3) => {
          const [currentRingLevel, currentSigningKeyId, currentKeyIds] = acc;
          const ringLevel = Math.min(currentRingLevel, contractState._vm?.authorizedKeys?.[keyId3]?.ringLevel ?? Number.POSITIVE_INFINITY);
          if (ringLevel >= currentRingLevel) {
            currentKeyIds.push(keyId3);
            return [currentRingLevel, currentSigningKeyId, currentKeyIds];
          } else if (Number.isFinite(ringLevel)) {
            const signingKeyId = findSuitableSecretKeyId(contractState, [SPMessage2.OP_KEY_DEL], ["sig"], ringLevel);
            if (signingKeyId) {
              currentKeyIds.push(keyId3);
              return [ringLevel, signingKeyId, currentKeyIds];
            }
          }
          return acc;
        }, [Number.POSITIVE_INFINITY, "", []]);
        if (keyIdsToDelete.length !== 0) {
          const contractName = contractState._vm.type;
          esm_default("chelonia/out/keyDel", { contractID, contractName, data: keyIdsToDelete, signingKeyId: keyDelSigningKeyId }).catch((e2) => {
            console.error(`[chelonia/private/deleteRevokedKeys] Error sending OP_KEY_DEL for ${contractID}`, e2.message);
          });
        }
      },
      "chelonia/private/respondToAllKeyRequests": function(contractID) {
        const state = esm_default(this.config.stateSelector);
        const contractState = state[contractID] ?? {};
        const pending = contractState?._vm?.pendingKeyshares;
        if (!pending)
          return;
        const signingKeyId = findSuitableSecretKeyId(contractState, [SPMessage2.OP_ATOMIC, SPMessage2.OP_KEY_REQUEST_SEEN, SPMessage2.OP_KEY_SHARE], ["sig"]);
        if (!signingKeyId) {
          console.log("Unable to respond to key request because there is no suitable secret key with OP_KEY_REQUEST_SEEN permission");
          return;
        }
        Object.entries(pending).map(([hash3, entry]) => {
          if (!Array.isArray(entry) || entry.length !== 4) {
            return void 0;
          }
          const [, , , [originatingContractID]] = entry;
          return esm_default("chelonia/private/queueEvent", originatingContractID, ["chelonia/private/respondToKeyRequest", contractID, signingKeyId, hash3]).catch((e2) => {
            console.error(`respondToAllKeyRequests: Error responding to key request ${hash3} from ${originatingContractID} to ${contractID}`, e2);
          });
        });
      },
      "chelonia/private/respondToKeyRequest": async function(contractID, signingKeyId, hash3) {
        const state = esm_default(this.config.stateSelector);
        const contractState = state[contractID];
        const entry = contractState?._vm?.pendingKeyshares?.[hash3];
        const instance = this._instance;
        if (!Array.isArray(entry) || entry.length !== 4) {
          return;
        }
        const [keyShareEncryption, height, , [originatingContractID, rv, originatingContractHeight, headJSON]] = entry;
        entry.pop();
        const krsEncryption = !!contractState._vm.authorizedKeys?.[signingKeyId]?._private;
        await esm_default("chelonia/private/in/syncContract", originatingContractID);
        if (instance !== this._instance)
          return;
        const originatingState = state[originatingContractID];
        const contractName = state.contracts[contractID].type;
        const originatingContractName = originatingState._vm.type;
        const v2 = signedIncomingData(originatingContractID, originatingState, rv, originatingContractHeight, headJSON).valueOf();
        const { encryptionKeyId } = v2;
        const responseKey = encryptedIncomingData(contractID, contractState, v2.responseKey, height, this.transientSecretKeys, headJSON).valueOf();
        const deserializedResponseKey = deserializeKey2(responseKey);
        const responseKeyId = keyId2(deserializedResponseKey);
        Promise.resolve().then(() => {
          if (instance !== this._instance)
            return;
          if (!has(originatingState._vm.authorizedKeys, responseKeyId) || originatingState._vm.authorizedKeys[responseKeyId]._notAfterHeight != null) {
            throw new Error(`Unable to respond to key request for ${originatingContractID}. Key ${responseKeyId} is not valid.`);
          }
          esm_default("chelonia/storeSecretKeys", new Secret([
            { key: deserializedResponseKey }
          ]));
          const keys = pick(state.secretKeys, Object.entries(contractState._vm.authorizedKeys).filter(([, key]) => !!key.meta?.private?.shareable).map(([kId]) => kId));
          if (!keys || Object.keys(keys).length === 0) {
            console.info("respondToAllKeyRequests: no keys to share", { contractID, originatingContractID });
            return;
          }
          const keySharePayload = {
            contractID,
            keys: Object.entries(keys).map(([keyId3, key]) => ({
              id: keyId3,
              meta: {
                private: {
                  content: encryptedOutgoingData(originatingContractID, encryptionKeyId, key),
                  shareable: true
                }
              }
            })),
            keyRequestHash: hash3,
            keyRequestHeight: height
          };
          if (!contractState?._vm?.pendingKeyshares?.[hash3]) {
            return;
          }
          return keySharePayload;
        }).then((keySharePayload) => {
          if (instance !== this._instance || !keySharePayload)
            return;
          return esm_default("chelonia/out/keyShare", {
            contractID: originatingContractID,
            contractName: originatingContractName,
            data: keyShareEncryption ? encryptedOutgoingData(originatingContractID, findSuitablePublicKeyIds(originatingState, [SPMessage2.OP_KEY_SHARE], ["enc"])?.[0] || "", keySharePayload) : keySharePayload,
            signingKeyId: responseKeyId
          }).then((msg) => {
            if (instance !== this._instance)
              return;
            const payload = { keyRequestHash: hash3, keyShareHash: msg.hash(), success: true };
            const connectionKeyPayload = {
              contractID: originatingContractID,
              keys: [
                {
                  id: responseKeyId,
                  meta: {
                    private: {
                      content: encryptedOutgoingData(contractID, findSuitablePublicKeyIds(contractState, [SPMessage2.OP_KEY_REQUEST_SEEN], ["enc"])?.[0] || "", responseKey),
                      shareable: true
                    }
                  }
                }
              ]
            };
            esm_default("chelonia/out/atomic", {
              contractID,
              contractName,
              signingKeyId,
              data: [
                [
                  "chelonia/out/keyRequestResponse",
                  {
                    data: krsEncryption ? encryptedOutgoingData(contractID, findSuitablePublicKeyIds(contractState, [SPMessage2.OP_KEY_REQUEST_SEEN], ["enc"])?.[0] || "", payload) : payload
                  }
                ],
                [
                  // Upon successful key share, we want to share deserializedResponseKey
                  // with ourselves
                  "chelonia/out/keyShare",
                  {
                    data: keyShareEncryption ? encryptedOutgoingData(contractID, findSuitablePublicKeyIds(contractState, [SPMessage2.OP_KEY_SHARE], ["enc"])?.[0] || "", connectionKeyPayload) : connectionKeyPayload
                  }
                ]
              ]
            }).catch((e2) => {
              console.error("Error at respondToKeyRequest while sending keyRequestResponse", e2);
            });
          });
        }).catch((e2) => {
          console.error("Error at respondToKeyRequest", e2);
          const payload = { keyRequestHash: hash3, success: false };
          if (!contractState?._vm?.pendingKeyshares?.[hash3]) {
            return;
          }
          esm_default("chelonia/out/keyRequestResponse", {
            contractID,
            contractName,
            signingKeyId,
            data: krsEncryption ? encryptedOutgoingData(contractID, findSuitablePublicKeyIds(contractState, [SPMessage2.OP_KEY_REQUEST_SEEN], ["enc"])?.[0] || "", payload) : payload
          }).catch((e3) => {
            console.error("Error at respondToKeyRequest while sending keyRequestResponse in error handler", e3);
          });
        });
      },
      "chelonia/private/in/handleEvent": async function(contractID, rawMessage) {
        const state = esm_default(this.config.stateSelector);
        const { preHandleEvent, postHandleEvent, handleEventError } = this.config.hooks;
        let processingErrored = false;
        let message;
        try {
          if (!this.config.acceptAllMessages && !this.pending.some((entry) => entry?.contractID === contractID) && !this.subscriptionSet.has(contractID)) {
            console.warn(`[chelonia] WARN: ignoring unexpected event for ${contractID}:`, rawMessage);
            return;
          }
          const contractStateCopy = state[contractID] ? cloneDeep2(state[contractID]) : /* @__PURE__ */ Object.create(null);
          message = SPMessage2.deserialize(rawMessage, this.transientSecretKeys, contractStateCopy, this.config.unwrapMaybeEncryptedData);
          if (message.contractID() !== contractID) {
            throw new Error(`[chelonia] Wrong contract ID. Expected ${contractID} but got ${message.contractID()}`);
          }
          if (!message.isFirstMessage() && (!has(state.contracts, contractID) || !has(state, contractID))) {
            throw new ChelErrorUnrecoverable("The event is not for a first message but the contract state is missing");
          }
          preHandleEvent?.(message);
          const proceed = handleEvent.checkMessageOrdering.call(this, message);
          if (proceed === false)
            return;
          if (state[contractID]?._volatile?.dirty) {
            console.info(`[chelonia] Ignoring message ${message.description()} as the contract is marked as dirty`);
            return;
          }
          const internalSideEffectStack = !this.config.skipSideEffects ? [] : void 0;
          missingDecryptionKeyIdsMap.delete(message);
          try {
            await handleEvent.processMutation.call(this, message, contractStateCopy, internalSideEffectStack);
          } catch (e_) {
            const e2 = e_;
            if (e2?.name === "ChelErrorDecryptionKeyNotFound") {
              console.warn(`[chelonia] WARN '${e2.name}' in processMutation for ${message.description()}: ${e2.message}`, e2, message.serialize());
              if (e2.cause) {
                const missingDecryptionKeyIds = missingDecryptionKeyIdsMap.get(message);
                if (missingDecryptionKeyIds) {
                  missingDecryptionKeyIds.add(e2.cause);
                } else {
                  missingDecryptionKeyIdsMap.set(message, /* @__PURE__ */ new Set([e2.cause]));
                }
              }
            } else {
              console.error(`[chelonia] ERROR '${e2.name}' in processMutation for ${message.description()}: ${e2.message || e2}`, e2, message.serialize());
            }
            console.warn(`[chelonia] Error processing ${message.description()}: ${message.serialize()}. Any side effects will be skipped!`);
            if (this.config.strictProcessing) {
              throw e2;
            }
            processingErrored = e2?.name !== "ChelErrorWarning";
            this.config.hooks.processError?.(e2, message, getMsgMeta.call(this, message, contractID, contractStateCopy));
            if (e2.name === "ChelErrorUnrecoverable" || e2.name === "ChelErrorForkedChain" || message.isFirstMessage()) {
              throw e2;
            }
          }
          if (!processingErrored) {
            if (Array.isArray(internalSideEffectStack) && internalSideEffectStack.length > 0) {
              await Promise.all(internalSideEffectStack.map((fn) => Promise.resolve(fn({ state: contractStateCopy, message })).catch((e_) => {
                const e2 = e_;
                console.error(`[chelonia] ERROR '${e2.name}' in internal side effect for ${message.description()}: ${e2.message}`, e2, { message: message.serialize() });
              })));
            }
            if (!this.config.skipActionProcessing && !this.config.skipSideEffects) {
              await handleEvent.processSideEffects.call(this, message, contractStateCopy)?.catch((e_) => {
                const e2 = e_;
                console.error(`[chelonia] ERROR '${e2.name}' in sideEffect for ${message.description()}: ${e2.message}`, e2, { message: message.serialize() });
                this.config.hooks.sideEffectError?.(e2, message);
              });
            }
          }
          try {
            const state2 = esm_default(this.config.stateSelector);
            await handleEvent.applyProcessResult.call(this, { message, state: state2, contractState: contractStateCopy, processingErrored, postHandleEvent });
          } catch (e_) {
            const e2 = e_;
            console.error(`[chelonia] ERROR '${e2.name}' for ${message.description()} marking the event as processed: ${e2.message}`, e2, { message: message.serialize() });
          }
        } catch (e_) {
          const e2 = e_;
          console.error(`[chelonia] ERROR in handleEvent: ${e2.message || e2}`, e2);
          try {
            handleEventError?.(e2, message);
          } catch (e22) {
            console.error("[chelonia] Ignoring user error in handleEventError hook:", e22);
          }
          throw e2;
        } finally {
          if (message) {
            missingDecryptionKeyIdsMap.delete(message);
          }
        }
      }
    });
    eventsToReingest = [];
    reprocessDebounced = debounce((contractID) => esm_default("chelonia/private/out/sync", contractID, { force: true }).catch((e2) => {
      console.error(`[chelonia] Error at reprocessDebounced for ${contractID}`, e2);
    }), 1e3);
    handleEvent = {
      checkMessageOrdering(message) {
        const contractID = message.contractID();
        const hash3 = message.hash();
        const height = message.height();
        const state = esm_default(this.config.stateSelector);
        const latestProcessedHeight = state.contracts[contractID]?.height;
        if (!Number.isSafeInteger(height)) {
          throw new ChelErrorDBBadPreviousHEAD(`Message ${hash3} in contract ${contractID} has an invalid height.`);
        }
        if (message.isFirstMessage() ? latestProcessedHeight != null : !(latestProcessedHeight < height)) {
          if (!this.config.strictOrdering) {
            return false;
          }
          throw new ChelErrorAlreadyProcessed(`Message ${hash3} with height ${height} in contract ${contractID} has already been processed. Current height: ${latestProcessedHeight}.`);
        }
        if (latestProcessedHeight + 1 < height) {
          if (this.config.strictOrdering) {
            throw new ChelErrorDBBadPreviousHEAD(`Unexpected message ${hash3} with height ${height} in contract ${contractID}: height is too high. Current height: ${latestProcessedHeight}.`);
          }
          if (eventsToReingest.length > 100) {
            throw new ChelErrorUnrecoverable("more than 100 different bad previousHEAD errors");
          }
          if (!eventsToReingest.includes(hash3)) {
            console.warn(`[chelonia] WARN bad previousHEAD for ${message.description()}, will attempt to re-sync contract to reingest message`);
            eventsToReingest.push(hash3);
            reprocessDebounced(contractID);
            return false;
          } else {
            console.error(`[chelonia] ERROR already attempted to reingest ${message.description()}, will not attempt again!`);
            throw new ChelErrorDBBadPreviousHEAD(`Already attempted to reingest ${hash3}`);
          }
        }
        const reprocessIdx = eventsToReingest.indexOf(hash3);
        if (reprocessIdx !== -1) {
          console.warn(`[chelonia] WARN: successfully reingested ${message.description()}`);
          eventsToReingest.splice(reprocessIdx, 1);
        }
      },
      async processMutation(message, state, internalSideEffectStack) {
        const contractID = message.contractID();
        if (message.isFirstMessage()) {
          if (Object.keys(state).some((k) => k !== "_volatile")) {
            throw new ChelErrorUnrecoverable(`state for ${contractID} is already set`);
          }
        }
        await esm_default("chelonia/private/in/processMessage", message, state, internalSideEffectStack);
      },
      processSideEffects(message, state) {
        const opT = message.opType();
        if (![SPMessage2.OP_ATOMIC, SPMessage2.OP_ACTION_ENCRYPTED, SPMessage2.OP_ACTION_UNENCRYPTED].includes(opT)) {
          return;
        }
        const contractID = message.contractID();
        const manifestHash = message.manifest();
        const hash3 = message.hash();
        const height = message.height();
        const signingKeyId = message.signingKeyId();
        const callSideEffect = async (field) => {
          const wv = this.config.unwrapMaybeEncryptedData(field);
          if (!wv)
            return;
          let v2 = wv.data;
          let innerSigningKeyId;
          if (isSignedData(v2)) {
            innerSigningKeyId = v2.signingKeyId;
            v2 = v2.valueOf();
          }
          const { action, data, meta } = v2;
          const mutation = {
            data,
            meta,
            hash: hash3,
            height,
            contractID,
            description: message.description(),
            direction: message.direction(),
            signingKeyId,
            get signingContractID() {
              return getContractIDfromKeyId(contractID, signingKeyId, state);
            },
            innerSigningKeyId,
            get innerSigningContractID() {
              return getContractIDfromKeyId(contractID, innerSigningKeyId, state);
            }
          };
          return await esm_default(`${manifestHash}/${action}/sideEffect`, mutation, state);
        };
        const msg = Object(message.message());
        if (opT !== SPMessage2.OP_ATOMIC) {
          return callSideEffect(msg);
        }
        const reducer = (acc, [opT2, opV]) => {
          if ([SPMessage2.OP_ACTION_ENCRYPTED, SPMessage2.OP_ACTION_UNENCRYPTED].includes(opT2)) {
            acc.push(Object(opV));
          }
          return acc;
        };
        const actionsOpV = msg.reduce(reducer, []);
        return Promise.allSettled(actionsOpV.map((action) => callSideEffect(action))).then((results) => {
          const errors = results.filter((r) => r.status === "rejected").map((r) => r.reason);
          if (errors.length > 0) {
            console.error("Side-effect errors", contractID, errors);
            throw new AggregateError(errors, `Error at side effects for ${contractID}`);
          }
        });
      },
      async applyProcessResult({ message, state, contractState, processingErrored, postHandleEvent }) {
        const contractID = message.contractID();
        const hash3 = message.hash();
        const height = message.height();
        await esm_default("chelonia/db/addEntry", message);
        if (!processingErrored) {
          this.config.reactiveSet(state, contractID, contractState);
          try {
            postHandleEvent?.(message);
          } catch (e2) {
            console.error(`[chelonia] ERROR '${e2.name}' for ${message.description()} in event post-handling: ${e2.message}`, e2, { message: message.serialize() });
          }
        }
        if (message.isFirstMessage()) {
          const { type } = message.opValue();
          if (!has(state.contracts, contractID)) {
            this.config.reactiveSet(state.contracts, contractID, /* @__PURE__ */ Object.create(null));
          }
          this.config.reactiveSet(state.contracts[contractID], "type", type);
          console.debug(`contract ${type} registered for ${contractID}`);
        }
        if (message.isKeyOp()) {
          this.config.reactiveSet(state.contracts[contractID], "previousKeyOp", hash3);
        }
        this.config.reactiveSet(state.contracts[contractID], "HEAD", hash3);
        this.config.reactiveSet(state.contracts[contractID], "height", height);
        const missingDecryptionKeyIdsForMessage = missingDecryptionKeyIdsMap.get(message);
        if (missingDecryptionKeyIdsForMessage) {
          let missingDecryptionKeyIds = state.contracts[contractID].missingDecryptionKeyIds;
          if (!missingDecryptionKeyIds) {
            missingDecryptionKeyIds = [];
            this.config.reactiveSet(state.contracts[contractID], "missingDecryptionKeyIds", missingDecryptionKeyIds);
          }
          missingDecryptionKeyIdsForMessage.forEach((keyId3) => {
            if (missingDecryptionKeyIds.includes(keyId3))
              return;
            missingDecryptionKeyIds.push(keyId3);
          });
        }
        if (!this.subscriptionSet.has(contractID)) {
          const entry = this.pending.find((entry2) => entry2?.contractID === contractID);
          if (entry) {
            const index = this.pending.indexOf(entry);
            if (index !== -1) {
              this.pending.splice(index, 1);
            }
          }
          this.subscriptionSet.add(contractID);
          esm_default("okTurtles.events/emit", CONTRACTS_MODIFIED, Array.from(this.subscriptionSet), { added: [contractID], removed: [] });
        }
        if (!processingErrored) {
          esm_default("okTurtles.events/emit", hash3, contractID, message);
          esm_default("okTurtles.events/emit", EVENT_HANDLED, contractID, message);
        }
      }
    };
    notImplemented = (v2) => {
      throw new Error(`chelonia: action not implemented to handle: ${JSON.stringify(v2)}.`);
    };
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/time-sync.mjs
var wallBase, monotonicBase, resyncTimeout, watchdog, syncServerTime, time_sync_default;
var init_time_sync = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/time-sync.mjs"() {
    init_esm();
    wallBase = Date.now();
    monotonicBase = performance.now();
    syncServerTime = async function() {
      const startTime = performance.now();
      const time = await this.config.fetch(`${this.config.connectionURL}/time`, { signal: this.abortController.signal });
      const requestTimeElapsed = performance.now();
      if (requestTimeElapsed - startTime > 8e3) {
        throw new Error("Error fetching server time: request took too long");
      }
      if (!time.ok)
        throw new Error("Error fetching server time");
      const serverTime = new Date(await time.text()).valueOf();
      if (Number.isNaN(serverTime))
        throw new Error("Unable to parse server time");
      const newMonotonicBase = performance.now();
      wallBase = serverTime + (requestTimeElapsed - startTime) / 2 + // Also take into account the time elapsed between `requestTimeElapsed`
      // and this line (which should be very little)
      (newMonotonicBase - requestTimeElapsed);
      monotonicBase = newMonotonicBase;
    };
    time_sync_default = esm_default("sbp/selectors/register", {
      "chelonia/private/startClockSync": function() {
        if (resyncTimeout !== void 0) {
          throw new Error("chelonia/private/startClockSync has already been called");
        }
        const resync = (delay2 = 3e5) => {
          if (resyncTimeout !== null)
            return;
          const timeout = setTimeout(() => {
            syncServerTime.call(this).then(() => {
              if (resyncTimeout === timeout)
                resyncTimeout = null;
              resync();
            }).catch((e2) => {
              if (resyncTimeout === timeout) {
                resyncTimeout = null;
                console.error("Error re-syncing server time; will re-attempt in 5s", e2);
                setTimeout(() => resync(0), 5e3);
              } else {
                console.error("Error re-syncing server time; another attempt is in progress", e2);
              }
            });
          }, delay2);
          resyncTimeout = timeout;
        };
        let wallLast = Date.now();
        let monotonicLast = performance.now();
        watchdog = setInterval(() => {
          const wallNow = Date.now();
          const monotonicNow = performance.now();
          const difference2 = Math.abs(Math.abs(wallNow - wallLast) - Math.abs(monotonicNow - monotonicLast));
          if (difference2 > 10) {
            if (resyncTimeout != null)
              clearTimeout(resyncTimeout);
            resyncTimeout = null;
            resync(0);
          }
          wallLast = wallNow;
          monotonicLast = monotonicNow;
        }, 1e4);
        resyncTimeout = null;
        resync(0);
      },
      "chelonia/private/stopClockSync": () => {
        if (resyncTimeout !== void 0) {
          if (watchdog != null)
            clearInterval(watchdog);
          if (resyncTimeout != null)
            clearTimeout(resyncTimeout);
          watchdog = void 0;
          resyncTimeout = void 0;
        }
      },
      // Get an estimate of the server's current time based on the time elapsed as
      // measured locally (using a monotonic clock), which is used as an offset, and
      // a previously retrieved server time. The time value is returned as a UNIX
      // _millisecond_ timestamp (milliseconds since 1 Jan 1970 00:00:00 UTC)
      "chelonia/time": function() {
        const monotonicNow = performance.now();
        const wallNow = wallBase - monotonicBase + monotonicNow;
        return Math.round(wallNow);
      }
    });
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/chelonia.mjs
import { Buffer as Buffer6 } from "node:buffer";
function contractNameFromAction(action) {
  const regexResult = ACTION_REGEX.exec(action);
  const contractName = regexResult?.[2];
  if (!contractName)
    throw new Error(`Poorly named action '${action}': missing contract name.`);
  return contractName;
}
function outputEncryptedOrUnencryptedMessage({ contractID, innerSigningKeyId, encryptionKeyId, signingKeyId, data, meta }) {
  const state = esm_default(this.config.stateSelector)[contractID];
  const signedMessage = innerSigningKeyId ? state._vm.authorizedKeys[innerSigningKeyId] && state._vm.authorizedKeys[innerSigningKeyId]?._notAfterHeight == null ? signedOutgoingData(contractID, innerSigningKeyId, data, this.transientSecretKeys) : signedOutgoingDataWithRawKey(this.transientSecretKeys[innerSigningKeyId], data) : data;
  const payload = !encryptionKeyId ? signedMessage : encryptedOutgoingData(contractID, encryptionKeyId, signedMessage);
  const message = signedOutgoingData(contractID, signingKeyId, payload, this.transientSecretKeys);
  const rootState = esm_default(this.config.stateSelector);
  const height = String(rootState.contracts[contractID].height);
  const serializedData = { ...message.serialize((meta ?? "") + height), height };
  return serializedData;
}
function parseEncryptedOrUnencryptedMessage(ctx, { contractID, serializedData, meta }) {
  if (!serializedData) {
    throw new TypeError("[chelonia] parseEncryptedOrUnencryptedMessage: serializedData is required");
  }
  const state = esm_default(ctx.config.stateSelector)[contractID];
  const numericHeight = parseInt(serializedData.height);
  const rootState = esm_default(ctx.config.stateSelector);
  const currentHeight = rootState.contracts[contractID].height;
  if (!(numericHeight >= 0) || !(numericHeight <= currentHeight)) {
    throw new Error(`[chelonia] parseEncryptedOrUnencryptedMessage: Invalid height ${serializedData.height}; it must be between 0 and ${currentHeight}`);
  }
  const aad = (meta ?? "") + serializedData.height;
  const v2 = signedIncomingData(contractID, state, serializedData, numericHeight, aad, (message) => {
    return maybeEncryptedIncomingData(contractID, state, message, numericHeight, ctx.transientSecretKeys, aad, void 0);
  });
  let encryptionKeyId;
  let innerSigningKeyId;
  const unwrap = /* @__PURE__ */ (() => {
    let result2;
    return () => {
      if (!result2) {
        try {
          let unwrapped;
          unwrapped = v2.valueOf();
          if (isEncryptedData(unwrapped)) {
            encryptionKeyId = unwrapped.encryptionKeyId;
            unwrapped = unwrapped.valueOf();
            if (isSignedData(unwrapped)) {
              innerSigningKeyId = unwrapped.signingKeyId;
              unwrapped = unwrapped.valueOf();
            } else {
              innerSigningKeyId = null;
            }
          } else {
            encryptionKeyId = null;
            innerSigningKeyId = null;
          }
          result2 = [unwrapped];
        } catch (e2) {
          result2 = [void 0, e2];
        }
      }
      if (result2.length === 2) {
        throw result2[1];
      }
      return result2[0];
    };
  })();
  const result = {
    get contractID() {
      return contractID;
    },
    get innerSigningKeyId() {
      if (innerSigningKeyId === void 0) {
        try {
          unwrap();
        } catch {
        }
      }
      return innerSigningKeyId;
    },
    get encryptionKeyId() {
      if (encryptionKeyId === void 0) {
        try {
          unwrap();
        } catch {
        }
      }
      return encryptionKeyId;
    },
    get signingKeyId() {
      return v2.signingKeyId;
    },
    get data() {
      return unwrap();
    },
    get signingContractID() {
      return getContractIDfromKeyId(contractID, result.signingKeyId, state);
    },
    get innerSigningContractID() {
      return getContractIDfromKeyId(contractID, result.innerSigningKeyId, state);
    }
  };
  return result;
}
async function outEncryptedOrUnencryptedAction(opType, params) {
  const { atomic, action, contractID, data, hooks, publishOptions } = params;
  const contractName = contractNameFromAction(action);
  const manifestHash = this.config.contracts.manifests[contractName];
  const { contract } = this.manifestToContract[manifestHash];
  const state = contract.state(contractID);
  const meta = await contract.metadata.create();
  const unencMessage = { action, data, meta };
  const signedMessage = params.innerSigningKeyId ? state._vm.authorizedKeys[params.innerSigningKeyId] && state._vm.authorizedKeys[params.innerSigningKeyId]?._notAfterHeight == null ? signedOutgoingData(contractID, params.innerSigningKeyId, unencMessage, this.transientSecretKeys) : signedOutgoingDataWithRawKey(this.transientSecretKeys[params.innerSigningKeyId], unencMessage) : unencMessage;
  if (opType === SPMessage2.OP_ACTION_ENCRYPTED && !params.encryptionKeyId) {
    throw new Error("OP_ACTION_ENCRYPTED requires an encryption key ID be given");
  }
  if (params.encryptionKey) {
    if (params.encryptionKeyId !== keyId2(params.encryptionKey)) {
      throw new Error("OP_ACTION_ENCRYPTED raw encryption key does not match encryptionKeyId");
    }
  }
  const payload = opType === SPMessage2.OP_ACTION_UNENCRYPTED ? signedMessage : params.encryptionKey ? encryptedOutgoingDataWithRawKey(params.encryptionKey, signedMessage) : encryptedOutgoingData(contractID, params.encryptionKeyId, signedMessage);
  let message = SPMessage2.createV1_0({
    contractID,
    op: [
      opType,
      signedOutgoingData(contractID, params.signingKeyId, payload, this.transientSecretKeys)
    ],
    manifest: manifestHash
  });
  if (!atomic) {
    message = await esm_default("chelonia/private/out/publishEvent", message, publishOptions, hooks);
  }
  return message;
}
function gettersProxy(state, getters) {
  const proxyGetters = new Proxy({}, {
    get(_target, prop) {
      return getters[prop](state, proxyGetters);
    }
  });
  return { getters: proxyGetters };
}
var ACTION_REGEX, chelonia_default;
var init_chelonia = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/chelonia.mjs"() {
    init_esm2();
    init_esm4();
    init_esm();
    init_esm5();
    init_functions();
    init_pubsub();
    init_esm7();
    init_errors();
    init_events2();
    init_SPMessage();
    init_chelonia_utils();
    init_encryptedData();
    init_files();
    init_internals();
    init_signedData();
    init_time_sync();
    init_utils2();
    ACTION_REGEX = /^((([\w.]+)\/([^/]+))(?:\/(?:([^/]+)\/)?)?)\w*/;
    chelonia_default = esm_default("sbp/selectors/register", {
      // https://www.wordnik.com/words/chelonia
      // https://gitlab.okturtles.org/okturtles/group-income/-/wikis/E2E-Protocol/Framework.md#alt-names
      "chelonia/_init": function() {
        this.config = {
          // TODO: handle connecting to multiple servers for federation
          get connectionURL() {
            throw new Error("Invalid use of connectionURL before initialization");
          },
          // override!
          set connectionURL(value) {
            Object.defineProperty(this, "connectionURL", { value, writable: true });
          },
          stateSelector: "chelonia/private/state",
          // override to integrate with, for example, vuex
          contracts: {
            defaults: {
              modules: {},
              // '<module name>' => resolved module import
              exposedGlobals: {},
              allowedDomains: [],
              allowedSelectors: [],
              preferSlim: false
            },
            overrides: {},
            // override default values per-contract
            manifests: {}
            // override! contract names => manifest hashes
          },
          whitelisted: (action) => !!this.whitelistedActions[action],
          reactiveSet: (obj, key, value) => {
            obj[key] = value;
            return value;
          },
          // example: set to Vue.set
          fetch: (...args) => fetch(...args),
          reactiveDel: (obj, key) => {
            delete obj[key];
          },
          // acceptAllMessages disables checking whether we are expecting a message
          // or not for processing
          acceptAllMessages: false,
          skipActionProcessing: false,
          skipDecryptionAttempts: false,
          skipSideEffects: false,
          // Strict processing will treat all processing errors as unrecoverable
          // This is useful, e.g., in the server, to prevent invalid messages from
          // being added to the database
          strictProcessing: false,
          // Strict ordering will throw on past events with ChelErrorAlreadyProcessed
          // Similarly, future events will not be reingested and will throw
          // with ChelErrorDBBadPreviousHEAD
          strictOrdering: false,
          connectionOptions: {
            maxRetries: Infinity,
            // See https://github.com/okTurtles/group-income/issues/1183
            reconnectOnTimeout: true
            // can be enabled since we are not doing auth via web sockets
          },
          hooks: {
            preHandleEvent: null,
            // async (message: SPMessage) => {}
            postHandleEvent: null,
            // async (message: SPMessage) => {}
            processError: null,
            // (e: Error, message: SPMessage) => {}
            sideEffectError: null,
            // (e: Error, message: SPMessage) => {}
            handleEventError: null,
            // (e: Error, message: SPMessage) => {}
            syncContractError: null,
            // (e: Error, contractID: string) => {}
            pubsubError: null
            // (e:Error, socket: Socket)
          },
          unwrapMaybeEncryptedData
        };
        this._instance = /* @__PURE__ */ Object.create(null);
        this.abortController = new AbortController();
        this.state = {
          contracts: {},
          // contractIDs => { type, HEAD } (contracts we've subscribed to)
          pending: []
          // prevents processing unexpected data from a malicious server
        };
        this.manifestToContract = {};
        this.whitelistedActions = {};
        this.currentSyncs = /* @__PURE__ */ Object.create(null);
        this.postSyncOperations = /* @__PURE__ */ Object.create(null);
        this.sideEffectStacks = /* @__PURE__ */ Object.create(null);
        this.sideEffectStack = (contractID) => {
          let stack = this.sideEffectStacks[contractID];
          if (!stack) {
            this.sideEffectStacks[contractID] = stack = [];
          }
          return stack;
        };
        this.setPostSyncOp = (contractID, key, op) => {
          this.postSyncOperations[contractID] = this.postSyncOperations[contractID] || /* @__PURE__ */ Object.create(null);
          this.postSyncOperations[contractID][key] = op;
        };
        const secretKeyGetter = (o2, p) => {
          if (has(o2, p))
            return o2[p];
          const rootState = esm_default(this.config.stateSelector);
          if (rootState?.secretKeys && has(rootState.secretKeys, p)) {
            const key = deserializeKey2(rootState.secretKeys[p]);
            o2[p] = key;
            return key;
          }
        };
        const secretKeyList = (o2) => {
          const rootState = esm_default(this.config.stateSelector);
          const stateKeys = Object.keys(rootState?.secretKeys || {});
          return Array.from(/* @__PURE__ */ new Set([...Object.keys(o2), ...stateKeys]));
        };
        this.transientSecretKeys = new Proxy(/* @__PURE__ */ Object.create(null), {
          get: secretKeyGetter,
          ownKeys: secretKeyList
        });
        this.ephemeralReferenceCount = /* @__PURE__ */ Object.create(null);
        this.subscriptionSet = /* @__PURE__ */ new Set();
        this.pending = [];
      },
      "chelonia/config": function() {
        return {
          ...cloneDeep2(this.config),
          fetch: this.config.fetch,
          reactiveSet: this.config.reactiveSet,
          reactiveDel: this.config.reactiveDel
        };
      },
      "chelonia/configure": async function(config) {
        merge(this.config, config);
        Object.assign(this.config.hooks, config.hooks || {});
        if (config.contracts) {
          Object.assign(this.config.contracts.defaults, config.contracts.defaults || {});
          const manifests = this.config.contracts.manifests;
          console.debug("[chelonia] preloading manifests:", Object.keys(manifests));
          for (const contractName in manifests) {
            await esm_default("chelonia/private/loadManifest", contractName, manifests[contractName]);
          }
        }
        if (has(config, "skipDecryptionAttempts")) {
          if (config.skipDecryptionAttempts) {
            this.config.unwrapMaybeEncryptedData = (data) => {
              if (!isEncryptedData(data)) {
                return {
                  encryptionKeyId: null,
                  data
                };
              }
            };
          } else {
            this.config.unwrapMaybeEncryptedData = unwrapMaybeEncryptedData;
          }
        }
      },
      "chelonia/reset": async function(newState, postCleanupFn) {
        if (typeof newState === "function" && typeof postCleanupFn === "undefined") {
          postCleanupFn = newState;
          newState = void 0;
        }
        if (this.pubsub) {
          esm_default("chelonia/private/stopClockSync");
        }
        Object.keys(this.postSyncOperations).forEach((cID) => {
          esm_default("chelonia/private/enqueuePostSyncOps", cID);
        });
        await esm_default("chelonia/contract/waitPublish");
        await esm_default("chelonia/contract/wait");
        Object.keys(this.postSyncOperations).forEach((cID) => {
          esm_default("chelonia/private/enqueuePostSyncOps", cID);
        });
        await esm_default("chelonia/contract/waitPublish");
        await esm_default("chelonia/contract/wait");
        const result = await postCleanupFn?.();
        const rootState = esm_default(this.config.stateSelector);
        this._instance = /* @__PURE__ */ Object.create(null);
        this.abortController.abort();
        this.abortController = new AbortController();
        reactiveClearObject(rootState, this.config.reactiveDel);
        this.config.reactiveSet(rootState, "contracts", /* @__PURE__ */ Object.create(null));
        clearObject(this.ephemeralReferenceCount);
        this.pending.splice(0);
        clearObject(this.currentSyncs);
        clearObject(this.postSyncOperations);
        clearObject(this.sideEffectStacks);
        const removedContractIDs = Array.from(this.subscriptionSet);
        this.subscriptionSet.clear();
        esm_default("chelonia/clearTransientSecretKeys");
        esm_default("okTurtles.events/emit", CHELONIA_RESET);
        esm_default("okTurtles.events/emit", CONTRACTS_MODIFIED, Array.from(this.subscriptionSet), { added: [], removed: removedContractIDs });
        if (this.pubsub) {
          esm_default("chelonia/private/startClockSync");
        }
        if (newState) {
          Object.entries(newState).forEach(([key, value]) => {
            this.config.reactiveSet(rootState, key, value);
          });
        }
        return result;
      },
      "chelonia/storeSecretKeys": function(wkeys) {
        const rootState = esm_default(this.config.stateSelector);
        if (!rootState.secretKeys)
          this.config.reactiveSet(rootState, "secretKeys", /* @__PURE__ */ Object.create(null));
        let keys = wkeys.valueOf();
        if (!keys)
          return;
        if (!Array.isArray(keys))
          keys = [keys];
        keys.forEach(({ key, transient }) => {
          if (!key)
            return;
          if (typeof key === "string") {
            key = deserializeKey2(key);
          }
          const id = keyId2(key);
          if (!has(this.transientSecretKeys, id)) {
            this.transientSecretKeys[id] = key;
          }
          if (transient)
            return;
          if (!has(rootState.secretKeys, id)) {
            this.config.reactiveSet(rootState.secretKeys, id, serializeKey2(key, true));
          }
        });
      },
      "chelonia/clearTransientSecretKeys": function(ids) {
        if (Array.isArray(ids)) {
          ids.forEach((id) => {
            delete this.transientSecretKeys[id];
          });
        } else {
          Object.keys(this.transientSecretKeys).forEach((id) => {
            delete this.transientSecretKeys[id];
          });
        }
      },
      "chelonia/haveSecretKey": function(keyId3, persistent) {
        if (!persistent && has(this.transientSecretKeys, keyId3))
          return true;
        const rootState = esm_default(this.config.stateSelector);
        return !!rootState?.secretKeys && has(rootState.secretKeys, keyId3);
      },
      "chelonia/contract/isResyncing": function(contractIDOrState) {
        if (typeof contractIDOrState === "string") {
          const rootState = esm_default(this.config.stateSelector);
          contractIDOrState = rootState[contractIDOrState];
        }
        return !!contractIDOrState?._volatile?.dirty || !!contractIDOrState?._volatile?.resyncing;
      },
      "chelonia/contract/hasKeyShareBeenRespondedBy": function(contractIDOrState, requestedToContractID, reference) {
        if (typeof contractIDOrState === "string") {
          const rootState = esm_default(this.config.stateSelector);
          contractIDOrState = rootState[contractIDOrState];
        }
        const result = Object.values(contractIDOrState?._vm.authorizedKeys || {}).some((r) => {
          return r?.meta?.keyRequest?.responded && r.meta.keyRequest.contractID === requestedToContractID && (!reference || r.meta.keyRequest.reference === reference);
        });
        return result;
      },
      "chelonia/contract/waitingForKeyShareTo": function(contractIDOrState, requestingContractID, reference) {
        if (typeof contractIDOrState === "string") {
          const rootState = esm_default(this.config.stateSelector);
          contractIDOrState = rootState[contractIDOrState];
        }
        const result = contractIDOrState._volatile?.pendingKeyRequests?.filter((r) => {
          return r && (!requestingContractID || r.contractID === requestingContractID) && (!reference || r.reference === reference);
        })?.map(({ name }) => name);
        if (!result?.length)
          return null;
        return result;
      },
      "chelonia/contract/successfulKeySharesByContractID": function(contractIDOrState, requestingContractID) {
        if (typeof contractIDOrState === "string") {
          const rootState = esm_default(this.config.stateSelector);
          contractIDOrState = rootState[contractIDOrState];
        }
        const keyShares = Object.values(contractIDOrState._vm.keyshares || {});
        if (!keyShares?.length)
          return;
        const result = /* @__PURE__ */ Object.create(null);
        keyShares.forEach((kS) => {
          if (!kS.success)
            return;
          if (requestingContractID && kS.contractID !== requestingContractID)
            return;
          if (!result[kS.contractID])
            result[kS.contractID] = [];
          result[kS.contractID].push({ height: kS.height, hash: kS.hash });
        });
        Object.keys(result).forEach((cID) => {
          result[cID].sort((a, b) => {
            return b.height - a.height;
          });
        });
        return result;
      },
      "chelonia/contract/hasKeysToPerformOperation": function(contractIDOrState, operation) {
        if (typeof contractIDOrState === "string") {
          const rootState = esm_default(this.config.stateSelector);
          contractIDOrState = rootState[contractIDOrState];
        }
        const op = operation !== "*" ? [operation] : operation;
        return !!findSuitableSecretKeyId(contractIDOrState, op, ["sig"]);
      },
      // Did sourceContractIDOrState receive an OP_KEY_SHARE to perform the given
      // operation on contractIDOrState?
      "chelonia/contract/receivedKeysToPerformOperation": function(sourceContractIDOrState, contractIDOrState, operation) {
        const rootState = esm_default(this.config.stateSelector);
        if (typeof sourceContractIDOrState === "string") {
          sourceContractIDOrState = rootState[sourceContractIDOrState];
        }
        if (typeof contractIDOrState === "string") {
          contractIDOrState = rootState[contractIDOrState];
        }
        const op = operation !== "*" ? [operation] : operation;
        const keyId3 = findSuitableSecretKeyId(contractIDOrState, op, ["sig"]);
        return sourceContractIDOrState?._vm?.sharedKeyIds?.some((sK) => sK.id === keyId3);
      },
      "chelonia/contract/currentKeyIdByName": function(contractIDOrState, name, requireSecretKey) {
        if (typeof contractIDOrState === "string") {
          const rootState = esm_default(this.config.stateSelector);
          contractIDOrState = rootState[contractIDOrState];
        }
        const currentKeyId = findKeyIdByName(contractIDOrState, name);
        if (requireSecretKey && !esm_default("chelonia/haveSecretKey", currentKeyId)) {
          return;
        }
        return currentKeyId;
      },
      "chelonia/contract/foreignKeysByContractID": function(contractIDOrState, foreignContractID) {
        if (typeof contractIDOrState === "string") {
          const rootState = esm_default(this.config.stateSelector);
          contractIDOrState = rootState[contractIDOrState];
        }
        return findForeignKeysByContractID(contractIDOrState, foreignContractID);
      },
      "chelonia/contract/historicalKeyIdsByName": function(contractIDOrState, name) {
        if (typeof contractIDOrState === "string") {
          const rootState = esm_default(this.config.stateSelector);
          contractIDOrState = rootState[contractIDOrState];
        }
        const currentKeyId = findKeyIdByName(contractIDOrState, name);
        const revokedKeyIds = findRevokedKeyIdsByName(contractIDOrState, name);
        return currentKeyId ? [currentKeyId, ...revokedKeyIds] : revokedKeyIds;
      },
      "chelonia/contract/suitableSigningKey": function(contractIDOrState, permissions, purposes, ringLevel, allowedActions) {
        if (typeof contractIDOrState === "string") {
          const rootState = esm_default(this.config.stateSelector);
          contractIDOrState = rootState[contractIDOrState];
        }
        const keyId3 = findSuitableSecretKeyId(contractIDOrState, permissions, purposes, ringLevel, allowedActions);
        return keyId3;
      },
      "chelonia/contract/setPendingKeyRevocation": function(contractID, names) {
        const rootState = esm_default(this.config.stateSelector);
        const state = rootState[contractID];
        if (!state._volatile)
          this.config.reactiveSet(state, "_volatile", /* @__PURE__ */ Object.create(null));
        if (!state._volatile.pendingKeyRevocations)
          this.config.reactiveSet(state._volatile, "pendingKeyRevocations", /* @__PURE__ */ Object.create(null));
        for (const name of names) {
          const keyId3 = findKeyIdByName(state, name);
          if (keyId3) {
            this.config.reactiveSet(state._volatile.pendingKeyRevocations, keyId3, true);
          } else {
            console.warn("[setPendingKeyRevocation] Unable to find keyId for name", { contractID, name });
          }
        }
      },
      "chelonia/shelterAuthorizationHeader"(contractID) {
        return buildShelterAuthorizationHeader.call(this, contractID);
      },
      // The purpose of the 'chelonia/crypto/*' selectors is so that they can be called
      // from contracts without including the crypto code (i.e., importing crypto.js)
      // This function takes a function as a parameter that returns a string
      // It does not a string directly to prevent accidentally logging the value,
      // which is a secret
      "chelonia/crypto/keyId": (inKey) => {
        return keyId2(inKey.valueOf());
      },
      // TODO: allow connecting to multiple servers at once
      "chelonia/connect": function(options2 = {}) {
        if (!this.config.connectionURL)
          throw new Error("config.connectionURL missing");
        if (!this.config.connectionOptions)
          throw new Error("config.connectionOptions missing");
        if (this.pubsub) {
          this.pubsub.destroy();
        }
        let pubsubURL = this.config.connectionURL;
        if (process.env.NODE_ENV === "development") {
          pubsubURL += `?debugID=${randomHexString(6)}`;
        }
        if (this.pubsub) {
          esm_default("chelonia/private/stopClockSync");
        }
        esm_default("chelonia/private/startClockSync");
        this.pubsub = createClient2(pubsubURL, {
          ...this.config.connectionOptions,
          handlers: {
            ...options2.handlers,
            // Every time we get a REQUEST_TYPE.SUB response, which happens for
            // 'new' subscriptions as well as every time the connection is reset
            "subscription-succeeded": function(event) {
              const { channelID } = event.detail;
              if (this.subscriptionSet.has(channelID)) {
                esm_default("chelonia/private/out/sync", channelID, { force: true }).catch((err) => {
                  console.warn(`[chelonia] Syncing contract ${channelID} failed: ${err.message}`);
                });
              }
              options2.handlers?.["subscription-succeeded"]?.call(this, event);
            }
          },
          // Map message handlers to transparently handle encryption and signatures
          messageHandlers: {
            ...Object.fromEntries(Object.entries(options2.messageHandlers || {}).map(([k, v2]) => {
              switch (k) {
                case NOTIFICATION_TYPE2.PUB:
                  return [k, (msg) => {
                    if (!msg.channelID) {
                      console.info("[chelonia] Discarding pub event without channelID");
                      return;
                    }
                    if (!this.subscriptionSet.has(msg.channelID)) {
                      console.info(`[chelonia] Discarding pub event for ${msg.channelID} because it's not in the current subscriptionSet`);
                      return;
                    }
                    esm_default("chelonia/queueInvocation", msg.channelID, () => {
                      v2.call(this.pubsub, parseEncryptedOrUnencryptedMessage(this, {
                        contractID: msg.channelID,
                        serializedData: msg.data
                      }));
                    }).catch((e2) => {
                      console.error(`[chelonia] Error processing pub event for ${msg.channelID}`, e2);
                    });
                  }];
                case NOTIFICATION_TYPE2.KV:
                  return [k, (msg) => {
                    if (!msg.channelID || !msg.key) {
                      console.info("[chelonia] Discarding kv event without channelID or key");
                      return;
                    }
                    if (!this.subscriptionSet.has(msg.channelID)) {
                      console.info(`[chelonia] Discarding kv event for ${msg.channelID} because it's not in the current subscriptionSet`);
                      return;
                    }
                    esm_default("chelonia/queueInvocation", msg.channelID, () => {
                      v2.call(this.pubsub, [msg.key, parseEncryptedOrUnencryptedMessage(this, {
                        contractID: msg.channelID,
                        meta: msg.key,
                        serializedData: JSON.parse(Buffer6.from(msg.data).toString())
                      })]);
                    }).catch((e2) => {
                      console.error(`[chelonia] Error processing kv event for ${msg.channelID} and key ${msg.key}`, msg, e2);
                    });
                  }];
                case NOTIFICATION_TYPE2.DELETION:
                  return [k, (msg) => v2.call(this.pubsub, msg.data)];
                default:
                  return [k, v2];
              }
            })),
            [NOTIFICATION_TYPE2.ENTRY](msg) {
              const { contractID } = SPMessage2.deserializeHEAD(msg.data);
              esm_default("chelonia/private/in/enqueueHandleEvent", contractID, msg.data);
            }
          }
        });
        if (!this.contractsModifiedListener) {
          this.contractsModifiedListener = () => esm_default("chelonia/pubsub/update");
          esm_default("okTurtles.events/on", CONTRACTS_MODIFIED, this.contractsModifiedListener);
        }
        return this.pubsub;
      },
      // This selector is defined primarily for ingesting web push notifications,
      // although it can be used as a general-purpose API to process events received
      // from other external sources that are not managed by Chelonia itself (i.e. sources
      // other than the Chelonia-managed websocket connection and RESTful API).
      "chelonia/handleEvent": async function(event) {
        const { contractID } = SPMessage2.deserializeHEAD(event);
        return await esm_default("chelonia/private/in/enqueueHandleEvent", contractID, event);
      },
      "chelonia/defineContract": function(contract) {
        if (!ACTION_REGEX.exec(contract.name))
          throw new Error(`bad contract name: ${contract.name}`);
        if (!contract.metadata)
          contract.metadata = { validate() {
          }, create: () => ({}) };
        if (!contract.getters)
          contract.getters = {};
        contract.state = (contractID) => esm_default(this.config.stateSelector)[contractID];
        contract.manifest = this.defContractManifest;
        contract.sbp = this.defContractSBP;
        this.defContractSelectors = [];
        this.defContract = contract;
        this.defContractSelectors.push(...esm_default("sbp/selectors/register", {
          // expose getters for Vuex integration and other conveniences
          [`${contract.manifest}/${contract.name}/getters`]: () => contract.getters,
          // 2 ways to cause sideEffects to happen: by defining a sideEffect function in the
          // contract, or by calling /pushSideEffect w/async SBP call. Can also do both.
          [`${contract.manifest}/${contract.name}/pushSideEffect`]: (contractID, asyncSbpCall) => {
            const [sel] = asyncSbpCall;
            if (sel.startsWith(contract.name + "/")) {
              asyncSbpCall[0] = `${contract.manifest}/${sel}`;
            }
            this.sideEffectStack(contractID).push(asyncSbpCall);
          }
        }));
        for (const action in contract.actions) {
          contractNameFromAction(action);
          this.whitelistedActions[action] = true;
          this.defContractSelectors.push(...esm_default("sbp/selectors/register", {
            [`${contract.manifest}/${action}/process`]: async (message, state) => {
              const { meta, data, contractID } = message;
              state = state || contract.state(contractID);
              const gProxy = gettersProxy(state, contract.getters);
              await contract.metadata.validate(meta, { state, ...gProxy, contractID });
              await contract.actions[action].validate(data, { state, ...gProxy, meta, message, contractID });
              this.sideEffectStacks[contractID] = [];
              await contract.actions[action].process(message, { state, ...gProxy });
            },
            // 'mutation' is an object that's similar to 'message', but not identical
            [`${contract.manifest}/${action}/sideEffect`]: async (mutation, state) => {
              if (contract.actions[action].sideEffect) {
                state = state || contract.state(mutation.contractID);
                if (!state) {
                  console.warn(`[${contract.manifest}/${action}/sideEffect]: Skipping side-effect since there is no contract state for contract ${mutation.contractID}`);
                  return;
                }
                const stateCopy = cloneDeep2(state);
                const gProxy = gettersProxy(stateCopy, contract.getters);
                await contract.actions[action].sideEffect(mutation, { state: stateCopy, ...gProxy });
              }
              const sideEffects = this.sideEffectStack(mutation.contractID);
              while (sideEffects.length > 0) {
                const sideEffect = sideEffects.shift();
                try {
                  await contract.sbp(...sideEffect);
                } catch (e_) {
                  const e2 = e_;
                  console.error(`[chelonia] ERROR: '${e2.name}' ${e2.message}, for pushed sideEffect of ${mutation.description}:`, sideEffect);
                  this.sideEffectStacks[mutation.contractID] = [];
                  throw e2;
                }
              }
            }
          }));
        }
        for (const method in contract.methods) {
          this.defContractSelectors.push(...esm_default("sbp/selectors/register", {
            [`${contract.manifest}/${method}`]: contract.methods[method]
          }));
        }
        esm_default("okTurtles.events/emit", CONTRACT_REGISTERED, contract);
      },
      "chelonia/queueInvocation": (contractID, sbpInvocation) => {
        return esm_default("chelonia/private/queueEvent", contractID, ["chelonia/private/noop"]).then(() => esm_default("chelonia/private/queueEvent", "public:" + contractID, sbpInvocation));
      },
      "chelonia/begin": async (...invocations) => {
        for (const invocation of invocations) {
          await esm_default(...invocation);
        }
      },
      // call this manually to resubscribe/unsubscribe from contracts as needed
      // if you are using a custom stateSelector and reload the state (e.g. upon login)
      "chelonia/pubsub/update": function() {
        const client = this.pubsub;
        const subscribedIDs = [...client.subscriptionSet];
        const currentIDs = Array.from(this.subscriptionSet);
        const leaveSubscribed = intersection(subscribedIDs, currentIDs);
        const toUnsubscribe = difference(subscribedIDs, leaveSubscribed);
        const toSubscribe = difference(currentIDs, leaveSubscribed);
        try {
          for (const contractID of toUnsubscribe) {
            client.unsub(contractID);
          }
          for (const contractID of toSubscribe) {
            client.sub(contractID);
          }
        } catch (e2) {
          console.error(`[chelonia] pubsub/update: error ${e2.name}: ${e2.message}`, { toUnsubscribe, toSubscribe }, e2);
          this.config.hooks.pubsubError?.(e2, client);
        }
      },
      // resolves when all pending actions for these contractID(s) finish
      "chelonia/contract/wait": function(contractIDs) {
        const listOfIds = contractIDs ? typeof contractIDs === "string" ? [contractIDs] : contractIDs : Object.keys(esm_default(this.config.stateSelector).contracts);
        return Promise.all(listOfIds.flatMap((cID) => {
          return esm_default("chelonia/queueInvocation", cID, ["chelonia/private/noop"]);
        }));
      },
      // resolves when all pending *writes* for these contractID(s) finish
      "chelonia/contract/waitPublish": function(contractIDs) {
        const listOfIds = contractIDs ? typeof contractIDs === "string" ? [contractIDs] : contractIDs : Object.keys(esm_default(this.config.stateSelector).contracts);
        return Promise.all(listOfIds.flatMap((cID) => {
          return esm_default("chelonia/private/queueEvent", `publish:${cID}`, ["chelonia/private/noop"]);
        }));
      },
      // 'chelonia/contract' - selectors related to injecting remote data and monitoring contracts
      // TODO: add an optional parameter to "retain" the contract (see #828)
      // eslint-disable-next-line require-await
      "chelonia/contract/sync": async function(contractIDs, params) {
        const listOfIds = typeof contractIDs === "string" ? [contractIDs] : contractIDs;
        listOfIds.forEach((id) => {
          if (checkCanBeGarbageCollected.call(this, id)) {
            if (process.env.CI) {
              Promise.reject(new Error("[chelonia] Missing reference count for contract " + id));
            }
            console.error("[chelonia] Missing reference count for contract " + id);
            throw new Error("Missing reference count for contract");
          }
        });
        return esm_default("chelonia/private/out/sync", listOfIds, { ...params, force: true });
      },
      "chelonia/contract/isSyncing": function(contractID, { firstSync = false } = {}) {
        const isSyncing = !!this.currentSyncs[contractID];
        return firstSync ? isSyncing && this.currentSyncs[contractID].firstSync : isSyncing;
      },
      "chelonia/contract/currentSyncs": function() {
        return Object.keys(this.currentSyncs);
      },
      // Because `/remove` is done asynchronously and a contract might be removed
      // much later than when the call to remove was made, an optional callback
      // can be passed to verify whether to proceed with removal. This is used as
      // part of the `/release` mechanism to prevent removing contracts that have
      // acquired new references since the call to `/remove`.
      "chelonia/contract/remove": function(contractIDs, { confirmRemovalCallback, permanent } = {}) {
        const rootState = esm_default(this.config.stateSelector);
        const listOfIds = typeof contractIDs === "string" ? [contractIDs] : contractIDs;
        return Promise.all(listOfIds.map((contractID) => {
          if (!rootState?.contracts?.[contractID]) {
            return void 0;
          }
          return esm_default("chelonia/private/queueEvent", contractID, () => {
            if (confirmRemovalCallback && !confirmRemovalCallback(contractID)) {
              return;
            }
            const rootState2 = esm_default(this.config.stateSelector);
            const fkContractIDs = Array.from(new Set(Object.values(rootState2[contractID]?._vm?.authorizedKeys ?? {}).filter((k) => {
              return !!k.foreignKey;
            }).map((k) => {
              try {
                const fkUrl = new URL(k.foreignKey);
                return fkUrl.pathname;
              } catch {
                return void 0;
              }
            }).filter(Boolean)));
            esm_default("chelonia/private/removeImmediately", contractID, { permanent });
            if (fkContractIDs.length) {
              esm_default("chelonia/contract/release", fkContractIDs, { try: true }).catch((e2) => {
                console.error("[chelonia] Error attempting to release foreign key contracts", e2);
              });
            }
          });
        }));
      },
      "chelonia/contract/retain": async function(contractIDs, params) {
        const listOfIds = typeof contractIDs === "string" ? [contractIDs] : contractIDs;
        const rootState = esm_default(this.config.stateSelector);
        if (listOfIds.length === 0)
          return Promise.resolve();
        const checkIfDeleted = (id) => {
          if (rootState.contracts[id] === null) {
            console.error("[chelonia/contract/retain] Called /retain on permanently deleted contract.", id);
            throw new ChelErrorResourceGone("Unable to retain permanently deleted contract " + id);
          }
        };
        if (!params?.ephemeral) {
          listOfIds.forEach((id) => {
            checkIfDeleted(id);
            if (!has(rootState.contracts, id)) {
              this.config.reactiveSet(rootState.contracts, id, /* @__PURE__ */ Object.create(null));
            }
            this.config.reactiveSet(rootState.contracts[id], "references", (rootState.contracts[id].references ?? 0) + 1);
          });
        } else {
          listOfIds.forEach((id) => {
            checkIfDeleted(id);
            if (!has(this.ephemeralReferenceCount, id)) {
              this.ephemeralReferenceCount[id] = 1;
            } else {
              this.ephemeralReferenceCount[id] = this.ephemeralReferenceCount[id] + 1;
            }
          });
        }
        return await esm_default("chelonia/private/out/sync", listOfIds);
      },
      // the `try` parameter does not affect (ephemeral or persistent) reference
      // counts, but rather removes a contract if the reference count is zero
      // and the contract isn't being monitored for foreign keys. This parameter
      // is meant mostly for internal chelonia use, so that removing or releasing
      // a contract can also remove other contracts that this first contract
      // was monitoring.
      "chelonia/contract/release": async function(contractIDs, params) {
        const listOfIds = typeof contractIDs === "string" ? [contractIDs] : contractIDs;
        const rootState = esm_default(this.config.stateSelector);
        if (!params?.try) {
          if (!params?.ephemeral) {
            listOfIds.forEach((id) => {
              if (rootState.contracts[id] === null) {
                console.warn("[chelonia/contract/release] Called /release on permanently deleted contract. This has no effect.", id);
                return;
              }
              if (has(rootState.contracts, id) && has(rootState.contracts[id], "references")) {
                const current = rootState.contracts[id].references;
                if (current === 0) {
                  console.error("[chelonia/contract/release] Invalid negative reference count for", id);
                  if (process.env.CI) {
                    Promise.reject(new Error("Invalid negative reference count: " + id));
                  }
                  throw new Error("Invalid negative reference count");
                }
                if (current <= 1) {
                  this.config.reactiveDel(rootState.contracts[id], "references");
                } else {
                  this.config.reactiveSet(rootState.contracts[id], "references", current - 1);
                }
              } else {
                console.error("[chelonia/contract/release] Invalid negative reference count for", id);
                if (process.env.CI) {
                  Promise.reject(new Error("Invalid negative reference count: " + id));
                }
                throw new Error("Invalid negative reference count");
              }
            });
          } else {
            listOfIds.forEach((id) => {
              if (rootState.contracts[id] === null) {
                console.warn("[chelonia/contract/release] Called /release on permanently deleted contract. This has no effect.", id);
                return;
              }
              if (has(this.ephemeralReferenceCount, id)) {
                const current = this.ephemeralReferenceCount[id] ?? 0;
                if (current <= 1) {
                  delete this.ephemeralReferenceCount[id];
                } else {
                  this.ephemeralReferenceCount[id] = current - 1;
                }
              } else {
                console.error("[chelonia/contract/release] Invalid negative ephemeral reference count for", id);
                if (process.env.CI) {
                  Promise.reject(new Error("Invalid negative ephemeral reference count: " + id));
                }
                throw new Error("Invalid negative ephemeral reference count");
              }
            });
          }
        }
        const boundCheckCanBeGarbageCollected = checkCanBeGarbageCollected.bind(this);
        const idsToRemove = listOfIds.filter(boundCheckCanBeGarbageCollected);
        return idsToRemove.length ? await esm_default("chelonia/contract/remove", idsToRemove, { confirmRemovalCallback: boundCheckCanBeGarbageCollected }) : void 0;
      },
      "chelonia/contract/disconnect": async function(contractID, contractIDToDisconnect) {
        const state = esm_default(this.config.stateSelector);
        const contractState = state[contractID];
        const keyIds = Object.values(contractState._vm.authorizedKeys).filter((k) => {
          return k._notAfterHeight == null && k.meta?.keyRequest?.contractID === contractIDToDisconnect;
        }).map((k) => k.id);
        if (!keyIds.length)
          return;
        return await esm_default("chelonia/out/keyDel", {
          contractID,
          contractName: contractState._vm.type,
          data: keyIds,
          signingKeyId: findSuitableSecretKeyId(contractState, [SPMessage2.OP_KEY_DEL], ["sig"])
        });
      },
      "chelonia/in/processMessage": function(messageOrRawMessage, state) {
        const stateCopy = cloneDeep2(state);
        const message = typeof messageOrRawMessage === "string" ? SPMessage2.deserialize(messageOrRawMessage, this.transientSecretKeys, stateCopy, this.config.unwrapMaybeEncryptedData) : messageOrRawMessage;
        return esm_default("chelonia/private/in/processMessage", message, stateCopy).then(() => stateCopy).catch((e2) => {
          console.warn(`chelonia/in/processMessage: reverting mutation ${message.description()}: ${message.serialize()}`, e2);
          return state;
        });
      },
      "chelonia/out/fetchResource": async function(cid, { code } = {}) {
        const parsedCID = parseCID2(cid);
        if (code != null) {
          if (parsedCID.code !== code) {
            throw new Error(`Invalid CID content type. Expected ${code}, got ${parsedCID.code}`);
          }
        }
        const local = await esm_default("chelonia.db/get", cid);
        if (local != null)
          return local;
        const url = `${this.config.connectionURL}/file/${cid}`;
        const data = await this.config.fetch(url, { signal: this.abortController.signal }).then(handleFetchResult2("text"));
        const ourHash = createCID3(data, parsedCID.code);
        if (ourHash !== cid) {
          throw new Error(`expected hash ${cid}. Got: ${ourHash}`);
        }
        await esm_default("chelonia.db/set", cid, data);
        return data;
      },
      "chelonia/out/latestHEADInfo": function(contractID) {
        return this.config.fetch(`${this.config.connectionURL}/latestHEADinfo/${contractID}`, {
          cache: "no-store",
          signal: this.abortController.signal
        }).then(handleFetchResult2("json"));
      },
      "chelonia/out/eventsAfter": eventsAfter2,
      "chelonia/out/eventsBefore": function(contractID, { beforeHeight, limit, stream }) {
        if (limit <= 0) {
          console.error('[chelonia] invalid params error: "limit" needs to be positive integer');
        }
        const offset = Math.max(0, beforeHeight - limit + 1);
        const eventsAfterLimit = Math.min(beforeHeight + 1, limit);
        return esm_default("chelonia/out/eventsAfter", contractID, { sinceHeight: offset, limit: eventsAfterLimit, stream });
      },
      "chelonia/out/eventsBetween": function(contractID, { startHash, endHeight, offset = 0, limit = 0, stream = true }) {
        if (offset < 0) {
          console.error('[chelonia] invalid params error: "offset" needs to be positive integer or zero');
          return;
        }
        let reader;
        const s = new ReadableStream({
          start: async (controller) => {
            const first = await this.config.fetch(`${this.config.connectionURL}/file/${startHash}`, { signal: this.abortController.signal }).then(handleFetchResult2("text"));
            const deserializedHEAD = SPMessage2.deserializeHEAD(first);
            if (deserializedHEAD.contractID !== contractID) {
              controller.error(new Error("chelonia/out/eventsBetween: Mismatched contract ID"));
              return;
            }
            const startOffset = Math.max(0, deserializedHEAD.head.height - offset);
            const ourLimit = limit ? Math.min(endHeight - startOffset + 1, limit) : endHeight - startOffset + 1;
            if (ourLimit < 1) {
              controller.close();
              return;
            }
            reader = esm_default("chelonia/out/eventsAfter", contractID, { sinceHeight: startOffset, limit: ourLimit }).getReader();
          },
          async pull(controller) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
            } else {
              controller.enqueue(value);
            }
          }
        });
        if (stream)
          return s;
        return collectEventStream(s);
      },
      "chelonia/rootState": function() {
        return esm_default(this.config.stateSelector);
      },
      "chelonia/latestContractState": async function(contractID, options2 = { forceSync: false }) {
        const rootState = esm_default(this.config.stateSelector);
        if (rootState.contracts[contractID] === null) {
          throw new ChelErrorResourceGone("Permanently deleted contract " + contractID);
        }
        if (!options2.forceSync && rootState[contractID] && Object.keys(rootState[contractID]).some((x2) => x2 !== "_volatile")) {
          return cloneDeep2(rootState[contractID]);
        }
        let state = /* @__PURE__ */ Object.create(null);
        let contractName = rootState.contracts[contractID]?.type;
        const eventsStream = esm_default("chelonia/out/eventsAfter", contractID, { sinceHeight: 0, sinceHash: contractID });
        const eventsStreamReader = eventsStream.getReader();
        if (rootState[contractID])
          state._volatile = rootState[contractID]._volatile;
        for (; ; ) {
          const { value: event, done } = await eventsStreamReader.read();
          if (done)
            return state;
          const stateCopy = cloneDeep2(state);
          try {
            await esm_default("chelonia/private/in/processMessage", SPMessage2.deserialize(event, this.transientSecretKeys, state, this.config.unwrapMaybeEncryptedData), state, void 0, contractName);
            if (!contractName && state._vm) {
              contractName = state._vm.type;
            }
          } catch (e2) {
            console.warn(`[chelonia] latestContractState: '${e2.name}': ${e2.message} processing:`, event, e2.stack);
            if (e2 instanceof ChelErrorUnrecoverable)
              throw e2;
            state = stateCopy;
          }
        }
      },
      "chelonia/contract/state": function(contractID, height) {
        const state = esm_default(this.config.stateSelector)[contractID];
        const stateCopy = state && cloneDeep2(state);
        if (stateCopy?._vm && height != null) {
          Object.keys(stateCopy._vm.authorizedKeys).forEach((keyId3) => {
            if (stateCopy._vm.authorizedKeys[keyId3]._notBeforeHeight > height) {
              delete stateCopy._vm.authorizedKeys[keyId3];
            }
          });
        }
        return stateCopy;
      },
      "chelonia/contract/fullState": function(contractID) {
        const rootState = esm_default(this.config.stateSelector);
        if (Array.isArray(contractID)) {
          return Object.fromEntries(contractID.map((contractID2) => {
            return [
              contractID2,
              {
                contractState: rootState[contractID2],
                cheloniaState: rootState.contracts[contractID2]
              }
            ];
          }));
        }
        return {
          contractState: rootState[contractID],
          cheloniaState: rootState.contracts[contractID]
        };
      },
      // 'chelonia/out' - selectors that send data out to the server
      "chelonia/out/registerContract": async function(params) {
        const { contractName, keys, hooks, publishOptions, signingKeyId, actionSigningKeyId, actionEncryptionKeyId } = params;
        const manifestHash = this.config.contracts.manifests[contractName];
        const contractInfo = this.manifestToContract[manifestHash];
        if (!contractInfo)
          throw new Error(`contract not defined: ${contractName}`);
        const signingKey = this.transientSecretKeys[signingKeyId];
        if (!signingKey)
          throw new Error(`Signing key ${signingKeyId} is not defined`);
        const payload = {
          type: contractName,
          keys
        };
        const contractMsg = SPMessage2.createV1_0({
          contractID: null,
          height: 0,
          op: [
            SPMessage2.OP_CONTRACT,
            signedOutgoingDataWithRawKey(signingKey, payload)
          ],
          manifest: manifestHash
        });
        const contractID = contractMsg.hash();
        await esm_default("chelonia/private/out/publishEvent", contractMsg, params.namespaceRegistration ? {
          ...publishOptions,
          headers: {
            ...publishOptions?.headers,
            "shelter-namespace-registration": params.namespaceRegistration
          }
        } : publishOptions, hooks && {
          prepublish: hooks.prepublishContract,
          postpublish: hooks.postpublishContract
        });
        await esm_default("chelonia/private/out/sync", contractID);
        const msg = await esm_default(actionEncryptionKeyId ? "chelonia/out/actionEncrypted" : "chelonia/out/actionUnencrypted", {
          action: contractName,
          contractID,
          data: params.data,
          signingKeyId: actionSigningKeyId ?? signingKeyId,
          encryptionKeyId: actionEncryptionKeyId,
          hooks,
          publishOptions
        });
        return msg;
      },
      "chelonia/out/ownResources": async function(contractID) {
        if (!contractID) {
          throw new TypeError("A contract ID must be provided");
        }
        const response = await this.config.fetch(`${this.config.connectionURL}/ownResources`, {
          method: "GET",
          signal: this.abortController.signal,
          headers: new Headers([
            [
              "authorization",
              buildShelterAuthorizationHeader.call(this, contractID)
            ]
          ])
        });
        if (!response.ok) {
          console.error("Unable to fetch own resources", contractID, response.status);
          throw new Error(`Unable to fetch own resources for ${contractID}: ${response.status}`);
        }
        return response.json();
      },
      "chelonia/out/deleteContract": async function(contractID, credentials = {}) {
        if (!contractID) {
          throw new TypeError("A contract ID must be provided");
        }
        if (!Array.isArray(contractID))
          contractID = [contractID];
        return await Promise.allSettled(contractID.map(async (cid) => {
          const hasCredential = has(credentials, cid);
          const hasToken = has(credentials[cid], "token") && credentials[cid].token;
          const hasBillableContractID = has(credentials[cid], "billableContractID") && credentials[cid].billableContractID;
          if (!hasCredential || hasToken === hasBillableContractID) {
            throw new TypeError(`Either a token or a billable contract ID must be provided for ${cid}`);
          }
          const response = await this.config.fetch(`${this.config.connectionURL}/deleteContract/${cid}`, {
            method: "POST",
            signal: this.abortController.signal,
            headers: new Headers([
              [
                "authorization",
                hasToken ? `bearer ${credentials[cid].token.valueOf()}` : buildShelterAuthorizationHeader.call(this, credentials[cid].billableContractID)
              ]
            ])
          });
          if (!response.ok) {
            if (response.status === 404 || response.status === 410) {
              console.warn("Contract appears to have been deleted already", cid, response.status);
              return;
            }
            console.error("Unable to delete contract", cid, response.status);
            throw new Error(`Unable to delete contract ${cid}: ${response.status}`);
          }
        }));
      },
      // all of these functions will do both the creation of the SPMessage
      // and the sending of it via 'chelonia/private/out/publishEvent'
      "chelonia/out/actionEncrypted": function(params) {
        return outEncryptedOrUnencryptedAction.call(this, SPMessage2.OP_ACTION_ENCRYPTED, params);
      },
      "chelonia/out/actionUnencrypted": function(params) {
        return outEncryptedOrUnencryptedAction.call(this, SPMessage2.OP_ACTION_UNENCRYPTED, params);
      },
      "chelonia/out/keyShare": async function(params) {
        const { atomic, originatingContractName, originatingContractID, contractName, contractID, data, hooks, publishOptions } = params;
        const originatingManifestHash = this.config.contracts.manifests[originatingContractName];
        const destinationManifestHash = this.config.contracts.manifests[contractName];
        const originatingContract = originatingContractID ? this.manifestToContract[originatingManifestHash]?.contract : void 0;
        const destinationContract = this.manifestToContract[destinationManifestHash]?.contract;
        if (originatingContractID && !originatingContract || !destinationContract) {
          throw new Error("Contract name not found");
        }
        const payload = data;
        if (!params.signingKeyId && !params.signingKey) {
          throw new TypeError("Either signingKeyId or signingKey must be specified");
        }
        let msg = SPMessage2.createV1_0({
          contractID,
          op: [
            SPMessage2.OP_KEY_SHARE,
            params.signingKeyId ? signedOutgoingData(contractID, params.signingKeyId, payload, this.transientSecretKeys) : signedOutgoingDataWithRawKey(params.signingKey, payload)
          ],
          manifest: destinationManifestHash
        });
        if (!atomic) {
          msg = await esm_default("chelonia/private/out/publishEvent", msg, publishOptions, hooks);
        }
        return msg;
      },
      "chelonia/out/keyAdd": async function(params) {
        const { atomic, contractID, contractName, data, hooks, publishOptions } = params;
        const manifestHash = this.config.contracts.manifests[contractName];
        const contract = this.manifestToContract[manifestHash]?.contract;
        if (!contract) {
          throw new Error("Contract name not found");
        }
        const state = contract.state(contractID);
        const payload = data.filter((wk) => {
          const k = isEncryptedData(wk) ? wk.valueOf() : wk;
          if (has(state._vm.authorizedKeys, k.id)) {
            if (state._vm.authorizedKeys[k.id]._notAfterHeight == null) {
              return false;
            }
          }
          return true;
        });
        if (payload.length === 0)
          return;
        let msg = SPMessage2.createV1_0({
          contractID,
          op: [
            SPMessage2.OP_KEY_ADD,
            signedOutgoingData(contractID, params.signingKeyId, payload, this.transientSecretKeys)
          ],
          manifest: manifestHash
        });
        if (!atomic) {
          msg = await esm_default("chelonia/private/out/publishEvent", msg, publishOptions, hooks);
        }
        return msg;
      },
      "chelonia/out/keyDel": async function(params) {
        const { atomic, contractID, contractName, data, hooks, publishOptions } = params;
        const manifestHash = this.config.contracts.manifests[contractName];
        const contract = this.manifestToContract[manifestHash]?.contract;
        if (!contract) {
          throw new Error("Contract name not found");
        }
        const state = contract.state(contractID);
        const payload = data.map((keyId3) => {
          if (isEncryptedData(keyId3))
            return keyId3;
          if (!has(state._vm.authorizedKeys, keyId3) || state._vm.authorizedKeys[keyId3]._notAfterHeight != null)
            return void 0;
          if (state._vm.authorizedKeys[keyId3]._private) {
            return encryptedOutgoingData(contractID, state._vm.authorizedKeys[keyId3]._private, keyId3);
          } else {
            return keyId3;
          }
        }).filter(Boolean);
        let msg = SPMessage2.createV1_0({
          contractID,
          op: [
            SPMessage2.OP_KEY_DEL,
            signedOutgoingData(contractID, params.signingKeyId, payload, this.transientSecretKeys)
          ],
          manifest: manifestHash
        });
        if (!atomic) {
          msg = await esm_default("chelonia/private/out/publishEvent", msg, publishOptions, hooks);
        }
        return msg;
      },
      "chelonia/out/keyUpdate": async function(params) {
        const { atomic, contractID, contractName, data, hooks, publishOptions } = params;
        const manifestHash = this.config.contracts.manifests[contractName];
        const contract = this.manifestToContract[manifestHash]?.contract;
        if (!contract) {
          throw new Error("Contract name not found");
        }
        const state = contract.state(contractID);
        const payload = data.map((key) => {
          if (isEncryptedData(key))
            return key;
          const { oldKeyId } = key;
          if (state._vm.authorizedKeys[oldKeyId]._private) {
            return encryptedOutgoingData(contractID, state._vm.authorizedKeys[oldKeyId]._private, key);
          } else {
            return key;
          }
        });
        let msg = SPMessage2.createV1_0({
          contractID,
          op: [
            SPMessage2.OP_KEY_UPDATE,
            signedOutgoingData(contractID, params.signingKeyId, payload, this.transientSecretKeys)
          ],
          manifest: manifestHash
        });
        if (!atomic) {
          msg = await esm_default("chelonia/private/out/publishEvent", msg, publishOptions, hooks);
        }
        return msg;
      },
      "chelonia/out/keyRequest": async function(params) {
        const { originatingContractID, originatingContractName, contractID, contractName, hooks, publishOptions, innerSigningKeyId, encryptionKeyId, innerEncryptionKeyId, encryptKeyRequestMetadata, reference } = params;
        const manifestHash = this.config.contracts.manifests[contractName];
        const originatingManifestHash = this.config.contracts.manifests[originatingContractName];
        const contract = this.manifestToContract[manifestHash]?.contract;
        const originatingContract = this.manifestToContract[originatingManifestHash]?.contract;
        if (!contract) {
          throw new Error("Contract name not found");
        }
        const rootState = esm_default(this.config.stateSelector);
        try {
          await esm_default("chelonia/contract/retain", contractID, { ephemeral: true });
          const state = contract.state(contractID);
          const originatingState = originatingContract.state(originatingContractID);
          const havePendingKeyRequest = Object.values(originatingState._vm.authorizedKeys).findIndex((k) => {
            return k._notAfterHeight == null && k.meta?.keyRequest?.contractID === contractID && state?._volatile?.pendingKeyRequests?.some((pkr) => pkr.name === k.name);
          }) !== -1;
          if (havePendingKeyRequest) {
            return;
          }
          const keyRequestReplyKey = keygen3(EDWARDS25519SHA512BATCH2);
          const keyRequestReplyKeyId = keyId2(keyRequestReplyKey);
          const keyRequestReplyKeyP = serializeKey2(keyRequestReplyKey, false);
          const keyRequestReplyKeyS = serializeKey2(keyRequestReplyKey, true);
          const signingKeyId = findSuitableSecretKeyId(originatingState, [SPMessage2.OP_KEY_ADD], ["sig"]);
          if (!signingKeyId) {
            throw ChelErrorUnexpected(`Unable to send key request. Originating contract is missing a key with OP_KEY_ADD permission. contractID=${contractID} originatingContractID=${originatingContractID}`);
          }
          const keyAddOp = () => esm_default("chelonia/out/keyAdd", {
            contractID: originatingContractID,
            contractName: originatingContractName,
            data: [{
              id: keyRequestReplyKeyId,
              name: "#krrk-" + keyRequestReplyKeyId,
              purpose: ["sig"],
              ringLevel: Number.MAX_SAFE_INTEGER,
              permissions: params.permissions === "*" ? "*" : Array.isArray(params.permissions) ? [...params.permissions, SPMessage2.OP_KEY_SHARE] : [SPMessage2.OP_KEY_SHARE],
              allowedActions: params.allowedActions,
              meta: {
                private: {
                  content: encryptedOutgoingData(originatingContractID, encryptionKeyId, keyRequestReplyKeyS),
                  shareable: false
                },
                keyRequest: {
                  ...reference && { reference: encryptKeyRequestMetadata ? encryptedOutgoingData(originatingContractID, encryptionKeyId, reference) : reference },
                  contractID: encryptKeyRequestMetadata ? encryptedOutgoingData(originatingContractID, encryptionKeyId, contractID) : contractID
                }
              },
              data: keyRequestReplyKeyP
            }],
            signingKeyId
          }).catch((e2) => {
            console.error(`[chelonia] Error sending OP_KEY_ADD for ${originatingContractID} during key request to ${contractID}`, e2);
            throw e2;
          });
          const payload = {
            contractID: originatingContractID,
            height: rootState.contracts[originatingContractID].height,
            replyWith: signedOutgoingData(originatingContractID, innerSigningKeyId, {
              encryptionKeyId,
              responseKey: encryptedOutgoingData(contractID, innerEncryptionKeyId, keyRequestReplyKeyS)
            }, this.transientSecretKeys),
            request: "*"
          };
          let msg = SPMessage2.createV1_0({
            contractID,
            op: [
              SPMessage2.OP_KEY_REQUEST,
              signedOutgoingData(contractID, params.signingKeyId, encryptKeyRequestMetadata ? encryptedOutgoingData(contractID, innerEncryptionKeyId, payload) : payload, this.transientSecretKeys)
            ],
            manifest: manifestHash
          });
          msg = await esm_default("chelonia/private/out/publishEvent", msg, publishOptions, {
            ...hooks,
            // We ensure that both messages are placed into the publish queue
            prepublish: (...args) => {
              return keyAddOp().then(() => hooks?.prepublish?.(...args));
            }
          });
          return msg;
        } finally {
          await esm_default("chelonia/contract/release", contractID, { ephemeral: true });
        }
      },
      "chelonia/out/keyRequestResponse": async function(params) {
        const { atomic, contractID, contractName, data, hooks, publishOptions } = params;
        const manifestHash = this.config.contracts.manifests[contractName];
        const contract = this.manifestToContract[manifestHash]?.contract;
        if (!contract) {
          throw new Error("Contract name not found");
        }
        const payload = data;
        let message = SPMessage2.createV1_0({
          contractID,
          op: [
            SPMessage2.OP_KEY_REQUEST_SEEN,
            signedOutgoingData(contractID, params.signingKeyId, payload, this.transientSecretKeys)
          ],
          manifest: manifestHash
        });
        if (!atomic) {
          message = await esm_default("chelonia/private/out/publishEvent", message, publishOptions, hooks);
        }
        return message;
      },
      "chelonia/out/atomic": async function(params) {
        const { contractID, contractName, data, hooks, publishOptions } = params;
        const manifestHash = this.config.contracts.manifests[contractName];
        const contract = this.manifestToContract[manifestHash]?.contract;
        if (!contract) {
          throw new Error("Contract name not found");
        }
        const payload = (await Promise.all(data.map(([selector, opParams]) => {
          if (!["chelonia/out/actionEncrypted", "chelonia/out/actionUnencrypted", "chelonia/out/keyAdd", "chelonia/out/keyDel", "chelonia/out/keyUpdate", "chelonia/out/keyRequestResponse", "chelonia/out/keyShare"].includes(selector)) {
            throw new Error("Selector not allowed in OP_ATOMIC: " + selector);
          }
          return esm_default(selector, { ...opParams, ...params, data: opParams.data, atomic: true });
        }))).flat().filter(Boolean).map((msg2) => {
          return [msg2.opType(), msg2.opValue()];
        });
        let msg = SPMessage2.createV1_0({
          contractID,
          op: [
            SPMessage2.OP_ATOMIC,
            signedOutgoingData(contractID, params.signingKeyId, payload, this.transientSecretKeys)
          ],
          manifest: manifestHash
        });
        msg = await esm_default("chelonia/private/out/publishEvent", msg, publishOptions, hooks);
        return msg;
      },
      "chelonia/out/protocolUpgrade": async function() {
      },
      "chelonia/out/propSet": async function() {
      },
      "chelonia/out/propDel": async function() {
      },
      "chelonia/out/encryptedOrUnencryptedPubMessage": function({ contractID, innerSigningKeyId, encryptionKeyId, signingKeyId, data }) {
        const serializedData = outputEncryptedOrUnencryptedMessage.call(this, {
          contractID,
          innerSigningKeyId,
          encryptionKeyId,
          signingKeyId,
          data
        });
        this.pubsub.pub(contractID, serializedData);
      },
      // Note: This is a bare-bones function designed for precise control. In many
      // situations, the `chelonia/kv/queuedSet` selector (in chelonia-utils.js)
      // will be simpler and more appropriate to use.
      // In most situations, you want to use some queuing strategy (which this
      // selector doesn't provide) alongside writing to the KV store. Therefore, as
      // a general rule, you shouldn't be calling this selector directly unless
      // you're building a utility library or if you have very specific needs. In
      // this case, see if `chelonia/kv/queuedSet` covers your needs.
      // `data` is allowed to be falsy, in which case a fetch will occur first and
      // the `onconflict` handler will be called.
      "chelonia/kv/set": async function(contractID, key, data, { ifMatch, innerSigningKeyId, encryptionKeyId, signingKeyId, maxAttempts, onconflict }) {
        maxAttempts = maxAttempts ?? 3;
        const url = `${this.config.connectionURL}/kv/${encodeURIComponent(contractID)}/${encodeURIComponent(key)}`;
        const hasOnconflict = typeof onconflict === "function";
        let response;
        const resolveData = async () => {
          let currentValue;
          if (response.ok || response.status === 409 || response.status === 412) {
            const serializedDataText = await response.text();
            currentValue = serializedDataText ? parseEncryptedOrUnencryptedMessage(this, {
              contractID,
              serializedData: JSON.parse(serializedDataText),
              meta: key
            }) : void 0;
          } else if (response.status !== 404 && response.status !== 410) {
            throw new ChelErrorUnexpectedHttpResponseCode("[kv/set] Invalid response code: " + response.status);
          }
          const result = await onconflict({
            contractID,
            key,
            failedData: data,
            status: response.status,
            // If no x-cid or etag header was returned, `ifMatch` would likely be
            // returned as undefined, which will then use the `''` fallback value
            // when writing. This allows 404 / 410 responses to work even if no
            // etag is explicitly given
            etag: response.headers.get("x-cid") || response.headers.get("etag"),
            get currentData() {
              return currentValue?.data;
            },
            currentValue
          });
          if (!result)
            return false;
          data = result[0];
          ifMatch = result[1];
          return true;
        };
        for (; ; ) {
          if (data !== void 0) {
            const serializedData = outputEncryptedOrUnencryptedMessage.call(this, {
              contractID,
              innerSigningKeyId,
              encryptionKeyId,
              signingKeyId,
              data,
              meta: key
            });
            response = await this.config.fetch(url, {
              headers: new Headers([
                [
                  "authorization",
                  buildShelterAuthorizationHeader.call(this, contractID)
                ],
                [
                  "if-match",
                  ifMatch || '""'
                ]
              ]),
              method: "POST",
              body: JSON.stringify(serializedData),
              signal: this.abortController.signal
            });
          } else {
            if (!hasOnconflict) {
              throw TypeError("onconflict required with empty data");
            }
            response = await this.config.fetch(url, {
              headers: new Headers([[
                "authorization",
                buildShelterAuthorizationHeader.call(this, contractID)
              ]]),
              signal: this.abortController.signal
            });
            if (await resolveData()) {
              continue;
            } else {
              break;
            }
          }
          if (!response.ok) {
            if (response.status === 409 || response.status === 412) {
              if (--maxAttempts <= 0) {
                throw new Error("kv/set conflict setting KV value");
              }
              await delay(randomIntFromRange(0, 1500));
              if (hasOnconflict) {
                if (await resolveData()) {
                  continue;
                } else {
                  break;
                }
              } else {
                throw new Error(`kv/set failed with status ${response.status} and no onconflict handler was provided`);
              }
            }
            throw new ChelErrorUnexpectedHttpResponseCode("kv/set invalid response status: " + response.status);
          }
          break;
        }
      },
      "chelonia/kv/get": async function(contractID, key) {
        const response = await this.config.fetch(`${this.config.connectionURL}/kv/${encodeURIComponent(contractID)}/${encodeURIComponent(key)}`, {
          headers: new Headers([[
            "authorization",
            buildShelterAuthorizationHeader.call(this, contractID)
          ]]),
          signal: this.abortController.signal
        });
        if (response.status === 404) {
          return null;
        }
        if (!response.ok) {
          throw new Error("Invalid response status: " + response.status);
        }
        const data = await response.json();
        return parseEncryptedOrUnencryptedMessage(this, {
          contractID,
          serializedData: data,
          meta: key
        });
      },
      // To set filters for a contract, call with `filter` set to an array of KV
      // keys to receive updates for over the WebSocket. An empty array means that
      // no KV updates will be sent.
      // Calling with a single argument (the contract ID) will remove filters,
      // meaning that KV updates will be sent for _any_ KV key.
      // The last call takes precedence, so, for example, calling with filter
      // set to `['foo', 'bar']` and then with `['baz']` means that KV updates will
      // be received for `baz` only, not for `foo`, `bar` or any other keys.
      "chelonia/kv/setFilter": function(contractID, filter) {
        this.pubsub.setKvFilter(contractID, filter);
      },
      "chelonia/parseEncryptedOrUnencryptedDetachedMessage": function({ contractID, serializedData, meta }) {
        return parseEncryptedOrUnencryptedMessage(this, {
          contractID,
          serializedData,
          meta
        });
      }
    });
    esm_default("sbp/domains/lock", ["chelonia"]);
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/persistent-actions.mjs
var timer, coerceToError, defaultOptions2, tag, PersistentAction, persistent_actions_default;
var init_persistent_actions = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/persistent-actions.mjs"() {
    init_esm4();
    init_esm();
    init_events2();
    timer = Symbol("timer");
    coerceToError = (arg) => {
      if (arg && arg instanceof Error)
        return arg;
      console.warn(tag, "Please use Error objects when throwing or rejecting");
      return new Error((typeof arg === "string" ? arg : JSON.stringify(arg)) ?? "undefined");
    };
    defaultOptions2 = {
      maxAttempts: Number.POSITIVE_INFINITY,
      retrySeconds: 30
    };
    tag = "[chelonia.persistentActions]";
    PersistentAction = class {
      id;
      invocation;
      options;
      status;
      [timer];
      constructor(invocation, options2 = {}) {
        this.id = crypto.randomUUID();
        this.invocation = invocation;
        this.options = { ...defaultOptions2, ...options2 };
        this.status = {
          attempting: false,
          failedAttemptsSoFar: 0,
          lastError: "",
          nextRetry: "",
          resolved: false
        };
      }
      async attempt() {
        if (this.status.attempting || this.status.resolved)
          return;
        if (await this.trySBP(this.options.skipCondition))
          this.cancel();
        if (this.status.resolved)
          return;
        try {
          this.status.attempting = true;
          const result = await esm_default(...this.invocation);
          this.status.attempting = false;
          this.handleSuccess(result);
        } catch (error) {
          this.status.attempting = false;
          await this.handleError(coerceToError(error));
        }
      }
      cancel() {
        if (this[timer])
          clearTimeout(this[timer]);
        this.status.nextRetry = "";
        this.status.resolved = true;
      }
      async handleError(error) {
        const { id, options: options2, status } = this;
        status.failedAttemptsSoFar++;
        status.lastError = error.message;
        const anyAttemptLeft = options2.maxAttempts > status.failedAttemptsSoFar;
        if (!anyAttemptLeft)
          status.resolved = true;
        status.nextRetry = anyAttemptLeft && !status.resolved ? new Date(Date.now() + options2.retrySeconds * 1e3).toISOString() : "";
        esm_default("okTurtles.events/emit", PERSISTENT_ACTION_FAILURE, { error, id });
        await this.trySBP(options2.errorInvocation);
        if (!anyAttemptLeft) {
          esm_default("okTurtles.events/emit", PERSISTENT_ACTION_TOTAL_FAILURE, { error, id });
          await this.trySBP(options2.totalFailureInvocation);
        }
        if (status.nextRetry) {
          this[timer] = setTimeout(() => {
            this.attempt().catch((e2) => {
              console.error("Error attempting persistent action", id, e2);
            });
          }, this.options.retrySeconds * 1e3);
        }
      }
      handleSuccess(result) {
        const { id, status } = this;
        status.lastError = "";
        status.nextRetry = "";
        status.resolved = true;
        esm_default("okTurtles.events/emit", PERSISTENT_ACTION_SUCCESS, { id, result });
      }
      async trySBP(invocation) {
        try {
          return invocation ? await esm_default(...invocation) : void 0;
        } catch (error) {
          console.error(tag, coerceToError(error).message);
        }
      }
    };
    persistent_actions_default = esm_default("sbp/selectors/register", {
      "chelonia.persistentActions/_init"() {
        this.actionsByID = /* @__PURE__ */ Object.create(null);
        this.checkDatabaseKey = () => {
          if (!this.databaseKey)
            throw new TypeError(`${tag} No database key configured`);
        };
        esm_default("okTurtles.events/on", PERSISTENT_ACTION_SUCCESS, ({ id }) => {
          esm_default("chelonia.persistentActions/cancel", id);
        });
        esm_default("okTurtles.events/on", PERSISTENT_ACTION_TOTAL_FAILURE, ({ id }) => {
          esm_default("chelonia.persistentActions/cancel", id);
        });
      },
      // Cancels a specific action by its ID.
      // The action won't be retried again, but an async action cannot be aborted if its promise is stil attempting.
      async "chelonia.persistentActions/cancel"(id) {
        if (id in this.actionsByID) {
          this.actionsByID[id].cancel();
          delete this.actionsByID[id];
          return await esm_default("chelonia.persistentActions/save");
        }
      },
      // TODO: validation
      "chelonia.persistentActions/configure"({ databaseKey, options: options2 = {} }) {
        this.databaseKey = databaseKey;
        for (const key in options2) {
          if (key in defaultOptions2) {
            defaultOptions2[key] = options2[key];
          } else {
            throw new TypeError(`${tag} Unknown option: ${key}`);
          }
        }
      },
      "chelonia.persistentActions/enqueue"(...args) {
        const ids = [];
        for (const arg of args) {
          const action = Array.isArray(arg) ? new PersistentAction(arg) : new PersistentAction(arg.invocation, arg);
          this.actionsByID[action.id] = action;
          ids.push(action.id);
        }
        esm_default("chelonia.persistentActions/save").catch((e2) => {
          console.error("Error saving persistent actions", e2);
        });
        for (const id of ids) {
          this.actionsByID[id].attempt().catch((e2) => {
            console.error("Error attempting persistent action", id, e2);
          });
        }
        return ids;
      },
      // Forces retrying a given persisted action immediately, rather than waiting for the scheduled retry.
      // - 'status.failedAttemptsSoFar' will still be increased upon failure.
      // - Does nothing if a retry is already running.
      // - Does nothing if the action has already been resolved, rejected or cancelled.
      "chelonia.persistentActions/forceRetry"(id) {
        if (id in this.actionsByID) {
          return this.actionsByID[id].attempt();
        }
      },
      // Loads and tries every stored persistent action under the configured database key.
      async "chelonia.persistentActions/load"() {
        this.checkDatabaseKey();
        const storedActions = JSON.parse(await esm_default("chelonia.db/get", this.databaseKey) ?? "[]");
        for (const { id, invocation, options: options2 } of storedActions) {
          this.actionsByID[id] = new PersistentAction(invocation, options2);
          this.actionsByID[id].id = id;
        }
        return esm_default("chelonia.persistentActions/retryAll");
      },
      // Retry all existing persisted actions.
      // TODO: add some delay between actions so as not to spam the server,
      // or have a way to issue them all at once in a single network call.
      "chelonia.persistentActions/retryAll"() {
        return Promise.allSettled(Object.keys(this.actionsByID).map((id) => esm_default("chelonia.persistentActions/forceRetry", id)));
      },
      // Updates the database version of the attempting action list.
      "chelonia.persistentActions/save"() {
        this.checkDatabaseKey();
        return esm_default("chelonia.db/set", this.databaseKey, JSON.stringify(Object.values(this.actionsByID)));
      },
      "chelonia.persistentActions/status"() {
        return Object.values(this.actionsByID).map((action) => ({ id: action.id, invocation: action.invocation, ...action.status }));
      },
      // Pauses every currently loaded action, and removes them from memory.
      // Note: persistent storage is not affected, so that these actions can be later loaded again and retried.
      "chelonia.persistentActions/unload"() {
        for (const id in this.actionsByID) {
          if (this.actionsByID[id][timer]) {
            clearTimeout(this.actionsByID[id][timer]);
          }
          delete this.actionsByID[id];
        }
      }
    });
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/presets.mjs
var init_presets = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/presets.mjs"() {
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/types.mjs
var init_types = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/types.mjs"() {
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/zkppConstants.mjs
var init_zkppConstants = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/zkppConstants.mjs"() {
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/zkpp.mjs
var import_scrypt_async2, import_tweetnacl2;
var init_zkpp = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/zkpp.mjs"() {
    import_scrypt_async2 = __toESM(require_scrypt_async(), 1);
    import_tweetnacl2 = __toESM(require_nacl_fast(), 1);
    init_zkppConstants();
  }
});

// node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/index.mjs
var esm_default5;
var init_esm9 = __esm({
  "node_modules/.deno/@chelonia+lib@1.2.2/node_modules/@chelonia/lib/dist/esm/index.mjs"() {
    init_chelonia();
    init_db();
    init_files();
    init_persistent_actions();
    init_SPMessage();
    init_Secret();
    init_chelonia();
    init_constants();
    init_db();
    init_encryptedData();
    init_errors();
    init_events2();
    init_files();
    init_persistent_actions();
    init_presets();
    init_pubsub();
    init_signedData();
    init_types();
    init_utils2();
    init_zkpp();
    init_zkppConstants();
    esm_default5 = [...chelonia_default, ...db_default, ...files_default, ...persistent_actions_default];
  }
});

// src/serve/constants.ts
var CREDITS_WORKER_TASK_TIME_INTERVAL, OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL;
var init_constants2 = __esm({
  "src/serve/constants.ts"() {
    "use strict";
    CREDITS_WORKER_TASK_TIME_INTERVAL = 3e5;
    OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL = 3e4;
  }
});

// src/serve/vapid.ts
import { Buffer as Buffer7 } from "node:buffer";
import process4 from "node:process";
var vapidPublicKey, vapidPrivateKey, vapid, initVapid, generateJwt, getVapidPublicKey, vapidAuthorization;
var init_vapid = __esm({
  "src/serve/vapid.ts"() {
    "use strict";
    init_deps();
    if (!process4.env.VAPID_EMAIL) {
      console.warn('Missing VAPID identification. Please set VAPID_EMAIL to a value like "mailto:some@example".');
    }
    vapid = { VAPID_EMAIL: process4.env.VAPID_EMAIL || "mailto:test@example.com" };
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
              (key) => Buffer7.from(key).toString("base64url")
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
      const header = Buffer7.from(JSON.stringify(
        Object.fromEntries([["typ", "JWT"], ["alg", "ES256"]])
      )).toString("base64url");
      const body = Buffer7.from(JSON.stringify(
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
      const signature = Buffer7.from(
        await crypto.subtle.sign(
          { name: "ECDSA", hash: "SHA-256" },
          vapidPrivateKey,
          Buffer7.from([header, body].join("."))
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
import { randomBytes as randomBytes2, timingSafeEqual } from "node:crypto";
import { Buffer as Buffer8 } from "node:buffer";
var nacl3, recordSecret, challengeSecret, registrationSecret, hashUpdateSecret, initZkpp, maxAge, computeZkppSaltRecordId, getZkppSaltRecord, setZkppSaltRecord, getChallenge, verifyChallenge, registrationKey, register, contractSaltVerifyC, getContractSalt, updateContractSalt, redeemSaltRegistrationToken, redeemSaltUpdateToken;
var init_zkppSalt = __esm({
  "src/serve/zkppSalt.ts"() {
    "use strict";
    init_deps();
    nacl3 = default2;
    initZkpp = async () => {
      const IKM = await default4("chelonia.db/get", "_private_immutable_zkpp_ikm").then((IKM2) => {
        if (!IKM2) {
          const secret = randomBytes2(33).toString("base64");
          return default4("chelonia.db/set", "_private_immutable_zkpp_ikm", secret).then(() => {
            return secret;
          });
        }
        return IKM2;
      });
      recordSecret = Buffer8.from(hashStringArray("private/recordSecret", IKM)).toString("base64");
      challengeSecret = Buffer8.from(hashStringArray("private/challengeSecret", IKM)).toString("base64");
      registrationSecret = Buffer8.from(hashStringArray("private/registrationSecret", IKM)).toString("base64");
      hashUpdateSecret = Buffer8.from(hashStringArray("private/hashUpdateSecret", IKM)).toString("base64");
    };
    maxAge = 30;
    computeZkppSaltRecordId = async (contractID) => {
      const recordId = `_private_rid_${contractID}`;
      const record = await default4("chelonia.db/get", recordId);
      if (!record) {
        return null;
      }
      const recordBuf = Buffer8.concat([Buffer8.from(contractID), Buffer8.from(record)]);
      return hash(recordBuf);
    };
    getZkppSaltRecord = async (contractID) => {
      const recordId = `_private_rid_${contractID}`;
      const record = await default4("chelonia.db/get", recordId);
      if (record) {
        const encryptionKey = hashStringArray("REK", contractID, recordSecret).slice(0, nacl3.secretbox.keyLength);
        const recordBuf = Buffer8.from(base64urlToBase64(record), "base64");
        const nonce = recordBuf.slice(0, nacl3.secretbox.nonceLength);
        const recordCiphertext = recordBuf.slice(nacl3.secretbox.nonceLength);
        const recordPlaintext = nacl3.secretbox.open(recordCiphertext, nonce, encryptionKey);
        if (!recordPlaintext) {
          return null;
        }
        const recordString = Buffer8.from(recordPlaintext).toString("utf-8");
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
      const encryptionKey = hashStringArray("REK", contractID, recordSecret).slice(0, nacl3.secretbox.keyLength);
      const nonce = nacl3.randomBytes(nacl3.secretbox.nonceLength);
      const recordPlaintext = JSON.stringify([hashedPassword, authSalt, contractSalt, cid]);
      const recordCiphertext = nacl3.secretbox(Buffer8.from(recordPlaintext), nonce, encryptionKey);
      const recordBuf = Buffer8.concat([nonce, recordCiphertext]);
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
      const sig = [now, base64ToBase64url(Buffer8.from(hashStringArray(contract, b, s, now, challengeSecret)).toString("base64"))].join(",");
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
      const macBuf = Buffer8.from(base64urlToBase64(mac), "base64");
      return sig.byteLength === macBuf.byteLength && timingSafeEqual(sig, macBuf);
    };
    registrationKey = (provisionalId, b) => {
      const encryptionKey = hashStringArray("REG", provisionalId, registrationSecret).slice(0, nacl3.secretbox.keyLength);
      const nonce = nacl3.randomBytes(nacl3.secretbox.nonceLength);
      const keyPair = boxKeyPair();
      const s = base64ToBase64url(Buffer8.concat([nonce, nacl3.secretbox(keyPair.secretKey, nonce, encryptionKey)]).toString("base64"));
      const now = (Date.now() / 1e3 | 0).toString(16);
      const sig = [now, base64ToBase64url(Buffer8.from(hashStringArray(provisionalId, b, s, now, challengeSecret)).toString("base64"))].join(",");
      return {
        s,
        p: base64ToBase64url(Buffer8.from(keyPair.publicKey).toString("base64")),
        sig
      };
    };
    register = (provisionalId, clientPublicKey, encryptedSecretKey, userSig, encryptedHashedPassword) => {
      if (!verifyChallenge(provisionalId, clientPublicKey, encryptedSecretKey, userSig)) {
        console.warn("register: Error validating challenge: " + JSON.stringify({ contract: provisionalId, clientPublicKey, userSig }));
        throw new Error("register: Invalid challenge");
      }
      const encryptedSecretKeyBuf = Buffer8.from(base64urlToBase64(encryptedSecretKey), "base64");
      const encryptionKey = hashStringArray("REG", provisionalId, registrationSecret).slice(0, nacl3.secretbox.keyLength);
      const secretKeyBuf = nacl3.secretbox.open(encryptedSecretKeyBuf.slice(nacl3.secretbox.nonceLength), encryptedSecretKeyBuf.slice(0, nacl3.secretbox.nonceLength), encryptionKey);
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
        JSON.stringify([Date.now(), Buffer8.from(hashedPasswordBuf).toString(), authSalt, contractSalt])
      );
      return encryptContractSalt(sharedEncryptionKey, token);
    };
    contractSaltVerifyC = (h2, r, s, userHc) => {
      const [c, hc] = computeCAndHc(r, s, h2);
      const userHcBuf = Buffer8.from(base64urlToBase64(userHc), "base64");
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
      const encryptionKey = hashRawStringArray(SU, c).slice(0, nacl3.secretbox.keyLength);
      const encryptedArgsBuf = Buffer8.from(base64urlToBase64(encryptedArgs), "base64");
      const nonce = encryptedArgsBuf.slice(0, nacl3.secretbox.nonceLength);
      const encryptedArgsCiphertext = encryptedArgsBuf.slice(nacl3.secretbox.nonceLength);
      const args = nacl3.secretbox.open(encryptedArgsCiphertext, nonce, encryptionKey);
      if (!args) {
        console.error(`update: Error decrypting arguments for contract ID ${contract} (${JSON.stringify({ r, s, hc })})`);
        return false;
      }
      try {
        const hashedPassword2 = Buffer8.from(args).toString();
        const recordId = await computeZkppSaltRecordId(contract);
        if (!recordId) {
          console.error(`update: Error obtaining record ID for contract ID ${contract}`);
          return false;
        }
        const authSalt = Buffer8.from(hashStringArray(AUTHSALT, c)).slice(0, SALT_LENGTH_IN_OCTETS).toString("base64");
        const contractSalt = Buffer8.from(hashStringArray(CONTRACTSALT, c)).slice(0, SALT_LENGTH_IN_OCTETS).toString("base64");
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
      await setZkppSaltRecord(contract, hashedPassword, authSalt, contractSalt, void 0);
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
import process5 from "node:process";
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
    splitAndGroup = (input, chunkLength, depth) => input.slice(0, chunkLength * depth).split("").reduce((acc, cv, i2) => {
      acc[i2 / chunkLength | 0] = (acc[i2 / chunkLength | 0] || "") + cv;
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
        if (process5.env.SKIP_DB_FS_CASE_SENSITIVITY_CHECK === void 0) {
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
          const error = err;
          if (error.code !== "ENOENT") throw err;
        });
      }
      async writeData(key, value) {
        const path5 = this.mapKey(key);
        if (this.depth) await mkdir(dirname(path5), { mode: 488, recursive: true });
        await writeFile(path5, value);
      }
      async deleteData(key) {
        await unlink(this.mapKey(key)).catch((e2) => {
          const error = e2;
          if (error?.code === "ENOENT") {
            return;
          }
          throw e2;
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
        this.run("DELETE FROM Data");
        return await Promise.resolve();
      }
      async readData(key) {
        const row = this.readStatement?.get(key);
        return await Promise.resolve(row?.value);
      }
      async writeData(key, value) {
        this.writeStatement?.run(key, value);
        return await Promise.resolve();
      }
      async deleteData(key) {
        this.deleteStatement?.run(key);
        return await Promise.resolve();
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
import process6 from "node:process";
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
    } = process6.env);
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
        for (let i2 = 0; i2 < keyPrefixes.length; i2++) {
          if (key.startsWith(keyPrefixes[i2])) {
            return backends2[keyPrefixes[i2]];
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
var CID3, randomKeyWithPrefix, validConfig, db2;
var init_database_router_test = __esm({
  "src/serve/database-router.test.ts"() {
    "use strict";
    init_database_router();
    init_deps();
    CID3 = "Q";
    randomKeyWithPrefix = (prefix) => `${prefix}${globalThis.crypto.randomUUID().replaceAll("-", "")}`;
    validConfig = {
      [CID3]: {
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
import process7 from "node:process";
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
    production = process7.env.NODE_ENV === "production";
    persistence = process7.env.GI_PERSIST || (production ? "fs" : void 0);
    dbRootPath = process7.env.DB_PATH || "./data";
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
        const limit = Math.min(requestedLimit ?? Number.POSITIVE_INFINITY, Number(process7.env.MAX_EVENTS_BATCH_SIZE ?? "500"));
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
            const value = index?.find((h2, i2) => {
              if (Number(h2) >= currentHeight) {
                index = index.slice(i2 + 1);
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
            } catch (e2) {
              const error = e2;
              console.error(`[backend] streamEntriesAfter: read(): ${error.message}:`, error.stack);
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
        const cache2 = new default10({
          max: Number(process7.env.GI_LRU_NUM_ITEMS) || 1e4
        });
        const prefixes = Object.keys(prefixHandlers);
        default4("sbp/selectors/overwrite", {
          "chelonia.db/get": async function(prefixableKey, { bypassCache } = {}) {
            if (!bypassCache) {
              const lookupValue = cache2.get(prefixableKey);
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
            cache2.set(prefixableKey, value);
            return value;
          },
          "chelonia.db/set": async function(key, value) {
            if (process7.env.CHELONIA_ARCHIVE_MODE) throw new Error("Unable to write in archive mode");
            checkKey(key);
            if (key.startsWith("_private_immutable")) {
              const existingValue = await readData3(key);
              if (existingValue !== void 0) {
                throw new Error("Cannot set already set immutable key");
              }
            }
            await writeData3(key, value);
            prefixes.forEach((prefix) => {
              cache2.delete(prefix + key);
            });
          },
          "chelonia.db/delete": async function(key) {
            if (process7.env.CHELONIA_ARCHIVE_MODE) throw new Error("Unable to write in archive mode");
            checkKey(key);
            if (key.startsWith("_private_immutable")) {
              throw new Error("Cannot delete immutable key");
            }
            await deleteData(key);
            prefixes.forEach((prefix) => {
              cache2.delete(prefix + key);
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
var init_errors2 = __esm({
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
import { Buffer as Buffer9 } from "node:buffer";
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
      })).catch((e2) => {
        console.error(e2, "Error saving subscription", subscriptionId);
        throw e2;
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
      } catch (e2) {
        console.error(e2, "Error removing subscription", subscriptionId);
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
                  salt = Buffer9.from(this.keys.auth, "base64url");
                }
                if (!uaPublic) {
                  uaPublic = Buffer9.from(this.keys.p256dh, "base64url");
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
      return default14(aes128gcm, readableStream, 32768, asPublic, IKM).then(async (bodyStream) => {
        const chunks = [];
        const reader = bodyStream.getReader();
        for (; ; ) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(new Uint8Array(value));
        }
        return Buffer9.concat(chunks);
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
          await req.text().then((response) => ({ response })).catch((e2) => `ERR: ${e2?.message}`),
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
          const theirVapidPublicKey = Buffer9.from(applicationServerKey, "base64").toString("base64url");
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
            await postEvent(subscriptionWrapper, JSON.stringify({ type: "initial" }));
          } else {
            host = subscriptionWrapper.endpoint.host;
            if (subscriptionWrapper.sockets.size === 0) {
              subscriptionWrapper.subscriptions.forEach((channelID) => {
                if (!server.subscribersByChannelID[channelID]) return;
                server.subscribersByChannelID[channelID].delete(subscriptionWrapper);
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
        } catch (e2) {
          console.error(e2, `[${socket.ip}] Failed to store subscription '${subscriptionId || "??"}' (${host}), removing it!`);
          subscriptionId && removeSubscription(subscriptionId);
          throw e2;
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
import process8 from "node:process";
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
    ...defaultOptions3,
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
  return Object.assign(server, publicMethods2);
}
var bold, PING, PONG, PUB, SUB, UNSUB, KV_FILTER, ERROR, OK, defaultOptions3, tag2, generateSocketID, log, defaultServerHandlers, defaultSocketEventHandlers, defaultMessageHandlers2, publicMethods2;
var init_pubsub2 = __esm({
  "src/serve/pubsub.ts"() {
    "use strict";
    init_deps();
    init_push();
    init_deps();
    ({ bold } = default8);
    ({ PING, PONG, PUB, SUB, UNSUB, KV_FILTER } = NOTIFICATION_TYPE);
    ({ ERROR, OK } = RESPONSE_TYPE);
    defaultOptions3 = {
      logPingRounds: process8.env.NODE_ENV !== "production" && !process8.env.CI,
      logPongMessages: false,
      maxPayload: 6 * 1024 * 1024,
      pingInterval: 3e4
    };
    tag2 = "[pubsub]";
    generateSocketID = /* @__PURE__ */ (() => {
      let counter = 0;
      return (debugID) => String(counter++) + (debugID ? "-" + debugID : "");
    })();
    log = logger.info.bind(logger, tag2);
    log.bold = (...args) => logger.debug(bold(tag2, ...args));
    log.debug = logger.debug.bind(logger, tag2);
    log.error = (error, ...args) => logger.error(error, bold.red(tag2, ...args));
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
        socket.ip = request.headers["x-real-ip"] || request.headers["x-forwarded-for"]?.split(",")[0].trim() || request.socket.remoteAddress;
        socket.send = function(data) {
          if (typeof data === "object" && typeof data[Symbol.toPrimitive] === "function") {
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
      close(code, reason) {
        const socket = this;
        const { server } = this;
        for (const channelID of socket.subscriptions) {
          server.subscribersByChannelID[channelID].delete(socket);
        }
        socket.subscriptions.clear();
      },
      message(data, isBinary) {
        const socket = this;
        const { server } = this;
        const text = data.toString();
        let msg = { type: "" };
        try {
          msg = messageParser(text);
        } catch (error) {
          log.error(error, `Malformed message: ${error.message}`);
          server.rejectMessageAndTerminateSocket(msg, socket);
          return;
        }
        if (msg.type !== "pong" || server.options.logPongMessages) {
          log.debug(`Received '${msg.type}' on socket ${socket.id}`, text);
        }
        socket.activeSinceLastPing = true;
        const defaultHandler = defaultMessageHandlers2[msg.type];
        const customHandler = server.customMessageHandlers[msg.type];
        if (defaultHandler || customHandler) {
          try {
            defaultHandler?.call(socket, msg);
            customHandler?.call(socket, msg);
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
    defaultMessageHandlers2 = {
      [PONG](msg) {
        const socket = this;
        socket.activeSinceLastPing = true;
      },
      [PUB](msg) {
        const { server } = this;
        const subscribers = server.subscribersByChannelID[msg.channelID];
        server.broadcast(msg, { to: subscribers ?? [] });
      },
      [SUB]({ channelID, kvFilter }) {
        const socket = this;
        const { server } = this;
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
        const { server } = this;
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
        const { server } = this;
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
    publicMethods2 = {
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
            postEvent(client, shortMsg || msg).catch((e2) => {
              if (e2?.message === "Payload too large") {
                if (shortMsg || !shortenPayload()) {
                  console.info("Skipping too large of a payload for", client.id);
                  return;
                }
                postEvent(client, shortMsg).catch((e3) => {
                  console.error(e3, "Error posting push notification");
                });
                return;
              }
              console.error(e2, "Error posting push notification");
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
import { Buffer as Buffer10 } from "node:buffer";
import { isIP } from "node:net";
import path4 from "node:path";
import process9 from "node:process";
function notFoundNoCache(h2) {
  return h2.response().code(404).header("Cache-Control", "no-store");
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
    FILE_UPLOAD_MAX_BYTES = parseInt(process9.env.FILE_UPLOAD_MAX_BYTES || "0") || 30 * MEGABYTE;
    SIGNUP_LIMIT_MIN = parseInt(process9.env.SIGNUP_LIMIT_MIN || "0") || 2;
    SIGNUP_LIMIT_HOUR = parseInt(process9.env.SIGNUP_LIMIT_HOUR || "0") || 10;
    SIGNUP_LIMIT_DAY = parseInt(process9.env.SIGNUP_LIMIT_DAY || "0") || 50;
    SIGNUP_LIMIT_DISABLED = process9.env.NODE_ENV !== "production" || process9.env.SIGNUP_LIMIT_DISABLED === "true";
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
        for (let i2 = 0; i2 < segments.length - 1; i2++) {
          if (!isCompressed && segments[i2] === "") {
            const requiredSegments = 8 - (segments.length - 1);
            if (requiredSegments < 0) {
              throw new Error("Invalid IPv6 address: too many segments");
            }
            if ((i2 === 0 || i2 === segments.length - 2) && segments[i2 + 1] === "") {
              segments[i2 + 1] = "0";
            }
            if (i2 === 0 && segments.length === 3 && segments[i2 + 2] === "") {
              segments[i2 + 2] = "0";
            }
            segments.splice(i2, 1, ...new Array(requiredSegments).fill("0"));
            isCompressed = true;
            continue;
          }
          segments[i2] = segments[i2].replace(/^0+/, "0");
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
      for (let i2 = 0; i2 < actual.length; i2++) {
        r |= (actual.codePointAt(i2) || 0) ^ (expected.codePointAt(i2) || 0);
      }
      return r === 0;
    };
    isCheloniaDashboard = process9.env.IS_CHELONIA_DASHBOARD_DEV;
    appDir = process9.env.CHELONIA_APP_DIR || ".";
    staticServeConfig = {
      routePath: isCheloniaDashboard ? "/dashboard/{path*}" : "/app/{path*}",
      distAssets: path4.resolve(isCheloniaDashboard ? "dist-dashboard/assets" : path4.join(appDir, "assets")),
      distIndexHtml: path4.resolve(isCheloniaDashboard ? "./dist-dashboard/index.html" : path4.join(appDir, "index.html")),
      redirect: isCheloniaDashboard ? "/dashboard/" : "/app/"
    };
    errorMapper = (e2) => {
      switch (e2?.name) {
        case "BackendErrorNotFound":
          return default5.notFound();
        case "BackendErrorGone":
          return default5.resourceGone();
        case "BackendErrorBadData":
          return default5.badData(e2.message);
        default:
          console.error(e2, "Unexpected backend error");
          return default5.internal(e2.message ?? "internal error");
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
    }, async function(request, h2) {
      if (process9.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
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
            if (process9.env.CHELONIA_REGISTRATION_DISABLED) {
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
          await default4("backend/server/updateSize", deserializedHEAD.contractID, Buffer10.byteLength(request.payload), deserializedHEAD.isFirstMessage && !credentials?.billableContractID ? deserializedHEAD.contractID : void 0);
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
    }, async function(request, h2) {
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
    }, async function(request, h2) {
      const billableContractID = request.auth.credentials.billableContractID;
      const resources = (await default4("chelonia.db/get", `_private_resources_${billableContractID}`))?.split("\0");
      return resources || [];
    });
    if (process9.env.NODE_ENV === "development") {
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
      }, function(request, h2) {
        if (process9.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
        const ip = request.headers["x-real-ip"] || request.info.remoteAddress;
        const log2 = levelToColor[request.payload.level];
        console.debug(default8.bold.yellow(`REMOTE LOG (${ip}): `) + log2(`[${request.payload.level}] ${request.payload.value}`));
        return h2.response().code(200);
      });
    }
    route.GET("/name/{name}", {
      validate: {
        params: default6.object({
          name: default6.string().regex(NAME_REGEX).required()
        })
      }
    }, async function(request, h2) {
      const { name } = request.params;
      try {
        const lookupResult = await default4("backend/db/lookupName", name);
        return lookupResult ? h2.response(lookupResult).type("text/plain") : notFoundNoCache(h2);
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
    }, async function(request, h2) {
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
          return notFoundNoCache(h2);
        }
        return HEADinfo;
      } catch (err) {
        logger3.error(err, `GET /latestHEADinfo/${contractID}`, err.message);
        return err;
      }
    });
    route.GET("/time", {}, function(request, h2) {
      return h2.response((/* @__PURE__ */ new Date()).toISOString()).header("cache-control", "no-store").type("text/plain");
    });
    route.POST(
      "/streams-test",
      {
        payload: {
          parse: "false"
        }
      },
      function(request, h2) {
        if (request.payload.byteLength === 2 && Buffer10.from(request.payload).toString() === "ok") {
          return h2.response().code(204);
        } else {
          return default5.badRequest();
        }
      }
    );
    if (process9.env.NODE_ENV === "development") {
      route.POST("/dev-file", {
        payload: {
          output: "data",
          multipart: true,
          allow: "multipart/form-data",
          failAction: function(request, h2, err) {
            console.error("failAction error:", err);
            return err;
          },
          maxBytes: 6 * MEGABYTE,
          // TODO: make this a configurable setting
          timeout: 10 * SECOND
          // TODO: make this a configurable setting
        }
      }, async function(request, h2) {
        if (process9.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
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
        failAction: function(request, h2, err) {
          console.error(err, "failAction error");
          return err;
        },
        maxBytes: FILE_UPLOAD_MAX_BYTES,
        timeout: 10 * SECOND
        // TODO: make this a configurable setting
      }
    }, async function(request, h2) {
      if (process9.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
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
            return JSON.parse(Buffer10.from(manifestMeta.payload).toString());
          } catch {
            throw default5.badData("Error parsing manifest");
          }
        })();
        if (typeof manifest2 !== "object") return default5.badData("manifest format is invalid");
        if (manifest2.version !== "1.0.0") return default5.badData("unsupported manifest version");
        if (manifest2.cipher !== "aes256gcm") return default5.badData("unsupported cipher");
        if (!Array.isArray(manifest2.chunks) || !manifest2.chunks.length) return default5.badData("missing chunks");
        let ourSize = 0;
        const chunks = manifest2.chunks.map((chunk, i2) => {
          if (!Array.isArray(chunk) || chunk.length !== 2 || typeof chunk[0] !== "number" || typeof chunk[1] !== "string" || !Number.isSafeInteger(chunk[0]) || chunk[0] <= 0) {
            throw default5.badData("bad chunk description");
          }
          if (!request.payload[i2] || !(request.payload[i2].payload instanceof Uint8Array)) {
            throw default5.badRequest("chunk missing in submitted data");
          }
          const ourHash = createCID(request.payload[i2].payload, multicodes.SHELTER_FILE_CHUNK);
          if (request.payload[i2].payload.byteLength !== chunk[0]) {
            throw default5.badRequest("bad chunk size");
          }
          if (ourHash !== chunk[1]) {
            throw default5.badRequest("bad chunk hash");
          }
          ourSize += chunk[0];
          return [ourHash, request.payload[i2].payload];
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
        return h2.response(manifestHash);
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
    }, async function(request, h2) {
      const { hash: hash3 } = request.params;
      const parsed = maybeParseCID(hash3);
      if (!parsed) {
        return default5.badRequest();
      }
      const blobOrString = await default4("chelonia.db/get", `any:${hash3}`);
      if (blobOrString?.length === 0) {
        return default5.resourceGone();
      } else if (!blobOrString) {
        return notFoundNoCache(h2);
      }
      const type = cidLookupTable[parsed.code] || "application/octet-stream";
      return h2.response(blobOrString).etag(hash3).header("Cache-Control", "public,max-age=31536000,immutable").header("content-security-policy", "default-src 'none'; frame-ancestors 'none'; form-action 'none'; upgrade-insecure-requests; sandbox").header("x-content-type-options", "nosniff").type(type);
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
    }, async function(request, h2) {
      if (process9.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
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
        return h2.response();
      } catch (e2) {
        return errorMapper(e2);
      }
    });
    route.POST("/deleteContract/{hash}", {
      auth: {
        // Allow file deletion, and allow either the bearer of the deletion token or
        // the file owner to delete it
        strategies: ["chel-shelter", "chel-bearer"],
        mode: "required"
      }
    }, async function(request, h2) {
      if (process9.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
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
        return h2.response({ id }).code(202);
      } catch (e2) {
        return errorMapper(e2);
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
    }, function(request, h2) {
      if (process9.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
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
          if (!expectedEtag.split(",").map((v2) => v2.trim()).includes(`"${cid}"`)) {
            return h2.response(existing || "").etag(cid).header("x-cid", `"${cid}"`).code(412);
          }
        }
        try {
          const serializedData = JSON.parse(request.payload.toString());
          const { contracts } = default4("chelonia/rootState");
          if (contracts[contractID].height !== Number(serializedData.height)) {
            return h2.response(existing || "").etag(cid).header("x-cid", `"${cid}"`).code(409);
          }
          default4("chelonia/parseEncryptedOrUnencryptedDetachedMessage", {
            contractID,
            serializedData,
            meta: key
          });
        } catch (e2) {
          return default5.badData();
        }
        const existingSize = existing ? Buffer10.from(existing).byteLength : 0;
        await default4("chelonia.db/set", `_private_kv_${contractID}_${key}`, request.payload);
        await default4("backend/server/updateSize", contractID, request.payload.byteLength - existingSize);
        await appendToIndexFactory(`_private_kvIdx_${contractID}`)(key);
        default4("backend/server/broadcastKV", contractID, key, request.payload.toString()).catch((e2) => console.error(e2, "Error broadcasting KV update", contractID, key));
        return h2.response().code(204);
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
    }, async function(request, h2) {
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
        return notFoundNoCache(h2);
      }
      const cid = createCID(result, multicodes.RAW);
      return h2.response(result).etag(cid).header("x-cid", `"${cid}"`);
    });
    route.GET("/serverMessages", { cache: { otherwise: "no-store" } }, (request, h2) => {
      if (!process9.env.CHELONIA_SERVER_MESSAGES) return [];
      return h2.response(process9.env.CHELONIA_SERVER_MESSAGES).type("application/json");
    });
    route.GET("/assets/{subpath*}", {
      ext: {
        onPostHandler: {
          method(request, h2) {
            if (request.path.includes("assets/js/sw-")) {
              console.debug("adding header: Service-Worker-Allowed /");
              request.response.header("Service-Worker-Allowed", "/");
            }
            return h2.continue;
          }
        }
      },
      files: {
        relativeTo: staticServeConfig.distAssets
      }
    }, function(request, h2) {
      const { subpath } = request.params;
      const basename4 = path4.basename(subpath);
      if (basename4.includes("-cached")) {
        return h2.file(subpath, { etagMethod: false }).etag(basename4).header("Cache-Control", "public,max-age=31536000,immutable");
      }
      return h2.file(subpath);
    });
    if (isCheloniaDashboard) {
      route.GET("/dashboard/assets/{subpath*}", {
        ext: {
          onPostHandler: {
            method(request, h2) {
              if (request.path.includes("assets/js/sw-")) {
                console.debug("adding header: Service-Worker-Allowed /");
                request.response.header("Service-Worker-Allowed", "/");
              }
              return h2.continue;
            }
          }
        },
        files: {
          relativeTo: staticServeConfig.distAssets
        }
      }, function(request, h2) {
        const { subpath } = request.params;
        const basename4 = path4.basename(subpath);
        if (basename4.includes("-cached")) {
          return h2.file(subpath, { etagMethod: false }).etag(basename4).header("Cache-Control", "public,max-age=31536000,immutable");
        }
        return h2.file(subpath);
      });
    }
    route.GET(staticServeConfig.routePath, {}, {
      file: staticServeConfig.distIndexHtml
    });
    route.GET("/", {}, function(req, h2) {
      return h2.redirect(staticServeConfig.redirect);
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
    }, async function(req, h2) {
      if (process9.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
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
      } catch (e2) {
        e2.ip = req.headers["x-real-ip"] || req.info.remoteAddress;
        console.error(e2, "Error at POST /zkpp/{name}: " + e2.message);
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
    }, async function(req, h2) {
      try {
        const challenge = await getChallenge(req.params["contractID"], req.query["b"]);
        return challenge || notFoundNoCache(h2);
      } catch (e2) {
        e2.ip = req.headers["x-real-ip"] || req.info.remoteAddress;
        console.error(e2, "Error at GET /zkpp/{contractID}/auth_hash: " + e2.message);
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
    }, async function(req, h2) {
      try {
        const salt = await getContractSalt(req.params["contractID"], req.query["r"], req.query["s"], req.query["sig"], req.query["hc"]);
        if (salt) {
          return salt;
        }
      } catch (e2) {
        e2.ip = req.headers["x-real-ip"] || req.info.remoteAddress;
        console.error(e2, "Error at GET /zkpp/{contractID}/contract_hash: " + e2.message);
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
    }, async function(req, h2) {
      if (process9.env.CHELONIA_ARCHIVE_MODE) return default5.notImplemented("Server in archive mode");
      try {
        const result = await updateContractSalt(req.params["contractID"], req.payload["r"], req.payload["s"], req.payload["sig"], req.payload["hc"], req.payload["Ea"]);
        if (result) {
          return result;
        }
      } catch (e2) {
        e2.ip = req.headers["x-real-ip"] || req.info.remoteAddress;
        console.error(e2, "Error at POST /zkpp/{contractID}/updatePasswordHash: " + e2.message);
      }
      return default5.internal("internal error");
    });
  }
});

// src/serve/server.ts
var server_exports = {};
import { basename as basename3, dirname as dirname3 } from "node:path";
import { fileURLToPath } from "node:url";
import process10 from "node:process";
var __filename, __dirname, ownerSizeTotalWorker, creditsWorker, CONTRACTS_VERSION, GI_VERSION, hapi, appendToOrphanedNamesIndex;
var init_server = __esm({
  async "src/serve/server.ts"() {
    "use strict";
    init_deps();
    init_auth();
    init_esm9();
    init_persistent_actions();
    init_constants2();
    init_database();
    init_errors2();
    init_events();
    init_instance_keys();
    init_pubsub2();
    init_push();
    __filename = fileURLToPath(import.meta.url);
    __dirname = dirname3(__filename);
    if (CREDITS_WORKER_TASK_TIME_INTERVAL && OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL > CREDITS_WORKER_TASK_TIME_INTERVAL) {
      process10.stderr.write("The size calculation worker must run more frequently than the credits worker for accurate billing");
      process10.exit(1);
    }
    ownerSizeTotalWorker = void 0;
    creditsWorker = void 0;
    if (!("crypto" in globalThis) && typeof __require === "function") {
      const crypto2 = await import("node:crypto");
      const { webcrypto } = crypto2;
      if (webcrypto) {
        Object.defineProperty(globalThis, "crypto", {
          enumerable: true,
          configurable: true,
          get: () => webcrypto
        });
      }
    }
    ({ CONTRACTS_VERSION, GI_VERSION } = process10.env);
    hapi = new Server({
      // debug: false, // <- Hapi v16 was outputing too many unnecessary debug statements
      //               // v17 doesn't seem to do this anymore so I've re-enabled the logging
      // debug: { log: ['error'], request: ['error'] },
      port: process10.env.API_PORT,
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
      method: function(request, h2) {
        try {
          if (typeof request.response.header === "function") {
            request.response.header("X-Frame-Options", "deny");
          } else {
            request.response.output.headers["X-Frame-Options"] = "deny";
          }
        } catch (err) {
          console.warn(default8.yellow("[backend] Could not set X-Frame-Options header:", err.message));
        }
        return h2.continue;
      }
    });
    appendToOrphanedNamesIndex = appendToIndexFactory("_private_orphaned_names_index");
    default4("okTurtles.data/set", SERVER_INSTANCE, hapi);
    default4("sbp/selectors/register", {
      "backend/server/persistState": async function(deserializedHEAD, entry) {
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
        default4("backend/server/broadcastEntry", deserializedHEAD, entry).catch((e2) => console.error(e2, "Error broadcasting entry", contractID, deserializedHEAD.hash));
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
        const sizeKey = `_private_contractFilesTotalSize_${resourceID}`;
        return updateSize(resourceID, sizeKey, size, true);
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
        } catch (e2) {
          console.warn(e2, `Error parsing manifest for ${cid}. It's probably not a file manifest.`);
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
            for (let i2 = latestHEADinfo.height; i2 > 0; i2--) {
              const eventKey = `_private_hidx=${cid}#${i2}`;
              const event = await default4("chelonia.db/get", eventKey);
              if (event) {
                await default4("chelonia.db/delete", JSON.parse(event).hash);
                await default4("chelonia.db/delete", eventKey);
              }
              if (i2 % KEYOP_SEGMENT_LENGTH === 0) {
                await default4("chelonia.db/delete", `_private_keyop_idx_${cid}_${i2}`);
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
          default4("backend/server/broadcastDeletion", cid).catch((e2) => {
            console.error(e2, "Error broadcasting contract deletion", cid);
          });
        }).finally(() => {
          contractsPendingDeletion.delete(cid);
        }).catch((e2) => {
          console.error(e2, "Error in contract deletion cleanup");
        });
      }
    });
    if (process10.env.NODE_ENV === "development" && !process10.env.CI) {
      hapi.events.on("response", (req, event, tags) => {
        const ip = req.headers["x-real-ip"] || req.info.remoteAddress;
        console.debug(default8`{grey ${ip}: ${req.method} ${req.path} --> ${req.response.statusCode}}`);
      });
    }
    default4("okTurtles.data/set", PUBSUB_INSTANCE, createServer(hapi.listener, {
      serverHandlers: {
        connection(socket, request) {
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
          if (!server.pushSubscriptions[subscriptionId]) return;
          server.pushSubscriptions[subscriptionId].sockets.delete(socket);
          delete socket.pushSubscriptionId;
          if (server.pushSubscriptions[subscriptionId].sockets.size === 0) {
            server.pushSubscriptions[subscriptionId].subscriptions.forEach((channelID) => {
              if (!server.subscribersByChannelID[channelID]) {
                server.subscribersByChannelID[channelID] = /* @__PURE__ */ new Set();
              }
              server.subscribersByChannelID[channelID].add(server.pushSubscriptions[subscriptionId]);
            });
          }
        }
      },
      messageHandlers: {
        [REQUEST_TYPE.PUSH_ACTION]: async function(...args) {
          const { data } = args[0];
          const socket = this;
          const { action, payload } = data;
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
          if (!server.pushSubscriptions[socket.pushSubscriptionId]) {
            delete socket.pushSubscriptionId;
            return;
          }
          addChannelToSubscription(server, socket.pushSubscriptionId, channelID);
        },
        // This handler removes subscribed channels from the web push subscription
        // associated with the WS, so that when the WS is closed we don't send
        // messages as web push notifications.
        [NOTIFICATION_TYPE.UNSUB](...args) {
          const { channelID } = args[0];
          const socket = this;
          const { server } = this;
          if (!socket.pushSubscriptionId) return;
          if (!server.pushSubscriptions[socket.pushSubscriptionId]) {
            delete socket.pushSubscriptionId;
            return;
          }
          deleteChannelFromSubscription(server, socket.pushSubscriptionId, channelID);
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
      default4("chelonia.persistentActions/load").catch((e2) => {
        console.error(e2, "Error loading persistent actions");
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
        Object.values(pubsub.pushSubscriptions || {}).filter(
          (pushSubscription) => !!pushSubscription.settings.heartbeatInterval && pushSubscription.sockets.size === 0
        ).forEach((pushSubscription) => {
          const last = map.get(pushSubscription) ?? Number.NEGATIVE_INFINITY;
          if (now - last < pushSubscription.settings.heartbeatInterval) return;
          postEvent(pushSubscription, notification).then(() => {
            map.set(pushSubscription, now);
          }).catch((e2) => {
            console.warn(e2, "Error sending recurring message to web push client", pushSubscription.id);
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
import process11 from "node:process";
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
    console.info("NODE_ENV =", process11.env.NODE_ENV);
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
      init_server().then(() => server_exports).catch(reject);
    });
    shutdownFn = function(message) {
      default4("okTurtles.data/apply", PUBSUB_INSTANCE, function(pubsub) {
        console.info("message received in child, shutting down...", message);
        pubsub.on("close", async function() {
          try {
            await default4("backend/server/stop");
            console.info("Hapi server down");
            process11.send?.({});
            process11.nextTick(() => process11.exit(0));
          } catch (err) {
            console.error(err, "Error during shutdown");
            process11.exit(1);
          }
        });
        pubsub.close();
        pubsub.clients.forEach((client) => client.terminate());
      });
    };
    process11.on("SIGUSR2", shutdownFn);
    process11.on("message", shutdownFn);
    process11.on("uncaughtException", (err) => {
      console.error(err, "[server] Unhandled exception");
      process11.exit(1);
    });
    process11.on("unhandledRejection", (reason, p) => {
      console.error(reason, "[server] Unhandled promise rejection:", reason);
      process11.exit(1);
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
  parseServeArgs: () => parseServeArgs,
  serve: () => serve,
  upload: () => upload,
  verifySignature: () => verifySignature3,
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
  const src2 = urlOrLocalPath;
  try {
    let messages;
    if (isURL(src2)) {
      messages = await getRemoteMessagesSince(src2, contractID, height, limit);
    } else {
      messages = await getMessagesSince(src2, contractID, height, limit);
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
async function getMessagesSince(src2, contractID, sinceHeight, limit) {
  backend = await getBackend(src2);
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
async function getRemoteMessagesSince(src2, contractID, sinceHeight, limit) {
  const response = await fetch(`${src2}/eventsAfter/${contractID}/${sinceHeight}`);
  if (!response.ok) {
    const bodyText = await response.text().catch((_) => "") || "";
    throw new Error(`failed network request to ${src2}: ${response.status} - ${response.statusText} - '${bodyText}'`);
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
  const src2 = urlOrLocalPath;
  try {
    const data = isURL(src2) ? await readRemoteData(src2, key) : await (await getBackend(src2)).readData(key);
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
  const { from: from3, to, out } = parsedArgs;
  const src2 = path.resolve(String(parsedArgs._[0]) ?? ".");
  if (!from3) exit("missing argument: --from");
  if (!to) exit("missing argument: --to");
  if (!out) exit("missing argument: --out");
  if (from3 === to) exit("arguments --from and --to must be different");
  let backendFrom;
  let backendTo;
  try {
    backendFrom = await getBackend(src2, { type: from3, create: false });
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
import process12 from "node:process";
async function startDashboardServer(port) {
  process12.env.IS_CHELONIA_DASHBOARD_DEV = "true";
  process12.env.DASHBOARD_PORT = port.toString();
  process12.env.PORT = port.toString();
  const dashboardServer = await Promise.resolve().then(() => (init_dashboard_server(), dashboard_server_exports));
  await dashboardServer.startDashboard(port);
}
async function startApplicationServer(port, directory) {
  delete process12.env.IS_CHELONIA_DASHBOARD_DEV;
  process12.env.PORT = port.toString();
  process12.env.API_PORT = port.toString();
  process12.env.CHELONIA_APP_DIR = directory;
  const startServer = await Promise.resolve().then(() => (init_serve(), serve_exports));
  await startServer.default;
}
async function serve(directory, options2 = {}) {
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
    process12.env.NODE_ENV = "development";
    process12.env.GI_PERSIST = dbType === "mem" ? "" : dbType;
    if (dbLocation) {
      if (dbType === "files") {
        process12.env.DB_PATH = dbLocation;
      } else if (dbType === "sqlite") {
        process12.env.DB_PATH = dbLocation;
      }
    }
    console.log(colors.cyan("\u{1F680} Starting dashboard server..."));
    try {
      await startDashboardServer(dashboardPort);
      console.log(colors.green(`\u2705 Dashboard server started on port ${dashboardPort}`));
    } catch (error) {
      console.error(colors.red("\u274C Failed to start dashboard server:"), error);
      throw error;
    }
    console.log(colors.cyan("\u{1F680} Starting application server..."));
    process12.env.PORT = applicationPort.toString();
    process12.env.API_PORT = applicationPort.toString();
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
    process12.exit(1);
  }
}
function parseServeArgs(args) {
  const parsed = flags.parse(args, {
    string: ["dp", "port", "db-type", "db-location"],
    default: {
      dp: "7000",
      port: "7000",
      "db-type": "mem"
    }
  });
  const directory = parsed._[0];
  if (!directory) {
    throw new Error("Directory argument is required");
  }
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
var verifySignature3 = async (args, internal = false) => {
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
  } catch (e2) {
    exit("Error validating signature: " + (e2?.message || String(e2)), internal);
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
/*! Bundled license information:

scrypt-async/scrypt-async.js:
  (*!
   * Fast "async" scrypt implementation in JavaScript.
   * Copyright (c) 2013-2016 Dmitry Chestnykh | BSD License
   * https://github.com/dchest/scrypt-async-js
   *)
*/
