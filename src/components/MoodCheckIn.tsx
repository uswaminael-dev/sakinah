'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Mood } from '@/lib/types'
import { Check } from 'lucide-react'

const moods: { value: Mood; label: string; emoji: string; color: string }[] = [
  { value: 'peaceful', label: 'Peaceful', emoji: '🕊️', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
  { value: 'grateful', label: 'Grateful', emoji: '🤲', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700' },
  { value: 'hopeful', label: 'Hopeful', emoji: '🌱', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
  { value: 'motivated', label: 'Motivated', emoji: '🔥', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
  { value: 'tired', label: 'Tired', emoji: '😴', color: 'bg-gray-100 hover:bg-gray-200 text-gray-700' },
  { value: 'sad', label: 'Sad', emoji: '🥀', color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700' },
  { value: 'anxious', label: 'Anxious', emoji: '🌧️', color: 'bg-red-50 hover:bg-red-100 text-red-700' },
  { value: 'reflective', label: 'Reflective', emoji: '🌙', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
]

export default function MoodCheckIn() {
  const router = useRouter()
  const supabase = createClient()
  const [selected, setSelected] = useState<Mood | null>(null)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  async function handleSelect(mood: Mood) {
    setSelected(mood)
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('mood_logs').insert({
      user_id: user.id,
      mood,
    })

    setSaving(false)
    setJustSaved(true)
    router.refresh()

    setTimeout(() => setJustSaved(false), 2000)
  }

  return (
    <div className="bg-app-panel backdrop-blur-md rounded-3xl p-6 shadow-sm border border-app-border">
      <h2 className="text-lg font-serif text-emerald-deep mb-1">How are you, right now?</h2>
      <p className="text-sm text-emerald-deep/50 mb-5">There's no wrong answer</p>

      <div className="grid grid-cols-2 gap-2">
        {moods.map((m) => (
          <motion.button
            key={m.value}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelect(m.value)}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${m.color} ${
              selected === m.value ? 'ring-2 ring-app-ring' : ''
            }`}
          >
            <span className="text-base">{m.emoji}</span>
            {m.label}
          </motion.button>
        ))}
      </div>

      {justSaved && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 text-emerald-deep text-sm"
        >
          <Check className="w-4 h-4" />
          Mood logged. Thank you for checking in.
        </motion.div>
      )}
    </div>
  )
}