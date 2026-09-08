import { resolve } from 'node:path';

export const configPathFor = (projectRoot: string): string =>
  resolve(projectRoot, '.openprompting', 'config.yml');
