import { beforeAll, describe, expect, it } from 'vitest';
import type { OpenPromptingConfig } from '../../src/config/types.js';
import { loadKnowledge } from '../../src/knowledge/load.js';
import type { KnowledgeIndex } from '../../src/knowledge/types.js';
import { renderGuide } from '../../src/resolver/guide.js';
import { resolveGuide, resolveTask } from '../../src/resolver/setup.js';

let knowledge: KnowledgeIndex;

const mixedConfig = (): OpenPromptingConfig => ({
  version: 1,
  setups: {
    gpt: { model: 'openai-gpt-6-astra', harness: 'codex' },
    claude: { model: 'anthropic-claude-sonnet-5', harness: 'claude-code' },
  },
  profiles: {
    builder: { uses: 'gpt', role: 'implementation' },
    reviewer: { uses: 'claude', role: 'review' },
  },
  defaults: { profile: 'builder', tasks: { review: 'reviewer' } },
});

beforeAll(async () => { knowledge = await loadKnowledge(); });

describe('guide resolution', () => {
  it('uses the configured default profile', () => {
    expect(resolveGuide(mixedConfig(), knowledge, {}).profileId).toBe('builder');
  });

  it('honors an explicit profile', () => {
    expect(resolveGuide(mixedConfig(), knowledge, { profile: 'reviewer' }).model?.metadata.id).toBe('anthropic-claude-sonnet-5');
  });

  it('resolves explicit model and harness selectors without config', () => {
    expect(resolveGuide(undefined, knowledge, { model: 'openai-gpt-6-astra' }).model).toBeDefined();
    expect(resolveGuide(undefined, knowledge, { harness: 'claude-code' }).harness).toBeDefined();
  });

  it('uses the only configured setup as fallback', () => {
    const config: OpenPromptingConfig = { version: 1, setups: { only: mixedConfig().setups.gpt! } };
    expect(resolveGuide(config, knowledge, {}).setupId).toBe('only');
  });

  it('fails actionably when selection is ambiguous', () => {
    const config = mixedConfig();
    delete config.defaults;
    expect(() => resolveGuide(config, knowledge, {})).toThrow(/Guidance is ambiguous.*--profile/);
  });

  it('reports valid choices for unknown identifiers', () => {
    expect(() => resolveGuide(undefined, knowledge, { model: 'missing' })).toThrow(
      /Valid models: anthropic-claude-sonnet-5, google-gemini-3-8-flash, openai-gpt-6-astra/,
    );
  });

  it('renders ownership, evidence, sources, and freshness separately', () => {
    const output = renderGuide(resolveGuide(mixedConfig(), knowledge, {}), new Date('2026-09-10T00:00:00Z'));
    expect(output).toContain('## Model guidance: openai-gpt-6-astra');
    expect(output).toContain('## Harness guidance: codex');
    expect(output).toContain('### Evidence');
    expect(output).toContain('### Sources');
    expect(output).toContain('2026-09-07 — current (3 days old)');
  });

  it('keeps model guidance stable when the harness changes', () => {
    const modelWithCodex = renderGuide(resolveGuide(undefined, knowledge, { model: 'openai-gpt-6-astra', harness: 'codex' }));
    const modelWithClaudeCode = renderGuide(resolveGuide(undefined, knowledge, { model: 'openai-gpt-6-astra', harness: 'claude-code' }));
    const modelSection = (text: string): string => text.split('## Model guidance:')[1]!.split('## Harness guidance:')[0]!;
    expect(modelSection(modelWithCodex)).toBe(modelSection(modelWithClaudeCode));
    expect(modelWithCodex).toContain('Harness guidance: codex');
    expect(modelWithClaudeCode).toContain('Harness guidance: claude-code');
  });
});

describe('task resolution precedence', () => {
  it('uses task-specific routing before the default profile', () => {
    expect(resolveTask(mixedConfig(), knowledge, 'review').profileId).toBe('reviewer');
  });

  it('uses an explicit profile before task-specific routing', () => {
    expect(resolveTask(mixedConfig(), knowledge, 'review', 'builder').profileId).toBe('builder');
  });

  it('uses the default profile when no task route exists', () => {
    expect(resolveTask(mixedConfig(), knowledge, 'feature').profileId).toBe('builder');
  });

  it('uses a single setup fallback without profiles', () => {
    const config: OpenPromptingConfig = { version: 1, setups: { only: mixedConfig().setups.gpt! } };
    expect(resolveTask(config, knowledge, 'bug').setupId).toBe('only');
  });

  it('rejects unknown tasks and ambiguous setups', () => {
    expect(() => resolveTask(mixedConfig(), knowledge, 'missing')).toThrow(/Valid tasks/);
    const config = mixedConfig();
    delete config.defaults;
    expect(() => resolveTask(config, knowledge, 'feature')).toThrow(/ambiguous/);
  });
});
