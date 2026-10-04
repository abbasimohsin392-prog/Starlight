import type { Metadata } from 'next'
export const siteUrl = 'https://starlightai.site'
export function pageMetadata(title: string, description: string, path: string, article = false): Metadata {
 const fullTitle = title.endsWith(' | Starlight AI') ? title : title + ' | Starlight AI'
 return { title: { absolute: fullTitle }, description, alternates: { canonical: siteUrl + path }, openGraph: { type: article ? 'article' : 'website', url: siteUrl + path, siteName: 'Starlight AI', locale: 'en_US', title: fullTitle, description, images: [{ url: siteUrl + '/images/social-card.png', width: 1200, height: 630, alt: 'Starlight AI — AI automation studio' }] }, twitter: { card: 'summary_large_image', title: fullTitle, description, images: [siteUrl + '/images/social-card.png'] } }
}
export function safeJsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, '\\u003c') }
