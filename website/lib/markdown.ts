import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
export { bulletsOf, parseTemplate, sectionByName, splitSections, summaryText, templatePlain } from './markdown-utils';

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify);
  const result = await file.process(markdown.replace(/^\s*#\s+[^\n]+\n+/, ''));
  return String(result);
}

export function trimSummary(summary: string, max = 160): string {
  return summary.length > max ? `${summary.slice(0, max - 1).trimEnd()}…` : summary;
}
