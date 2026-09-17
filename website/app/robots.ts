import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/knowledge';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = SITE_URL.endsWith('/') ? SITE_URL : `${SITE_URL}/`;
  return { rules: { userAgent: '*', allow: '/' }, sitemap: new URL('sitemap.xml', siteUrl).toString() };
}
