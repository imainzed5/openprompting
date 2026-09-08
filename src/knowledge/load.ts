import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { Ajv2020, type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js';
import type { FormatsPlugin } from 'ajv-formats';
import matter from 'gray-matter';
import { parse } from 'yaml';
import type {
  HarnessMetadata,
  KnowledgeEntry,
  KnowledgeIndex,
  KnowledgeMetadata,
  KnowledgeType,
  ModelMetadata,
  TaskMetadata,
} from './types.js';
import { packageRoot } from '../utils/package-root.js';

const DIRECTORIES: Record<KnowledgeType, string> = {
  model: 'models',
  harness: 'harnesses',
  task: 'tasks',
};

const require = createRequire(import.meta.url);
const addFormats = require('ajv-formats') as FormatsPlugin;

export class KnowledgeError extends Error {
  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'KnowledgeError';
  }
}

const formatAjvErrors = (errors: ErrorObject[] | null | undefined): string =>
  (errors ?? []).map((error) => `${error.instancePath || '/'} ${error.message ?? 'is invalid'}`).join('; ');

const schemaValidators = async (schemasRoot: string): Promise<Record<KnowledgeType, ValidateFunction>> => {
  const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
  addFormats(ajv);
  const validators = {} as Record<KnowledgeType, ValidateFunction>;
  for (const type of Object.keys(DIRECTORIES) as KnowledgeType[]) {
    const schemaPath = join(schemasRoot, `${type}.schema.json`);
    const schema = JSON.parse(await readFile(schemaPath, 'utf8')) as object;
    validators[type] = ajv.compile(schema);
  }
  return validators;
};

const markdownFiles = async (directory: string): Promise<string[]> => {
  try {
    return (await readdir(directory, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => join(directory, entry.name))
      .sort();
  } catch (error) {
    throw new KnowledgeError(`Cannot read knowledge directory: ${directory}`, { cause: error });
  }
};

const parseEntry = async (
  filePath: string,
  expectedType: KnowledgeType,
  validate: ValidateFunction,
): Promise<KnowledgeEntry> => {
  let parsed: matter.GrayMatterFile<string>;
  try {
    const raw = await readFile(filePath, 'utf8');
    if (!raw.startsWith('---')) throw new Error('missing opening frontmatter delimiter');
    parsed = matter(raw, { engines: { yaml: (source) => parse(source) as object }, language: 'yaml' });
  } catch (error) {
    throw new KnowledgeError(`Malformed frontmatter in ${filePath}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  }

  if (!validate(parsed.data)) {
    throw new KnowledgeError(`Invalid ${expectedType} metadata in ${filePath}: ${formatAjvErrors(validate.errors)}`);
  }
  const metadata = parsed.data as KnowledgeMetadata;
  if (metadata.type !== expectedType) {
    throw new KnowledgeError(`Invalid knowledge type in ${filePath}: expected ${expectedType}, received ${metadata.type}`);
  }
  const sourceIds = new Set(metadata.sources.map((source) => source.id));
  for (const evidence of metadata.evidence) {
    if (evidence.source && !sourceIds.has(evidence.source)) {
      throw new KnowledgeError(`Unknown source reference '${evidence.source}' in ${filePath}`);
    }
  }
  return { metadata, body: parsed.content.trim(), path: filePath };
};

export interface LoadKnowledgeOptions {
  knowledgeRoot?: string;
  schemasRoot?: string;
}

export const loadKnowledge = async (options: LoadKnowledgeOptions = {}): Promise<KnowledgeIndex> => {
  const knowledgeRoot = resolve(options.knowledgeRoot ?? join(packageRoot, 'knowledge'));
  const schemasRoot = resolve(options.schemasRoot ?? join(packageRoot, 'schemas'));
  const validators = await schemaValidators(schemasRoot);
  const all = new Map<string, KnowledgeEntry>();
  const models = new Map<string, KnowledgeEntry<ModelMetadata>>();
  const harnesses = new Map<string, KnowledgeEntry<HarnessMetadata>>();
  const tasks = new Map<string, KnowledgeEntry<TaskMetadata>>();

  for (const type of Object.keys(DIRECTORIES) as KnowledgeType[]) {
    for (const filePath of await markdownFiles(join(knowledgeRoot, DIRECTORIES[type]))) {
      const entry = await parseEntry(filePath, type, validators[type]);
      const previous = all.get(entry.metadata.id);
      if (previous) {
        throw new KnowledgeError(`Duplicate knowledge ID '${entry.metadata.id}' in ${previous.path} and ${entry.path}`);
      }
      all.set(entry.metadata.id, entry);
      if (entry.metadata.type === 'model') models.set(entry.metadata.id, entry as KnowledgeEntry<ModelMetadata>);
      if (entry.metadata.type === 'harness') harnesses.set(entry.metadata.id, entry as KnowledgeEntry<HarnessMetadata>);
      if (entry.metadata.type === 'task') tasks.set(entry.metadata.id, entry as KnowledgeEntry<TaskMetadata>);
    }
  }

  return { all, models, harnesses, tasks };
};
