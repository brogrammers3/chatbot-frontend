import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/dashboard/app-shell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // El middleware ya protege /dashboard, pero validamos también aquí para
  // obtener el usuario que se muestra en la barra lateral.
  if (!user) redirect('/login')

  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? 'Usuario'
  const initials = name.trim().slice(0, 2).toUpperCase() || 'US'

  return (
    <AppShell user={{ name, email: user.email ?? '', initials }}>{children}</AppShell>
  )
}
