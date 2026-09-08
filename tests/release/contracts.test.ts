import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createProgram } from '../../src/cli-program.js';
import { loadKnowledge } from '../../src/knowledge/load.js';

const readJson = async (file: string): Promise<Record<string, unknown>> =>
  JSON.parse(await readFile(resolve(file), 'utf8')) as Record<string, unknown>;

describe('frozen V1 release contracts', () => {
  it('keeps package and CLI identity stable', async () => {
    const packageJson = await readJson('package.json');
    expect(packageJson.version).toBe('1.0.0-rc.1');
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
    }
  });

  it('ships complete initial ecosystem coverage with core sections', async () => {
    const knowledge = await loadKnowledge();
    expect([...knowledge.models.keys()]).toEqual([
      'anthropic-claude-sonnet-5',
      'google-gemini-3-8-flash',
      'openai-gpt-6-astra',
    ]);
    expect([...knowledge.harnesses.keys()]).toEqual(['claude-code', 'codex', 'gemini-cli']);
    expect([...knowledge.tasks.keys()]).toEqual(['bug', 'feature', 'refactor', 'review', 'ui']);

    for (const entry of [...knowledge.models.values(), ...knowledge.harnesses.values()]) {
      expect(entry.body).toContain('## Summary');
      expect(entry.body).toContain('## Recommended');
      expect(entry.body).toContain('## Avoid');
      expect(entry.body).toContain('## Sources');
      expect(entry.metadata.sources.length).toBeGreaterThan(0);
      expect(entry.metadata.evidence.length).toBeGreaterThan(0);
      expect(entry.body).not.toMatch(/universal (winner|best)|best model/i);
    }
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
