import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createProgram } from '../../src/cli-program.js';
import { validateTaskTemplateIntegrity } from '../../src/knowledge/integrity.js';
import { loadKnowledge } from '../../src/knowledge/load.js';

const V1_MODEL_IDS = [
  'openai-gpt-6-astra',
  'anthropic-claude-sonnet-5',
  'google-gemini-3-8-flash',
];
const V1_HARNESS_IDS = ['codex', 'claude-code', 'gemini-cli'];
const V1_TASK_IDS = ['feature', 'bug', 'review', 'refactor', 'ui'];
const V1_1_MODEL_IDS = ['openai-gpt-5-3-codex', 'anthropic-claude-opus-5'];
const V1_1_HARNESS_IDS = ['cursor', 'github-copilot-cli', 'opencode', 'aider'];
const V1_1_TASK_IDS = ['planning', 'research', 'testing', 'migration'];

const readJson = async (file: string): Promise<Record<string, unknown>> =>
  JSON.parse(await readFile(resolve(file), 'utf8')) as Record<string, unknown>;

describe('V1 release contracts', () => {
  it('keeps package and CLI identity stable', async () => {
    const packageJson = await readJson('package.json');
    expect(packageJson.version).toBe('1.1.2');
    expect(packageJson.bin).toEqual({ openprompting: 'dist/cli.js' });

    const program = createProgram();
    expect(program.name()).toBe('openprompting');
    expect(program.version()).toBe(packageJson.version);
    expect(program.commands.map((command) => command.name())).toEqual([
      'help',
      'setup',
      'guide',
      'new',
      'doctor',
      'compare',
    ]);
  });

  it('keeps config schema version 1 and evidence vocabulary stable', async () => {
    const config = await readJson('schemas/config.schema.json');
    const configProperties = config.properties as Record<string, { const?: number }>;
    expect(configProperties.version?.const).toBe(1);

    for (const schemaName of ['model', 'harness', 'task']) {
      const schema = await readJson(`schemas/${schemaName}.schema.json`);
      const definitions = schema.$defs as Record<string, { items?: { properties?: { class?: { enum?: string[] } } } }>;
      expect(definitions.evidenceList?.items?.properties?.class?.enum).toEqual([
        'official',
        'tested',
        'community',
        'legacy',
      ]);
      const properties = schema.properties as Record<string, { type?: string }>;
      expect(properties.display_name?.type).toBe('string');
    }
  });

  it('preserves V1 seed entries while allowing additive catalog growth', async () => {
    const knowledge = await loadKnowledge();
    for (const id of V1_MODEL_IDS) expect(knowledge.models.has(id)).toBe(true);
    for (const id of V1_HARNESS_IDS) expect(knowledge.harnesses.has(id)).toBe(true);
    for (const id of V1_TASK_IDS) expect(knowledge.tasks.has(id)).toBe(true);
    for (const id of V1_1_MODEL_IDS) expect(knowledge.models.has(id)).toBe(true);
    for (const id of V1_1_HARNESS_IDS) expect(knowledge.harnesses.has(id)).toBe(true);
    for (const id of V1_1_TASK_IDS) expect(knowledge.tasks.has(id)).toBe(true);

    for (const entry of knowledge.all.values()) {
      if (entry.metadata.status !== 'active') continue;
      expect(entry.body).toContain('## Summary');
      expect(entry.body).toContain('## Recommended');
      expect(entry.body).toContain('## Avoid');
      expect(entry.body).toContain('## Sources');
      expect(entry.metadata.sources.length).toBeGreaterThan(0);
      expect(entry.metadata.evidence.length).toBeGreaterThan(0);
      expect(entry.body).not.toMatch(/universal (winner|best)|best model/i);
    }
    await validateTaskTemplateIntegrity(knowledge);
  });

  it('keeps runtime source free of network clients', async () => {
    const sourceFiles = [
      'src/cli-program.ts',
      'src/config/read.ts',
      'src/config/setup.ts',
      'src/doctor/run.ts',
      'src/knowledge/load.ts',
      'src/resolver/guide.ts',
      'src/resolver/prompt.ts',
    ];
    const source = (await Promise.all(sourceFiles.map((file) => readFile(resolve(file), 'utf8')))).join('\n');
    expect(source).not.toMatch(/from ['"](?:node:)?https?['"]|\bfetch\s*\(/);
  });
});
