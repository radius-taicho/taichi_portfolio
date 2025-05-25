import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'ja' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
}

// 翻訳データ
const translations = {
  ja: {
    'nav.works': 'Works',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'works.title': 'Works',
    'works.website': 'Website',
    'works.illustration': 'Illustration & Icon Design',
    'theme.modern': 'モダン',
    'theme.retro': 'レトロ',
    'language.ja': '日本語',
    'language.en': 'English',
  },
  en: {
    'nav.works': 'Works',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'works.title': 'Works',
    'works.website': 'Website',
    'works.illustration': 'Illustration & Icon Design',
    'theme.modern': 'Modern',
    'theme.retro': 'Retro',
    'language.ja': '日本語',
    'language.en': 'English',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja')

  useEffect(() => {
    // ローカルストレージから言語設定を読み込み
    const savedLanguage = localStorage.getItem('portfolio-language') as Language
    if (savedLanguage && (savedLanguage === 'ja' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // 言語が変更されたらローカルストレージに保存
    localStorage.setItem('portfolio-language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ja' ? 'en' : 'ja')
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
