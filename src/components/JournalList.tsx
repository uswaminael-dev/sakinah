'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Search, BookOpen } from 'lucide-react'
import { JournalEntry, Mood } from '@/lib/types'

const moodColors: Record<Mood, string> = {
  peaceful: 'bg-blue-50 text-blue-700',
  grateful: 'bg-amber-50 text-amber-700',
  hopeful: 'bg-green-50 text-green-700',
  motivated: 'bg-orange-50 text-orange-700',
  tired: 'bg-gray-100 text-gray-700',
  sad: 'bg-indigo-50 text-indigo-700',
  anxious: 'bg-red-50 text-red-700',
  reflective: 'bg-purple-50 text-purple-700',
}

export default function JournalList({ entries }: { entries: JournalEntry[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return entries
    const q = query.toLowerCase()
    return entries.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.content?.toLowerCase().includes(q) ||
        e.gratitude?.toLowerCase().includes(q)
    )
  }, [entries, query])

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-deep/40 w-4 h-4" />
        <input
          type="text"
          placeholder="Search your reflections..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 border border-emerald-deep/10 text-emerald-deep placeholder-emerald-deep/40 focus:outline-none focus:ring-2 focus:ring-emerald-gold transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-3xl">
          <BookOpen className="w-10 h-10 text-emerald-deep/20 mx-auto mb-3" />
          <p className="text-emerald-deep/50">
            {query ? 'No entries match your search' : 'No reflections yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/journal/${entry.id}`}
                className="block p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-emerald-deep/5 hover:shadow-md hover:border-emerald-deep/15 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-emerald-deep text-lg">
                    {entry.title || 'Untitled reflection'}
                  </h3>
                  <span className="text-xs text-emerald-deep/40 flex-shrink-0 ml-3">
                    {format(new Date(entry.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-emerald-deep/60 line-clamp-2 mb-3">
                  {entry.content || 'No content'}
                </p>
                {entry.mood && (
                  <span
                    className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${moodColors[entry.mood]}`}
                  >
                    {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}