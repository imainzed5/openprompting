import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadKnowledge } from '../../src/knowledge/load.js';

const temporaryRoots: string[] = [];

const newKnowledgeRoot = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'openprompting-knowledge-'));
  temporaryRoots.push(root);
  await Promise.all(['models', 'harnesses', 'tasks'].map((name) => mkdir(join(root, name))));
  return root;
};

const validEntry = (id: string, type: 'model' | 'harness' | 'task'): string => `---
id: ${id}
type: ${type}
${type === 'task' ? '' : 'provider: example\n'}status: active
last_verified: 2026-09-07
evidence:
  - class: official
    claim: A scoped example claim.
    source: example-source
sources:
  - id: example-source
    title: Example source
    url: https://example.com/docs
    last_checked: 2026-09-07
---

# Example
`;

const schemasRoot = resolve('schemas');

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('knowledge loader', () => {
  it('enumerates all shipped knowledge by type', async () => {
    const index = await loadKnowledge();
    expect([...index.models.keys()]).toEqual([
      'anthropic-claude-sonnet-5',
      'google-gemini-3-8-flash',
      'openai-gpt-6-astra',
    ]);
    expect([...index.harnesses.keys()]).toEqual(['claude-code', 'codex', 'gemini-cli']);
    expect([...index.tasks.keys()]).toEqual(['bug', 'feature', 'refactor', 'review', 'ui']);
  });

  it('loads a newly added valid entry without router changes', async () => {
    const root = await newKnowledgeRoot();
    await writeFile(join(root, 'models', 'new-model.md'), validEntry('new-model', 'model'));
    const index = await loadKnowledge({ knowledgeRoot: root, schemasRoot });
    expect(index.models.has('new-model')).toBe(true);
  });

  it('discovers a contributor-added harness without resolver changes', async () => {
    const root = await newKnowledgeRoot();
    await writeFile(join(root, 'harnesses', 'new-harness.md'), validEntry('new-harness', 'harness'));
    const index = await loadKnowledge({ knowledgeRoot: root, schemasRoot });
    expect(index.harnesses.has('new-harness')).toBe(true);
  });

  it('rejects malformed frontmatter', async () => {
    const root = await newKnowledgeRoot();
    await writeFile(join(root, 'tasks', 'broken.md'), '---\nid: [\n---\n');
    await expect(loadKnowledge({ knowledgeRoot: root, schemasRoot })).rejects.toThrow(/Malformed frontmatter/);
  });

  it('rejects duplicate IDs globally', async () => {
    const root = await newKnowledgeRoot();
    await writeFile(join(root, 'models', 'same.md'), validEntry('same', 'model'));
    await writeFile(join(root, 'tasks', 'same.md'), validEntry('same', 'task'));
    await expect(loadKnowledge({ knowledgeRoot: root, schemasRoot })).rejects.toThrow(/Duplicate knowledge ID 'same'/);
  });

  it('rejects an unknown type', async () => {
    const root = await newKnowledgeRoot();
    await writeFile(join(root, 'tasks', 'alien.md'), validEntry('alien', 'task').replace('type: task', 'type: alien'));
    await expect(loadKnowledge({ knowledgeRoot: root, schemasRoot })).rejects.toThrow(/Invalid task metadata/);
  });

  it('rejects an unsupported evidence class', async () => {
    const root = await newKnowledgeRoot();
    await writeFile(join(root, 'tasks', 'bad-evidence.md'), validEntry('bad-evidence', 'task').replace('class: official', 'class: rumor'));
    await expect(loadKnowledge({ knowledgeRoot: root, schemasRoot })).rejects.toThrow(/Invalid task metadata/);
  });

  it('rejects missing required metadata', async () => {
    const root = await newKnowledgeRoot();
    await writeFile(join(root, 'tasks', 'missing.md'), validEntry('missing', 'task').replace('last_verified: 2026-09-07\n', ''));
    await expect(loadKnowledge({ knowledgeRoot: root, schemasRoot })).rejects.toThrow(/last_verified/);
  });

  it('rejects evidence pointing to an undeclared source', async () => {
    const root = await newKnowledgeRoot();
    await writeFile(join(root, 'tasks', 'bad-source.md'), validEntry('bad-source', 'task').replace('source: example-source', 'source: missing-source'));
    await expect(loadKnowledge({ knowledgeRoot: root, schemasRoot })).rejects.toThrow(/Unknown source reference/);
  });

  it('accepts tested evidence only with a reproduction basis', async () => {
    const root = await newKnowledgeRoot();
    const tested = validEntry('tested-task', 'task')
      .replace('class: official', 'class: tested')
      .replace('    source: example-source\n', '    reproduction: Run the documented fixture suite.\n');
    await writeFile(join(root, 'tasks', 'tested.md'), tested);
    const index = await loadKnowledge({ knowledgeRoot: root, schemasRoot });
    expect(index.tasks.has('tested-task')).toBe(true);
  });
});
