import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import { ThemeProvider } from '@/lib/theme-context'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <ThemeProvider initialTheme={profile?.theme || 'emerald-sakinah'}>
      <div className="min-h-screen bg-app-bg flex transition-colors duration-500">
        <Sidebar userName={profile?.full_name || 'Friend'} />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}