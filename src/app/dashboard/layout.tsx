import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/dashboard/shell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // El middleware ya protege /dashboard, pero validamos también aquí para
  // obtener el usuario que se muestra en la barra lateral.
  if (!user) redirect('/login')

  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? 'Usuario'

  return (
    <DashboardShell user={{ name, email: user.email ?? '' }}>{children}</DashboardShell>
  )
}
