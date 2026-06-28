'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { timeAgo, initials } from '@/lib/utils'
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
type Convo = { id: string; session_id: string; created_at: string; count: number; last: string }

export function ChatbotTabs({
  id,
  publicToken,
  name,
  model,
  description = '',
  systemPrompt = '',
}: {
  id: string
  publicToken: string
  name: string
  model: string
  description?: string
  systemPrompt?: string
}) {
  const router = useRouter()
  const [tab, setTab] = useState<TabKey>('config')
  const [copied, setCopied] = useState<string | null>(null)

  // Config state
  const [cfgName, setCfgName] = useState(name)
  const [cfgModel, setCfgModel] = useState(model)
  const [cfgWelcome, setCfgWelcome] = useState(description)
  const [cfgPrompt, setCfgPrompt] = useState(systemPrompt)
  const [savingCfg, setSavingCfg] = useState(false)
  const [savedCfg, setSavedCfg] = useState(false)

  // Docs state
  const [docs, setDocs] = useState<Doc[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Conversations state
  const [convos, setConvos] = useState<Convo[]>([])
  const [convosLoaded, setConvosLoaded] = useState(false)

  // Chat state
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const sessionId = useRef(crypto.randomUUID())
  const bottomRef = useRef<HTMLDivElement>(null)

  const publicUrl = `https://smartsupport.app/chat/${publicToken}`
  const snippet = `<script src="https://smartsupport.app/widget.js" data-chatbot="${publicToken}" defer></script>`

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

  async function loadConvos() {
    const supabase = createClient()
    const { data } = await supabase
      .from('conversations')
      .select('id, session_id, created_at, messages(content, role, created_at)')
      .eq('chatbot_id', id)
      .order('created_at', { ascending: false })
      .limit(50)
    type Row = {
      id: string
      session_id: string
      created_at: string
      messages: { content: string; role: string; created_at: string }[]
    }
    const rows = ((data as Row[] | null) ?? []).map((c) => {
      const sorted = [...c.messages].sort(
        (a, b) => +new Date(a.created_at) - +new Date(b.created_at),
      )
      const lastUser = [...sorted].reverse().find((m) => m.role === 'user')
      return {
        id: c.id,
        session_id: c.session_id,
        created_at: c.created_at,
        count: c.messages.length,
        last: lastUser?.content ?? sorted[sorted.length - 1]?.content ?? 'Conversación sin mensajes',
      }
    })
    setConvos(rows)
    setConvosLoaded(true)
  }

  async function saveConfig() {
    if (!cfgName.trim() || savingCfg) return
    setSavingCfg(true)
    setSavedCfg(false)
    const supabase = createClient()
    const { error } = await supabase
      .from('chatbots')
      .update({
        name: cfgName.trim(),
        model: cfgModel,
        description: cfgWelcome.trim() || null,
        system_prompt: cfgPrompt.trim() || null,
      })
      .eq('id', id)
    setSavingCfg(false)
    if (error) {
      alert(`No se pudo guardar: ${error.message}`)
      return
    }
    setSavedCfg(true)
    setTimeout(() => setSavedCfg(false), 2000)
    router.refresh() // refresca el nombre en el encabezado (server component)
  }

  useEffect(() => {
    // Carga diferida al abrir cada pestaña (los setState ocurren tras el await).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (tab === 'docs') loadDocs()
    if (tab === 'convos') loadConvos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, id])

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
          <form onSubmit={(e) => { e.preventDefault(); saveConfig() }}>
            <div className="ff">
              <label htmlFor="c-name">Nombre</label>
              <input
                className="ff__input"
                id="c-name"
                value={cfgName}
                onChange={(e) => setCfgName(e.target.value)}
              />
            </div>
            <div className="ff">
              <label htmlFor="c-model">Modelo de IA</label>
              <select
                className="ff__input"
                id="c-model"
                value={cfgModel}
                onChange={(e) => setCfgModel(e.target.value)}
              >
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
                placeholder="¡Hola! ¿En qué puedo ayudarte?"
                value={cfgWelcome}
                onChange={(e) => setCfgWelcome(e.target.value)}
              />
            </div>
            <div className="ff">
              <label htmlFor="c-prompt">Instrucciones del sistema</label>
              <textarea
                className="ff__input"
                id="c-prompt"
                rows={4}
                placeholder="Responde con tono profesional usando solo la información de los documentos cargados. Si algo no está en los documentos, indícalo."
                value={cfgPrompt}
                onChange={(e) => setCfgPrompt(e.target.value)}
              />
              <span className="ff__hint">Define el tono y la personalidad del asistente.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="submit"
                className="btn btn--dark btn--lg"
                disabled={savingCfg || !cfgName.trim()}
              >
                {savingCfg ? 'Guardando…' : 'Guardar cambios'}
              </button>
              {savedCfg && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--green-600, #15803d)', fontSize: 14 }}>
                  <Check style={{ width: 16, height: 16 }} />
                  Guardado
                </span>
              )}
            </div>
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
        convos.length > 0 ? (
          <section className="panel" style={{ padding: 0 }}>
            <div className="member-list">
              {convos.map((c) => (
                <div className="member" key={c.id}>
                  <span className="conv__ava" aria-hidden="true">
                    {initials(c.session_id)}
                  </span>
                  <span className="member__meta">
                    <span className="n">{c.last}</span>
                    <span className="c">
                      Sesión {c.session_id.slice(0, 8)} · {c.count} mensaje{c.count === 1 ? '' : 's'}
                    </span>
                  </span>
                  <span className="conv__time">{timeAgo(c.created_at)}</span>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="empty">
            <span className="empty__icon" aria-hidden="true">
              {convosLoaded ? <Inbox /> : <Loader2 className="animate-spin" />}
            </span>
            <h2>{convosLoaded ? 'Sin conversaciones todavía' : 'Cargando…'}</h2>
            <p>Cuando tus usuarios hablen con este chatbot, las sesiones aparecerán aquí.</p>
          </div>
        )
      )}
    </div>
  )
}
