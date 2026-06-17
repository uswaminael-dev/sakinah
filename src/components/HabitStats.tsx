'use client'

import { Flame, Target } from 'lucide-react'
import { Habit, HabitLog } from '@/lib/types'
import { format, subDays } from 'date-fns'

function calculateStreak(habitId: string, logs: HabitLog[]): number {
  const habitDates = new Set(
    logs.filter((l) => l.habit_id === habitId).map((l) => l.completed_date)
  )

  let streak = 0
  let cursor = new Date()

  // If today isn't logged yet, start counting from yesterday
  if (!habitDates.has(format(cursor, 'yyyy-MM-dd'))) {
    cursor = subDays(cursor, 1)
  }

  while (habitDates.has(format(cursor, 'yyyy-MM-dd'))) {
    streak++
    cursor = subDays(cursor, 1)
  }

  return streak
}

export default function HabitStats({
  habits,
  recentLogs,
}: {
  habits: Habit[]
  recentLogs: HabitLog[]
}) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const completedToday = recentLogs.filter((l) => l.completed_date === today).length

  const bestStreak = habits.reduce((max, habit) => {
    const streak = calculateStreak(habit.id, recentLogs)
    return streak > max ? streak : max
  }, 0)

  const completionRate = habits.length > 0
    ? Math.round((completedToday / habits.length) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-emerald-deep/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-emerald-deep/60 font-medium">Today</span>
          <Target className="w-4 h-4 text-emerald-deep/40" />
        </div>
        <p className="text-3xl font-serif text-emerald-deep">
          {completedToday}/{habits.length}
        </p>
        <p className="text-xs text-emerald-deep/50 mt-1">{completionRate}% complete</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-emerald-deep/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-emerald-deep/60 font-medium">Best Streak</span>
          <Flame className="w-4 h-4 text-emerald-gold" />
        </div>
        <p className="text-3xl font-serif text-emerald-deep">{bestStreak}</p>
        <p className="text-xs text-emerald-deep/50 mt-1">days in a row</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-emerald-deep/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-emerald-deep/60 font-medium">Active Habits</span>
          <Target className="w-4 h-4 text-emerald-deep/40" />
        </div>
        <p className="text-3xl font-serif text-emerald-deep">{habits.length}</p>
        <p className="text-xs text-emerald-deep/50 mt-1">being tracked</p>
      </div>
    </div>
  )
}