'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { JournalEntry, Mood } from '@/lib/types'
import { Trash2, Check, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const moods: { value: Mood; label: string; emoji: string }[] = [
  { value: 'peaceful', label: 'Peaceful', emoji: '🕊️' },
  { value: 'grateful', label: 'Grateful', emoji: '🤲' },
  { value: 'hopeful', label: 'Hopeful', emoji: '🌱' },
  { value: 'motivated', label: 'Motivated', emoji: '🔥' },
  { value: 'tired', label: 'Tired', emoji: '😴' },
  { value: 'sad', label: 'Sad', emoji: '🥀' },
  { value: 'anxious', label: 'Anxious', emoji: '🌧️' },
  { value: 'reflective', label: 'Reflective', emoji: '🌙' },
]

export default function JournalEditor({ entry }: { entry: JournalEntry | null }) {
  const router = useRouter()
  const supabase = createClient()

  const [id, setId] = useState(entry?.id || null)
  const [title, setTitle] = useState(entry?.title || '')
  const [content, setContent] = useState(entry?.content || '')
  const [mood, setMood] = useState<Mood | null>(entry?.mood || null)
  const [energyLevel, setEnergyLevel] = useState(entry?.energy_level || 3)
  const [gratitude, setGratitude] = useState(entry?.gratitude || '')
  const [lessonsLearned, setLessonsLearned] = useState(entry?.lessons_learned || '')
  const [duaRequests, setDuaRequests] = useState(entry?.dua_requests || '')

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [deleting, setDeleting] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)

  const saveEntry = useCallback(async (isDraft: boolean) => {
    setSaveStatus('saving')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      user_id: user.id,
      title: title || null,
      content: content || null,
      mood,
      energy_level: energyLevel,
      gratitude: gratitude || null,
      lessons_learned: lessonsLearned || null,
      dua_requests: duaRequests || null,
      is_draft: isDraft,
      updated_at: new Date().toISOString(),
    }

    if (id) {
      await supabase.from('journal_entries').update(payload).eq('id', id)
    } else {
      const { data } = await supabase
        .from('journal_entries')
        .insert(payload)
        .select()
        .single()
      if (data) setId(data.id)
    }

    setSaveStatus('saved')
  }, [id, title, content, mood, energyLevel, gratitude, lessonsLearned, duaRequests, supabase])

  // Debounced autosave as draft whenever fields change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!title && !content) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveEntry(true)
    }, 1500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, mood, energyLevel, gratitude, lessonsLearned, duaRequests])

  async function handlePublish() {
    await saveEntry(false)
    router.push('/journal')
  }

  async function handleDelete() {
    if (!id) {
      router.push('/journal')
      return
    }
    setDeleting(true)
    await supabase.from('journal_entries').delete().eq('id', id)
    router.push('/journal')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/journal"
          className="flex items-center gap-2 text-emerald-deep/60 hover:text-emerald-deep text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to journal
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-emerald-deep/40 flex items-center gap-1">
            {saveStatus === 'saving' && <Loader2 className="w-3 h-3 animate-spin" />}
            {saveStatus === 'saved' && <Check className="w-3 h-3" />}
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Draft saved' : ''}
          </span>
          {id && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-app-panel backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-sm border border-app-border space-y-6"
      >
        <input
          type="text"
          placeholder="Give your reflection a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-serif text-emerald-deep placeholder-emerald-deep/30 focus:outline-none bg-transparent"
        />

        <textarea
          placeholder="What's on your heart today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full text-emerald-deep/80 placeholder-emerald-deep/30 focus:outline-none bg-transparent resize-none leading-relaxed"
        />

        <div>
          <label className="text-sm font-medium text-emerald-deep/70 mb-2 block">
            How are you feeling?
          </label>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 ${
                  mood === m.value
                    ? 'bg-app-accent text-app-accentText shadow-sm'
                    : 'bg-app-field text-emerald-deep/70 hover:bg-app-field'
                }`}
              >
                <span>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-emerald-deep/70 mb-2 block">
            Energy level: {energyLevel}/5
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={energyLevel}
            onChange={(e) => setEnergyLevel(Number(e.target.value))}
            className="w-full accent-app-accent"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-emerald-deep/70 mb-2 block">
              🤲 Gratitude
            </label>
            <textarea
              placeholder="What are you grateful for today?"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-app-field text-emerald-deep/80 placeholder-emerald-deep/30 focus:outline-none focus:ring-2 focus:ring-app-ring/40 resize-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-emerald-deep/70 mb-2 block">
              💡 Lessons Learned
            </label>
            <textarea
              placeholder="What did today teach you?"
              value={lessonsLearned}
              onChange={(e) => setLessonsLearned(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-app-field text-emerald-deep/80 placeholder-emerald-deep/30 focus:outline-none focus:ring-2 focus:ring-app-ring/40 resize-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-emerald-deep/70 mb-2 block">
            🌙 Dua Requests
          </label>
          <textarea
            placeholder="What would you like to ask Allah for?"
            value={duaRequests}
            onChange={(e) => setDuaRequests(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-2xl bg-app-field text-emerald-deep/80 placeholder-emerald-deep/30 focus:outline-none focus:ring-2 focus:ring-app-ring/40 resize-none text-sm"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handlePublish}
            className="px-6 py-3 rounded-2xl bg-app-accent text-app-accentText font-medium hover:bg-app-accentHover transition-all shadow-sm"
          >
            Save Reflection
          </button>
        </div>
      </motion.div>
    </div>
  )
}