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
    dangerouslyAllowSVG: true, // SVG画像の許可
    contentDispositionType: 'attachment', // セキュリティ向上
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // SCSS support is built-in with Next.js
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  // 本番環境での最適化
  compress: true,
  poweredByHeader: false,
  // 画像読み込みエラーのデバッグ用
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
