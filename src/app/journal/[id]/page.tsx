import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import JournalEditor from '@/components/JournalEditor'

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: entry } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!entry) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <JournalEditor entry={entry} />
    </div>
  )
}