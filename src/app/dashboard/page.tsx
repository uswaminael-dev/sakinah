import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { BookOpen, Flame, Smile, Heart } from 'lucide-react'
import StatCard from '@/components/StatCard'
import RecentEntries from '@/components/RecentEntries'
import Link from 'next/link'


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

  // Recent Quran reflections
  const { data: quranReflections } = await supabase
    .from('quran_reflections')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(3)

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

      <div className="bg-app-panel backdrop-blur-md rounded-3xl p-6 shadow-sm border border-app-border">
        <h2 className="text-xl font-serif text-emerald-deep mb-4">Recent Reflections</h2>
        <RecentEntries entries={entries || []} />
      </div>

      <div className="mt-6 bg-app-panel backdrop-blur-md rounded-3xl p-6 shadow-sm border border-app-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif text-emerald-deep">Quran Reflections</h2>
          <Link href="/quran-reflections" className="text-sm text-emerald-deep/50 hover:text-emerald-deep">
            View all
          </Link>
        </div>
        {quranReflections && quranReflections.length > 0 ? (
          <div className="space-y-3">
            {quranReflections.map((r) => (
              <Link
                key={r.id}
                href={`/quran-reflections/${r.id}`}
                className="block p-4 rounded-2xl hover:bg-app-field transition-all"
              >
                <p className="font-serif text-emerald-deep">{r.ayah_reference}</p>
                {r.reflection && (
                  <p className="text-sm text-emerald-deep/60 line-clamp-1 mt-1">{r.reflection}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-emerald-deep/40">No reflections saved yet</p>
        )}
      </div>
    </div>
  )
}