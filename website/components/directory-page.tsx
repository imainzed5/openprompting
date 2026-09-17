import type { CatalogEntry, KnowledgeKind } from '@/lib/content-types';
import { CatalogFilter } from './catalog-filter';
import { PageHeader } from './page-header';

const copy: Record<KnowledgeKind, { title: string; lede: string; search: string; empty: string }> = {
  models: { title: 'Models', lede: 'Provider models with prompting guidance scoped to model behavior — not the tool around them. No rankings; entries document observed and documented behavior.', search: 'Filter models', empty: 'No model matches that filter.' },
  harnesses: { title: 'Harnesses', lede: 'Coding-agent tools with instruction-file guidance, context handling, permissions, and cautions. Harness behavior stays separate from model behavior.', search: 'Filter harnesses', empty: 'No harness matches that filter.' },
  tasks: { title: 'Tasks', lede: 'Recurring work patterns with purpose, cautions, and deterministic prompt skeletons. Each task pairs with a template of the same name.', search: 'Filter tasks', empty: 'No task matches that filter.' },
};

export function DirectoryPage({ kind, entries }: { kind: KnowledgeKind; entries: CatalogEntry[] }) {
  const page = copy[kind];
  return <><PageHeader title={page.title} lede={page.lede} /><section className="section section--tight"><div className="wrap"><CatalogFilter entries={entries} kind={kind} label={page.search} empty={page.empty} /></div></section></>;
}
