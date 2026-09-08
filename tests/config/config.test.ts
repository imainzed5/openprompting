import { mkdir, mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { configPathFor } from '../../src/config/path.js';
import type { PromptChoice, SetupPrompter } from '../../src/config/prompter.js';
import { readConfig } from '../../src/config/read.js';
import { setupProject } from '../../src/config/setup.js';
import type { OpenPromptingConfig } from '../../src/config/types.js';
import { validateConfig } from '../../src/config/validate.js';
import { writeConfig } from '../../src/config/write.js';
import { loadKnowledge } from '../../src/knowledge/load.js';
import type { KnowledgeIndex } from '../../src/knowledge/types.js';

const roots: string[] = [];
let knowledge: KnowledgeIndex;

const project = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'openprompting-config-'));
  roots.push(root);
  return root;
};

const baseConfig = (): OpenPromptingConfig => ({
  version: 1,
  setups: {
    builder: { model: 'openai-gpt-6-astra', harness: 'codex' },
  },
  profiles: {
    builder: { uses: 'builder', role: 'implementation' },
  },
  defaults: { profile: 'builder', tasks: { feature: 'builder' } },
});

class ScriptedPrompter implements SetupPrompter {
  public readonly previews: string[] = [];
  public constructor(
    private readonly inputs: Array<string | undefined>,
    private readonly confirmations: Array<boolean | undefined>,
    private readonly selections: Array<string | undefined>,
  ) {}
  public async input(): Promise<string | undefined> { return this.inputs.shift(); }
  public async confirm(): Promise<boolean | undefined> { return this.confirmations.shift(); }
  public async select(_message: string, choices: PromptChoice[]): Promise<string | undefined> {
    const value = this.selections.shift();
    if (value !== undefined && !choices.some((choice) => choice.value === value)) throw new Error(`Invalid scripted choice: ${value}`);
    return value;
  }
  public show(message: string): void { this.previews.push(message); }
}

beforeAll(async () => { knowledge = await loadKnowledge(); });
afterEach(async () => { await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))); });

describe('config contract', () => {
  it('creates and round-trips a fresh config', async () => {
    const root = await project();
    await writeConfig(root, baseConfig());
    await expect(readConfig(root, knowledge)).resolves.toEqual(baseConfig());
  });

  it.each(['openprompting.yml', 'single-setup.yml', 'builder-reviewer.yml', 'builder-reviewer-designer.yml'])('validates example %s', async (filename) => {
    const value = parse(await readFile(join('examples', filename), 'utf8')) as unknown;
    await expect(validateConfig(value, knowledge)).resolves.toEqual(value);
  });

  it('preserves valid unrelated top-level fields during an edit', async () => {
    const root = await project();
    const original = { ...baseConfig(), extension_data: { enabled: true } };
    await writeConfig(root, original);
    const edited = await readConfig(root, knowledge);
    if (!edited) throw new Error('Expected config');
    edited.defaults = { ...edited.defaults, profile: 'builder' };
    await writeConfig(root, edited);
    expect((await readConfig(root, knowledge))?.extension_data).toEqual({ enabled: true });
  });

  it('rejects unsupported config versions', async () => {
    await expect(validateConfig({ ...baseConfig(), version: 2 }, knowledge)).rejects.toThrow(/supports version 1/);
  });

  it.each([
    [{ ...baseConfig(), setups: { bad: { model: 'missing', harness: 'codex' } } }, /unknown model/],
    [{ ...baseConfig(), setups: { bad: { model: 'openai-gpt-6-astra', harness: 'missing' } } }, /unknown harness/],
    [{ ...baseConfig(), profiles: { bad: { uses: 'missing' } } }, /missing setup/],
    [{ ...baseConfig(), defaults: { profile: 'missing' } }, /Default profile/],
    [{ ...baseConfig(), defaults: { tasks: { feature: 'missing' } } }, /missing profile/],
  ])('rejects invalid semantic references', async (config, expected) => {
    await expect(validateConfig(config, knowledge)).rejects.toThrow(expected as RegExp);
  });

  it('builds a mixed-model config through the wizard and previews before writing', async () => {
    const root = await project();
    const prompts = new ScriptedPrompter(
      ['gpt-codex', 'builder', 'implementation', 'claude-review', 'reviewer', 'review'],
      [true, true, true, false, true, true],
      [
        'openai-gpt-6-astra', 'codex',
        'anthropic-claude-sonnet-5', 'claude-code',
        'builder',
        'builder', 'builder', 'builder', 'reviewer', 'builder',
      ],
    );
    const result = await setupProject(root, knowledge, prompts);
    expect(prompts.previews).toHaveLength(1);
    expect(result.config.setups).toHaveProperty('gpt-codex');
    expect(result.config.setups).toHaveProperty('claude-review');
    expect(result.config.defaults?.tasks?.review).toBe('reviewer');
    await expect(readConfig(root, knowledge)).resolves.toEqual(result.config);
  });

  it('edits an existing config without discarding unrelated information', async () => {
    const root = await project();
    await writeConfig(root, { ...baseConfig(), custom: { keep: 'yes' } });
    const prompts = new ScriptedPrompter(
      ['claude-review', 'reviewer', 'review'],
      [true, false, false, true],
      ['anthropic-claude-sonnet-5', 'claude-code', 'builder'],
    );
    const result = await setupProject(root, knowledge, prompts);
    expect(result.config.custom).toEqual({ keep: 'yes' });
    expect(result.config.setups).toHaveProperty('claude-review');
  });

  it('does not mutate the file when final confirmation is declined', async () => {
    const root = await project();
    await writeConfig(root, baseConfig());
    const path = configPathFor(root);
    const before = await readFile(path, 'utf8');
    const prompts = new ScriptedPrompter(
      ['new-setup', 'new-profile', 'testing'],
      [true, false, false, false],
      ['anthropic-claude-sonnet-5', 'claude-code', 'builder'],
    );
    await expect(setupProject(root, knowledge, prompts)).rejects.toThrow(/cancelled/i);
    expect(await readFile(path, 'utf8')).toBe(before);
  });

  it('rejects config-directory links before writing', async () => {
    const root = await project();
    const outside = await project();
    await mkdir(join(outside, 'linked-config'), { recursive: true });
    await symlink(join(outside, 'linked-config'), dirname(configPathFor(root)), 'junction');
    await expect(writeConfig(root, baseConfig())).rejects.toThrow(/symbolic link/);
    await expect(readFile(join(outside, 'linked-config', 'config.yml'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' });
  });
});
