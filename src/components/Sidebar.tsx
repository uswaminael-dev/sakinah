'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/lib/theme-context'
import {
  LayoutDashboard,
  BookOpen,
  Smile,
  CheckSquare,
  Settings,
  LogOut,
  Sparkles,
  Palette,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/quran-reflections', label: 'Quran Reflections', icon: Sparkles },
  { href: '/moods', label: 'Moods', icon: Smile },
  { href: '/habits', label: 'Habits', icon: CheckSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const themeOrder = [
  'emerald-sakinah',
  'midnight-reflection',
  'desert-serenity',
  'moonlight',
  'quranic-garden',
]

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()

  function cycleTheme() {
    const currentIndex = themeOrder.indexOf(theme)
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length]
    setTheme(nextTheme)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-20 md:w-64 bg-app-panel/80 backdrop-blur-xl border-r border-app-border flex flex-col py-8 px-3 md:px-6">
      <div className="mb-10 px-2">
        <h1 className="hidden md:block text-2xl font-serif text-emerald-deep">Sakinah</h1>
        <p className="hidden md:block text-sm text-emerald-deep/60 mt-1">
          Welcome, {userName}
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all ${
                  isActive
                    ? 'bg-app-accent text-app-accentText shadow-md'
                    : 'text-emerald-deep/70 hover:bg-app-field'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:inline text-sm font-medium">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <button
        onClick={cycleTheme}
        className="mb-2 flex items-center gap-3 px-3 py-3 rounded-2xl text-emerald-deep/70 hover:bg-app-field hover:text-emerald-deep transition-all"
        title="Cycle theme"
        aria-label="Cycle theme"
      >
        <Palette className="w-5 h-5 flex-shrink-0" />
        <span className="hidden md:inline text-sm font-medium">Theme</span>
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-3 rounded-2xl text-emerald-deep/70 hover:bg-app-field hover:text-app-danger transition-all"
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        <span className="hidden md:inline text-sm font-medium">Sign Out</span>
      </button>
    </aside>
  )
}
