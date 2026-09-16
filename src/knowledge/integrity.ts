import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { KnowledgeIndex } from './types.js';
import { packageRoot } from '../utils/package-root.js';

export class CatalogIntegrityError extends Error {
  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'CatalogIntegrityError';
  }
}

const templateIds = async (templatesRoot: string): Promise<Set<string>> => {
  let entries;
  try {
    entries = await readdir(templatesRoot, { withFileTypes: true });
  } catch (error) {
    throw new CatalogIntegrityError(`Cannot read task template directory: ${templatesRoot}`, { cause: error });
  }

  return new Set(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => entry.name.slice(0, -'.md'.length)),
  );
};

export const validateTaskTemplateIntegrity = async (
  knowledge: KnowledgeIndex,
  templatesRoot = join(packageRoot, 'templates'),
): Promise<void> => {
  const templates = await templateIds(templatesRoot);
  const missing = [...knowledge.tasks.values()]
    .filter((entry) => entry.metadata.status === 'active' && !templates.has(entry.metadata.id))
    .map((entry) => entry.metadata.id)
    .sort();
  const orphan = [...templates]
    .filter((id) => !knowledge.tasks.has(id))
    .sort();

  const problems = [
    missing.length > 0 ? `Missing template(s) for active task(s): ${missing.join(', ')}` : undefined,
    orphan.length > 0 ? `Orphan task template(s): ${orphan.join(', ')}` : undefined,
  ].filter((problem): problem is string => Boolean(problem));

  if (problems.length > 0) {
    throw new CatalogIntegrityError(`Task/template catalog integrity failed. ${problems.join('. ')}.`);
  }
};
