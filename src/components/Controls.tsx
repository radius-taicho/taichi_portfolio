import React from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useLanguage } from '@/components/providers/LanguageProvider'

export default function Controls() {
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {/* テーマ切り替えボタン */}
      <button
        onClick={toggleTheme}
        className={`
          px-4 py-2 rounded-lg font-medium text-sm transition-colors
          ${theme === 'retro' 
            ? 'bg-retro-accent text-black hover:bg-gray-400' 
            : 'bg-white text-gray-900 shadow-md hover:bg-gray-50'
          }
        `}
      >
        {theme === 'retro' ? t('theme.modern') : t('theme.retro')}
      </button>

      {/* 言語切り替えボタン */}
      <button
        onClick={toggleLanguage}
        className={`
          px-4 py-2 rounded-lg font-medium text-sm transition-colors
          ${theme === 'retro' 
            ? 'bg-retro-accent text-black hover:bg-gray-400' 
            : 'bg-white text-gray-900 shadow-md hover:bg-gray-50'
          }
        `}
      >
        {language === 'ja' ? t('language.en') : t('language.ja')}
      </button>
    </div>
  )
}
