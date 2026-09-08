import { lstat, mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { stringify } from 'yaml';
import { ConfigError } from './errors.js';
import { configPathFor } from './path.js';
import type { OpenPromptingConfig } from './types.js';

const rejectSymlink = async (path: string): Promise<void> => {
  try {
    if ((await lstat(path)).isSymbolicLink()) throw new ConfigError(`Refusing to write through symbolic link: ${path}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
};

export const serializeConfig = (config: OpenPromptingConfig): string => stringify(config, { lineWidth: 0 });

export const writeConfig = async (projectRoot: string, config: OpenPromptingConfig): Promise<string> => {
  const root = resolve(projectRoot);
  const path = configPathFor(root);
  const directory = dirname(path);
  await rejectSymlink(directory);
  await mkdir(directory, { recursive: true });
  await rejectSymlink(path);

  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporaryPath, serializeConfig(config), { encoding: 'utf8', flag: 'wx' });
    await rename(temporaryPath, path);
  } catch (error) {
    await rm(temporaryPath, { force: true }).catch(() => undefined);
    throw new ConfigError(`Could not safely write config at ${path}.`, { cause: error });
  }
  return path;
};
