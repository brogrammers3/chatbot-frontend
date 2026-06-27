'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
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
  Inbox,
  Loader2,
} from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const tabs = [
  { key: 'config', label: 'Configuración', icon: Settings },
  { key: 'docs', label: 'Documentos', icon: FileText },
  { key: 'test', label: 'Probar', icon: Play },
  { key: 'embed', label: 'Embed', icon: CodeXml },
  { key: 'convos', label: 'Conversaciones', icon: MessagesSquare },
] as const

type TabKey = (typeof tabs)[number]['key']

type Doc = { id: string; filename: string; status: 'pending' | 'processed' | 'error' }
type Message = { role: 'user' | 'bot'; content: string }

export function ChatbotTabs({ id, publicToken }: { id: string; publicToken: string }) {
  const [tab, setTab] = useState<TabKey>('config')
  const [copied, setCopied] = useState<string | null>(null)

  // Docs state
  const [docs, setDocs] = useState<Doc[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const sessionId = useRef(crypto.randomUUID())
  const bottomRef = useRef<HTMLDivElement>(null)

  const publicUrl = `https://smartsupport.app/chat/${publicToken}`
  const snippet = `<script src="https://smartsupport.app/widget.js" data-chatbot="${publicToken}" defer></script>`

  useEffect(() => {
    if (tab !== 'docs') return
    loadDocs()
  }, [tab, id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  async function loadDocs() {
    const supabase = createClient()
    const { data } = await supabase
      .from('documents')
      .select('id, filename, status')
      .eq('chatbot_id', id)
      .order('created_at', { ascending: false })
    setDocs((data as Doc[]) ?? [])
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('chatbot_id', id)
      await fetch(`${API_URL}/documents/upload`, { method: 'POST', body: form })
      await loadDocs()
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleSend() {
    if (!input.trim() || thinking) return
    const userMsg = input.trim()
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: userMsg }])
    setThinking(true)
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatbot_id: id, session_id: sessionId.current, message: userMsg }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'bot', content: data.answer }])
    } catch {
      setMessages((m) => [...m, { role: 'bot', content: 'Error al conectar con el asistente. Intenta de nuevo.' }])
    } finally {
      setThinking(false)
    }
  }

  function copy(text: string, key: string) {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div>
      <div className="tabs">
        {tabs.map((t) => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`tab${active ? ' is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'config' && (
        <section className="panel">
          <form>
            <div className="ff">
              <label htmlFor="c-name">Nombre</label>
              <input className="ff__input" id="c-name" defaultValue="Asistente de RRHH" />
            </div>
            <div className="ff">
              <label htmlFor="c-model">Modelo de IA</label>
              <select className="ff__input" id="c-model" defaultValue="claude">
                <option value="gpt">GPT-4o mini (Plan Base)</option>
                <option value="claude">Claude Sonnet 4.6 (Plan Pro)</option>
              </select>
            </div>
            <div className="ff">
              <label htmlFor="c-welcome">Mensaje de bienvenida</label>
              <textarea
                className="ff__input"
                id="c-welcome"
                rows={2}
                defaultValue="¡Hola! Soy el asistente de RRHH. ¿En qué puedo ayudarte?"
              />
            </div>
            <div className="ff">
              <label htmlFor="c-prompt">Instrucciones del sistema</label>
              <textarea
                className="ff__input"
                id="c-prompt"
                rows={4}
                defaultValue="Responde con tono profesional usando solo la información de los documentos cargados. Si algo no está en los documentos, indícalo."
              />
            </div>
            <button type="button" className="btn btn--muted btn--lg" disabled>
              Guardar cambios
            </button>
          </form>
        </section>
      )}

      {tab === 'docs' && (
        <section className="panel">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
          <div
            className="dropzone"
            onClick={() => !uploading && fileRef.current?.click()}
            style={{ cursor: uploading ? 'default' : 'pointer' }}
          >
            {uploading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Upload />
            )}
            <p>{uploading ? 'Procesando documento…' : 'Haz clic para subir un PDF'}</p>
            <p className="hint">El texto se segmentará y vectorizará automáticamente.</p>
          </div>

          {docs.length > 0 && (
            <div className="member-list" style={{ marginTop: 16 }}>
              {docs.map((d) => (
                <div className="doc-row" key={d.id}>
                  <span className="doc-row__name">
                    <FileText />
                    {d.filename}
                  </span>
                  {d.status === 'processed' ? (
                    <span className="badge badge--live">
                      <span className="dot" />
                      Indexado
                    </span>
                  ) : d.status === 'error' ? (
                    <span className="badge badge--draft">
                      <span className="dot" />
                      Error
                    </span>
                  ) : (
                    <span className="badge badge--warn">
                      <span className="dot" />
                      Procesando…
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {docs.length === 0 && !uploading && (
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--slate-400)' }}>
              Aún no hay documentos. Sube el primero.
            </p>
          )}
        </section>
      )}

      {tab === 'test' && (
        <section className="panel">
          <div
            className="preview"
            style={{ minHeight: 200, maxHeight: 360, overflowY: 'auto' }}
          >
            {messages.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--slate-400)', fontSize: 13, padding: '24px 0' }}>
                Escribe una pregunta para probar el chatbot con tus documentos.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`preview__msg preview__msg--${m.role === 'user' ? 'user' : 'bot'}`}
              >
                {m.content}
              </div>
            ))}
            {thinking && (
              <div className="preview__msg preview__msg--bot" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Loader2 className="animate-spin" style={{ width: 14, height: 14 }} />
                Pensando…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="field-row" style={{ marginTop: 12 }}>
            <input
              className="ff__input"
              placeholder="Escribe una pregunta…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={thinking}
            />
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleSend}
              disabled={thinking || !input.trim()}
              aria-label="Enviar"
              style={{ padding: '11px 14px' }}
            >
              <Send />
            </button>
          </div>
        </section>
      )}

      {tab === 'embed' && (
        <section className="panel" style={{ display: 'grid', gap: 18 }}>
          <div className="ff" style={{ marginBottom: 0 }}>
            <label>Enlace público</label>
            <div className="field-row">
              <input
                className="ff__input"
                readOnly
                value={publicUrl}
                style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 13 }}
              />
              <button type="button" className="btn btn--outline" onClick={() => copy(publicUrl, 'url')}>
                {copied === 'url' ? <Check /> : <Copy />}
                {copied === 'url' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
          <div className="ff" style={{ marginBottom: 0 }}>
            <label>Snippet para incrustar</label>
            <pre className="code">
              <code>{snippet}</code>
            </pre>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => copy(snippet, 'snippet')}
              style={{ justifySelf: 'start', marginTop: 4 }}
            >
              {copied === 'snippet' ? <Check /> : <Copy />}
              {copied === 'snippet' ? 'Copiado' : 'Copiar snippet'}
            </button>
          </div>
        </section>
      )}

      {tab === 'convos' && (
        <div className="empty">
          <span className="empty__icon" aria-hidden="true">
            <Inbox />
          </span>
          <h2>Sin conversaciones todavía</h2>
          <p>Cuando tus usuarios hablen con este chatbot, las sesiones aparecerán aquí.</p>
        </div>
      )}
    </div>
  )
}
