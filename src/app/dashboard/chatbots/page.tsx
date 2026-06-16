import Link from 'next/link'
import { Link as LinkIcon, Plus, Bot, Sparkles, FileText, MessagesSquare } from 'lucide-react'

const chatbots = [
  { id: 'asistente-rrhh', name: 'Asistente de RRHH', status: 'live' as const, model: 'Claude Sonnet 4.6', docs: 8, chats: 142 },
  { id: 'soporte-producto', name: 'Soporte de Producto', status: 'live' as const, model: 'GPT-5.4 mini', docs: 23, chats: 980 },
  { id: 'faq-ventas', name: 'FAQ de Ventas', status: 'draft' as const, model: 'GPT-5.4 mini', docs: 3, chats: 0 },
]

export default function ChatbotsPage() {
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

      <div className="notice">
        <LinkIcon />
        <span>
          <b>Datos de ejemplo.</b> La lista real se cargará desde la tabla <code>chatbots</code>{' '}
          (filtrada por empresa vía RLS).
        </span>
      </div>

      <section className="bots" aria-label="Lista de chatbots">
        {chatbots.map((bot) => (
          <article className="bot" key={bot.id}>
            <div className="bot__top">
              <span className="bot__icon" aria-hidden="true">
                <Bot />
              </span>
              {bot.status === 'live' ? (
                <span className="badge badge--live">
                  <span className="dot" />
                  Publicado
                </span>
              ) : (
                <span className="badge badge--draft">
                  <span className="dot" />
                  Borrador
                </span>
              )}
            </div>
            <div className="bot__body">
              <h2 className="bot__name">{bot.name}</h2>
              <span className="bot__model">
                <Sparkles />
                {bot.model}
              </span>
              <div className="bot__meta">
                <span>
                  <FileText />
                  {bot.docs} docs
                </span>
                <span>
                  <MessagesSquare />
                  {bot.chats} chats
                </span>
              </div>
            </div>
            <Link href={`/dashboard/chatbots/${bot.id}`} className="bot__action">
              Configurar
            </Link>
          </article>
        ))}
      </section>
    </>
  )
}
