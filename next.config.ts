import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.starlightai.site' }],
        destination: 'https://starlightai.site/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
