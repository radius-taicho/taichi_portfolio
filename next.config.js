/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
    // 🚨 緊急対応: 画像最適化を無効化してRenderでの502エラーを回避
    unoptimized: true,
    formats: ["image/webp"],
    minimumCacheTTL: 86400, // 24時間キャッシュ（ヒーロー画像白画面防止）
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // SCSS support
  sassOptions: {
    includePaths: ["./src/styles"],
  },

  // 本番環境での最適化
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,

  // 🚀 ビルドパフォーマンス向上の実験機能を有効化を無効化
  experimental: {
    // webpackBuildWorker: true, // この行を削除または false に変更する
    webpackBuildWorker: false,
  },

  // webpack設定
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
