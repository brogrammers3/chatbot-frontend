import Link from 'next/link'
import { Bot, Plus, FileText, MessagesSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { PageHeader, PendingNote, Badge } from '@/components/dashboard/ui'

const chatbots = [
  { id: 'asistente-rrhh', name: 'Asistente de RRHH', status: 'published' as const, model: 'Claude Sonnet 4.6', docs: 8, convos: 142 },
  { id: 'soporte-producto', name: 'Soporte de Producto', status: 'published' as const, model: 'GPT-5.4 mini', docs: 23, convos: 980 },
  { id: 'faq-ventas', name: 'FAQ de Ventas', status: 'draft' as const, model: 'GPT-5.4 mini', docs: 3, convos: 0 },
]

export default function ChatbotsPage() {
  return (
    <>
      <PageHeader
        title="Chatbots"
        description="Crea, configura y publica los asistentes de tu empresa."
        action={
          <Link href="/dashboard/chatbots/new" className={buttonVariants()}>
            <Plus /> Nuevo chatbot
          </Link>
        }
      />

      <PendingNote>
        Datos de ejemplo. La lista real se cargará desde la tabla <code>chatbots</code> (filtrada por
        empresa vía RLS).
      </PendingNote>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chatbots.map((bot) => (
          <Card key={bot.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Bot className="size-5" />
                </span>
                {bot.status === 'published' ? (
                  <Badge tone="success">Publicado</Badge>
                ) : (
                  <Badge>Borrador</Badge>
                )}
              </div>
              <CardTitle className="mt-3 text-base">{bot.name}</CardTitle>
              <p className="font-mono text-xs text-muted-foreground">{bot.model}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <FileText className="size-3.5" /> {bot.docs} docs
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessagesSquare className="size-3.5" /> {bot.convos} chats
                </span>
              </div>
              <Link
                href={`/dashboard/chatbots/${bot.id}`}
                className={buttonVariants({ variant: 'outline', size: 'sm', className: 'mt-4 w-full' })}
              >
                Configurar
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
