import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended', 'Amazonbot', 'Bytespider', 'CCBot', 'meta-externalagent'],
        allow: '/',
      },
    ],
    sitemap: 'https://starlightai.site/sitemap.xml',
  }
}
