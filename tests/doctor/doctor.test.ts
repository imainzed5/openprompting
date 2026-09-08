import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { configPathFor } from '../../src/config/path.js';
import type { OpenPromptingConfig } from '../../src/config/types.js';
import { writeConfig } from '../../src/config/write.js';
import { renderDoctor } from '../../src/doctor/render.js';
import { runDoctor } from '../../src/doctor/run.js';

const roots: string[] = [];

const project = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'openprompting-doctor-'));
  roots.push(root);
  return root;
};

const healthyConfig: OpenPromptingConfig = {
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

const snapshot = async (root: string): Promise<string> => {
  const files = (await readdir(root, { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
  return (await Promise.all(files.map(async (file) => `${file.slice(root.length)}\n${await readFile(file, 'utf8')}`))).join('\n---\n');
};

beforeAll(() => undefined);
afterEach(async () => { await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))); });

describe('local doctor', () => {
  it('reports a healthy mixed-model project and remains read-only', async () => {
    const root = await project();
    await writeConfig(root, healthyConfig);
    await writeFile(join(root, 'AGENTS.md'), '# Instructions\n');
    await writeFile(join(root, 'CLAUDE.md'), '# Instructions\n');
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'vitest', lint: 'eslint .', build: 'tsup', typecheck: 'tsc --noEmit' } }));
    const before = await snapshot(root);
    const report = await runDoctor(root, { now: new Date('2026-09-10T00:00:00Z'), profile: 'reviewer' });
    expect(report.hasFailures).toBe(false);
    expect(report.results).toContainEqual(expect.objectContaining({ level: 'PASS', check: 'selected-profile:reviewer' }));
    expect(report.results).toContainEqual(expect.objectContaining({ level: 'INFO', check: 'instruction:codex:AGENTS.md' }));
    expect(await snapshot(root)).toBe(before);
  });

  it('treats missing instruction files and scripts as warnings, not failures', async () => {
    const root = await project();
    await writeConfig(root, { version: 1, setups: { only: healthyConfig.setups.gpt! } });
    await writeFile(join(root, 'package.json'), JSON.stringify({ scripts: { test: 'vitest' } }));
    const report = await runDoctor(root, { now: new Date('2026-09-10T00:00:00Z') });
    expect(report.hasFailures).toBe(false);
    expect(report.results).toContainEqual(expect.objectContaining({ level: 'WARN', check: 'instruction:codex:AGENTS.md' }));
    expect(report.results).toContainEqual(expect.objectContaining({ level: 'WARN', check: 'script:typecheck' }));
  });

  it('reports a project without package.json as informational', async () => {
    const root = await project();
    await writeConfig(root, { version: 1, setups: { only: healthyConfig.setups.gpt! } });
    const report = await runDoctor(root);
    expect(report.results).toContainEqual(expect.objectContaining({ level: 'INFO', check: 'package' }));
  });

  it('fails for a missing config', async () => {
    const report = await runDoctor(await project());
    expect(report.hasFailures).toBe(true);
    expect(report.results).toContainEqual(expect.objectContaining({ level: 'FAIL', check: 'config' }));
  });

  it.each([
    [`version: 1\nsetups:\n  bad:\n    model: missing\n    harness: codex\n`, /unknown model/],
    [`version: 1\nsetups:\n  good:\n    model: openai-gpt-6-astra\n    harness: codex\nprofiles:\n  broken:\n    uses: missing\n`, /missing setup/],
    [`version: 1\nsetups:\n  good:\n    model: openai-gpt-6-astra\n    harness: codex\nprofiles:\n  good:\n    uses: good\ndefaults:\n  tasks:\n    review: missing\n`, /missing profile/],
  ])('fails for broken references with a migration path', async (yaml, expected) => {
    const root = await project();
    const path = configPathFor(root);
    await mkdir(join(root, '.openprompting'));
    await writeFile(path, yaml);
    const report = await runDoctor(root);
    const output = renderDoctor(report);
    expect(report.hasFailures).toBe(true);
    expect(output).toMatch(expected as RegExp);
    expect(output).toContain('migrate it to the version 1');
  });

  it('warns when knowledge is stale without failing', async () => {
    const root = await project();
    await writeConfig(root, { version: 1, setups: { only: healthyConfig.setups.gpt! } });
    const report = await runDoctor(root, { now: new Date('2027-02-01T00:00:00Z') });
    expect(report.hasFailures).toBe(false);
    expect(report.results.some((item) => item.level === 'WARN' && item.check.startsWith('freshness:'))).toBe(true);
  });

  it('fails when knowledge is unavailable', async () => {
    const root = await project();
    const report = await runDoctor(root, { knowledgeRoot: join(root, 'missing-knowledge') });
    expect(report.results).toContainEqual(expect.objectContaining({ level: 'FAIL', check: 'knowledge' }));
  });

  it('fails an explicit unknown profile actionably', async () => {
    const root = await project();
    await writeConfig(root, healthyConfig);
    const report = await runDoctor(root, { profile: 'missing' });
    expect(report.results).toContainEqual(expect.objectContaining({ level: 'FAIL', check: 'selected-profile:missing', message: expect.stringMatching(/Valid profiles/) }));
  });
});
