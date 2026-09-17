import type { Metadata } from 'next';
import { DirectoryPage } from '@/components/directory-page';
import { getCatalog } from '@/lib/knowledge';

export const metadata: Metadata = { title: 'Harnesses', description: 'Source-backed guidance for coding-agent harnesses, instruction files, context, and permissions.', alternates: { canonical: '/harnesses' } };

export default async function HarnessesPage() {
  const catalog = await getCatalog();
  return <DirectoryPage kind="harnesses" entries={catalog.harnesses} />;
}
