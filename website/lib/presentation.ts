export const PROVIDERS: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  cursor: 'Cursor',
  github: 'GitHub',
  opencode: 'OpenCode',
  aider: 'Aider',
};

export function providerLabel(id: string | null | undefined): string {
  if (!id) return '';
  return PROVIDERS[id] ?? id.charAt(0).toUpperCase() + id.slice(1);
}

export function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}`;
}

/** Stable route identity: preserve repository ids and therefore existing URLs. */
export function slugFor(entryOrId: { id: string } | string): string {
  const id = typeof entryOrId === 'string' ? entryOrId : entryOrId.id;
  const slug = id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!slug) throw new Error(`Cannot create a route slug from '${id}'`);
  return slug;
}
