import type { Evidence, KnowledgeEntry, KnowledgeMetadata, Source } from '../knowledge/types.js';
import { knowledgeFreshness } from '../knowledge/freshness.js';
import { markdownSection } from './markdown.js';
import type { ResolvedSelection } from './setup.js';

const freshness = (lastVerified: string, now: Date): string => {
  const value = knowledgeFreshness(lastVerified, now);
  return `${lastVerified} — ${value.status} (${value.ageDays} day${value.ageDays === 1 ? '' : 's'} old)`;
};

const renderEvidence = (evidence: Evidence[]): string => evidence
  .map((item) => `- **${item.class}**: ${item.claim}${item.source ? ` [source: ${item.source}]` : ` [reproduction: ${item.reproduction ?? 'not recorded'}]`}`)
  .join('\n');

const renderSources = (sources: Source[]): string => sources
  .map((source) => `- ${source.title}: ${source.url} (checked ${source.last_checked})`)
  .join('\n');

const renderEntry = (label: string, entry: KnowledgeEntry<KnowledgeMetadata>, now: Date): string => {
  const sections = ['Summary', 'Recommended', 'Avoid', 'Context and tool-use notes', 'Known limitations']
    .map((heading) => {
      const content = markdownSection(entry.body, heading);
      return content ? `### ${heading}\n\n${content}` : undefined;
    })
    .filter((value): value is string => Boolean(value));
  return `## ${label} guidance: ${entry.metadata.id}\n\n${sections.join('\n\n')}\n\n### Evidence\n\n${renderEvidence(entry.metadata.evidence)}\n\n### Sources\n\n${renderSources(entry.metadata.sources)}\n\n### Freshness\n\n${freshness(entry.metadata.last_verified, now)}`;
};

export const renderGuide = (resolved: ResolvedSelection, now = new Date()): string => {
  const setup = [
    resolved.profileId ? `- Profile: ${resolved.profileId}` : undefined,
    resolved.role ? `- Role: ${resolved.role}` : undefined,
    resolved.setupId ? `- Setup: ${resolved.setupId}` : undefined,
    resolved.model ? `- Model: ${resolved.model.metadata.id}` : undefined,
    resolved.harness ? `- Harness: ${resolved.harness.metadata.id}` : undefined,
  ].filter((value): value is string => Boolean(value));
  const entries = [
    resolved.model ? renderEntry('Model', resolved.model, now) : undefined,
    resolved.harness ? renderEntry('Harness', resolved.harness, now) : undefined,
  ].filter((value): value is string => Boolean(value));
  return `# Resolved guidance\n\n## Resolved setup\n\n${setup.join('\n')}\n\n${entries.join('\n\n')}`.trimEnd() + '\n';
};
