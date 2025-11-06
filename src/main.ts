#!/usr/bin/env -S deno run --allow-net --allow-read=. --allow-write=. --allow-sys --allow-env

// Deno APIs:
// https://doc.deno.land/deno/stable
// https://doc.deno.land/https://deno.land/std/
// Deno examples:
// https://doc.deno.land/https://deno.land/std@0.141.0/examples
// https://examples.deno.land/
// Third-party modules:
// https://deno.land/x

import * as commands from './commands.ts'
// @deno-types="npm:@types/nconf"
// import nconf from 'npm:nconf';
import process from 'node:process'
// @deno-types="npm:@types/yargs"
import yargs from 'npm:yargs'
import { hideBin } from 'npm:yargs/helpers'

/* nconf.argv()
  .env()
  .file({ file: 'chel.config.json' })

nconf.set('database:host', '127.0.0.1');
nconf.set('database:port', 5984); */

yargs(hideBin(process.argv))
  .command('deploy', '', (yargs) => {
    return yargs
      .option('url', {
        describe: 'URL of a remote server',
        requiresArg: true,
        string: true
      })
      .demandOption('_')
      .array('_')
      .string('_')
  }, (argv) => {
    argv._.shift()
    return commands.deploy(argv)
  })
  .command('eventsAfter [--limit LIMIT] [--url REMOTE_URL] contractID height', '', (yargs) => {
    return yargs
      .option('limit', {
        describe: 'Limit',
        default: 50,
        number: true,
        requiresArg: true
      })
      .option('url', {
        describe: 'URL of a remote server',
        string: true
      })
      .positional('contractID', {
        describe: 'Contract ID',
        demandOption: true,
        type: 'string'
      })
      .positional('height', {
        describe: 'Height',
        demandOption: true,
        type: 'number'
      })
  }, (argv) => {
    return commands.eventsAfter(argv)
  })
  .command('get [--url URL] key', '', (yargs) => {
    return yargs
      .option('url', {
        describe: 'URL of a remote server',
        requiresArg: true,
        string: true
      })
      .positional('key', {
        describe: 'Key',
        demandOption: true,
        type: 'string'
      })
  }, (argv) => {
    return commands.get(argv)
  })
  .command('hash filename', '', (yargs) => {
    return yargs
      .positional('filename', {
        describe: 'File name',
        demandOption: true,
        type: 'string'
      })
  }, (argv) => {
    return commands.hash(argv)
  })
  .command('keygen', '', (yargs) => {
    return yargs
      .option('out', {
        describe: 'File name for the secret key',
        requiresArg: true,
        string: true
      })
      .option('pubout', {
        describe: 'File name for the public key',
        requiresArg: true,
        string: true
      })
  }, (argv) => {
    return commands.keygen(argv)
  })
  .command('manifest [-k|--key <pubkey1>] [-k|--key <pubkey2> ...] [--out <manifest.json>] [-s|--slim <contract-slim.js>] [-v|--version <version>] signingKey contractBundle', '', (yargs) => {
    return yargs
      .option('key', {
        coerce: (v: string | string[]) => Array.isArray(v) ? v : [v],
        describe: 'Additional public key',
        requiresArg: true,
        string: true,
      })
      .alias('k', 'key')
      .option('out', {
        describe: 'Manifest file name',
        requiresArg: true,
        string: true
      })
      .option('name', {
        describe: 'Contract name',
        requiresArg: true,
        string: true
      })
      .alias('n', 'name')
      .option('slim', {
        describe: 'Slim contract bundle',
        requiresArg: true,
        string: true
      })
      .alias('s', 'slim')
      .option('version', {
        describe: 'Contract version',
        requiresArg: true,
        string: true
      })
      .alias('v', 'version')
      .positional('signingKey', {
        describe: 'Signing key file',
        demandOption: true,
        type: 'string'
      })
      .positional('contractBundle', {
        describe: 'Contract bundle',
        demandOption: true,
        type: 'string'
      })
  }, (argv) => {
    return commands.manifest(argv)
  })
  .command('migrate [--to backend]', '', (yargs) => {
    return yargs
      .option('to', {
        describe: 'Destination backend',
        demandOption: true,
        requiresArg: true,
        string: true
      })
  }, (argv) => {
    return commands.migrate(argv)
  })
  .command('serve [--port PORT] [--dashboard-port PORT] [directory]', 'start the server', (yargs) => {
    return yargs
      .option('port', {
        default: 8000,
        describe: 'Port to listen on (app)',
        demandOption: true,
        requiresArg: true,
        number: true
      })
      .alias('p', 'port')
      .option('dashboard-port', {
        default: 8888,
        describe: 'Port to listen on (dashboard)',
        demandOption: true,
        requiresArg: true,
        number: true
      })
      .alias('d', 'dashboard-port')
      .positional('directory', {
        default: '.',
        describe: 'Directory',
        type: 'string'
      })
  }, (argv) => {
    return commands.serve(argv)
  })
  .command('upload', '', (yargs) => {
    return yargs
      .option('url', {
        describe: 'URL of a remote server',
        requiresArg: true,
        string: true
      })
      .demandOption('_')
      .string('_')
      .array('_')
  }, (argv) => {
    argv._.shift()
    return commands.upload(argv)
  })
  .command('verifySignature manifestFile', '', (yargs) => {
    return yargs
      .option('key', {
        describe: 'Public key',
        requiresArg: true,
        string: true,
      })
      .alias('k', 'key')
      .positional('manifestFile', {
        describe: 'Manifest file',
        demandOption: true,
        type: 'string'
      })
  }, (argv) => {
    return commands.verifySignature(argv)
  })
  .help()
  .parse()
