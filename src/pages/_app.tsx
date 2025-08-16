import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Rubik } from 'next/font/google'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { registerImageCacheServiceWorker, preloadCriticalImages } from '@/lib/serviceWorkerUtils'
import Head from 'next/head'
import { useEffect } from 'react'

// Rubikフォントの設定を最適化
const rubik = Rubik({ 
  subsets: ['latin'],
  display: 'swap', // フォント表示を最適化
  variable: '--font-rubik' // CSS変数として設定
})

export default function App({ Component, pageProps }: AppProps) {
  // 🚀 Service Worker 登録と画像最適化初期化
  useEffect(() => {
    // Service Worker 登録
    registerImageCacheServiceWorker();
    
    // 重要な画像のプリロード
    const timer = setTimeout(() => {
      preloadCriticalImages();
    }, 1000); // 1秒後にプリロード開始
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Taichi Portfolio</title>
        <meta name="description" content="Web Designer Portfolio - Taichi Yamamoto" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* 🚀 画像最適化のためのDNSプリフェッチ */}
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      </Head>
      <main className={`${rubik.variable} pc`}>
        <LanguageProvider>
          <Component {...pageProps} />
        </LanguageProvider>
      </main>
    </>
  )
}