import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PendingNote } from '@/components/dashboard/ui'

const control =
  'flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export default function NewChatbotPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/chatbots"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Volver a chatbots
      </Link>

      <h1 className="font-heading text-2xl font-semibold tracking-tight">Nuevo chatbot</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Define lo básico; luego podrás subir documentos y publicarlo.
      </p>

      <PendingNote>
        Formulario de muestra. Al conectar el backend, esto creará un registro en{' '}
        <code>chatbots</code>.
      </PendingNote>

      <Card>
        <CardContent>
          <form className="grid gap-5">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Nombre del chatbot</Label>
              <Input id="name" placeholder="Asistente de RRHH" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="model">Modelo de IA</Label>
              <select id="model" className={control} defaultValue="gpt">
                <option value="gpt">GPT-5.4 mini — soporte general (Plan Base)</option>
                <option value="claude">Claude Sonnet 4.6 — documentos técnicos/legales (Plan Pro)</option>
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="welcome">Mensaje de bienvenida</Label>
              <textarea
                id="welcome"
                rows={2}
                className={control}
                placeholder="¡Hola! Soy el asistente de… ¿En qué puedo ayudarte?"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="prompt">Instrucciones del sistema</Label>
              <textarea
                id="prompt"
                rows={4}
                className={control}
                placeholder="Responde con tono profesional usando solo la información de los documentos…"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <Link href="/dashboard/chatbots" className={buttonVariants({ variant: 'ghost' })}>
                Cancelar
              </Link>
              <Button type="button" disabled title="Se habilitará al conectar el backend">
                Crear chatbot
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
