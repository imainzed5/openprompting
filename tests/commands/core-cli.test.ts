import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable, Writable } from 'node:stream';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createProgram } from '../../src/cli-program.js';
import { writeConfig } from '../../src/config/write.js';
import type { OpenPromptingConfig } from '../../src/config/types.js';

const roots: string[] = [];

const mixedConfig: OpenPromptingConfig = {
  version: 1,
  setups: {
    gpt: { model: 'openai-gpt-6-astra', harness: 'codex' },
    claude: { model: 'anthropic-claude-sonnet-5', harness: 'claude-code' },
  },
  profiles: {
    builder: { uses: 'gpt', role: 'implementation' },
    reviewer: { uses: 'claude', role: 'review' },
  },
  defaults: { profile: 'builder', tasks: { review: 'reviewer' } },
};

let configuredRoot: string;

const collector = (): { stream: Writable; read: () => string } => {
  let content = '';
  return {
    stream: new Writable({ write(chunk: Buffer | string, encoding, callback) {
      void encoding;
      content += chunk.toString();
      callback();
    } }),
    read: () => content,
  };
};

const run = async (cwd: string, args: string[]): Promise<{ stdout: string; stderr: string; exitCode?: number }> => {
  const out = collector();
  const err = collector();
  let commandedExitCode: number | undefined;
  const program = createProgram({
    cwd,
    input: Readable.from([]),
    output: out.stream,
    error: err.stream,
    now: () => new Date('2026-09-10T00:00:00Z'),
    setExitCode: (code) => { commandedExitCode = code; },
  }).exitOverride().configureOutput({ writeOut: (text) => out.stream.write(text), writeErr: (text) => err.stream.write(text) });
  for (const command of program.commands) {
    command.exitOverride().configureOutput({ writeOut: (text) => out.stream.write(text), writeErr: (text) => err.stream.write(text) });
  }
  try {
    await program.parseAsync(['node', 'openprompting', ...args]);
    return { stdout: out.read(), stderr: err.read(), ...(commandedExitCode === undefined ? {} : { exitCode: commandedExitCode }) };
  } catch (error) {
    const exitCode = (error as { exitCode?: number }).exitCode;
    return {
      stdout: out.read(),
      stderr: err.read(),
      ...(exitCode === undefined ? {} : { exitCode }),
    };
  }
};

beforeAll(async () => {
  configuredRoot = await mkdtemp(join(tmpdir(), 'openprompting-cli-'));
  roots.push(configuredRoot);
  await writeConfig(configuredRoot, mixedConfig);
});

afterAll(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('Phase B CLI journeys', () => {
  it('validates an existing setup non-interactively', async () => {
    const result = await run(configuredRoot, ['setup', '--check']);
    expect(result.exitCode).toBeUndefined();
    expect(result.stdout).toContain('Config valid:');
  });

  it('renders the default configured guide with evidence and sources', async () => {
    const result = await run(configuredRoot, ['guide']);
    expect(result.stdout).toContain('Profile: builder');
    expect(result.stdout).toContain('Model guidance: openai-gpt-6-astra');
    expect(result.stdout).toContain('Harness guidance: codex');
    expect(result.stdout).toContain('### Evidence');
    expect(result.stdout).toContain('### Sources');
  });

  it('supports explicit profile and direct harness guide selectors', async () => {
    expect((await run(configuredRoot, ['guide', '--profile', 'reviewer'])).stdout).toContain('Model: anthropic-claude-sonnet-5');
    const harness = await run(configuredRoot, ['guide', '--harness', 'codex']);
    expect(harness.stdout).not.toContain('## Model guidance');
    expect(harness.stdout).toContain('## Harness guidance: codex');
  });

  it('fails clearly for unknown guide identifiers', async () => {
    const result = await run(configuredRoot, ['guide', '--model', 'missing']);
    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('Valid models:');
  });

  it('renders a copyable feature prompt using the default profile', async () => {
    const result = await run(configuredRoot, ['new', 'feature']);
    expect(result.stdout).toContain('# openPrompting task: feature');
    expect(result.stdout).toContain('Profile: builder');
    expect(result.stdout).toContain('<!-- State the user-visible outcome. -->');
  });

  it('uses task routing and allows an explicit override', async () => {
    expect((await run(configuredRoot, ['new', 'review'])).stdout).toContain('Profile: reviewer');
    expect((await run(configuredRoot, ['new', 'review', '--profile', 'builder'])).stdout).toContain('Profile: builder');
  });

  it('fails clearly for an unknown task', async () => {
    const result = await run(configuredRoot, ['new', 'missing']);
    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('Valid tasks:');
  });

  it('runs doctor with warnings at exit zero and supports explicit profiles', async () => {
    const result = await run(configuredRoot, ['doctor', '--profile', 'reviewer']);
    expect(result.exitCode).toBeUndefined();
    expect(result.stdout).toContain('PASS Profile \'reviewer\' resolves');
    expect(result.stdout).toContain('WARN AGENTS.md was not found');
    expect(result.stdout).toMatch(/Summary: \d+ PASS, \d+ INFO, \d+ WARN, 0 FAIL/);
  });

  it('returns a failure status when doctor finds no config', async () => {
    const root = await mkdtemp(join(tmpdir(), 'openprompting-cli-empty-'));
    roots.push(root);
    const result = await run(root, ['doctor']);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain('FAIL No config found');
  });

  it('compares profiles through the CLI without declaring a winner', async () => {
    const result = await run(configuredRoot, ['compare', 'builder', 'reviewer']);
    expect(result.stdout).toContain('builder (profile)');
    expect(result.stdout).toContain('| Role | implementation | review |');
    expect(result.stdout).toContain('No universal winner is inferred.');
  });

});
