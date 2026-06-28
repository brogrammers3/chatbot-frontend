import { Search, Bot, Inbox } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { timeAgo, initials } from '@/lib/utils'

type ConversationRow = {
  id: string
  session_id: string
  created_at: string
  chatbots: { name: string } | null
  messages: { content: string; role: string; created_at: string }[]
}

export default async function ConversationsPage() {
  const supabase = await createClient()

  // RLS limita las conversaciones a los chatbots de la empresa del usuario.
  const { data } = await supabase
    .from('conversations')
    .select('id, session_id, created_at, chatbots(name), messages(content, role, created_at)')
    .order('created_at', { ascending: false })
    .limit(100)

  const conversations = ((data as ConversationRow[] | null) ?? []).map((c) => {
    const sorted = [...c.messages].sort(
      (a, b) => +new Date(a.created_at) - +new Date(b.created_at),
    )
    const last = sorted[sorted.length - 1]
    const lastUser = [...sorted].reverse().find((m) => m.role === 'user')

    // Estado derivado del último mensaje: si el bot ya respondió la cerramos.
    const status =
      sorted.length === 0
        ? { cls: 'draft', label: 'Vacía' }
        : last.role === 'assistant'
          ? { cls: 'live', label: 'Respondida' }
          : { cls: 'warn', label: 'Pendiente' }

    return {
      id: c.id,
      session: c.session_id,
      bot: c.chatbots?.name ?? 'Chatbot',
      msg: lastUser?.content ?? last?.content ?? 'Conversación sin mensajes',
      count: c.messages.length,
      status,
      time: c.created_at,
    }
  })

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Conversaciones</h1>
          <p>Revisa los chats que tus usuarios tuvieron con tus asistentes.</p>
        </div>
      </header>

      <div className="toolbar">
        <label className="search">
          <Search />
          <input type="search" placeholder="Buscar por sesión o mensaje…" aria-label="Buscar conversaciones" />
        </label>
      </div>

      {conversations.length === 0 ? (
        <div className="empty">
          <span className="empty__icon" aria-hidden="true">
            <Inbox />
          </span>
          <h2>Sin conversaciones todavía</h2>
          <p>Cuando tus usuarios hablen con tus chatbots, las sesiones aparecerán aquí.</p>
        </div>
      ) : (
        <section className="conv-list" aria-label="Lista de conversaciones">
          {conversations.map((c) => (
            <div className="conv" key={c.id}>
              <div className="conv__user">
                <span className="conv__ava" aria-hidden="true">
                  {initials(c.session)}
                </span>
                <span className="conv__who">
                  <span className="n">Sesión {c.session.slice(0, 8)}</span>
                  <span className="c">{c.count} mensaje{c.count === 1 ? '' : 's'}</span>
                </span>
              </div>
              <div className="conv__msg">{c.msg}</div>
              <span className="conv__bot">
                <Bot />
                {c.bot}
              </span>
              <span className={`badge badge--${c.status.cls}`}>
                <span className="dot" />
                {c.status.label}
              </span>
              <span className="conv__time">{timeAgo(c.time)}</span>
            </div>
          ))}
        </section>
      )}
    </>
  )
}
