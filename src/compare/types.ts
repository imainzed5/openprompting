import type { KnowledgeEntry, KnowledgeMetadata } from '../knowledge/types.js';

export type ComparableKind = 'profile' | 'setup' | 'model' | 'harness';

export interface ComparableEntity {
  id: string;
  kind: ComparableKind;
  userFields: Record<string, string>;
  knowledgeFields: Record<string, string>;
  knowledgeEntries: KnowledgeEntry<KnowledgeMetadata>[];
}

export interface Comparison {
  left: ComparableEntity;
  right: ComparableEntity;
}
