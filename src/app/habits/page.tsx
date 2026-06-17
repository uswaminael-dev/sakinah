import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import HabitChecklist from '@/components/HabitChecklist'
import HabitStats from '@/components/HabitStats'

export default async function HabitsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user!.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const today = format(new Date(), 'yyyy-MM-dd')
  const { data: todayLogs } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', user!.id)
    .eq('completed_date', today)

  // Logs from the last 30 days, for streak calculation
  const { data: recentLogs } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', user!.id)
    .order('completed_date', { ascending: false })
    .limit(300)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-emerald-deep mb-1">Daily Habits</h1>
        <p className="text-emerald-deep/60">Small, consistent steps matter most</p>
      </div>

      <HabitStats habits={habits || []} recentLogs={recentLogs || []} />

      <div className="mt-6">
        <HabitChecklist
          habits={habits || []}
          todayLogs={todayLogs || []}
        />
      </div>
    </div>
  )
}