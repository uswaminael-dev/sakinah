'use client'

import { useEffect, useState } from 'react'
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
  const [chartColors, setChartColors] = useState({
    text: 'rgb(20 91 65)',
    bar: 'rgb(188 143 76)',
    panel: 'rgb(255 255 255)',
    border: 'rgb(215 226 215)',
  })

  useEffect(() => {
    const readThemeColors = () => {
      const styles = getComputedStyle(document.documentElement)
      const rgb = (name: string) => `rgb(${styles.getPropertyValue(name).trim()})`

      setChartColors({
        text: rgb('--app-text'),
        bar: rgb('--app-chart'),
        panel: rgb('--app-panel'),
        border: rgb('--app-border'),
      })
    }

    readThemeColors()

    const observer = new MutationObserver(readThemeColors)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

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
    <div className="bg-app-panel backdrop-blur-md rounded-3xl p-6 shadow-sm border border-app-border">
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
              tick={{ fontSize: 12, fill: chartColors.text }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: `1px solid ${chartColors.border}`,
                backgroundColor: chartColors.panel,
                color: chartColors.text,
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" fill={chartColors.bar} radius={[0, 8, 8, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
