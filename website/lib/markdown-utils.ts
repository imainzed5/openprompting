import type { TemplateField } from './content-types';

export interface MarkdownSection {
  heading: string;
  lines: string[];
}

export function splitSections(body: string): MarkdownSection[] {
  const sections: MarkdownSection[] = [];
  let current: MarkdownSection | undefined;
  for (const rawLine of body.replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.replace(/\s+$/, '');
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading && heading[1].length >= 2) {
      current = { heading: heading[2].trim(), lines: [] };
      sections.push(current);
      continue;
    }
    if (heading?.[1].length === 1) continue;
    if (!current) {
      if (!line.trim()) continue;
      current = { heading: '', lines: [] };
      sections.push(current);
    }
    current.lines.push(line);
  }
  return sections;
}

export function sectionByName(sections: MarkdownSection[], name: string): MarkdownSection | undefined {
  const lower = name.toLowerCase();
  return sections.find((section) => section.heading.toLowerCase() === lower);
}

export function summaryText(sections: MarkdownSection[]): string {
  const summary = sectionByName(sections, 'Summary');
  return summary ? summary.lines.filter(Boolean).join(' ').trim() : '';
}

export function bulletsOf(sections: MarkdownSection[], name: string): string[] {
  const section = sectionByName(sections, name);
  if (!section) return [];
  const bullets: string[] = [];
  for (const line of section.lines) {
    const bullet = /^[-*+]\s+(.*)$/.exec(line);
    if (bullet) bullets.push(bullet[1].trim());
    else if (line.trim() && bullets.length && /^\s{2,}\S/.test(line)) bullets[bullets.length - 1] += ` ${line.trim()}`;
  }
  return bullets;
}

export function parseTemplate(raw: string): TemplateField[] {
  const fields: TemplateField[] = [];
  let current: TemplateField | undefined;
  for (const rawLine of raw.replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const heading = /^#{1,2}\s+(.*)$/.exec(line);
    if (heading) {
      if (line.startsWith('## ')) {
        current = { heading: heading[1].trim(), hint: '' };
        fields.push(current);
      }
      continue;
    }
    const comment = /^<!--\s*(.*?)\s*-->$/.exec(line);
    if (comment && current && !current.hint) current.hint = comment[1];
  }
  return fields;
}

export function templatePlain(fields: TemplateField[]): string {
  return fields.map((field) => `${field.heading}\n${field.hint ? `[${field.hint}]` : '[describe…]'}`).join('\n\n');
}
