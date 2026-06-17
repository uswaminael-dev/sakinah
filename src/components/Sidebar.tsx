'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  BookOpen,
  Smile,
  CheckSquare,
  Settings,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/moods', label: 'Moods', icon: Smile },
  { href: '/habits', label: 'Habits', icon: CheckSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-20 md:w-64 bg-white/60 backdrop-blur-xl border-r border-emerald-deep/10 flex flex-col py-8 px-3 md:px-6">
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
                    ? 'bg-emerald-deep text-white shadow-md'
                    : 'text-emerald-deep/70 hover:bg-emerald-deep/10'
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
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-3 rounded-2xl text-emerald-deep/70 hover:bg-red-50 hover:text-red-600 transition-all"
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        <span className="hidden md:inline text-sm font-medium">Sign Out</span>
      </button>
    </aside>
  )
}