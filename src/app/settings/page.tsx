'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

const themes = [
  { id: 'emerald-sakinah', name: 'Emerald Sakinah', colors: ['#0D3127', '#145B41', '#BC8F4C'] },
  { id: 'midnight-reflection', name: 'Midnight Reflection', colors: ['#0C121F', '#688BB1', '#D9B05D'] },
  { id: 'desert-serenity', name: 'Desert Serenity', colors: ['#443421', '#845D36', '#B87E41'] },
  { id: 'moonlight', name: 'Moonlight', colors: ['#273746', '#37658B', '#AE8841'] },
  { id: 'quranic-garden', name: 'Quranic Garden', colors: ['#2F4432', '#46704E', '#A98B45'] },
]

export default function SettingsPage() {
  const supabase = createClient()
  const { theme, setTheme } = useTheme()
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name || '')
      }
      setLoading(false)
    }
    loadProfile()
  }, [supabase])

  async function handleSaveProfile() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-emerald-deep/40 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-emerald-deep mb-1">Settings</h1>
        <p className="text-emerald-deep/60">Personalize your space</p>
      </div>

      <div className="bg-app-panel backdrop-blur-md rounded-3xl p-6 shadow-sm border border-app-border mb-6">
        <h2 className="text-lg font-serif text-emerald-deep mb-4">Profile</h2>
        <label className="text-sm font-medium text-emerald-deep/70 mb-2 block">Full name</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-app-field text-emerald-deep focus:outline-none focus:ring-2 focus:ring-app-ring/40"
          />
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-5 py-3 rounded-2xl bg-app-accent text-app-accentText font-medium hover:bg-app-accentHover transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="bg-app-panel backdrop-blur-md rounded-3xl p-6 shadow-sm border border-app-border">
        <h2 className="text-lg font-serif text-emerald-deep mb-1">Theme</h2>
        <p className="text-sm text-emerald-deep/50 mb-4">Changes apply instantly across the app</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {themes.map((t) => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTheme(t.id)}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                theme === t.id ? 'border-app-ring bg-app-field' : 'border-app-border hover:border-app-ring'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1">
                  {t.colors.map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-black/5" style={{ backgroundColor: c }} />
                  ))}
                </div>
                {theme === t.id && <Check className="w-4 h-4 text-emerald-deep" />}
              </div>
              <p className="text-xs font-medium text-emerald-deep">{t.name}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
