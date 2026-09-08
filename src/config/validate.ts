import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { Ajv2020, type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js';
import type { FormatsPlugin } from 'ajv-formats';
import type { KnowledgeIndex } from '../knowledge/types.js';
import { packageRoot } from '../utils/package-root.js';
import { ConfigError } from './errors.js';
import type { OpenPromptingConfig } from './types.js';

const require = createRequire(import.meta.url);
const addFormats = require('ajv-formats') as FormatsPlugin;
const validators = new Map<string, Promise<ValidateFunction>>();

const formatErrors = (errors: ErrorObject[] | null | undefined): string =>
  (errors ?? []).map((error) => `${error.instancePath || '/'} ${error.message ?? 'is invalid'}`).join('; ');

const getValidator = (schemasRoot: string): Promise<ValidateFunction> => {
  const existing = validators.get(schemasRoot);
  if (existing) return existing;
  const created = (async () => {
    const ajv = new Ajv2020({ allErrors: true, strict: true });
    addFormats(ajv);
    const schema = JSON.parse(await readFile(join(schemasRoot, 'config.schema.json'), 'utf8')) as object;
    return ajv.compile(schema);
  })();
  validators.set(schemasRoot, created);
  return created;
};

const list = (values: Iterable<string>): string => [...values].sort().join(', ') || '(none)';

export const validateConfig = async (
  value: unknown,
  knowledge: KnowledgeIndex,
  schemasRoot = join(packageRoot, 'schemas'),
): Promise<OpenPromptingConfig> => {
  if (typeof value === 'object' && value !== null && 'version' in value && value.version !== 1) {
    throw new ConfigError(`This config uses version ${String(value.version)}, but this openPrompting build supports version 1.`);
  }

  const validate = await getValidator(schemasRoot);
  if (!validate(value)) throw new ConfigError(`Invalid openPrompting config: ${formatErrors(validate.errors)}`);
  const config = value as OpenPromptingConfig;

  for (const [setupId, setup] of Object.entries(config.setups)) {
    if (!knowledge.models.has(setup.model)) {
      throw new ConfigError(`Setup '${setupId}' references unknown model '${setup.model}'. Valid models: ${list(knowledge.models.keys())}`);
    }
    if (!knowledge.harnesses.has(setup.harness)) {
      throw new ConfigError(`Setup '${setupId}' references unknown harness '${setup.harness}'. Valid harnesses: ${list(knowledge.harnesses.keys())}`);
    }
  }

  const profiles = config.profiles ?? {};
  for (const [profileId, profile] of Object.entries(profiles)) {
    if (!config.setups[profile.uses]) {
      throw new ConfigError(`Profile '${profileId}' references missing setup '${profile.uses}'. Valid setups: ${list(Object.keys(config.setups))}`);
    }
  }
  if (config.defaults?.profile && !profiles[config.defaults.profile]) {
    throw new ConfigError(`Default profile '${config.defaults.profile}' does not exist. Valid profiles: ${list(Object.keys(profiles))}`);
  }
  for (const [taskId, profileId] of Object.entries(config.defaults?.tasks ?? {})) {
    if (!knowledge.tasks.has(taskId)) {
      throw new ConfigError(`Task route '${taskId}' is unknown. Valid tasks: ${list(knowledge.tasks.keys())}`);
    }
    if (!profiles[profileId]) {
      throw new ConfigError(`Task '${taskId}' references missing profile '${profileId}'. Valid profiles: ${list(Object.keys(profiles))}`);
    }
  }
  return config;
};
