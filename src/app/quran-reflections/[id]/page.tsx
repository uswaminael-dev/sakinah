import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import QuranReflectionEditor from '@/components/QuranReflectionEditor'

export default async function QuranReflectionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: reflection } = await supabase
    .from('quran_reflections')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!reflection) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <QuranReflectionEditor reflection={reflection} />
    </div>
  )
}