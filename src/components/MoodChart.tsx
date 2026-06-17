'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
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

export default function MoodChart({ logs }: { logs: MoodLog[] }) {
  const counts: Record<string, number> = {}
  logs.forEach((log) => {
    counts[log.mood] = (counts[log.mood] || 0) + 1
  })

  const data = Object.entries(counts)
    .map(([mood, count]) => ({
      mood: `${moodEmoji[mood] || ''} ${mood}`,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-emerald-deep/5">
      <h2 className="text-lg font-serif text-emerald-deep mb-1">Mood Patterns</h2>
      <p className="text-sm text-emerald-deep/50 mb-5">Your last 60 check-ins</p>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-emerald-deep/40 text-sm">
          Log a mood to see your patterns
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="mood"
              width={100}
              tick={{ fontSize: 12, fill: '#1B5E3F' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid rgba(27,94,63,0.1)',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" fill="#C9A861" radius={[0, 8, 8, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}