// we directly include this in our project so that the downloaded binary is stored
// with our module instead of with some other one. This allows us to avoid using
// nodejs as a wrapper executable to run our binary, greatly speeding up performance
// see: https://github.com/EverlastingBugstopper/binary-install/tree/main/packages/binary-install

const process = require('node:process')
const { existsSync, mkdirSync } = require('fs')
const { join, resolve } = require('path')
const { spawnSync } = require('child_process')

const axios = require('axios')
const tar = require('tar')
const rimraf = require('rimraf')

const error = msg => {
  console.error(msg)
  process.exit(1)
}

class Binary {
  constructor (name, url) {
    const errors = []
    if (typeof url !== 'string') {
      errors.push('url must be a string')
    } else {
      if (!URL.canParse(url)) {
        errors.push(new Error('Invalid URL format'))
      }
    }
    if (name && typeof name !== 'string') {
      errors.push('name must be a string')
    }

    if (!name) {
      errors.push('You must specify the name of your binary')
    }
    if (errors.length > 0) {
      let errorMsg =
        'One or more of the parameters you passed to the Binary constructor are invalid:\n'
      errors.forEach(error => {
        errorMsg += error
      })
      errorMsg +=
        '\n\nCorrect usage: new Binary("my-binary", "https://example.com/binary/download.tar.gz")'
      error(errorMsg)
    }
    this.url = url
    this.name = name
    this.installDirectory = resolve('bin')

    if (!existsSync(this.installDirectory)) {
      mkdirSync(this.installDirectory, { recursive: true })
    }

    this.binaryPath = join(this.installDirectory, this.name)
  }

  install (fetchOptions) {
    if (existsSync(this.installDirectory)) {
      rimraf.sync(this.installDirectory)
    }

    mkdirSync(this.installDirectory, { recursive: true })

    console.log(`Downloading release from ${this.url}`)

    return axios({ ...fetchOptions, url: this.url, responseType: 'stream' })
      .then(res => {
        return new Promise((resolve, reject) => {
          const sink = res.data.pipe(
            tar.x({ strip: 1, C: this.installDirectory })
          )
          sink.on('finish', () => resolve())
          sink.on('error', err => reject(err))
        })
      })
      .then(() => {
        // TODO: verify the blake32hash of the downloaded binary upon install
        console.log(`${this.name} has been installed!`)
      })
      .catch(e => {
        error(`Error fetching release: ${e.message}`)
      })
  }

  run () {
    if (!existsSync(this.binaryPath)) {
      error(`You must install ${this.name} before you can run it`)
    }

    const [, , ...args] = process.argv

    const options = { cwd: process.cwd(), stdio: 'inherit' }

    const result = spawnSync(this.binaryPath, args, options)

    if (result.error) {
      error(result.error)
    }

    process.exit(result.status)
  }
}

module.exports.Binary = Binary
