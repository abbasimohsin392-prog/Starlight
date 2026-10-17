import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: 'https://starlightai.site', lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: 'https://starlightai.site/pricing', lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://starlightai.site/services', lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://starlightai.site/solutions', lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://starlightai.site/contact', lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://starlightai.site/demo/ai-receptionist', lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://starlightai.site/demo/real-estate', lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://starlightai.site/privacy', lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://starlightai.site/terms', lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
