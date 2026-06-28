import { UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { initials } from '@/lib/utils'

type Member = {
  id: string
  full_name: string | null
  email: string
  role: 'admin' | 'member'
}

const ROLE_LABEL: Record<Member['role'], { label: string; cls: string }> = {
  admin: { label: 'Administrador', cls: 'open' },
  member: { label: 'Miembro', cls: 'draft' },
}

export default async function TeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // RLS limita `users` a los miembros de la misma empresa.
  const { data } = await supabase
    .from('users')
    .select('id, full_name, email, role')
    .order('created_at', { ascending: true })

  const members = (data as Member[] | null) ?? []
  // El usuario actual va primero.
  members.sort((a, b) => (a.id === user?.id ? -1 : b.id === user?.id ? 1 : 0))

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Equipo</h1>
          <p>Gestiona quién tiene acceso a tu empresa en SmartSupport.</p>
        </div>
        <button type="button" className="btn btn--dark btn--lg" disabled title="Las invitaciones llegarán en un Sprint futuro">
          <UserPlus />
          Invitar miembro
        </button>
      </header>

      <section className="member-list" aria-label="Miembros del equipo">
        {members.map((m) => {
          const name = m.full_name || m.email
          const role = ROLE_LABEL[m.role] ?? ROLE_LABEL.member
          const you = m.id === user?.id
          return (
            <div className="member" key={m.id}>
              <span className="conv__ava" aria-hidden="true">
                {initials(name)}
              </span>
              <span className="member__meta">
                <span className="n">
                  {name} {you && <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(tú)</span>}
                </span>
                <span className="c">{m.email}</span>
              </span>
              <span className={`badge badge--${role.cls}`}>
                <span className="dot" />
                {role.label}
              </span>
            </div>
          )
        })}
      </section>
    </>
  )
}
