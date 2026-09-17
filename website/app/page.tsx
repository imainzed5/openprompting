import type { Metadata } from 'next';
import { HomePage } from '@/components/home';
import { getCatalog } from '@/lib/knowledge';

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await getCatalog();
  const counts = `${catalog.models.length} models · ${catalog.harnesses.length} harnesses · ${catalog.tasks.length} tasks`;
  return {
    title: 'openPrompting — Source-backed guidance for the model, harness, and task you’re actually using',
    description: `An open-source, local-first CLI with deterministic prompting guidance for coding agents. Browse ${counts}. No API keys, model calls, or backend.`,
    alternates: { canonical: '/' },
  };
}

export default async function Page() {
  return <HomePage catalog={await getCatalog()} />;
}
