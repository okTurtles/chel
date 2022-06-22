#!/usr/bin/env node

// TODO: include 'binary-install' under the 'vendor/' folder and modify it so that we directly download
//       the binary into the node_modules of this module instead of that of binary-install, so that
//       we can directly reference it from "package.json"'s "bin" as { "chel": "./node_modules/.bin/chel" }
//       and therefore speed up its startup time.

const { Binary } = require('../vendor/binary-install/index.js')
const os = require('os')
const { version, repository } = require('../package.json')

const supportedPlatforms = {
  'Windows_NT_x64': {
    TARGET: 'x86_64-pc-windows-msvc',
    BINARY_NAME: 'chel.exe'
  },
  'Linux_x64': {
    TARGET: 'x86_64-unknown-linux-gnu',
    BINARY_NAME: 'chel'
  },
  'Darwin_x64': {
    TARGET: 'x86_64-apple-darwin',
    BINARY_NAME: 'chel'
  }
}

const getPlatformMetadata = () => {
  const type = os.type()
  const architecture = os.arch()
  const supportedPlatform = supportedPlatforms[`${type}_${architecture}`]
  if (supportedPlatform) return supportedPlatform
  console.error(`Platform with type '${type}' and architecture '${architecture}' is not supported by chel.`)
  process.exit(1)
}

const getBinary = () => {
  const metadata = getPlatformMetadata()
  // the url for this binary is constructed from values in `package.json`
  // https://github.com/okTurtles/chel/releases/download/v1.0.0/chel-v1.0.0-x86_64-apple-darwin.tar.gz
  const url = `${repository.url}/releases/download/v${version}/chel-v${version}-${metadata.TARGET}.tar.gz`
  return new Binary(metadata.BINARY_NAME, url)
}

module.exports = {
  install () { getBinary().install() },
  run () { getBinary().run() }
}
