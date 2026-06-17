'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'

type ThemeContextType = {
  theme: string
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'emerald-sakinah',
  setTheme: () => {},
})

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode
  initialTheme: string
}) {
  const [theme, setThemeState] = useState(initialTheme)
  const supabase = createClient()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  async function setTheme(newTheme: string) {
    setThemeState(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({ theme: newTheme, updated_at: new Date().toISOString() })
      .eq('id', user.id)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}