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
import { default as default2 } from "https://esm.sh/multihashes@4.0.3?bundle";
import { default as default3 } from "https://esm.sh/blakejs@1.2.1";
import { miniexec } from "https://deno.land/x/miniexec@1.0.0/mod.ts";
import * as esbuild from "https://deno.land/x/esbuild@v0.14.47/mod.js";
import * as sqlite from "https://deno.land/x/sqlite/mod.ts";
var init_deps = __esm({
  "src/deps.ts"() {
  }
});

// src/database-sqlite.ts
var database_sqlite_exports = {};
__export(database_sqlite_exports, {
  checkKey: () => checkKey,
  initStorage: () => initStorage,
  writeData: () => writeData
});
function checkKey(key) {
  if (/[/\\]/.test(key)) {
    throw new Error(`bad key: ${key}`);
  }
}
function initStorage(filename) {
  if (db !== null && filename === databaseFilename) {
    return;
  }
  if (db !== null && filename !== databaseFilename) {
    db.close();
  }
  db = new DB(path.resolve(filename), { mode: "write" });
  databaseFilename = filename;
  console.log("Connected to the %s SQLite database.", filename);
  writeStatement = db.prepareQuery("REPLACE INTO Data(key, value) VALUES(?, ?)");
}
function writeData(key, value) {
  checkKey(key);
  writeStatement.execute([key, value]);
}
var DB, db, databaseFilename, writeStatement;
var init_database_sqlite = __esm({
  "src/database-sqlite.ts"() {
    init_deps();
    ({ DB } = sqlite);
    db = null;
  }
});

// src/commands.ts
var commands_exports = {};
__export(commands_exports, {
  deploy: () => deploy,
  hash: () => hash,
  help: () => help,
  manifest: () => manifest,
  upload: () => upload,
  version: () => version
});

// src/hash.ts
init_deps();

// src/utils.ts
init_deps();
function blake32Hash(data) {
  const uint8array = default3.blake2b(data, void 0, 32);
  return default2.toB58String(default2.encode(uint8array, "blake2b-32", 32));
}
function isDir(path2) {
  try {
    const info = Deno.lstatSync(path2);
    return info.isDirectory;
  } catch (_e) {
    return false;
  }
}

// src/hash.ts
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
      chel deploy <url-or-dir> <contract-manifest.json> [<manifest2.json> [<manifest3.json> ...]]
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

// src/upload.ts
init_deps();
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
async function uploadToSQLite(filepath, databaseFile) {
  const { initStorage: initStorage2, writeData: writeData2 } = await Promise.resolve().then(() => (init_database_sqlite(), database_sqlite_exports));
  initStorage2(databaseFile);
  const buffer = await Deno.readFile(filepath);
  const hash2 = blake32Hash(buffer);
  writeData2(`blob=${hash2}`, buffer);
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
