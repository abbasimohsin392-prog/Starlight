import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://starlightai.site' changeFrequency: 'monthly', priority: 1 },
    { url: 'https://starlightai.site/pricing' changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://starlightai.site/services' changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://starlightai.site/solutions' changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://starlightai.site/contact' changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://starlightai.site/demo/ai-receptionist' changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://starlightai.site/demo/real-estate' changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://starlightai.site/privacy' changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://starlightai.site/terms' changeFrequency: 'yearly', priority: 0.3 },
  ]
}
