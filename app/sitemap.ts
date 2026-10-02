import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/data'
import { niches } from '@/lib/niches'
const site = 'https://starlightai.site'
export default function sitemap(): MetadataRoute.Sitemap {
  const core = ['', '/services', '/pricing', '/solutions', '/about', '/contact', '/blog', '/demo', '/privacy', '/terms'].map((path) => ({ url: site + path, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: path === '' ? 1 : 0.8 }))
  const posts = blogPosts.map((post) => ({ url: site + '/blog/' + post.slug, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 }))
  const solutionPages = niches.map((niche) => ({ url: site + '/solutions/' + niche.slug, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 }))
  return [...core, ...posts, ...solutionPages]
}