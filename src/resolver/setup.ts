import type { OpenPromptingConfig } from '../config/types.js';
import type {
  HarnessMetadata,
  KnowledgeEntry,
  KnowledgeIndex,
  ModelMetadata,
  TaskMetadata,
} from '../knowledge/types.js';
import { ResolutionError } from './errors.js';

const choices = (values: Iterable<string>): string => [...values].sort().join(', ') || '(none)';

export interface ResolvedSelection {
  setupId?: string;
  profileId?: string;
  role?: string;
  model?: KnowledgeEntry<ModelMetadata>;
  harness?: KnowledgeEntry<HarnessMetadata>;
}

export interface GuideSelectors {
  profile?: string;
  model?: string;
  harness?: string;
  knowledgeId?: string;
}

export const resolveSetup = (
  config: OpenPromptingConfig,
  knowledge: KnowledgeIndex,
  setupId: string,
  profileId?: string,
): ResolvedSelection => {
  const setup = config.setups[setupId];
  if (!setup) throw new ResolutionError(`Unknown setup '${setupId}'. Valid setups: ${choices(Object.keys(config.setups))}`);
  const model = knowledge.models.get(setup.model);
  const harness = knowledge.harnesses.get(setup.harness);
  if (!model || !harness) throw new ResolutionError(`Setup '${setupId}' references unavailable knowledge. Run 'openprompting setup --check'.`);
  return { setupId, ...(profileId ? { profileId } : {}), model, harness };
};

const profileSelection = (
  config: OpenPromptingConfig | undefined,
  knowledge: KnowledgeIndex,
  profileId: string,
): ResolvedSelection => {
  if (!config) throw new ResolutionError(`Profile '${profileId}' requires a project config. Run 'openprompting setup' first.`);
  const profile = config.profiles?.[profileId];
  if (!profile) throw new ResolutionError(`Unknown profile '${profileId}'. Valid profiles: ${choices(Object.keys(config.profiles ?? {}))}`);
  const resolved = resolveSetup(config, knowledge, profile.uses, profileId);
  return { ...resolved, ...(profile.role ? { role: profile.role } : {}) };
};

const directEntry = (knowledge: KnowledgeIndex, id: string): ResolvedSelection => {
  const model = knowledge.models.get(id);
  if (model) return { model };
  const harness = knowledge.harnesses.get(id);
  if (harness) return { harness };
  if (knowledge.tasks.has(id)) throw new ResolutionError(`'${id}' is a task. Use 'openprompting new ${id}' to render its prompt.`);
  throw new ResolutionError(`Unknown knowledge ID '${id}'. Valid models: ${choices(knowledge.models.keys())}. Valid harnesses: ${choices(knowledge.harnesses.keys())}.`);
};

export const resolveGuide = (
  config: OpenPromptingConfig | undefined,
  knowledge: KnowledgeIndex,
  selectors: GuideSelectors,
): ResolvedSelection => {
  const supplied = [selectors.profile, selectors.model, selectors.harness, selectors.knowledgeId].filter(Boolean).length;
  if (selectors.knowledgeId && supplied > 1) throw new ResolutionError('A knowledge ID cannot be combined with --profile, --model, or --harness.');
  if (selectors.profile && (selectors.model || selectors.harness)) throw new ResolutionError('--profile cannot be combined with --model or --harness.');
  if (selectors.knowledgeId) return directEntry(knowledge, selectors.knowledgeId);
  if (selectors.profile) return profileSelection(config, knowledge, selectors.profile);

  let model: KnowledgeEntry<ModelMetadata> | undefined;
  let harness: KnowledgeEntry<HarnessMetadata> | undefined;
  if (selectors.model) {
    model = knowledge.models.get(selectors.model);
    if (!model) throw new ResolutionError(`Unknown model '${selectors.model}'. Valid models: ${choices(knowledge.models.keys())}`);
  }
  if (selectors.harness) {
    harness = knowledge.harnesses.get(selectors.harness);
    if (!harness) throw new ResolutionError(`Unknown harness '${selectors.harness}'. Valid harnesses: ${choices(knowledge.harnesses.keys())}`);
  }
  if (model || harness) return { ...(model ? { model } : {}), ...(harness ? { harness } : {}) };

  if (!config) throw new ResolutionError("No config or explicit selector was provided. Run 'openprompting setup' or pass --model/--harness.");
  if (config.defaults?.profile) return profileSelection(config, knowledge, config.defaults.profile);
  const setupIds = Object.keys(config.setups);
  if (setupIds.length === 1 && setupIds[0]) return resolveSetup(config, knowledge, setupIds[0]);
  throw new ResolutionError(`Guidance is ambiguous. Choose --profile (${choices(Object.keys(config.profiles ?? {}))}), --model (${choices(knowledge.models.keys())}), or --harness (${choices(knowledge.harnesses.keys())}).`);
};

export interface ResolvedTask extends ResolvedSelection {
  task: KnowledgeEntry<TaskMetadata>;
}

export const resolveTask = (
  config: OpenPromptingConfig | undefined,
  knowledge: KnowledgeIndex,
  taskId: string,
  explicitProfile?: string,
): ResolvedTask => {
  const task = knowledge.tasks.get(taskId);
  if (!task) throw new ResolutionError(`Unknown task '${taskId}'. Valid tasks: ${choices(knowledge.tasks.keys())}`);
  if (!config) throw new ResolutionError(`Task '${taskId}' needs a configured setup. Run 'openprompting setup' first.`);

  let selection: ResolvedSelection;
  if (explicitProfile) selection = profileSelection(config, knowledge, explicitProfile);
  else if (config.defaults?.tasks?.[taskId]) selection = profileSelection(config, knowledge, config.defaults.tasks[taskId]);
  else if (config.defaults?.profile) selection = profileSelection(config, knowledge, config.defaults.profile);
  else {
    const setupIds = Object.keys(config.setups);
    if (setupIds.length !== 1 || !setupIds[0]) {
      throw new ResolutionError(`Task setup is ambiguous. Choose --profile from: ${choices(Object.keys(config.profiles ?? {}))}.`);
    }
    selection = resolveSetup(config, knowledge, setupIds[0]);
  }
  return { ...selection, task };
};
