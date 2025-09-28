var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __glob = (map) => (path3) => {
  var fn = map[path3];
  if (fn) return fn();
  throw new Error("Module not found in bundle: " + path3);
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
  Hapi: () => Hapi,
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
import { z } from "npm:zod@4.0.5";
import { default as default2 } from "npm:tweetnacl@1.0.3";
import { base58btc } from "npm:multiformats@11.0.2/bases/base58";
import { default as default3 } from "npm:@multiformats/blake2@1.0.13";
import { CID } from "npm:multiformats@11.0.2/cid";
import { default as default4 } from "npm:@sbp/sbp@2.4.1";
import * as Hapi from "npm:@hapi/hapi@21.4.3";
import { default as default5 } from "npm:@hapi/boom@10.0.1";
import { default as default6 } from "npm:joi@18.0.1";
import { default as default7 } from "npm:@hapi/inert@7.1.0";
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
import * as chelonia_star from "npm:@chelonia/lib@1.2.4/chelonia";
import "npm:@chelonia/lib@1.2.4/persistent-actions";
import { blake32Hash, createCID, maybeParseCID, multicodes, strToB64, getSubscriptionId, parseCID } from "npm:@chelonia/lib@1.2.4/functions";
import { checkKey, parsePrefixableKey, prefixHandlers } from "npm:@chelonia/lib@1.2.4/db";
import { SPMessage } from "npm:@chelonia/lib@1.2.4/SPMessage";
import { SERVER } from "npm:@chelonia/lib@1.2.4/presets";
import { ChelErrorGenerator } from "npm:@chelonia/lib@1.2.4/errors";
import { PUSH_SERVER_ACTION_TYPE, REQUEST_TYPE, RESPONSE_TYPE, NOTIFICATION_TYPE, createMessage, createClient, createKvMessage, messageParser } from "npm:@chelonia/lib@1.2.4/pubsub";
import { verifyShelterAuthorizationHeader } from "npm:@chelonia/lib@1.2.4/utils";
import { base64ToBase64url, base64urlToBase64, boxKeyPair, computeCAndHc, decryptSaltUpdate, encryptContractSalt, encryptSaltUpdate, hash, hashRawStringArray, hashStringArray, parseRegisterSalt, randomNonce } from "npm:@chelonia/lib@1.2.4/zkpp";
import { AUTHSALT, CONTRACTSALT, CS, SALT_LENGTH_IN_OCTETS, SU } from "npm:@chelonia/lib@1.2.4/zkppConstants";
import { EDWARDS25519SHA512BATCH, CURVE25519XSALSA20POLY1305, XSALSA20POLY1305 } from "npm:@chelonia/crypto@1.0.1";
import { keygen, serializeKey, deserializeKey, keygenOfSameType, keyId, generateSalt, deriveKeyFromPassword } from "npm:@chelonia/crypto@1.0.1";
import { sign, verifySignature, encrypt, decrypt } from "npm:@chelonia/crypto@1.0.1";
import { validationMixin } from "npm:vuelidate@0.7.6";
var init_deps = __esm({
  "src/deps.ts"() {
    "use strict";
    __reExport(deps_exports, chelonia_star);
  }
});

// src/serve/DatabaseBackend.ts
var requiredMethodNames, DatabaseBackend;
var init_DatabaseBackend = __esm({
  "src/serve/DatabaseBackend.ts"() {
    "use strict";
    requiredMethodNames = ["init", "clear", "readData", "writeData", "deleteData", "close"];
    DatabaseBackend = class _DatabaseBackend {
      constructor() {
        if (new.target === _DatabaseBackend) {
          throw new Error("Class DatabaseBackend cannot be instantiated directly.");
        }
        const bindMethod = (name) => {
          this[name] = this[name].bind(this);
        };
        for (const name of requiredMethodNames) {
          bindMethod(name);
        }
      }
    };
  }
});

// src/serve/database-fs.ts
var database_fs_exports = {};
__export(database_fs_exports, {
  default: () => FsBackend
});
import { mkdir, readdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join, normalize, resolve } from "node:path";
import process2 from "node:process";
async function testCaseSensitivity(backend) {
  const { readData, writeData, deleteData } = backend;
  const date = /* @__PURE__ */ new Date();
  const dateString = date.toISOString();
  const originalKey = `_private_testCaseSensitivity_${date.getTime()}_${(0, Math.random)().toFixed(8).slice(2)}`;
  const differentlyCasedKey = "_P" + originalKey.slice(2);
  await writeData(originalKey, dateString);
  try {
    const valueOriginalCase = await readData(originalKey);
    const valueDifferentCase = await readData(differentlyCasedKey);
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
var init_database_fs = __esm({
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
        this.dataFolder = resolve(options2.dirname);
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
        if (process2.env.SKIP_DB_FS_CASE_SENSITIVITY_CHECK === void 0) {
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
        const path3 = this.mapKey(key);
        if (this.depth) await mkdir(dirname(path3), { mode: 488, recursive: true });
        await writeFile(path3, value);
      }
      async deleteData(key) {
        await unlink(this.mapKey(key)).catch((e) => {
          if (e?.code === "ENOENT") {
            return;
          }
          throw e;
        });
      }
      close() {
      }
    };
  }
});

// src/serve/database-sqlite.ts
var database_sqlite_exports = {};
__export(database_sqlite_exports, {
  default: () => SqliteBackend
});
import { mkdir as mkdir2 } from "node:fs/promises";
import { basename as basename2, dirname as dirname2, join as join2, resolve as resolve2 } from "node:path";
var SqliteBackend;
var init_database_sqlite = __esm({
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
        const { filepath } = options2;
        const resolvedPath = resolve2(filepath);
        this.dataFolder = dirname2(resolvedPath);
        this.filename = basename2(resolvedPath);
      }
      run(sql) {
        this.db.prepare(sql).run();
      }
      async init() {
        const { dataFolder: dataFolder2, filename } = this;
        await mkdir2(dataFolder2, { mode: 488, recursive: true });
        if (this.db) {
          throw new Error(`The ${filename} SQLite database is already open.`);
        }
        this.db = new sqlite.Database(join2(dataFolder2, filename));
        this.run("CREATE TABLE IF NOT EXISTS Data(key TEXT NOT NULL PRIMARY KEY, value TEXT NOT NULL)");
        console.info(`Connected to the ${filename} SQLite database.`);
        this.readStatement = this.db.prepare("SELECT value FROM Data WHERE key = ?");
        this.writeStatement = this.db.prepare("REPLACE INTO Data(key, value) VALUES(?, ?)");
        this.deleteStatement = this.db.prepare("DELETE FROM Data WHERE key = ?");
      }
      // Useful in test hooks.
      // deno-lint-ignore require-await
      async clear() {
        this.run("DELETE FROM Data");
      }
      // deno-lint-ignore require-await
      async readData(key) {
        const row = this.readStatement.get(key);
        return row?.value;
      }
      async writeData(key, value) {
        await this.writeStatement.run(key, value);
      }
      async deleteData(key) {
        await this.deleteStatement.run(key);
      }
      close() {
        this.db.close();
      }
    };
  }
});

// import("./database-*.ts") in src/serve/database-router.ts
var globImport_database_ts;
var init_ = __esm({
  'import("./database-*.ts") in src/serve/database-router.ts'() {
    globImport_database_ts = __glob({
      "./database-fs.ts": () => Promise.resolve().then(() => (init_database_fs(), database_fs_exports)),
      "./database-router.test.ts": () => Promise.resolve().then(() => (init_database_router_test(), database_router_test_exports)),
      "./database-router.ts": () => Promise.resolve().then(() => (init_database_router(), database_router_exports)),
      "./database-sqlite.ts": () => Promise.resolve().then(() => (init_database_sqlite(), database_sqlite_exports))
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
import process3 from "node:process";
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
    } = process3.env);
    RouterBackend = class extends DatabaseBackend {
      backends;
      config;
      constructor(options2 = {}) {
        super();
        if (options2.config) this.config = options2.config;
      }
      lookupBackend(key) {
        const { backends, config } = this;
        const keyPrefixes = Object.keys(config);
        for (let i = 0; i < keyPrefixes.length; i++) {
          if (key.startsWith(keyPrefixes[i])) {
            return backends[keyPrefixes[i]];
          }
        }
        return backends["*"];
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
          const backend = new Ctor(options2);
          await backend.init();
          this.backends[keyPrefix] = backend;
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
        for (const backend of new Set(Object.values(this.backends))) {
          try {
            await backend.clear();
          } catch (e) {
            const prefix = Object.entries(this.backends).find(([, b]) => b === backend)[0];
            console.error(e, `Error clearing DB for prefix ${prefix}`);
          }
        }
      }
      async close() {
        for (const backend of new Set(Object.values(this.backends))) {
          try {
            await backend.close();
          } catch (e) {
            const prefix = Object.entries(this.backends).find(([, b]) => b === backend)[0];
            console.error(e, `Error closing DB for prefix ${prefix}`);
          }
        }
      }
    };
  }
});

// src/serve/database-router.test.ts
var database_router_test_exports = {};
var CID2, randomKeyWithPrefix, validConfig, db;
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
    db = new RouterBackend({ config: validConfig });
    Deno.test({
      name: "DatabaseRouter::validateConfig",
      async fn(t) {
        await t.step("should accept a valid config", () => {
          const errors = db.validateConfig(validConfig);
          if (errors.length !== 0) throw new Error(`Expected 0 errors but got ${errors.length}`);
        });
        await t.step("should reject configs missing a * key", () => {
          const config = omit(validConfig, ["*"]);
          const errors = db.validateConfig(config);
          if (errors.length !== 1) throw new Error(`Expected 1 error but got ${errors.length}`);
        });
        await t.step("should reject config entries missing a name", () => {
          const config = cloneDeep(validConfig);
          delete config["*"].name;
          const errors = db.validateConfig(config);
          if (errors.length !== 1) throw new Error(`Expected 1 error but got ${errors.length}`);
        });
      }
    });
    Deno.test({
      name: "DatabaseRouter::lookupBackend",
      async fn(t) {
        await db.init();
        try {
          await t.step("should find the right backend for keys starting with configured prefixes", () => {
            for (const keyPrefix of Object.keys(db.config)) {
              if (keyPrefix === "*") continue;
              const key = randomKeyWithPrefix(keyPrefix);
              const actual = db.lookupBackend(key);
              const expected = db.backends[keyPrefix];
              if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
            }
          });
          await t.step("should find the right backend for keys equal to configured prefixes", () => {
            for (const keyPrefix of Object.keys(db.config)) {
              const key = keyPrefix;
              const actual = db.lookupBackend(key);
              const expected = db.backends[keyPrefix];
              if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
            }
          });
          await t.step("should return the fallback backend for keys not matching any configured prefix", () => {
            const key = "foo";
            const actual = db.lookupBackend(key);
            const expected = db.backends["*"];
            if (actual !== expected) throw new Error(`Expected ${expected} but got ${actual}`);
          });
        } finally {
          await db.clear();
        }
      }
    });
  }
});

// src/serve/ownerSizeTotalWorker.ts
init_deps();

// src/serve/constants.ts
var OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL = 3e4;

// src/serve/database.ts
init_deps();
import { Readable } from "node:stream";
import fs2 from "node:fs";
import { readdir as readdir2, readFile as readFile3 } from "node:fs/promises";
import path2 from "node:path";
import process4 from "node:process";

// src/serve/vapid.ts
init_deps();
import { Buffer as Buffer2 } from "node:buffer";
import process from "node:process";
var vapidPublicKey;
var vapidPrivateKey;
if (!process.env.VAPID_EMAIL) {
  console.warn('Missing VAPID identification. Please set VAPID_EMAIL to a value like "mailto:some@example".');
}
var vapid = { VAPID_EMAIL: process.env.VAPID_EMAIL || "mailto:test@example.com" };
var initVapid = async () => {
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

// src/serve/zkppSalt.ts
init_deps();
import { randomBytes, timingSafeEqual } from "node:crypto";
import { Buffer as Buffer3 } from "node:buffer";
var recordSecret;
var challengeSecret;
var registrationSecret;
var hashUpdateSecret;
var initZkpp = async () => {
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

// src/serve/events.ts
var SERVER_EXITING = "server-exiting";

// import("./database-*.ts") in src/serve/database.ts
var globImport_database_ts2 = __glob({
  "./database-fs.ts": () => Promise.resolve().then(() => (init_database_fs(), database_fs_exports)),
  "./database-router.test.ts": () => Promise.resolve().then(() => (init_database_router_test(), database_router_test_exports)),
  "./database-router.ts": () => Promise.resolve().then(() => (init_database_router(), database_router_exports)),
  "./database-sqlite.ts": () => Promise.resolve().then(() => (init_database_sqlite(), database_sqlite_exports))
});

// src/serve/database.ts
var production = process4.env.NODE_ENV === "production";
var persistence = process4.env.GI_PERSIST || (production ? "fs" : void 0);
var dbRootPath = process4.env.DB_PATH || "./data";
var options = {
  fs: {
    depth: 0,
    dirname: dbRootPath,
    keyChunkLength: 2
  },
  sqlite: {
    filepath: path2.join(dbRootPath, "groupincome.db")
  }
};
var KEYOP_SEGMENT_LENGTH = 1e4;
var dataFolder = path2.resolve(options.fs.dirname);
if (!fs2.existsSync(dataFolder)) {
  fs2.mkdirSync(dataFolder, { mode: 488 });
}
var updateSize = async (resourceID, sizeKey, size, skipIfDeleted) => {
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
var database_default = default4("sbp/selectors/register", {
  "backend/db/streamEntriesAfter": async function(contractID, height, requestedLimit, options2 = {}) {
    const limit = Math.min(requestedLimit ?? Number.POSITIVE_INFINITY, process4.env.MAX_EVENTS_BATCH_SIZE ? parseInt(process4.env.MAX_EVENTS_BATCH_SIZE) : 500);
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
          console.error(e, "[backend] streamEntriesAfter: read()");
          break;
        }
      }
      yield "]";
    }(), { encoding: "utf-8", objectMode: false });
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
function namespaceKey(name) {
  return "name=" + name;
}
var initDB = async ({ skipDbPreloading } = {}) => {
  if (persistence) {
    const Ctor = (await globImport_database_ts2(`./database-${persistence}.ts`)).default;
    const { init, readData, writeData, deleteData, close } = new Ctor(options[persistence]);
    await init();
    default4("okTurtles.events/once", SERVER_EXITING, () => {
      default4("okTurtles.eventQueue/queueEvent", SERVER_EXITING, async () => {
        try {
          await close();
        } catch (e) {
          console.error(e, `Error closing DB ${persistence}`);
        }
      });
    });
    const cache = new default10({
      max: Number(process4.env.GI_LRU_NUM_ITEMS) || 1e4
    });
    const prefixes = Object.keys(prefixHandlers);
    default4("sbp/selectors/overwrite", {
      "chelonia.db/get": async function(prefixableKey, { bypassCache } = {}) {
        if (!bypassCache) {
          const lookupValue = cache.get(prefixableKey);
          if (lookupValue !== void 0) {
            return lookupValue;
          }
        }
        const [prefix, key] = parsePrefixableKey(prefixableKey);
        let value = await readData(key);
        if (value === void 0) {
          return;
        }
        value = prefixHandlers[prefix](value);
        cache.set(prefixableKey, value);
        return value;
      },
      "chelonia.db/set": async function(key, value) {
        if (process4.env.CHELONIA_ARCHIVE_MODE) throw new Error("Unable to write in archive mode");
        checkKey(key);
        if (key.startsWith("_private_immutable")) {
          const existingValue = await readData(key);
          if (existingValue !== void 0) {
            throw new Error("Cannot set already set immutable key");
          }
        }
        await writeData(key, value);
        prefixes.forEach((prefix) => {
          cache.delete(prefix + key);
        });
      },
      "chelonia.db/delete": async function(key) {
        if (process4.env.CHELONIA_ARCHIVE_MODE) throw new Error("Unable to write in archive mode");
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
    const keys = (await readdir2(dataFolder)).filter((k) => {
      if (k.length !== HASH_LENGTH) return false;
      const parsed = maybeParseCID(k);
      return parsed && [
        multicodes.SHELTER_CONTRACT_MANIFEST,
        multicodes.SHELTER_CONTRACT_TEXT
      ].includes(parsed.code);
    });
    const numKeys = keys.length;
    let numVisitedKeys = 0;
    let numNewKeys = 0;
    const savedProgress = { value: 0, numKeys: 0 };
    console.info("[chelonia.db] Preloading...");
    for (const key of keys) {
      if (!persistence || !await default4("chelonia.db/get", key)) {
        const value = await readFile3(path2.join(dataFolder, key), "utf8");
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
var appendToIndexFactory = (key) => {
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
var appendToNamesIndex = appendToIndexFactory("_private_names_index");
var removeFromIndexFactory = (key) => {
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
var lookupUltimateOwner = async (resourceID) => {
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

// src/serve/genericWorker.ts
init_deps();
import { parentPort } from "node:worker_threads";

// src/serve/logger.ts
init_deps();
import process5 from "node:process";
var prettyPrint = process5.env.NODE_ENV === "development" || process5.env.CI || process5.env.CYPRESS_RECORD_KEY || process5.env.PRETTY;
function logMethod(args, method) {
  const stringIdx = typeof args[0] === "string" ? 0 : 1;
  if (args.length > 1) {
    for (let i = stringIdx + 1; i < args.length; ++i) {
      args[stringIdx] += typeof args[i] === "string" ? " %s" : " %o";
    }
  }
  method.apply(this, args);
}
var logger;
if (prettyPrint) {
  try {
    logger = default9({
      hooks: { logMethod },
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true
        }
      }
    });
  } catch (e) {
    console.warn("pino-pretty transport unavailable, using basic logging", e);
    logger = default9({ hooks: { logMethod } });
  }
} else {
  logger = default9({ hooks: { logMethod } });
}
var logLevel = process5.env.LOG_LEVEL || (prettyPrint ? "debug" : "info");
if (Object.keys(logger.levels.values).includes(logLevel)) {
  logger.level = logLevel;
} else {
  logger.warn(`Unknown log level: ${logLevel}`);
}
globalThis.logger = logger;
console.debug = logger.debug.bind(logger);
console.info = logger.info.bind(logger);
console.log = logger.info.bind(logger);
console.warn = logger.warn.bind(logger);
console.error = logger.error.bind(logger);

// src/serve/genericWorker.ts
var readyQueueName = "parentPort";
parentPort.on("message", ([port, ...msg]) => {
  default4("okTurtles.eventQueue/queueEvent", readyQueueName, () => {
    (async () => {
      try {
        port?.postMessage([true, await default4(...msg)]);
      } catch (e) {
        port?.postMessage([false, e]);
      }
    })();
  });
});
default4("okTurtles.eventQueue/queueEvent", readyQueueName, async () => {
  await initDB({ skipDbPreloading: true });
  parentPort.postMessage("ready");
});

// src/serve/ownerSizeTotalWorker.ts
var updatedSizeList = /* @__PURE__ */ new Set();
var updatedSizeMap = /* @__PURE__ */ new Map();
var cachedUltimateOwnerMap = /* @__PURE__ */ new Map();
var fastBase58Hash = (cid) => {
  const len = cid.length;
  const a = cid.codePointAt(len - 2) || 0;
  const b = cid.codePointAt(len - 1) || 0;
  return a * 19 + (b + 19) & 255;
};
var addToTempIndex = (cid) => {
  return appendToIndexFactory(`_private_pendingIdx_ownerTotalSize_${fastBase58Hash(cid)}`)(cid);
};
var removeFromTempIndex = (cids) => {
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
default4("okTurtles.eventQueue/queueEvent", readyQueueName, async () => {
  for (let i = 0; i < 256; i++) {
    const data = await default4("chelonia.db/get", `_private_pendingIdx_ownerTotalSize_${i}`, { bypassCache: true });
    if (data) {
      data.split("\0").forEach((cid) => {
        updatedSizeList.add(cid);
      });
    }
  }
  console.info(`[ownerSizeTotalWorker] Loaded ${updatedSizeList.size} CIDs for full recalculation.`);
  if (updatedSizeList.size) {
    default4("backend/server/computeSizeTask");
  }
  setTimeout(default4, OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL, "backend/server/computeSizeTaskDeltas");
});
default4("sbp/selectors/register", {
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
        if (!await default4("chelonia.db/get", contractID)) {
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
    setTimeout(default4, OWNER_SIZE_TOTAL_WORKER_TASK_TIME_INTERVAL, "backend/server/computeSizeTaskDeltas");
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
      const resources = await default4("chelonia.db/get", `_private_resources_${ownerID}`);
      const indirectResources = resources ? await default4("chelonia.db/get", `_private_indirectResources_${ownerID}`) : void 0;
      const allSubresources = Array.from(/* @__PURE__ */ new Set([
        ownerID,
        ...resources ? resources.split("\0") : [],
        ...indirectResources ? indirectResources.split("\0") : []
      ]));
      const totalSize = (await Promise.all(allSubresources.map((id) => {
        return default4("chelonia.db/get", `_private_size_${id}`);
      }))).reduce((acc, cv) => {
        if (cv) {
          const parsed = parseInt(cv, 10);
          if (parsed) return parsed + acc;
        }
        return acc;
      }, 0);
      await default4("okTurtles.eventQueue/queueEvent", `_private_ownerTotalSize_${ownerID}`, async () => {
        allSubresources.forEach((id) => {
          updatedSizeList.delete(id);
          if (updatedSizeMap.delete(id)) {
            contractIDs.add(id);
          }
        });
        await default4("chelonia.db/set", `_private_ownerTotalSize_${ownerID}`, totalSize.toString(10));
        await removeFromTempIndex(Array.from(contractIDs).filter((id) => {
          return !updatedSizeMap.has(id);
        }));
      });
    }));
    console.info(`[ownerSizeTotalWorker] Computed size for ${updatedSizeList.size} CIDs in ${((performance.now() - start) / 1e3).toFixed(2)} seconds.`);
  }
});
