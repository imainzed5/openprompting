import type { KnowledgeMetadata } from './types.js';

export const displayName = (metadata: Pick<KnowledgeMetadata, 'id' | 'display_name'>): string =>
  metadata.display_name ?? metadata.id;

export const displayLabel = (metadata: Pick<KnowledgeMetadata, 'id' | 'display_name'>): string => {
  const name = displayName(metadata);
  return name === metadata.id ? name : `${name} (${metadata.id})`;
};

export const displayReference = (metadata: Pick<KnowledgeMetadata, 'id' | 'display_name'>): string => {
  const name = displayName(metadata);
  return name === metadata.id ? name : `${name} (ID: ${metadata.id})`;
};
