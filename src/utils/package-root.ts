import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDirectory = dirname(fileURLToPath(import.meta.url));

// Source modules live under src/utils; bundled modules live directly in dist.
export const packageRoot = basename(moduleDirectory) === 'utils'
  && basename(dirname(moduleDirectory)) === 'src'
  ? resolve(moduleDirectory, '..', '..')
  : resolve(moduleDirectory, '..');
