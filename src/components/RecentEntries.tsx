'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { JournalEntry } from '@/lib/types'
import { BookOpen } from 'lucide-react'

export default function RecentEntries({ entries }: { entries: JournalEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-10 h-10 text-emerald-deep/20 mx-auto mb-3" />
        <p className="text-emerald-deep/50 mb-1">No reflections yet</p>
        <p className="text-sm text-emerald-deep/40 mb-4">
          Your journal is waiting for your first thought
        </p>
        <Link
          href="/journal/new"
          className="inline-block px-5 py-2 rounded-2xl bg-emerald-deep text-white text-sm font-medium hover:bg-emerald-light transition-all"
        >
          Write your first entry
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link
            href={`/journal/${entry.id}`}
            className="block p-4 rounded-2xl hover:bg-emerald-deep/5 transition-all border border-transparent hover:border-emerald-deep/10"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-emerald-deep">
                {entry.title || 'Untitled reflection'}
              </h3>
              <span className="text-xs text-emerald-deep/40">
                {format(new Date(entry.created_at), 'MMM d')}
              </span>
            </div>
            <p className="text-sm text-emerald-deep/60 line-clamp-1">
              {entry.content || 'No content'}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}