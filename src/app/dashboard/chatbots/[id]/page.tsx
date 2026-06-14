import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/dashboard/ui'
import { ChatbotTabs } from '@/components/dashboard/chatbot-tabs'

export default async function ChatbotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Placeholder: nombre legible derivado del id de ejemplo.
  const name = id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <>
      <Link
        href="/dashboard/chatbots"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver a chatbots
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{name}</h1>
          <Badge tone="success">Publicado</Badge>
        </div>
        <a href="#" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          <Globe /> Ver chatbot público
        </a>
      </div>

      <ChatbotTabs id={id} publicToken="pk_demo_3f9a2b7c" />
    </>
  )
}
