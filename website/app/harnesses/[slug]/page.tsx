import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KnowledgeDetail } from '@/components/knowledge-content';
import { getCatalog, getEntry, slugFor } from '@/lib/knowledge';
import { splitSections, summaryText, trimSummary } from '@/lib/markdown';
import type { HarnessEntry } from '@/lib/content-types';

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.harnesses.map((entry) => ({ slug: slugFor(entry) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entry = await getEntry('harnesses', (await params).slug);
  if (!entry) return { title: 'Harness not found' };
  return { title: `${entry.displayName} harness guidance`, description: trimSummary(summaryText(splitSections(entry.body))), alternates: { canonical: `/harnesses/${slugFor(entry)}` } };
}

export default async function HarnessPage({ params }: { params: Promise<{ slug: string }> }) {
  const catalog = await getCatalog();
  const entry = await getEntry('harnesses', (await params).slug);
  if (!entry || entry.type !== 'harness') notFound();
  return <KnowledgeDetail kind="harnesses" entry={entry as HarnessEntry} catalog={catalog} />;
}
