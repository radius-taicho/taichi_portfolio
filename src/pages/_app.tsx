import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Taichi Portfolio</title>
        <meta name="description" content="Web Designer Portfolio - Taichi Yamamoto" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <LanguageProvider>
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </LanguageProvider>
      </main>
    </>
  )
}