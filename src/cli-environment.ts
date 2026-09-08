import type { Readable, Writable } from 'node:stream';

export interface CliEnvironment {
  cwd: string;
  input: Readable;
  output: Writable;
  error: Writable;
  now: () => Date;
  setExitCode: (code: number) => void;
}

export const processEnvironment = (): CliEnvironment => ({
  cwd: process.cwd(),
  input: process.stdin,
  output: process.stdout,
  error: process.stderr,
  now: () => new Date(),
  setExitCode: (code) => { process.exitCode = code; },
});
