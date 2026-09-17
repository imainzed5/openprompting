import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KnowledgeDetail } from '@/components/knowledge-content';
import { getCatalog, getEntry, slugFor } from '@/lib/knowledge';
import { splitSections, summaryText, trimSummary } from '@/lib/markdown';
import type { ModelEntry } from '@/lib/content-types';

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.models.map((entry) => ({ slug: slugFor(entry) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entry = await getEntry('models', (await params).slug);
  if (!entry) return { title: 'Model not found' };
  return { title: `${entry.displayName} prompting guidance`, description: trimSummary(summaryText(splitSections(entry.body))), alternates: { canonical: `/models/${slugFor(entry)}` } };
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const catalog = await getCatalog();
  const entry = await getEntry('models', (await params).slug);
  if (!entry || entry.type !== 'model') notFound();
  return <KnowledgeDetail kind="models" entry={entry as ModelEntry} catalog={catalog} />;
}
