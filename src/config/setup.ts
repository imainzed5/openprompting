import type { KnowledgeIndex } from '../knowledge/types.js';
import { ConfigError, SetupCancelledError } from './errors.js';
import { configPathFor } from './path.js';
import type { SetupPrompter } from './prompter.js';
import { readConfig } from './read.js';
import type { OpenPromptingConfig } from './types.js';
import { validateConfig } from './validate.js';
import { serializeConfig, writeConfig } from './write.js';

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const required = <T>(value: T | undefined): T => {
  if (value === undefined) throw new SetupCancelledError();
  return value;
};

const askId = async (prompter: SetupPrompter, message: string, initial: string): Promise<string> => {
  const value = required(await prompter.input(message, initial));
  if (!ID_PATTERN.test(value)) throw new ConfigError(`'${value}' is not a valid ID. Use lowercase letters, numbers, and single hyphens.`);
  return value;
};

export interface SetupResult {
  config: OpenPromptingConfig;
  path: string;
}

export const setupProject = async (
  projectRoot: string,
  knowledge: KnowledgeIndex,
  prompter: SetupPrompter,
): Promise<SetupResult> => {
  const existing = await readConfig(projectRoot, knowledge, { required: false });
  const config: OpenPromptingConfig = existing
    ? structuredClone(existing)
    : { version: 1, setups: {} };

  let addAnother = true;
  while (addAnother) {
    const model = required(await prompter.select('Select a model', [...knowledge.models.keys()].sort().map((value) => ({ value }))));
    const harness = required(await prompter.select('Select a harness', [...knowledge.harnesses.keys()].sort().map((value) => ({ value }))));
    const setupId = await askId(prompter, 'Setup ID', `${model}-${harness}`);
    if (config.setups[setupId] && !required(await prompter.confirm(`Replace existing setup '${setupId}'?`, false))) {
      throw new SetupCancelledError();
    }
    config.setups[setupId] = { model, harness };

    if (required(await prompter.confirm('Create or update a named profile for this setup?', true))) {
      const profileId = await askId(prompter, 'Profile ID', setupId);
      if (config.profiles?.[profileId] && !required(await prompter.confirm(`Replace existing profile '${profileId}'?`, false))) {
        throw new SetupCancelledError();
      }
      const role = required(await prompter.input('Profile role (optional)', config.profiles?.[profileId]?.role ?? ''));
      config.profiles ??= {};
      config.profiles[profileId] = role ? { uses: setupId, role } : { uses: setupId };
    }
    addAnother = required(await prompter.confirm('Add another setup?', false));
  }

  const profileIds = Object.keys(config.profiles ?? {}).sort();
  if (profileIds.length > 0) {
    const defaultProfile = required(await prompter.select(
      'Choose the default profile',
      profileIds.map((value) => ({ value })),
    ));
    config.defaults ??= {};
    config.defaults.profile = defaultProfile;

    if (required(await prompter.confirm('Configure task-specific profile routing?', false))) {
      const routes: Record<string, string> = { ...(config.defaults.tasks ?? {}) };
      for (const taskId of [...knowledge.tasks.keys()].sort()) {
        const profile = required(await prompter.select(
          `Profile for '${taskId}'`,
          [{ value: '', label: 'Use default profile' }, ...profileIds.map((value) => ({ value }))],
        ));
        if (profile) routes[taskId] = profile;
        else delete routes[taskId];
      }
      config.defaults.tasks = routes;
    }
  }

  await validateConfig(config, knowledge);
  const preview = serializeConfig(config);
  prompter.show(`\nConfig preview for ${configPathFor(projectRoot)}:\n\n${preview}`);
  if (!required(await prompter.confirm('Write this configuration?', false))) throw new SetupCancelledError();
  const path = await writeConfig(projectRoot, config);
  return { config, path };
};
