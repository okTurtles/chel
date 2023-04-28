#!/usr/bin/env -S deno run --allow-read=./ --allow-write=./  --allow-net --no-remote --import-map=vendor/import_map.json
"use strict";
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
import * as flags from "https://deno.land/std@0.141.0/flags/mod.ts";
import * as path from "https://deno.land/std@0.141.0/path/mod.ts";
import * as colors from "https://deno.land/std@0.141.0/fmt/colors.ts";
import * as streams from "https://deno.land/std@0.141.0/streams/mod.ts";
import * as fs from "https://deno.land/std@0.141.0/fs/mod.ts";
import { default as default2 } from "https://esm.sh/multihashes@4.0.3?bundle&pin=v86";
import { default as default3 } from "https://esm.sh/blakejs@1.2.1?pin=v95";
import { miniexec } from "https://deno.land/x/miniexec@1.0.0/mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.14.47/mod.js";
import * as sqlite from "https://deno.land/x/sqlite@v3.7.1/mod.ts";
import {} from "https://deno.land/x/sqlite@v3.7.1/mod.ts";
var init_deps = __esm({
  "src/deps.ts"() {
  }
});

// src/utils.ts
function blake32Hash(data) {
  const uint8array = default3.blake2b(data, void 0, 32);
  return default2.toB58String(default2.encode(uint8array, "blake2b-32", 32));
}
function checkKey(key) {
  if (!isValidKey(key)) {
    throw new Error(`bad key: ${JSON.stringify(key)}`);
  }
}
function exit(message) {
  console.error("[chel]", colors.red("Error:"), message);
  Deno.exit(1);
}
function isDir(path2) {
  try {
    const info = Deno.lstatSync(path2);
    return info.isDirectory;
  } catch (_e) {
    return false;
  }
}
function isFile(path2) {
  try {
    const info = Deno.lstatSync(path2);
    return info.isFile;
  } catch (_e) {
    return false;
  }
}
function isNotHashKey(key) {
  return key.startsWith("head=") || key.startsWith("name=");
}
function isValidKey(key) {
  return !/[\x00-\x1f\x7f\t\\/]/.test(key);
}
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
    init_deps();
  }
});

// src/database-fs.ts
var database_fs_exports = {};
__export(database_fs_exports, {
  clear: () => clear,
  count: () => count,
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
  for await (const _entry of Deno.readDir(dataFolder)) {
    n++;
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
  return await Deno.readFile(path.join(dataFolder, key)).catch((_err) => void 0);
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
    if (err.name !== "AlreadyExists")
      throw err;
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
  initStorage: () => initStorage2,
  iterKeys: () => iterKeys2,
  readData: () => readData2,
  writeData: () => writeData2,
  writeDataOnce: () => writeDataOnce2
});
async function initStorage2(options = {}) {
  const { dirname, filename } = options;
  const dataFolder2 = path.resolve(dirname);
  const filepath = path.join(dataFolder2, filename);
  if (db !== void 0) {
    if (filepath === dbPath) {
      return;
    }
    db.close();
  }
  db = new DB(filepath);
  db.execute("CREATE TABLE IF NOT EXISTS Data(key TEXT NOT NULL PRIMARY KEY, value TEXT NOT NULL)");
  dbPath = filepath;
  console.log("Connected to the %s SQLite database.", filepath);
  iterKeysStatement = db.prepareQuery("SELECT key FROM Data");
  readStatement = db.prepareQuery("SELECT value FROM Data WHERE key = ?");
  writeOnceStatement = db.prepareQuery("INSERT INTO Data(key, value) VALUES(?, ?) ON CONFLICT (key) DO NOTHING");
  writeStatement = db.prepareQuery("REPLACE INTO Data(key, value) VALUES(?, ?)");
}
function count2() {
  return db.query("SELECT COUNT(*) FROM Data")[0][0];
}
async function readData2(key) {
  const maybeRow = readStatement.first([key]);
  return maybeRow === void 0 ? void 0 : maybeRow[0] ?? new Uint8Array();
}
async function* iterKeys2() {
  for (const row of iterKeysStatement.iter()) {
    yield row[0];
  }
}
async function writeData2(key, value) {
  checkKey(key);
  writeStatement.execute([key, value]);
}
async function writeDataOnce2(key, value) {
  checkKey(key);
  writeOnceStatement.execute([key, value]);
}
var DB, db, dbPath, iterKeysStatement, readStatement, writeOnceStatement, writeStatement;
var init_database_sqlite = __esm({
  "src/database-sqlite.ts"() {
    init_deps();
    init_utils();
    ({ DB } = sqlite);
  }
});

// src/commands.ts
var commands_exports = {};
__export(commands_exports, {
  deploy: () => deploy,
  hash: () => hash,
  help: () => help,
  manifest: () => manifest,
  migrate: () => migrate,
  upload: () => upload,
  version: () => version
});

// src/hash.ts
init_deps();
init_utils();
async function hash(args, internal = false) {
  const [filename] = args;
  if (!filename) {
    console.error("please pass in a file");
    Deno.exit(1);
  }
  const file = await Deno.open(filename, { read: true });
  const myFileContent = await streams.readAll(file);
  Deno.close(file.rid);
  const hash2 = blake32Hash(myFileContent);
  if (!internal) {
    console.log(`blake32Hash(${filename}):`, hash2);
  }
  return hash2;
}

// src/help.ts
function help(args) {
  if (!args || args.length === 0) {
    console.log(`
      chel
      chel help [command]
      chel version
      chel keygen [--out <key.json>]
      chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]] [--out=<manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] <key.json> <contract-bundle.js>
      chel deploy <url-or-dir-or-sqlitedb> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]
      chel upload <url-or-dir-or-sqlitedb> <file1> [<file2> [<file3> ...]]
      chel latestState <url> <contractID>
      chel eventsSince [--limit N] <url> <contractID> <hash>
      chel eventsBefore [--limit N] <url> <contractID> <hash>
      chel hash <file>
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
  `,
  manifest: `
    chel manifest [-k|--key <pubkey1> [-k|--key <pubkey2> ...]]
                  [--out=<manifest.json>]
                  [--slim <contract-slim.js>]
                  [-v|--version <version>]
                  <key.json> <contract-bundle.js>

    If unspecified, <version> is set to 'x'.
  `,
  upload: `
    chel upload <url-or-dir-or-sqlitedb> <file1> [<file2> [<file3> ...]]

    Reqires read and write access to the destination.
  `,
  deploy: `
    chel deploy <url-or-dir> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]
  `
};

// src/manifest.ts
init_deps();
async function manifest(args) {
  const parsedArgs = flags.parse(args);
  const [_keyFile, contractFile] = parsedArgs._;
  const parsedFilepath = path.parse(contractFile);
  const { name: contractName, base: contractBasename, dir: contractDir } = parsedFilepath;
  const version2 = parsedArgs.version || parsedArgs.v || "x";
  const slim = parsedArgs.slim || parsedArgs.s;
  const outFilepath = path.join(contractDir, `${contractName}.${version2}.manifest.json`);
  const body = {
    version: version2,
    contract: {
      hash: await hash([contractFile], true),
      file: contractBasename
    },
    authors: [
      { cipher: "algo", key: "<pubkey from deploy-key.json>" },
      { cipher: "algo", key: "<pubkey from alex.json>" }
    ]
  };
  if (slim) {
    body.contractSlim = {
      file: path.basename(slim),
      hash: await hash([slim], true)
    };
  }
  const manifest2 = JSON.stringify({
    head: { manifestVersion: "1.0.0" },
    body: JSON.stringify(body),
    signature: {
      key: "<which of the 'authors' keys was used to sign 'body'>",
      signature: "<signature>"
    }
  });
  if (parsedArgs.out === "-") {
    console.log(manifest2);
  } else {
    const outFile = parsedArgs.out || outFilepath;
    Deno.writeTextFileSync(outFile, manifest2);
    console.log(colors.green("wrote:"), outFile);
  }
}

// src/migrate.ts
init_deps();
init_utils();
var backends = {
  fs: await Promise.resolve().then(() => (init_database_fs(), database_fs_exports)),
  sqlite: await Promise.resolve().then(() => (init_database_sqlite(), database_sqlite_exports))
};
async function migrate(args) {
  const parsedArgs = flags.parse(args);
  const { from, to, out } = parsedArgs;
  const src = path.resolve(String(parsedArgs._[0]) ?? ".");
  if (!from)
    exit("missing argument: --from");
  if (!to)
    exit("missing argument: --to");
  if (!out)
    exit("missing argument: --out");
  const backendFrom = backends[from];
  const backendTo = backends[to];
  if (!backendFrom)
    exit(`unknown storage backend: "${from}"`);
  if (!backendTo)
    exit(`unknown storage backend: "${to}"`);
  if (from === to)
    exit("arguments --from and --to must be different");
  if (isDir(src)) {
    if (from === "sqlite")
      exit(`not a database file: "${src}"`);
  } else if (isFile(src)) {
    if (from === "fs")
      exit(`not a directory: "${src}"`);
  } else {
    exit(`not found: "${src}"`);
  }
  if (isDir(out)) {
    if (to === "sqlite")
      exit(`argument --out is a directory: "${out}"`);
  } else if (isFile(out)) {
    if (to === "fs")
      exit(`argument --out is a file: "${out}"`);
  } else if (out.endsWith("./")) {
    if (to === "sqlite")
      exit(`argument --out ends with a slash: "${out}"`);
  }
  try {
    await backendFrom.initStorage(from === "fs" ? { dirname: src } : { dirname: path.dirname(src), filename: path.basename(src) });
  } catch (error) {
    exit(`could not init storage backend at "${src}" to migrate from: ${error.message}`);
  }
  try {
    await backendTo.initStorage(to === "fs" ? { dirname: out } : { dirname: path.dirname(out), filename: path.basename(out) });
  } catch (error) {
    exit(`could not init storage backend to migrate to: ${error.message}`);
  }
  const numKeys = await backendFrom.count();
  let numVisitedKeys = 0;
  for await (const key of backendFrom.iterKeys()) {
    if (!isValidKey(key))
      continue;
    const value = await backendFrom.readData(key);
    if (value === void 0)
      continue;
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

// src/upload.ts
init_deps();
init_utils();
async function upload(args, internal = false) {
  const [urlOrDirOrSqliteFile, ...files] = args;
  if (files.length === 0)
    throw new Error(`missing files!`);
  const uploaded = [];
  const uploaderFn = isDir(urlOrDirOrSqliteFile) ? uploadToDir : urlOrDirOrSqliteFile.endsWith(".db") ? uploadToSQLite : uploadToURL;
  for (const filepath of files) {
    const destination = await uploaderFn(filepath, urlOrDirOrSqliteFile);
    if (!internal) {
      console.log(colors.green("uploaded:"), destination);
    } else {
      console.log(colors.green(`${path.relative(".", filepath)}:`), destination);
    }
    uploaded.push([filepath, destination]);
  }
  return uploaded;
}
function uploadToURL(filepath, url) {
  const buffer = Deno.readFileSync(filepath);
  const hash2 = blake32Hash(buffer);
  const form = new FormData();
  form.append("hash", hash2);
  form.append("data", new Blob([buffer]), path.basename(filepath));
  return fetch(`${url}/file`, { method: "POST", body: form }).then(handleFetchResult("text")).then((r) => {
    if (r !== `/file/${hash2}`) {
      throw new Error(`server returned bad URL: ${r}`);
    }
    return `${url}${r}`;
  });
}
async function uploadToDir(filepath, dir) {
  const buffer = Deno.readFileSync(filepath);
  const hash2 = blake32Hash(buffer);
  const destination = path.join(dir, hash2);
  await Deno.writeFile(destination, buffer);
  return destination;
}
async function uploadToSQLite(filepath, sqlitedb) {
  const { initStorage: initStorage3, writeData: writeData3 } = await Promise.resolve().then(() => (init_database_sqlite(), database_sqlite_exports));
  initStorage3({ dirname: path.dirname(sqlitedb), filename: path.basename(sqlitedb) });
  const buffer = await Deno.readFile(filepath);
  const hash2 = blake32Hash(buffer);
  writeData3(hash2, buffer);
  return hash2;
}
function handleFetchResult(type) {
  return function(r) {
    if (!r.ok)
      throw new Error(`${r.status}: ${r.statusText}`);
    return r[type]();
  };
}

// src/deploy.ts
init_deps();
async function deploy(args) {
  const [urlOrDirOrSqliteFile, ...manifests] = args;
  if (manifests.length === 0)
    throw new Error("missing url or manifests!");
  const toUpload = [];
  for (const manifestPath of manifests) {
    const json = JSON.parse(Deno.readTextFileSync(manifestPath));
    const body = JSON.parse(json.body);
    const dirname = path.dirname(manifestPath);
    toUpload.push(path.join(dirname, body.contract.file));
    if (body.contractSlim) {
      toUpload.push(path.join(dirname, body.contractSlim.file));
    }
    toUpload.push(manifestPath);
  }
  await upload([urlOrDirOrSqliteFile, ...toUpload], true);
}

// src/version.ts
function version() {
  console.log("1.1.3");
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
