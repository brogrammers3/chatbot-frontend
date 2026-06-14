import Link from 'next/link'
import { Bot, MessagesSquare, FileText, Users, Plus, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import { PageHeader, PendingNote, StatCard, EmptyState } from '@/components/dashboard/ui'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'Usuario'
  const firstName = fullName.split(' ')[0]

  return (
    <>
      <PageHeader
        title={`Hola, ${firstName}`}
        description="Este es el resumen de tu cuenta en SmartSupport."
        action={
          <Link href="/dashboard/chatbots/new" className={buttonVariants()}>
            <Plus /> Nuevo chatbot
          </Link>
        }
      />

      <PendingNote>
        Vista preliminar con datos de ejemplo. Las métricas reales aparecerán al conectar el backend
        (Supabase + FastAPI).
      </PendingNote>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Bot />} value="0" label="Chatbots" hint="Chatbots creados" />
        <StatCard icon={<MessagesSquare />} value="0" label="Conversaciones" hint="Conversaciones (30 días)" />
        <StatCard icon={<FileText />} value="0" label="Documentos" hint="Documentos indexados" />
        <StatCard icon={<Users />} value="1" label="Miembros" hint="Miembros del equipo" />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Actividad reciente
        </h2>
        <EmptyState
          icon={<Activity />}
          title="Sin actividad todavía"
          description="Cuando crees chatbots y tus usuarios conversen con ellos, lo verás aquí."
          action={
            <Link href="/dashboard/chatbots/new" className={buttonVariants({ variant: 'outline' })}>
              <Plus /> Crear tu primer chatbot
            </Link>
          }
        />
      </section>
    </>
  )
}
