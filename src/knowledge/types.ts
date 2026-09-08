export const KNOWLEDGE_TYPES = ['model', 'harness', 'task'] as const;
export type KnowledgeType = (typeof KNOWLEDGE_TYPES)[number];

export const EVIDENCE_CLASSES = ['official', 'tested', 'community', 'legacy'] as const;
export type EvidenceClass = (typeof EVIDENCE_CLASSES)[number];

export interface Source {
  id: string;
  title: string;
  url: string;
  last_checked: string;
}

export interface Evidence {
  class: EvidenceClass;
  claim: string;
  source?: string;
  reproduction?: string;
}

interface BaseMetadata {
  id: string;
  type: KnowledgeType;
  status: 'active' | 'legacy';
  last_verified: string;
  evidence: Evidence[];
  sources: Source[];
}

export interface ModelMetadata extends BaseMetadata {
  type: 'model';
  provider: string;
}

export interface HarnessMetadata extends BaseMetadata {
  type: 'harness';
  provider: string;
  instruction_files?: string[];
}

export interface TaskMetadata extends BaseMetadata {
  type: 'task';
}

export type KnowledgeMetadata = ModelMetadata | HarnessMetadata | TaskMetadata;

export interface KnowledgeEntry<T extends KnowledgeMetadata = KnowledgeMetadata> {
  metadata: T;
  body: string;
  path: string;
}

export interface KnowledgeIndex {
  all: ReadonlyMap<string, KnowledgeEntry>;
  models: ReadonlyMap<string, KnowledgeEntry<ModelMetadata>>;
  harnesses: ReadonlyMap<string, KnowledgeEntry<HarnessMetadata>>;
  tasks: ReadonlyMap<string, KnowledgeEntry<TaskMetadata>>;
}
