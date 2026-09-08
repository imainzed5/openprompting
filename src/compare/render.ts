import type { ComparableEntity, Comparison } from './types.js';

const escape = (value: string): string => value.replaceAll('|', '\\|').replaceAll('\n', ' ');

const table = (title: string, fields: string[], left: ComparableEntity, right: ComparableEntity, source: 'userFields' | 'knowledgeFields'): string => {
  if (fields.length === 0) return `## ${title}\n\nUnavailable for both targets.`;
  const rows = fields.map((field) => `| ${escape(field)} | ${escape(left[source][field] ?? 'unavailable / incomparable')} | ${escape(right[source][field] ?? 'unavailable / incomparable')} |`);
  return `## ${title}\n\n| Field | ${escape(left.id)} | ${escape(right.id)} |\n|---|---|---|\n${rows.join('\n')}`;
};

const provenance = (entity: ComparableEntity): string => {
  if (entity.knowledgeEntries.length === 0) return '- No project-maintained knowledge is attached.';
  return entity.knowledgeEntries.flatMap((entry) => [
    `### ${entry.metadata.type}: ${entry.metadata.id}`,
    ...entry.metadata.evidence.map((evidence) => `- **${evidence.class}**: ${evidence.claim}`),
    ...entry.metadata.sources.map((source) => `- Source: ${source.title} — ${source.url} (checked ${source.last_checked})`),
  ]).join('\n');
};

export const renderComparison = (comparison: Comparison): string => {
  const { left, right } = comparison;
  const userFields = [...new Set([...Object.keys(left.userFields), ...Object.keys(right.userFields)])];
  const knowledgeFields = [...new Set([...Object.keys(left.knowledgeFields), ...Object.keys(right.knowledgeFields)])];
  const compatibility = left.kind === right.kind
    ? `Both targets are ${left.kind} entities; shared fields are shown side by side.`
    : `The targets have different entity types (${left.kind} and ${right.kind}); absent fields are marked unavailable / incomparable.`;
  return `# Evidence-aware comparison\n\n- Left: ${left.id} (${left.kind})\n- Right: ${right.id} (${right.kind})\n\n${compatibility}\n\nNo universal winner is inferred.\n\n${table('User-defined configuration', userFields, left, right, 'userFields')}\n\n${table('Source-backed project knowledge', knowledgeFields, left, right, 'knowledgeFields')}\n\n## Evidence and sources: ${left.id}\n\n${provenance(left)}\n\n## Evidence and sources: ${right.id}\n\n${provenance(right)}\n`;
};
