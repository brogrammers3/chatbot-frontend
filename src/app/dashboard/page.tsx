import Link from 'next/link'
import { Plus, Bot, MessagesSquare, FileText, Users, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { timeAgo, daysAgoISO } from '@/lib/utils'

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'Usuario'
  const firstName = fullName.split(' ')[0]

  const since = daysAgoISO(30)

  // RLS ya filtra cada tabla por la empresa del usuario.
  const [botsRes, convosRes, docsRes, membersRes, recentRes] = await Promise.all([
    supabase.from('chatbots').select('*', { count: 'exact', head: true }),
    supabase.from('conversations').select('*', { count: 'exact', head: true }).gte('created_at', since),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'processed'),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase
      .from('conversations')
      .select('id, created_at, chatbots(name), messages(content, role, created_at)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { icon: Bot, num: botsRes.count ?? 0, label: 'Chatbots creados' },
    { icon: MessagesSquare, num: convosRes.count ?? 0, label: 'Conversaciones (30 días)' },
    { icon: FileText, num: docsRes.count ?? 0, label: 'Documentos indexados' },
    { icon: Users, num: membersRes.count ?? 0, label: 'Miembros del equipo' },
  ]

  type RecentConvo = {
    id: string
    created_at: string
    chatbots: { name: string } | null
    messages: { content: string; role: string; created_at: string }[]
  }
  const recent = ((recentRes.data as RecentConvo[] | null) ?? []).map((c) => {
    const lastUser = [...c.messages]
      .filter((m) => m.role === 'user')
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))[0]
    return {
      id: c.id,
      bot: c.chatbots?.name ?? 'Chatbot',
      msg: lastUser?.content ?? 'Conversación iniciada',
      time: c.created_at,
    }
  })

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

      <section className="stats" aria-label="Resumen de métricas">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div className="stat" key={s.label}>
              <span className="stat__icon" aria-hidden="true">
                <Icon />
              </span>
              <div>
                <div className="stat__num">{s.num}</div>
                <div className="stat__label">{s.label}</div>
              </div>
            </div>
          )
        })}
      </section>

      <h2 className="section-label">Actividad reciente</h2>

      {recent.length === 0 ? (
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
      ) : (
        <section className="conv-list" aria-label="Actividad reciente">
          {recent.map((r) => (
            <div className="conv" key={r.id} style={{ gridTemplateColumns: '1fr auto auto' }}>
              <div className="conv__msg">{r.msg}</div>
              <span className="conv__bot">
                <Bot />
                {r.bot}
              </span>
              <span className="conv__time">{timeAgo(r.time)}</span>
            </div>
          ))}
        </section>
      )}
    </>
  )
}
