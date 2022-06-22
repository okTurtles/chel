import { iter } from "./deps.ts";

export interface MiniExecOptions {
  printOutput?: boolean; // Print the output to stdout & stderr?
  shell?: string; // Specifies what shell is used. Default is "/bin/sh".
}

export async function miniexec(command: string, options: MiniExecOptions = {}) {
  const { printOutput = false, shell = "/bin/sh" } = options;
  const decoder = new TextDecoder();
  const p = Deno.run({
    cmd: [shell, "-c", command],
    stdout: "piped",
    stderr: "piped",
  });
  let stdout = "";
  let stderr = "";
  const stdoutPromise = (async function () {
    for await (const chunk of iter(p.stdout)) {
      const decoded = decoder.decode(chunk);
      if (printOutput) await Deno.stdout.write(chunk);
      stdout += decoded;
    }
    p.stdout.close();
  })();
  const stderrPromise = (async function () {
    for await (const chunk of iter(p.stderr)) {
      const decoded = decoder.decode(chunk);
      if (printOutput) await Deno.stderr.write(chunk);
      stderr += decoded;
    }
    p.stderr.close();
  })();
  const { success } = await p.status();
  await Promise.all([stdoutPromise, stderrPromise]);
  p.close();
  if (!success) {
    throw new Error(stderr);
  }
  return stdout.trim();
}
