/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        // Handle the homepage explicitly so an empty wildcard can never leak into the URL.
        source: '/',
        has: [{ type: 'host', value: 'www.starlightai.site' }],
        destination: 'https://starlightai.site/',
        permanent: true,
      },
      {
        // Preserve the requested path and query for all non-root URLs.
        source: '/:path*',
        has: [{ type: 'host', value: 'www.starlightai.site' }],
        destination: 'https://starlightai.site/:path*',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
