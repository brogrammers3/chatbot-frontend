import Link from 'next/link'
import { Link as LinkIcon, Plus, Bot, MessagesSquare, FileText, Users, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'Usuario'
  const firstName = fullName.split(' ')[0]

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Hola, {firstName}</h1>
          <p>Este es el resumen de tu cuenta en SmartSupport.</p>
        </div>
        <Link href="/dashboard/chatbots/new" className="btn btn--dark btn--lg">
          <Plus />
          Nuevo chatbot
        </Link>
      </header>

      <div className="notice">
        <LinkIcon />
        <span>
          <b>Vista preliminar con datos de ejemplo.</b> Las métricas reales aparecerán al conectar el
          backend (Supabase + FastAPI).
        </span>
      </div>

      <section className="stats" aria-label="Resumen de métricas">
        <div className="stat">
          <span className="stat__icon" aria-hidden="true">
            <Bot />
          </span>
          <div>
            <div className="stat__num">0</div>
            <div className="stat__label">Chatbots creados</div>
          </div>
        </div>
        <div className="stat">
          <span className="stat__icon" aria-hidden="true">
            <MessagesSquare />
          </span>
          <div>
            <div className="stat__num">0</div>
            <div className="stat__label">Conversaciones (30 días)</div>
          </div>
        </div>
        <div className="stat">
          <span className="stat__icon" aria-hidden="true">
            <FileText />
          </span>
          <div>
            <div className="stat__num">0</div>
            <div className="stat__label">Documentos indexados</div>
          </div>
        </div>
        <div className="stat">
          <span className="stat__icon" aria-hidden="true">
            <Users />
          </span>
          <div>
            <div className="stat__num">1</div>
            <div className="stat__label">Miembros del equipo</div>
          </div>
        </div>
      </section>

      <h2 className="section-label">Actividad reciente</h2>

      <div className="empty">
        <span className="empty__icon" aria-hidden="true">
          <Activity />
        </span>
        <h2>Sin actividad todavía</h2>
        <p>Cuando crees chatbots y tus usuarios conversen con ellos, lo verás aquí.</p>
        <Link href="/dashboard/chatbots/new" className="btn btn--outline btn--lg">
          <Plus />
          Crear tu primer chatbot
        </Link>
      </div>
    </>
  )
}
