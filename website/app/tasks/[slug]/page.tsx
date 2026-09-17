import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { KnowledgeDetail } from '@/components/knowledge-content';
import { getCatalog, getEntry, slugFor } from '@/lib/knowledge';
import { splitSections, summaryText, trimSummary } from '@/lib/markdown';
import type { TaskEntry } from '@/lib/content-types';

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.tasks.map((entry) => ({ slug: slugFor(entry) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const entry = await getEntry('tasks', (await params).slug);
  if (!entry) return { title: 'Task not found' };
  return { title: `${entry.displayName} task guidance`, description: trimSummary(summaryText(splitSections(entry.body))), alternates: { canonical: `/tasks/${slugFor(entry)}` } };
}

export default async function TaskPage({ params }: { params: Promise<{ slug: string }> }) {
  const catalog = await getCatalog();
  const entry = await getEntry('tasks', (await params).slug);
  if (!entry || entry.type !== 'task') notFound();
  return <KnowledgeDetail kind="tasks" entry={entry as TaskEntry} catalog={catalog} />;
}
