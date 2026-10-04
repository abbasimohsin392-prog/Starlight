import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/data'
import { niches } from '@/lib/niches'

const site = 'https://starlightai.site'

export default function sitemap(): MetadataRoute.Sitemap {
  const corePaths = ['', '/services', '/solutions', '/pricing', '/about', '/blog', '/contact', '/demo', '/privacy', '/terms']
  const core = corePaths.map((path) => ({ url: site + path, changeFrequency: 'monthly' as const, priority: path === '' ? 1 : 0.8 }))
  const posts = blogPosts.map((post) => ({ url: site + '/blog/' + post.slug, changeFrequency: 'monthly' as const, priority: 0.6 }))
  const solutions = niches.map((niche) => ({ url: site + '/solutions/' + niche.slug, changeFrequency: 'monthly' as const, priority: 0.7 }))
  return [...core, ...posts, ...solutions]
}
