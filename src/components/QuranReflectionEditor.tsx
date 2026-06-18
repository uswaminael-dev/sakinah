'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { QuranReflection } from '@/lib/types'
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react'

export default function QuranReflectionEditor({
  reflection,
}: {
  reflection: QuranReflection | null
}) {
  const router = useRouter()
  const supabase = createClient()

  const [ayahReference, setAyahReference] = useState(reflection?.ayah_reference || '')
  const [reflectionText, setReflectionText] = useState(reflection?.reflection || '')
  const [lessonsLearned, setLessonsLearned] = useState(reflection?.lessons_learned || '')
  const [actionsToImplement, setActionsToImplement] = useState(reflection?.actions_to_implement || '')

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!ayahReference.trim()) {
      setError('Please enter an ayah reference')
      return
    }
    setError(null)
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      user_id: user.id,
      ayah_reference: ayahReference,
      reflection: reflectionText || null,
      lessons_learned: lessonsLearned || null,
      actions_to_implement: actionsToImplement || null,
      updated_at: new Date().toISOString(),
    }

    if (reflection) {
      await supabase.from('quran_reflections').update(payload).eq('id', reflection.id)
    } else {
      await supabase.from('quran_reflections').insert(payload)
    }

    router.push('/quran-reflections')
  }

  async function handleDelete() {
    if (!reflection) {
      router.push('/quran-reflections')
      return
    }
    setDeleting(true)
    await supabase.from('quran_reflections').delete().eq('id', reflection.id)
    router.push('/quran-reflections')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/quran-reflections"
          className="flex items-center gap-2 text-emerald-deep/60 hover:text-emerald-deep text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to reflections
        </Link>

        {reflection && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-app-panel backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-sm border border-app-border space-y-6"
      >
        <div>
          <label className="text-sm font-medium text-emerald-deep/70 mb-2 block">
            Ayah Reference
          </label>
          <input
            type="text"
            placeholder="e.g. Surah Al-Baqarah, 2:286"
            value={ayahReference}
            onChange={(e) => setAyahReference(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-app-field text-emerald-deep placeholder-emerald-deep/30 focus:outline-none focus:ring-2 focus:ring-app-ring/40"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-emerald-deep/70 mb-2 block">
            Reflection
          </label>
          <textarea
            placeholder="What did this ayah make you think or feel?"
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-2xl bg-app-field text-emerald-deep placeholder-emerald-deep/30 focus:outline-none focus:ring-2 focus:ring-app-ring/40 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-emerald-deep/70 mb-2 block">
            Lessons Learned
          </label>
          <textarea
            placeholder="What is the key lesson here?"
            value={lessonsLearned}
            onChange={(e) => setLessonsLearned(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-app-field text-emerald-deep placeholder-emerald-deep/30 focus:outline-none focus:ring-2 focus:ring-app-ring/40 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-emerald-deep/70 mb-2 block">
            Actions to Implement
          </label>
          <textarea
            placeholder="How will you apply this in your life?"
            value={actionsToImplement}
            onChange={(e) => setActionsToImplement(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-app-field text-emerald-deep placeholder-emerald-deep/30 focus:outline-none focus:ring-2 focus:ring-app-ring/40 resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-app-accent text-app-accentText font-medium hover:bg-app-accentHover transition-all shadow-sm flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Reflection
          </button>
        </div>
      </motion.div>
    </div>
  )
}