import type { MetadataRoute } from 'next';
import { getCatalog, SITE_URL, slugFor } from '@/lib/knowledge';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  const siteUrl = SITE_URL.endsWith('/') ? SITE_URL : `${SITE_URL}/`;
  const staticRoutes = ['/', '/models', '/harnesses', '/tasks', '/docs', '/contributing', '/start'];
  const entries = [
    ...catalog.models.map((entry) => `/models/${slugFor(entry)}`),
    ...catalog.harnesses.map((entry) => `/harnesses/${slugFor(entry)}`),
    ...catalog.tasks.map((entry) => `/tasks/${slugFor(entry)}`),
  ];
  return [...staticRoutes, ...entries].map((path) => {
    const routePath = path === '/' ? '' : `${path.replace(/^\//, '').replace(/\/$/, '')}/`;
    return { url: new URL(routePath, siteUrl).toString(), changeFrequency: 'weekly', priority: path === '/' ? 1 : path.split('/').length > 2 ? 0.7 : 0.8 };
  });
}
