import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Rubik } from 'next/font/google'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import Head from 'next/head'

// Rubikフォントの設定を最適化
const rubik = Rubik({ 
  subsets: ['latin'],
  display: 'swap', // フォント表示を最適化
  variable: '--font-rubik' // CSS変数として設定
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Taichi Portfolio</title>
        <meta name="description" content="Web Designer Portfolio - Taichi Yamamoto" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${rubik.variable} pc`}>
        <LanguageProvider>
          <Component {...pageProps} />
        </LanguageProvider>
      </main>
    </>
  )
}