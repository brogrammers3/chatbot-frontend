'use client'

import { useState } from 'react'
import {
  Settings,
  FileText,
  Play,
  CodeXml,
  MessagesSquare,
  Upload,
  Copy,
  Check,
  Send,
  Trash2,
  Inbox,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge, EmptyState } from '@/components/dashboard/ui'

const control =
  'flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50'

const tabs = [
  { key: 'config', label: 'Configuración', icon: Settings },
  { key: 'docs', label: 'Documentos', icon: FileText },
  { key: 'test', label: 'Probar', icon: Play },
  { key: 'embed', label: 'Embed', icon: CodeXml },
  { key: 'convos', label: 'Conversaciones', icon: MessagesSquare },
] as const

type TabKey = (typeof tabs)[number]['key']

const sampleDocs = [
  { name: 'Manual_RRHH.pdf', status: 'done' as const, size: '2.4 MB' },
  { name: 'Politica_Vacaciones.pdf', status: 'done' as const, size: '480 KB' },
  { name: 'Reglamento_Interno.pdf', status: 'pending' as const, size: '1.1 MB' },
]

export function ChatbotTabs({ id, publicToken }: { id: string; publicToken: string }) {
  const [tab, setTab] = useState<TabKey>('config')
  const [copied, setCopied] = useState<string | null>(null)

  const publicUrl = `https://smartsupport.app/chat/${publicToken}`
  const snippet = `<script src="https://smartsupport.app/widget.js" data-chatbot="${publicToken}" defer></script>`

  function copy(text: string, key: string) {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b">
        {tabs.map((t) => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              aria-current={active ? 'page' : undefined}
              className={
                'flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ' +
                (active
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-muted-foreground hover:text-foreground')
              }
            >
              <Icon className="size-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'config' && (
        <Card>
          <CardContent>
            <form className="grid max-w-xl gap-5">
              <div className="grid gap-1.5">
                <Label htmlFor="c-name">Nombre</Label>
                <Input id="c-name" defaultValue="Asistente de RRHH" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="c-model">Modelo de IA</Label>
                <select id="c-model" className={control} defaultValue="claude">
                  <option value="gpt">GPT-5.4 mini (Plan Base)</option>
                  <option value="claude">Claude Sonnet 4.6 (Plan Pro)</option>
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="c-welcome">Mensaje de bienvenida</Label>
                <textarea
                  id="c-welcome"
                  rows={2}
                  className={control}
                  defaultValue="¡Hola! Soy el asistente de RRHH. ¿En qué puedo ayudarte?"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="c-prompt">Instrucciones del sistema</Label>
                <textarea
                  id="c-prompt"
                  rows={4}
                  className={control}
                  defaultValue="Responde con tono profesional y cercano usando solo la información de los documentos cargados. Si algo no está en los documentos, indícalo."
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="size-4 rounded border-input" />
                Publicado (visible para tus usuarios)
              </label>
              <div>
                <Button type="button" disabled title="Se habilitará al conectar el backend">
                  Guardar cambios
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {tab === 'docs' && (
        <div className="grid gap-4">
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-10 text-center">
            <Upload className="size-6 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Arrastra tus PDFs aquí</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              La ingesta (chunking + embeddings) la hará FastAPI. Pendiente de conectar.
            </p>
            <Button variant="outline" size="sm" className="mt-4" disabled>
              <Upload /> Subir documento
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Documento</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Tamaño</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {sampleDocs.map((d) => (
                  <tr key={d.name} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2">
                        <FileText className="size-4 text-muted-foreground" />
                        {d.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {d.status === 'done' ? (
                        <Badge tone="success">Indexado</Badge>
                      ) : (
                        <Badge tone="warning">Procesando…</Badge>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{d.size}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-muted-foreground hover:text-destructive disabled:opacity-50" aria-label="Eliminar documento" disabled>
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'test' && (
        <Card>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 rounded-lg bg-muted/30 p-4">
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-blue-600 px-3.5 py-2 text-sm text-white">
                ¿Cuántos días de vacaciones tengo el primer año?
              </div>
              <div className="mr-auto max-w-[80%] rounded-2xl rounded-bl-sm bg-background px-3.5 py-2 text-sm ring-1 ring-foreground/10">
                15 días hábiles, prorrateados desde tu fecha de ingreso.{' '}
                <span className="text-xs text-muted-foreground">(Manual_RRHH.pdf · pág. 12)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input className={control} placeholder="Escribe una pregunta…" disabled />
              <Button size="icon" disabled aria-label="Enviar">
                <Send />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              El playground se activará cuando el endpoint <code>/chat</code> de FastAPI esté listo.
            </p>
          </CardContent>
        </Card>
      )}

      {tab === 'embed' && (
        <div className="grid gap-4">
          <Card>
            <CardContent className="grid gap-2">
              <Label>Enlace público</Label>
              <div className="flex items-center gap-2">
                <input readOnly value={publicUrl} className={`${control} font-mono text-xs`} />
                <Button variant="outline" size="sm" onClick={() => copy(publicUrl, 'url')}>
                  {copied === 'url' ? <Check /> : <Copy />}
                  {copied === 'url' ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-2">
              <Label>Snippet para incrustar</Label>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
                <code>{snippet}</code>
              </pre>
              <div>
                <Button variant="outline" size="sm" onClick={() => copy(snippet, 'snippet')}>
                  {copied === 'snippet' ? <Check /> : <Copy />}
                  {copied === 'snippet' ? 'Copiado' : 'Copiar snippet'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Pégalo antes de <code>&lt;/body&gt;</code> en tu sitio. (Chatbot <code>{id}</code> · token de ejemplo.)
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'convos' && (
        <EmptyState
          icon={<Inbox />}
          title="Sin conversaciones todavía"
          description="Cuando tus usuarios hablen con este chatbot, las sesiones aparecerán aquí."
        />
      )}
    </div>
  )
}
