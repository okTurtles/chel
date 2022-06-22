// TODO: typescriptify
export function configure(opts) {
    const {
        ignoreExitCode = false, // throws on exit code != 0
        encoding = 'utf-8',     // null for Uint8Array or TextDecoder encoding
        trim = true,            // trim string output. invalid for encoding null
    } = opts

    const decoder = new TextDecoder(encoding)

    if (encoding == null && trim) {
        throw new Error('Must specify an encoding if trim is enabled')
    }

    return async function shell(strings, ...keys) {
        let command = strings[0]
        for (let i = 1; i < strings.length; i++) {
            command += keys[i - 1].toString()
            command += strings[i]
        }

        let proc = Deno.run({
            cmd: ['/bin/sh', '-c', command],
            stdin: 'piped',
            stdout: 'piped',
            stderr: 'piped',
        })

        let stdout = await proc.output()
        let { code } = await proc.status()

        if (code != 0 && !ignoreExitCode) {
            let stderr = await Deno.readAll(proc.stderr)
            let decoder = new TextDecoder('utf-8')
            let error = decoder.decode(stderr).trim()
            throw new Error(`Non-zero exit code: ${code} ${error}`)
        }

        if (encoding == null) {
            return stdout
        }

        let text = decoder.decode(stdout)
        if (trim) text = text.trim()
        return text
    }
}

export default configure({})
