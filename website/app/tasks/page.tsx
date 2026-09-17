import type { Metadata } from 'next';
import { DirectoryPage } from '@/components/directory-page';
import { getCatalog } from '@/lib/knowledge';

export const metadata: Metadata = { title: 'Tasks', description: 'Deterministic task guidance and prompt skeletons from the openPrompting knowledge base.', alternates: { canonical: '/tasks' } };

export default async function TasksPage() {
  const catalog = await getCatalog();
  return <DirectoryPage kind="tasks" entries={catalog.tasks} />;
}
