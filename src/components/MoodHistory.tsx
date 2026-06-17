'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { MoodLog } from '@/lib/types'

const moodEmoji: Record<string, string> = {
  peaceful: '🕊️',
  grateful: '🤲',
  hopeful: '🌱',
  motivated: '🔥',
  tired: '😴',
  sad: '🥀',
  anxious: '🌧️',
  reflective: '🌙',
}

export default function MoodHistory({ logs }: { logs: MoodLog[] }) {
  if (logs.length === 0) return null

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-emerald-deep/5">
      <h2 className="text-lg font-serif text-emerald-deep mb-4">Recent Check-ins</h2>
      <div className="space-y-2">
        {logs.slice(0, 10).map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between py-2 border-b border-emerald-deep/5 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{moodEmoji[log.mood]}</span>
              <span className="text-sm font-medium text-emerald-deep capitalize">{log.mood}</span>
            </div>
            <span className="text-xs text-emerald-deep/40">
              {format(new Date(log.logged_at), 'MMM d, h:mm a')}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}