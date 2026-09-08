import { beforeAll, describe, expect, it } from 'vitest';
import { compareEntities, resolveComparable } from '../../src/compare/resolve.js';
import { renderComparison } from '../../src/compare/render.js';
import type { OpenPromptingConfig } from '../../src/config/types.js';
import { loadKnowledge } from '../../src/knowledge/load.js';
import type { KnowledgeIndex } from '../../src/knowledge/types.js';

let knowledge: KnowledgeIndex;
const config: OpenPromptingConfig = {
  version: 1,
  setups: {
    builder: { model: 'openai-gpt-6-astra', harness: 'codex' },
    reviewer: { model: 'anthropic-claude-sonnet-5', harness: 'claude-code' },
  },
  profiles: {
    builder: { uses: 'builder', role: 'implementation' },
    reviewer: { uses: 'reviewer', role: 'review' },
  },
  defaults: { profile: 'builder', tasks: { review: 'reviewer' } },
};

beforeAll(async () => { knowledge = await loadKnowledge(); });

describe('evidence-aware comparison', () => {
  it('compares profiles with user roles separate from project knowledge', () => {
    const output = renderComparison(compareEntities('builder', 'reviewer', config, knowledge));
    expect(output).toContain('builder (profile)');
    expect(output).toContain('reviewer (profile)');
    expect(output).toContain('## User-defined configuration');
    expect(output).toContain('| Role | implementation | review |');
    expect(output).toContain('## Source-backed project knowledge');
    expect(output).toContain('No universal winner is inferred.');
  });

  it('prioritizes a profile over a setup with the same ID', () => {
    expect(resolveComparable('builder', config, knowledge).kind).toBe('profile');
  });

  it('compares harnesses and renders evidence sources', () => {
    const output = renderComparison(compareEntities('codex', 'claude-code', undefined, knowledge));
    expect(output).toContain('codex (harness)');
    expect(output).toContain('Instruction files');
    expect(output).toContain('**official**');
    expect(output).toContain('Source:');
  });

  it('compares models without unsupported rankings', () => {
    const output = renderComparison(compareEntities('openai-gpt-6-astra', 'anthropic-claude-sonnet-5', undefined, knowledge));
    expect(output).toContain('openai-gpt-6-astra (model)');
    expect(output).not.toMatch(/\d+% better|winner:/i);
  });

  it('compares setup entities', () => {
    const withoutProfiles = { ...config, profiles: {} };
    const output = renderComparison(compareEntities('builder', 'reviewer', withoutProfiles, knowledge));
    expect(output).toContain('builder (setup)');
    expect(output).toContain('| Model | openai-gpt-6-astra | anthropic-claude-sonnet-5 |');
  });

  it('marks fields unavailable or incomparable across entity types', () => {
    const output = renderComparison(compareEntities('builder', 'codex', config, knowledge));
    expect(output).toContain('different entity types (profile and harness)');
    expect(output).toContain('unavailable / incomparable');
  });

  it('reports all valid target categories for an unknown ID', () => {
    expect(() => resolveComparable('missing', config, knowledge)).toThrow(/Profiles:.*Setups:.*Models:.*Harnesses:/);
  });
});
