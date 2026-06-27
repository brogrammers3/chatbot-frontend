import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Bot, Sparkles, MessagesSquare } from 'lucide-react'

export default async function ChatbotsPage() {
  const supabase = await createClient()

  const { data: chatbots } = await supabase
    .from('chatbots')
    .select('id, name, model, created_at')
    .order('created_at', { ascending: false })

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Chatbots</h1>
          <p>Crea, configura y publica los asistentes de tu empresa.</p>
        </div>
        <Link href="/dashboard/chatbots/new" className="btn btn--dark btn--lg">
          <Plus />
          Nuevo chatbot
        </Link>
      </header>

      {!chatbots || chatbots.length === 0 ? (
        <div className="empty">
          <span className="empty__icon" aria-hidden="true">
            <Bot />
          </span>
          <h2>Sin chatbots todavía</h2>
          <p>Crea tu primer asistente para empezar a subir documentos.</p>
          <Link href="/dashboard/chatbots/new" className="btn btn--dark" style={{ marginTop: 16 }}>
            <Plus />
            Crear mi primer chatbot
          </Link>
        </div>
      ) : (
        <section className="bots" aria-label="Lista de chatbots">
          {chatbots.map((bot) => (
            <article className="bot" key={bot.id}>
              <div className="bot__top">
                <span className="bot__icon" aria-hidden="true">
                  <Bot />
                </span>
                <span className="badge badge--live">
                  <span className="dot" />
                  Publicado
                </span>
              </div>
              <div className="bot__body">
                <h2 className="bot__name">{bot.name}</h2>
                <span className="bot__model">
                  <Sparkles />
                  {bot.model === 'claude' ? 'Claude Sonnet 4.6' : 'GPT-4o mini'}
                </span>
                <div className="bot__meta">
                  <span>
                    <MessagesSquare />
                    0 chats
                  </span>
                </div>
              </div>
              <Link href={`/dashboard/chatbots/${bot.id}`} className="bot__action">
                Configurar
              </Link>
            </article>
          ))}
        </section>
      )}
    </>
  )
}
