export type KnowledgeKind = 'models' | 'harnesses' | 'tasks';

export type EvidenceClass = 'official' | 'tested' | 'community' | 'legacy' | string;

export interface Evidence {
  class: EvidenceClass;
  claim: string;
  source?: string;
  reproduction?: string;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  lastChecked: string;
}

export interface Freshness {
  ageDays: number;
  status: 'current' | 'review suggested' | 'stale';
}

export interface BaseEntry {
  id: string;
  displayName: string;
  status: string;
  lastVerified: string;
  evidence: Evidence[];
  sources: Source[];
  instructionFiles: string[];
  body: string;
  entryPath: string;
  freshness: Freshness;
}

export interface ModelEntry extends BaseEntry {
  type: 'model';
  provider: string;
}

export interface HarnessEntry extends BaseEntry {
  type: 'harness';
  provider: string;
}

export interface TaskEntry extends BaseEntry {
  type: 'task';
  provider: null;
  templateRaw: string;
}

export type CatalogEntry = ModelEntry | HarnessEntry | TaskEntry;

export interface Catalog {
  models: ModelEntry[];
  harnesses: HarnessEntry[];
  tasks: TaskEntry[];
  version: string;
  builtAt: string;
}

export interface TemplateField {
  heading: string;
  hint: string;
}
