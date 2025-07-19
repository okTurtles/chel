#!/usr/bin/env -S deno run --allow-read=./ --allow-write=./  --allow-net --no-remote --import-map=vendor/import_map.json
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

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
import { default as default2 } from "npm:tweetnacl@1.0.3";
import { base58btc } from "npm:multiformats@11.0.2/bases/base58";
import { default as default3 } from "npm:@multiformats/blake2@1.0.13";
import { CID } from "npm:multiformats@11.0.2/cid";
import { EDWARDS25519SHA512BATCH, CURVE25519XSALSA20POLY1305, XSALSA20POLY1305 } from "npm:@chelonia/crypto@1.0.1";
import { keygen, serializeKey, deserializeKey, keygenOfSameType, keyId, generateSalt, deriveKeyFromPassword } from "npm:@chelonia/crypto@1.0.1";
import { sign, verifySignature, encrypt, decrypt } from "npm:@chelonia/crypto@1.0.1";
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
async function initStorage(options = {}) {
  dataFolder = path.resolve(options.dirname);
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
async function readData(key) {
  checkKey(key);
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
  const options = { createNew: true };
  try {
    if (typeof value === "string") {
      await Deno.writeTextFile(path.join(dataFolder, key), value, options);
    } else {
      await Deno.writeFile(path.join(dataFolder, key), value, options);
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
async function initStorage2(options = {}) {
  const { dirname, filename } = options;
  dataFolder2 = path.resolve(dirname);
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
  if (!options.internal) {
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
  checkKey(key);
  writeStatement.run([key, value]);
}
async function writeDataOnce2(key, value) {
  checkKey(key);
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
function checkKey(key) {
  if (!isValidKey(key)) {
    throw new Error(`bad key: ${JSON.stringify(key)}`);
  }
}
async function createEntryFromFile(filepath, multicode) {
  const buffer = await Deno.readFile(filepath);
  const key = createCID(buffer, multicode);
  return [key, buffer];
}
function createCID(data, multicode = multicodes.RAW) {
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
async function isDir(path2) {
  try {
    return (await Deno.stat(path2)).isDirectory;
  } catch {
    return false;
  }
}
async function isFile(path2) {
  try {
    return (await Deno.stat(path2)).isFile;
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
var backends, multibase, multicodes, multihasher, readJsonFile;
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
    init_deps();
    init_database_fs();
    init_database_sqlite();
    backends = { fs: database_fs_exports, sqlite: database_sqlite_exports };
    multibase = base58btc;
    multicodes = {
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

// src/commands.ts
var commands_exports = {};
__export(commands_exports, {
  deploy: () => deploy,
  eventsAfter: () => eventsAfter,
  get: () => get,
  hash: () => hash,
  help: () => help,
  keygen: () => keygen2,
  manifest: () => manifest,
  migrate: () => migrate,
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
    let type = multicodes.RAW;
    let filepath = filepath_;
    if (internal) {
      if (filepath_[1] !== "|") throw new Error("Invalid path format");
      switch (filepath_[0]) {
        case "r":
          break;
        case "m":
          type = multicodes.SHELTER_CONTRACT_MANIFEST;
          break;
        case "t":
          type = multicodes.SHELTER_CONTRACT_TEXT;
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
      throw new Error(`server returned bad URL: ${String(r)}`);
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
async function deploy(args) {
  const [urlOrDirOrSqliteFile, ...manifests] = args;
  if (manifests.length === 0) throw new Error("missing url or manifests!");
  const toUpload = [];
  for (const manifestPath of manifests) {
    const json = JSON.parse(Deno.readTextFileSync(manifestPath));
    const body = JSON.parse(json.body);
    const dirname = path.dirname(manifestPath);
    toUpload.push(CONTRACT_TEXT_PREFIX + path.join(dirname, body.contract.file));
    if (body.contractSlim) {
      toUpload.push(CONTRACT_TEXT_PREFIX + path.join(dirname, body.contractSlim.file));
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
async function getMessage(hash2) {
  const value = await readString(hash2);
  if (!value) throw new Error(`no entry for ${hash2}!`);
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
    if (entry === void 0) {
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
    const bodyText = await response.text().catch((_) => "") || "";
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
async function hash(args, multicode = multicodes.RAW, internal = false) {
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
  const signingKeyDescriptor = await readJsonFile(keyFile);
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
      hash: await hash([contractFile], multicodes.SHELTER_CONTRACT_TEXT, true),
      file: contractBasename
    },
    signingKeys: publicKeys
  };
  if (typeof slim === "string" && slim !== "") {
    body.contractSlim = {
      file: path.basename(slim),
      hash: await hash([slim], multicodes.SHELTER_CONTRACT_TEXT, true)
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
  const src = path.resolve(String(parsedArgs._[0]) ?? ".");
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

// src/verifySignature.ts
init_deps();
init_utils();
function isExternalKeyDescriptor(obj) {
  return obj !== null && typeof obj === "object" && typeof obj.pubkey === "string";
}
function isManifest(obj) {
  const maybe = obj;
  return obj !== null && typeof maybe.head === "string" && typeof maybe.body === "string" && typeof maybe.signature === "object" && maybe.signature !== null;
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
  const externalKeyDescriptor = externalKeyDescriptorRaw;
  const manifest2 = manifestRaw;
  if (keyFile && (!externalKeyDescriptorRaw || !isExternalKeyDescriptor(externalKeyDescriptorRaw))) {
    exit("Public key missing from key file", internal);
  }
  if (!isManifest(manifestRaw)) {
    exit("Invalid manifest: missing signature key ID", internal);
  }
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
  if (externalKeyDescriptor !== null) {
    const id = keyId(externalKeyDescriptor.pubkey);
    if (manifest2.signature.keyId !== id) {
      exit(`Invalid manifest signature: key ID doesn't match the provided key file. Expected ${String(id)} but got ${String(manifest2.signature.keyId)}.`, internal);
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
  const computedHash = await hash([path.join(parsedFilepath.dir, body.contract.file)], multicodes.SHELTER_CONTRACT_TEXT, true);
  if (computedHash !== body.contract.hash) {
    exit(`Invalid contract file hash. Expected ${body.contract.hash} but got ${computedHash}`, internal);
  }
  if (body.contractSlim) {
    const computedHash2 = await hash([path.join(parsedFilepath.dir, body.contractSlim.file)], multicodes.SHELTER_CONTRACT_TEXT, true);
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
