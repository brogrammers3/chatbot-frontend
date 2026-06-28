import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'
import { ChatbotTabs } from '@/components/dashboard/chatbot-tabs'
import { notFound } from 'next/navigation'

export default async function ChatbotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: chatbot } = await supabase
    .from('chatbots')
    .select('id, name, model, description, system_prompt')
    .eq('id', id)
    .single()

  if (!chatbot) return notFound()

  const publicToken = `pk_${id.replace(/-/g, '').slice(0, 16)}`

  return (
    <>
      <Link href="/dashboard/chatbots" className="back-link">
        <ArrowLeft />
        Volver a chatbots
      </Link>

      <header className="page-head">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1>{chatbot.name}</h1>
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

      <ChatbotTabs
        id={id}
        publicToken={publicToken}
        name={chatbot.name}
        model={chatbot.model ?? 'gpt'}
        description={chatbot.description ?? ''}
        systemPrompt={chatbot.system_prompt ?? ''}
      />
    </>
  )
}
