import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/data'
const site = 'https://starlightai.site'
export default function sitemap(): MetadataRoute.Sitemap {
  const core = ['', '/services', '/pricing', '/solutions', '/about', '/contact', '/blog'].map((path) => ({ url: site + path, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: path === '' ? 1 : 0.8 }))
  const posts = blogPosts.map((post) => ({ url: site + '/blog/' + post.slug, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 }))
  return [...core, ...posts]
}
