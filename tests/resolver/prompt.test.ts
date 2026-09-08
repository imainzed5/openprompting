import { readFile } from 'node:fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';
import type { OpenPromptingConfig } from '../../src/config/types.js';
import { loadKnowledge } from '../../src/knowledge/load.js';
import type { KnowledgeIndex } from '../../src/knowledge/types.js';
import { renderTaskPrompt } from '../../src/resolver/prompt.js';
import { resolveTask } from '../../src/resolver/setup.js';
import { loadTemplate } from '../../src/templates/load.js';

let knowledge: KnowledgeIndex;
const config: OpenPromptingConfig = {
  version: 1,
  setups: { primary: { model: 'openai-gpt-6-astra', harness: 'codex' } },
  profiles: { builder: { uses: 'primary' } },
  defaults: { profile: 'builder' },
};

beforeAll(async () => { knowledge = await loadKnowledge(); });

describe('task prompt generation', () => {
  it.each(['feature', 'bug', 'review', 'refactor', 'ui'])('renders the %s template with obvious placeholders', async (taskId) => {
    const output = renderTaskPrompt(resolveTask(config, knowledge, taskId), await loadTemplate(taskId));
    expect(output).toContain(`# openPrompting task: ${taskId}`);
    expect(output).toContain('## Prompt skeleton');
    expect(output).toContain('<!--');
  });

  it('is deterministic for identical inputs', async () => {
    const resolved = resolveTask(config, knowledge, 'feature');
    const template = await loadTemplate('feature');
    expect(renderTaskPrompt(resolved, template)).toBe(renderTaskPrompt(resolved, template));
  });

  it('contains no hidden network client in runtime source', async () => {
    const files = ['src/config/read.ts', 'src/resolver/setup.ts', 'src/resolver/prompt.ts', 'src/templates/load.ts'];
    const source = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
    expect(source).not.toMatch(/\bfetch\s*\(|https?:\/\//);
  });
});
