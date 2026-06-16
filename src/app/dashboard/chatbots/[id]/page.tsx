import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'
import { ChatbotTabs } from '@/components/dashboard/chatbot-tabs'

export default async function ChatbotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Placeholder: nombre legible derivado del id de ejemplo.
  const name = id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <>
      <Link href="/dashboard/chatbots" className="back-link">
        <ArrowLeft />
        Volver a chatbots
      </Link>

      <header className="page-head">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1>{name}</h1>
            <span className="badge badge--live">
              <span className="dot" />
              Publicado
            </span>
          </div>
          <p>Configura, prueba y publica tu asistente.</p>
        </div>
        <a href="#" className="btn btn--outline">
          <Globe />
          Ver chatbot público
        </a>
      </header>

      <ChatbotTabs id={id} publicToken="pk_demo_3f9a2b7c" />
    </>
  )
}
