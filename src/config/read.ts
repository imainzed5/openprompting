import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import type { KnowledgeIndex } from '../knowledge/types.js';
import { ConfigError } from './errors.js';
import { configPathFor } from './path.js';
import type { OpenPromptingConfig } from './types.js';
import { validateConfig } from './validate.js';

export interface ReadConfigOptions {
  required?: boolean;
}

export const readConfig = async (
  projectRoot: string,
  knowledge: KnowledgeIndex,
  options: ReadConfigOptions = {},
): Promise<OpenPromptingConfig | undefined> => {
  const path = configPathFor(projectRoot);
  let raw: string;
  try {
    raw = await readFile(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      if (options.required === false) return undefined;
      throw new ConfigError(`No openPrompting config found at ${path}. Run 'openprompting setup' first.`);
    }
    throw new ConfigError(`Cannot read openPrompting config at ${path}.`, { cause: error });
  }

  let value: unknown;
  try {
    value = parse(raw);
  } catch (error) {
    throw new ConfigError(`Invalid YAML in ${path}: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  }
  return validateConfig(value, knowledge);
};
