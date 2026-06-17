import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { BookOpen, Flame, Smile, Heart } from 'lucide-react'
import StatCard from '@/components/StatCard'
import RecentEntries from '@/components/RecentEntries'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Recent journal entries
  const { data: entries } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user!.id)
    .eq('is_draft', false)
    .order('created_at', { ascending: false })
    .limit(5)

  // Total entries count
  const { count: entryCount } = await supabase
    .from('journal_entries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  // Most recent mood
  const { data: latestMood } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', user!.id)
    .order('logged_at', { ascending: false })
    .limit(1)
    .single()

  // Habit completions today
  const today = format(new Date(), 'yyyy-MM-dd')
  const { count: habitsToday } = await supabase
    .from('habit_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)
    .eq('completed_date', today)

  const { count: totalHabits } = await supabase
    .from('habits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)
    .eq('is_active', true)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-emerald-deep mb-1">
          As-Salamu Alaikum
        </h1>
        <p className="text-emerald-deep/60">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<BookOpen className="w-4 h-4" />}
          label="Journal Entries"
          value={entryCount || 0}
          subtext="Total reflections"
        />
        <StatCard
          icon={<Smile className="w-4 h-4" />}
          label="Latest Mood"
          value={latestMood?.mood ? latestMood.mood.charAt(0).toUpperCase() + latestMood.mood.slice(1) : 'Not logged'}
          subtext={latestMood ? format(new Date(latestMood.logged_at), 'MMM d') : 'Log your mood'}
        />
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          label="Today's Habits"
          value={`${habitsToday || 0}/${totalHabits || 0}`}
          subtext="Completed today"
        />
        <StatCard
          icon={<Heart className="w-4 h-4" />}
          label="Gratitude"
          value={entries?.filter(e => e.gratitude).length || 0}
          subtext="Recent grateful moments"
        />
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-emerald-deep/5">
        <h2 className="text-xl font-serif text-emerald-deep mb-4">Recent Reflections</h2>
        <RecentEntries entries={entries || []} />
      </div>
    </div>
  )
}