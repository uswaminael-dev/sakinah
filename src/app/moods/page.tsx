import { createClient } from '@/lib/supabase/server'
import MoodCheckIn from '@/components/MoodCheckIn'
import MoodChart from '@/components/MoodChart'
import MoodHistory from '@/components/MoodHistory'

export default async function MoodsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: moodLogs } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', user!.id)
    .order('logged_at', { ascending: false })
    .limit(60)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-emerald-deep mb-1">Mood Tracker</h1>
        <p className="text-emerald-deep/60">Check in with yourself, gently</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <MoodCheckIn />
        <MoodChart logs={moodLogs || []} />
      </div>

      <MoodHistory logs={moodLogs || []} />
    </div>
  )
}