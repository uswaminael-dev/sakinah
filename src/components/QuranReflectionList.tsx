'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Sparkles } from 'lucide-react'
import { QuranReflection } from '@/lib/types'

export default function QuranReflectionList({ reflections }: { reflections: QuranReflection[] }) {
  if (reflections.length === 0) {
    return (
      <div className="text-center py-16 bg-app-panel/80 rounded-3xl">
        <Sparkles className="w-10 h-10 text-emerald-deep/20 mx-auto mb-3" />
        <p className="text-emerald-deep/50 mb-1">No reflections yet</p>
        <p className="text-sm text-emerald-deep/40">
          Save what an ayah taught you the next time you read
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {reflections.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <Link
            href={`/quran-reflections/${r.id}`}
            className="block p-5 rounded-3xl bg-app-panel backdrop-blur-md border border-app-border hover:shadow-md hover:border-app-ring transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-lg text-emerald-deep">{r.ayah_reference}</h3>
              <span className="text-xs text-emerald-deep/40 flex-shrink-0 ml-3">
                {format(new Date(r.created_at), 'MMM d, yyyy')}
              </span>
            </div>
            {r.reflection && (
              <p className="text-sm text-emerald-deep/60 line-clamp-2">{r.reflection}</p>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  )
}