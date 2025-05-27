import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Rubik } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import Head from 'next/head'

// Rubikフォントのみ読み込み（HiraginoMaruGothicはシステムフォントとして指定）
const rubik = Rubik({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Taichi Portfolio</title>
        <meta name="description" content="Web Designer Portfolio - Taichi Yamamoto" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={rubik.className} style={{
        '--font-rubik': rubik.style.fontFamily,
        '--font-japanese': '"Hiragino Maru Gothic ProN", "Hiragino Maru Gothic Pro", "HiraginoMaruGothicProN-W4", "HiraginoMaruGothicPro-W4", "ヒラギノ丸ゴ ProN W4", "ヒラギノ丸ゴ Pro W4", "Meiryo", "メイリオ", sans-serif',
        fontFamily: '"Hiragino Maru Gothic ProN", "Hiragino Maru Gothic Pro", "HiraginoMaruGothicProN-W4", "HiraginoMaruGothicPro-W4", "ヒラギノ丸ゴ ProN W4", "ヒラギノ丸ゴ Pro W4", "Meiryo", "メイリオ", sans-serif',
      } as React.CSSProperties}>
        <LanguageProvider>
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </LanguageProvider>
      </main>
    </>
  )
}