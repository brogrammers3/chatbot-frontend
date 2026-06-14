import type { ReactNode } from 'react'
import Link from 'next/link'
import { MessageCircleMore, ArrowLeft, Check, File } from 'lucide-react'
import './auth.css'

type ChatMsg = { who: 'user' | 'bot'; text: ReactNode; cite?: string }

export type AsideContent = {
  headline: string
  sub: string
  chat: ChatMsg[]
  trust: string[]
}

/**
 * Layout split-screen para las pantallas de auth: columna de formulario a la
 * izquierda (children) y panel azul→índigo con mini-mockup de chat a la derecha.
 * En móvil el panel se oculta y el formulario queda centrado.
 */
export function AuthShell({ aside, children }: { aside: AsideContent; children: ReactNode }) {
  return (
    <div className="ss-auth">
      <div className="auth">
        {/* Columna del formulario */}
        <section className="auth__form-col">
          <div className="auth__brandbar">
            <Link href="/" className="brand" aria-label="SmartSupport, inicio">
              <span className="brand__mark" aria-hidden="true">
                <MessageCircleMore />
              </span>
              <span>
                <b>Smart</b>Support
              </span>
            </Link>
            <Link href="/" className="auth__back">
              <ArrowLeft />
              Volver
            </Link>
          </div>

          <div className="auth__body">
            <div className="auth__card">{children}</div>
          </div>
        </section>

        {/* Panel lateral */}
        <aside className="auth__aside" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />

          <div className="aside__top">
            <span className="aside__brand">
              <span className="brand__mark" aria-hidden="true">
                <MessageCircleMore />
              </span>
              <span>SmartSupport</span>
            </span>
          </div>

          <div className="aside__mid">
            <h2 className="aside__headline">{aside.headline}</h2>
            <p className="aside__sub">{aside.sub}</p>

            <div className="aside__chat">
              {aside.chat.map((m, i) => (
                <div key={i} className={`a-msg a-msg--${m.who}`}>
                  <span className="a-ava">{m.who === 'bot' ? 'AI' : 'Tú'}</span>
                  <div className="a-bubble">
                    {m.text}
                    {m.cite && (
                      <span className="a-cite">
                        <File /> {m.cite}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="aside__bottom">
            <ul className="aside__trust">
              {aside.trust.map((t, i) => (
                <li key={i}>
                  <span className="tick">
                    <Check />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
