import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { packageRoot } from '../utils/package-root.js';

export class TemplateError extends Error {
  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'TemplateError';
  }
}

export const loadTemplate = async (taskId: string, templatesRoot = join(packageRoot, 'templates')): Promise<string> => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(taskId)) throw new TemplateError(`Unsafe task template ID '${taskId}'.`);
  const path = resolve(templatesRoot, `${taskId}.md`);
  try {
    return (await readFile(path, 'utf8')).trim();
  } catch (error) {
    throw new TemplateError(`No template found for task '${taskId}' at ${path}.`, { cause: error });
  }
};
