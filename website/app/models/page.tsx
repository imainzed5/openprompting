import type { Metadata } from 'next';
import { DirectoryPage } from '@/components/directory-page';
import { getCatalog } from '@/lib/knowledge';

export const metadata: Metadata = { title: 'Models', description: 'Source-backed prompting guidance for models in the openPrompting catalog.', alternates: { canonical: '/models' } };

export default async function ModelsPage() {
  const catalog = await getCatalog();
  return <DirectoryPage kind="models" entries={catalog.models} />;
}
