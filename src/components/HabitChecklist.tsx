'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Habit, HabitLog } from '@/lib/types'
import { Check } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  prayer: '🕌 Prayers',
  spiritual: '✨ Spiritual',
  general: '🌱 General',
}

export default function HabitChecklist({
  habits,
  todayLogs,
}: {
  habits: Habit[]
  todayLogs: HabitLog[]
}) {
  const router = useRouter()
  const supabase = createClient()
  const [pending, setPending] = useState<string | null>(null)
  const today = format(new Date(), 'yyyy-MM-dd')

  const completedIds = new Set(todayLogs.map((log) => log.habit_id))

  const grouped = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) acc[habit.category] = []
    acc[habit.category].push(habit)
    return acc
  }, {} as Record<string, Habit[]>)

  async function toggleHabit(habit: Habit) {
    setPending(habit.id)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const isCompleted = completedIds.has(habit.id)

    if (isCompleted) {
      await supabase
        .from('habit_logs')
        .delete()
        .eq('habit_id', habit.id)
        .eq('completed_date', today)
        .eq('user_id', user.id)
    } else {
      await supabase.from('habit_logs').insert({
        habit_id: habit.id,
        user_id: user.id,
        completed_date: today,
      })
    }

    router.refresh()
    setPending(null)
  }

  if (habits.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 text-center shadow-sm border border-emerald-deep/5">
        <p className="text-emerald-deep/50">No habits set up yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div
          key={category}
          className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-emerald-deep/5"
        >
          <h2 className="text-lg font-serif text-emerald-deep mb-4">
            {categoryLabels[category] || category}
          </h2>
          <div className="space-y-2">
            {items.map((habit) => {
              const isCompleted = completedIds.has(habit.id)
              return (
                <motion.button
                  key={habit.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleHabit(habit)}
                  disabled={pending === habit.id}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                    isCompleted
                      ? 'bg-emerald-deep/10 text-emerald-deep'
                      : 'bg-emerald-deep/5 text-emerald-deep/70 hover:bg-emerald-deep/10'
                  }`}
                >
                  <span className="font-medium text-sm">{habit.name}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-emerald-deep' : 'bg-white border border-emerald-deep/20'
                    }`}
                  >
                    {isCompleted && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}