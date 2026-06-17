import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'
import JournalList from '@/components/JournalList'

export default async function JournalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: entries } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user!.id)
    .eq('is_draft', false)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-emerald-deep mb-1">Your Journal</h1>
          <p className="text-emerald-deep/60">A space for honest reflection</p>
        </div>
        <Link
          href="/journal/new"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-deep text-white font-medium hover:bg-emerald-light transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </Link>
      </div>

      <JournalList entries={entries || []} />
    </div>
  )
}