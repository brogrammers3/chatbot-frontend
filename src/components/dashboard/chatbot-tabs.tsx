'use client'

import { useState } from 'react'
import {
  Settings,
  FileText,
  Play,
  CodeXml,
  MessagesSquare,
  Upload,
  Trash2,
  Copy,
  Check,
  Send,
  Inbox,
} from 'lucide-react'

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
                <option value="gpt">GPT-5.4 mini (Plan Base)</option>
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
            <button type="button" className="btn btn--muted btn--lg" disabled title="Se habilitará al conectar el backend">
              Guardar cambios
            </button>
          </form>
        </section>
      )}

      {tab === 'docs' && (
        <section className="panel">
          <div className="dropzone">
            <Upload />
            <p>Arrastra tus PDFs aquí</p>
            <p className="hint">La ingesta (chunking + embeddings) la hará FastAPI. Pendiente de conectar.</p>
            <button type="button" className="btn btn--outline" disabled style={{ marginTop: 14 }}>
              <Upload />
              Subir documento
            </button>
          </div>

          <div className="member-list">
            {sampleDocs.map((d) => (
              <div className="doc-row" key={d.name}>
                <span className="doc-row__name">
                  <FileText />
                  {d.name}
                </span>
                {d.status === 'done' ? (
                  <span className="badge badge--live">
                    <span className="dot" />
                    Indexado
                  </span>
                ) : (
                  <span className="badge badge--warn">
                    <span className="dot" />
                    Procesando…
                  </span>
                )}
                <span style={{ fontSize: 13, color: 'var(--slate-400)' }}>{d.size}</span>
                <button type="button" className="doc-row__del" disabled aria-label="Eliminar documento">
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'test' && (
        <section className="panel">
          <div className="preview">
            <div className="preview__msg preview__msg--user">
              ¿Cuántos días de vacaciones tengo el primer año?
            </div>
            <div className="preview__msg preview__msg--bot">
              15 días hábiles, prorrateados desde tu fecha de ingreso.{' '}
              <span className="preview__cite">(Manual_RRHH.pdf · pág. 12)</span>
            </div>
          </div>
          <div className="field-row">
            <input className="ff__input" placeholder="Escribe una pregunta…" disabled />
            <button type="button" className="btn btn--primary" disabled aria-label="Enviar" style={{ padding: '11px 14px' }}>
              <Send />
            </button>
          </div>
          <p style={{ marginTop: 10, fontSize: 13, color: 'var(--slate-400)' }}>
            El playground se activará cuando el endpoint <code>/chat</code> de FastAPI esté listo.
          </p>
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
          <p style={{ fontSize: 13, color: 'var(--slate-400)' }}>
            Pégalo antes de <code>&lt;/body&gt;</code> en tu sitio. (Chatbot <code>{id}</code> · token de ejemplo.)
          </p>
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
