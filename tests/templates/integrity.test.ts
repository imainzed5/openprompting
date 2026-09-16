import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { loadKnowledge } from '../../src/knowledge/load.js';
import { validateTaskTemplateIntegrity } from '../../src/knowledge/integrity.js';
import type { KnowledgeEntry, KnowledgeIndex, TaskMetadata } from '../../src/knowledge/types.js';

const roots: string[] = [];
let knowledge: KnowledgeIndex;

const createTemplateRoot = async (taskIds: Iterable<string>): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'openprompting-templates-'));
  roots.push(root);
  await Promise.all([...taskIds].map((taskId) => writeFile(join(root, `${taskId}.md`), `# ${taskId}\n`)));
  return root;
};

const taskEntry = (id: string, status: 'active' | 'legacy' = 'active'): KnowledgeEntry<TaskMetadata> => ({
  metadata: {
    id,
    type: 'task',
    status,
    last_verified: '2026-09-17',
    evidence: [],
    sources: [],
  },
  body: '',
  path: `${id}.md`,
});

const knowledgeWithTasks = (entries: KnowledgeEntry<TaskMetadata>[]): KnowledgeIndex => ({
  all: new Map(entries.map((entry) => [entry.metadata.id, entry])),
  models: new Map(),
  harnesses: new Map(),
  tasks: new Map(entries.map((entry) => [entry.metadata.id, entry])),
});

beforeAll(async () => { knowledge = await loadKnowledge(); });
afterEach(async () => { await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))); });

describe('task/template catalog integrity', () => {
  it('accepts the shipped active task catalog', async () => {
    await expect(validateTaskTemplateIntegrity(knowledge)).resolves.toBeUndefined();
  });

  it('rejects a missing active task template', async () => {
    const taskIds = [...knowledge.tasks.keys()].filter((taskId) => taskId !== 'feature');
    const root = await createTemplateRoot(taskIds);
    await expect(validateTaskTemplateIntegrity(knowledge, root)).rejects.toThrow(/Missing template.*feature/);
  });

  it('rejects an orphan task template', async () => {
    const root = await createTemplateRoot([...knowledge.tasks.keys(), 'orphan']);
    await expect(validateTaskTemplateIntegrity(knowledge, root)).rejects.toThrow(/Orphan task template.*orphan/);
  });

  it('allows a legacy task to omit a template', async () => {
    const legacy = taskEntry('legacy-task', 'legacy');
    const extended = knowledgeWithTasks([...knowledge.tasks.values(), legacy]);
    const root = await createTemplateRoot(knowledge.tasks.keys());
    await expect(validateTaskTemplateIntegrity(extended, root)).resolves.toBeUndefined();
  });
});
