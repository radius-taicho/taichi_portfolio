/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 300, // キャッシュ最適化
  },
  // SCSS support is built-in with Next.js
  sassOptions: {
    includePaths: ['./src/styles'],
  },
}

module.exports = nextConfig
