import { Link as LinkIcon, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function TeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const myName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'Tú'
  const myEmail = user?.email ?? ''

  const members = [
    { name: myName, email: myEmail, role: 'Propietario', status: 'live' as const, you: true },
    { name: 'María González', email: 'maria@empresa.com', role: 'Administrador', status: 'open' as const, you: false },
    { name: 'Carlos Ruiz', email: 'carlos@empresa.com', role: 'Miembro', status: 'draft' as const, you: false },
  ]

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Equipo</h1>
          <p>Gestiona quién tiene acceso a tu empresa en SmartSupport.</p>
        </div>
        <button type="button" className="btn btn--dark btn--lg" disabled title="Se habilitará al conectar el backend">
          <UserPlus />
          Invitar miembro
        </button>
      </header>

      <div className="notice">
        <LinkIcon />
        <span>
          <b>Datos de ejemplo</b> (excepto tu usuario). Los miembros se leerán de <code>users</code>{' '}
          filtrados por <code>company_id</code>.
        </span>
      </div>

      <section className="member-list" aria-label="Miembros del equipo">
        {members.map((m, i) => (
          <div className="member" key={i}>
            <span className="conv__ava" aria-hidden="true">
              {(m.name || '??').slice(0, 2).toUpperCase()}
            </span>
            <span className="member__meta">
              <span className="n">
                {m.name} {m.you && <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(tú)</span>}
              </span>
              <span className="c">{m.email}</span>
            </span>
            <span className={`badge badge--${m.status}`}>
              <span className="dot" />
              {m.role}
            </span>
          </div>
        ))}
      </section>
    </>
  )
}
