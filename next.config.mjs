const isProdBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone is for Docker/VPS production builds only. Skip it in `next dev`
  // and on Vercel (Vercel needs NFT traces such as next-server.js.nft.json).
  ...(isProdBuild ? { output: 'standalone' } : {}),
  poweredByHeader: false,
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'backend.codewithseth.co.ke' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        source: '/api/:path*',
        has: [{ type: 'header', key: 'origin', value: 'https://tarumed-three.vercel.app' }],
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://tarumed-three.vercel.app' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Org-Id' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Vary', value: 'Origin' },
        ],
      },
    ]
  },
}

export default nextConfig
