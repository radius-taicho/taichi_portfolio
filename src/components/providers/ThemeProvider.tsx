import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'modern' | 'retro'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('retro')

  useEffect(() => {
    // ローカルストレージからテーマを読み込み
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme
    if (savedTheme && (savedTheme === 'modern' || savedTheme === 'retro')) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    // テーマが変更されたらローカルストレージに保存
    localStorage.setItem('portfolio-theme', theme)
    
    // bodyにテーマクラスを追加
    document.body.className = document.body.className.replace(/\b(modern|retro)-style\b/g, '')
    document.body.classList.add(`${theme}-style`)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'modern' ? 'retro' : 'modern')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
