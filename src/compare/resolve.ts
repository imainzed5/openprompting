import type { OpenPromptingConfig } from '../config/types.js';
import type { KnowledgeEntry, KnowledgeIndex, KnowledgeMetadata } from '../knowledge/types.js';
import { ResolutionError } from '../resolver/errors.js';
import { resolveGuide, resolveSetup } from '../resolver/setup.js';
import type { ComparableEntity, Comparison } from './types.js';

const list = (values: Iterable<string>): string => [...values].sort().join(', ') || '(none)';
const evidenceClasses = (entry: KnowledgeEntry<KnowledgeMetadata>): string =>
  [...new Set(entry.metadata.evidence.map((evidence) => evidence.class))].sort().join(', ');

const attachedEntries = (model?: KnowledgeEntry, harness?: KnowledgeEntry): KnowledgeEntry<KnowledgeMetadata>[] => {
  const entries: KnowledgeEntry<KnowledgeMetadata>[] = [];
  if (model) entries.push(model);
  if (harness) entries.push(harness);
  return entries;
};

const resolvedKnowledgeFields = (model?: KnowledgeEntry, harness?: KnowledgeEntry): Record<string, string> => ({
  ...(model ? {
    Model: model.metadata.id,
    'Model provider': 'provider' in model.metadata ? model.metadata.provider : 'unavailable',
    'Model last verified': model.metadata.last_verified,
    'Model evidence': evidenceClasses(model),
  } : {}),
  ...(harness ? {
    Harness: harness.metadata.id,
    'Harness provider': 'provider' in harness.metadata ? harness.metadata.provider : 'unavailable',
    'Harness last verified': harness.metadata.last_verified,
    'Harness evidence': evidenceClasses(harness),
    'Instruction files': 'instruction_files' in harness.metadata
      ? harness.metadata.instruction_files?.join(', ') || 'none documented'
      : 'none documented',
  } : {}),
});

export const resolveComparable = (
  id: string,
  config: OpenPromptingConfig | undefined,
  knowledge: KnowledgeIndex,
): ComparableEntity => {
  const profile = config?.profiles?.[id];
  if (profile && config) {
    const selected = resolveGuide(config, knowledge, { profile: id });
    const taskRoutes = Object.entries(config.defaults?.tasks ?? {})
      .filter(([, profileId]) => profileId === id)
      .map(([taskId]) => taskId)
      .sort();
    return {
      id,
      kind: 'profile',
      userFields: {
        Role: profile.role ?? 'not assigned',
        Setup: profile.uses,
        'Default profile': config.defaults?.profile === id ? 'yes' : 'no',
        'Task routes': taskRoutes.join(', ') || 'none',
      },
      knowledgeFields: resolvedKnowledgeFields(selected.model, selected.harness),
      knowledgeEntries: attachedEntries(selected.model, selected.harness),
    };
  }

  const setup = config?.setups[id];
  if (setup && config) {
    const selected = resolveSetup(config, knowledge, id);
    return {
      id,
      kind: 'setup',
      userFields: { Setup: id },
      knowledgeFields: resolvedKnowledgeFields(selected.model, selected.harness),
      knowledgeEntries: attachedEntries(selected.model, selected.harness),
    };
  }

  const model = knowledge.models.get(id);
  if (model) {
    return {
      id,
      kind: 'model',
      userFields: {},
      knowledgeFields: {
        Model: id,
        Provider: model.metadata.provider,
        'Last verified': model.metadata.last_verified,
        'Evidence classes': evidenceClasses(model),
      },
      knowledgeEntries: [model],
    };
  }

  const harness = knowledge.harnesses.get(id);
  if (harness) {
    return {
      id,
      kind: 'harness',
      userFields: {},
      knowledgeFields: {
        Harness: id,
        Provider: harness.metadata.provider,
        'Last verified': harness.metadata.last_verified,
        'Evidence classes': evidenceClasses(harness),
        'Instruction files': harness.metadata.instruction_files?.join(', ') || 'none documented',
      },
      knowledgeEntries: [harness],
    };
  }

  throw new ResolutionError(`Unknown comparison target '${id}'. Profiles: ${list(Object.keys(config?.profiles ?? {}))}. Setups: ${list(Object.keys(config?.setups ?? {}))}. Models: ${list(knowledge.models.keys())}. Harnesses: ${list(knowledge.harnesses.keys())}.`);
};

export const compareEntities = (
  leftId: string,
  rightId: string,
  config: OpenPromptingConfig | undefined,
  knowledge: KnowledgeIndex,
): Comparison => ({
  left: resolveComparable(leftId, config, knowledge),
  right: resolveComparable(rightId, config, knowledge),
});
