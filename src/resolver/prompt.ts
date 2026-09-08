import { markdownSection } from './markdown.js';
import type { ResolvedTask } from './setup.js';

const notes = (label: string, id: string, body: string): string => {
  const recommended = markdownSection(body, 'Recommended');
  return `### ${label}: ${id}\n\n${recommended ?? '- No setup-specific recommendations recorded.'}`;
};

export const renderTaskPrompt = (resolved: ResolvedTask, template: string): string => {
  const context = [
    resolved.profileId ? `- Profile: ${resolved.profileId}` : undefined,
    resolved.role ? `- Role: ${resolved.role}` : undefined,
    resolved.setupId ? `- Setup: ${resolved.setupId}` : undefined,
    resolved.model ? `- Model: ${resolved.model.metadata.id}` : undefined,
    resolved.harness ? `- Harness: ${resolved.harness.metadata.id}` : undefined,
  ].filter((value): value is string => Boolean(value));
  const taskRecommended = markdownSection(resolved.task.body, 'Recommended') ?? '- Follow the task template below.';
  const setupNotes = [
    resolved.model ? notes('Model', resolved.model.metadata.id, resolved.model.body) : undefined,
    resolved.harness ? notes('Harness', resolved.harness.metadata.id, resolved.harness.body) : undefined,
  ].filter((value): value is string => Boolean(value));

  return `# openPrompting task: ${resolved.task.metadata.id}\n\n## Resolved context\n\n${context.join('\n')}\n\n## Task guidance\n\n${taskRecommended}\n\n## Setup-specific notes\n\n${setupNotes.join('\n\n')}\n\n## Prompt skeleton\n\n${template}\n`;
};
