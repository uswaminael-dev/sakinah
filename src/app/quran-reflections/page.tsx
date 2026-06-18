import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'
import QuranReflectionList from '@/components/QuranReflectionList'

export default async function QuranReflectionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: reflections } = await supabase
    .from('quran_reflections')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-emerald-deep mb-1">Quran Reflections</h1>
          <p className="text-emerald-deep/60">Capture what an ayah taught you</p>
        </div>
        <Link
          href="/quran-reflections/new"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-app-accent text-app-accentText font-medium hover:bg-app-accentHover transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Reflection
        </Link>
      </div>

      <QuranReflectionList reflections={reflections || []} />
    </div>
  )
}