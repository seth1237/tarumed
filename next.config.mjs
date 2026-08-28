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
    ]
  },
}

export default nextConfig
