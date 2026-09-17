import { readFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import matter from 'gray-matter';
import { cache } from 'react';
import type {
  Catalog,
  CatalogEntry,
  Evidence,
  EvidenceClass,
  Freshness,
  HarnessEntry,
  KnowledgeKind,
  ModelEntry,
  Source,
  TaskEntry,
} from './content-types';
import { slugFor } from './presentation';
export { formatDate, providerLabel, slugFor } from './presentation';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://openprompting.dev';
export const REPO_URL = 'https://github.com/imainzed5/openprompting';
export const NPM_INSTALL = 'npm install --global openprompting';

/** Build from the repository checkout by default; CI can point elsewhere. */
export const REPO_ROOT = resolve(process.env.OPENPROMPTING_REPO ?? join(process.cwd(), '..'));

export const EVIDENCE_ORDER: EvidenceClass[] = ['official', 'tested', 'community', 'legacy'];

export const EVIDENCE_DESCRIPTIONS: Record<string, string> = {
  official: 'Supported directly by first-party provider or harness documentation.',
  tested: 'Reproduced by maintainers with a procedure recorded in the entry.',
  community: 'Useful practice without first-party confirmation.',
  legacy: 'Historical or migration advice, not treated as the current default.',
};

export const CLI_COMMANDS = [
  { cmd: 'help', desc: 'Show the command list and common examples. No config required.', example: 'openprompting help' },
  { cmd: 'setup', desc: 'Create or update .openprompting/config.yml; --check validates without writing.', example: 'openprompting setup' },
  { cmd: 'guide', desc: 'Display resolved model and harness guidance: recommendations, cautions, evidence, sources.', example: 'openprompting guide --profile reviewer' },
  { cmd: 'new', desc: 'Render a deterministic prompt skeleton for a task. No model call, no invented facts.', example: 'openprompting new planning' },
  { cmd: 'doctor', desc: 'Run read-only local diagnostics. Never executes project scripts.', example: 'openprompting doctor' },
  { cmd: 'compare', desc: 'Compare two profiles, setups, models, or harnesses from documented evidence. No winner inferred.', example: 'openprompting compare builder reviewer' },
];

export const TERMINOLOGY = [
  ['Agentic coding', 'Using a coding agent — a model paired with tools, repository access, and an instruction file — to perform work inside a codebase.'],
  ['Model', 'The AI performing reasoning and generation.'],
  ['Harness', 'The coding tool around that model: repository access, instruction files, tools, permissions, and context management.'],
  ['Setup', 'One model paired with one harness.'],
  ['Profile', 'A user-defined role or name pointing to a setup, such as builder or reviewer.'],
  ['Task', 'The type of work being performed — feature, bug, review, refactor, and so on.'],
  ['Prompting', 'Supplying goals, context, constraints, and acceptance criteria so an agent can act reliably.'],
] as const;

export const PROMPTING_MATERIAL = [
  ['Goals', 'what outcome is wanted.'],
  ['Context', 'files, symbols, and prior decisions that matter.'],
  ['Requirements', 'what must be true when the work is done.'],
  ['Constraints', 'what must not change.'],
  ['Acceptance criteria', 'how the outcome will be verified.'],
  ['Validation', 'the command or test that confirms success.'],
] as const;

export function freshness(lastVerified: string, now = new Date()): Freshness {
  const verified = new Date(`${lastVerified}T00:00:00Z`);
  const ageDays = Math.max(0, Math.floor((now.getTime() - verified.getTime()) / 86_400_000));
  return {
    ageDays,
    status: ageDays <= 60 ? 'current' : ageDays <= 120 ? 'review suggested' : 'stale',
  };
}

function requiredString(value: unknown, field: string, filePath: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid metadata in ${filePath}: '${field}' must be a non-empty string`);
  }
  return value.trim();
}

function dateString(value: unknown, field: string, filePath: string): string {
  const raw = value instanceof Date ? value.toISOString().slice(0, 10) : requiredString(value, field, filePath);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || Number.isNaN(new Date(`${raw}T00:00:00Z`).getTime())) {
    throw new Error(`Invalid metadata in ${filePath}: '${field}' must be YYYY-MM-DD`);
  }
  return raw;
}

function evidenceList(value: unknown, filePath: string): Evidence[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Invalid metadata in ${filePath}: 'evidence' must be a non-empty list`);
  }
  return value.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`Invalid evidence ${index + 1} in ${filePath}`);
    const record = item as Record<string, unknown>;
    const result: Evidence = {
      class: requiredString(record.class, `evidence[${index}].class`, filePath),
      claim: requiredString(record.claim, `evidence[${index}].claim`, filePath),
    };
    if (record.source !== undefined) result.source = requiredString(record.source, `evidence[${index}].source`, filePath);
    if (record.reproduction !== undefined) result.reproduction = requiredString(record.reproduction, `evidence[${index}].reproduction`, filePath);
    return result;
  });
}

function sourceList(value: unknown, filePath: string): Source[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Invalid metadata in ${filePath}: 'sources' must be a non-empty list`);
  }
  return value.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`Invalid source ${index + 1} in ${filePath}`);
    const record = item as Record<string, unknown>;
    return {
      id: requiredString(record.id, `sources[${index}].id`, filePath),
      title: requiredString(record.title, `sources[${index}].title`, filePath),
      url: requiredString(record.url, `sources[${index}].url`, filePath),
      lastChecked: dateString(record.last_checked, `sources[${index}].last_checked`, filePath),
    };
  });
}

function stringList(value: unknown, field: string, filePath: string): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' || item.trim() === '')) {
    throw new Error(`Invalid metadata in ${filePath}: '${field}' must be a list of strings`);
  }
  return value.map((item) => item.trim());
}

async function readEntries(kind: KnowledgeKind, now: Date): Promise<CatalogEntry[]> {
  const directory = join(REPO_ROOT, 'knowledge', kind);
  let names: string[];
  try {
    names = (await readdir(directory, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    throw new Error(`Cannot read knowledge directory ${directory}`, { cause: error });
  }

  return Promise.all(names.map(async (name) => {
    const filePath = join(directory, name);
    const parsed = matter(await readFile(filePath, 'utf8'));
    const data = parsed.data as Record<string, unknown>;
    const expectedType = kind === 'models' ? 'model' : kind === 'harnesses' ? 'harness' : 'task';
    const id = requiredString(data.id, 'id', filePath);
    if (data.type !== expectedType) throw new Error(`Invalid knowledge type in ${filePath}: expected '${expectedType}'`);
    const base = {
      id,
      displayName: typeof data.display_name === 'string' && data.display_name.trim() ? data.display_name.trim() : id,
      status: requiredString(data.status, 'status', filePath),
      lastVerified: dateString(data.last_verified, 'last_verified', filePath),
      evidence: evidenceList(data.evidence, filePath),
      sources: sourceList(data.sources, filePath),
      instructionFiles: stringList(data.instruction_files, 'instruction_files', filePath),
      body: parsed.content.trim(),
      entryPath: `knowledge/${kind}/${name}`,
      freshness: freshness(dateString(data.last_verified, 'last_verified', filePath), now),
    };

    if (kind === 'tasks') {
      return { ...base, type: 'task', provider: null } as TaskEntry;
    }
    return { ...base, type: expectedType, provider: requiredString(data.provider, 'provider', filePath) } as ModelEntry | HarnessEntry;
  }));
}

async function readTemplates(): Promise<Map<string, string>> {
  const directory = join(REPO_ROOT, 'templates');
  const names = (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
  const templates = new Map<string, string>();
  for (const name of names) templates.set(name.replace(/\.md$/, ''), await readFile(join(directory, name), 'utf8'));
  return templates;
}

export const getCatalog = cache(async (): Promise<Catalog> => {
  const now = new Date();
  const [models, harnesses, tasks, templates] = await Promise.all([
    readEntries('models', now),
    readEntries('harnesses', now),
    readEntries('tasks', now),
    readTemplates(),
  ]);
  const all = [...models, ...harnesses, ...tasks];
  const ids = new Set<string>();
  for (const entry of all) {
    if (ids.has(entry.id)) throw new Error(`Duplicate knowledge ID '${entry.id}'`);
    ids.add(entry.id);
  }
  const taskEntries = tasks.map((entry) => {
    const templateRaw = templates.get(entry.id);
    if (!templateRaw) throw new Error(`Task '${entry.id}' has no matching templates/${entry.id}.md`);
    return { ...entry, templateRaw } as TaskEntry;
  });
  let version = '1.1.x';
  try {
    const packageJson = JSON.parse(await readFile(join(REPO_ROOT, 'package.json'), 'utf8')) as { version?: unknown };
    if (packageJson.version) version = String(packageJson.version);
  } catch {
    // The catalog remains usable for source-only checkouts without package.json.
  }
  return {
    models: models as ModelEntry[],
    harnesses: harnesses as HarnessEntry[],
    tasks: taskEntries,
    version,
    builtAt: now.toISOString(),
  };
});

export async function getEntry(kind: KnowledgeKind, slug: string): Promise<CatalogEntry | undefined> {
  const catalog = await getCatalog();
  return catalog[kind].find((entry) => slugFor(entry) === slug || entry.id === slug);
}

export function entriesFor(catalog: Catalog, kind: KnowledgeKind): CatalogEntry[] {
  return catalog[kind];
}
