'use client'

import { useEffect, useState } from 'react'
import { Bot, File, FileText, Cpu, Send } from 'lucide-react'

type Msg = { type: 'user' | 'bot'; text: string; cite?: string }

const script: Msg[] = [
  { type: 'user', text: '¿Cuántos días de vacaciones tiene un empleado nuevo?' },
  {
    type: 'bot',
    text: 'Un empleado nuevo acumula <strong>15 días hábiles</strong> de vacaciones durante su primer año, prorrateados desde su fecha de ingreso.',
    cite: 'Manual_RRHH.pdf · pág. 12',
  },
  { type: 'user', text: '¿Y se pueden acumular para el año siguiente?' },
  {
    type: 'bot',
    text: 'Sí. Puedes arrastrar hasta <strong>5 días</strong> al año siguiente, siempre que se usen antes del 31 de marzo.',
    cite: 'Política_Vacaciones.pdf · §4.2',
  },
]

type Entry =
  | { id: number; kind: 'typing' }
  | { id: number; kind: 'msg'; item: Msg; show: boolean }

function MessageBubble({ item, show }: { item: Msg; show: boolean }) {
  return (
    <div className={`msg msg--${item.type}${show ? ' show' : ''}`}>
      <div className="msg__ava">{item.type === 'bot' ? 'AI' : 'Tú'}</div>
      <div className="msg__bubble">
        <span dangerouslySetInnerHTML={{ __html: item.text }} />
        {item.cite && (
          <div className="cite">
            <File />
            <span>{item.cite}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/** Mockup de chat del hero con reproducción animada (typing + fade-in) en bucle. */
export function HeroChat() {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Versión estática para reduced-motion: pintar todos los mensajes.
    if (reduce) {
      setEntries(script.map((item, i) => ({ id: i, kind: 'msg', item, show: true })))
      return
    }

    let aborted = false
    let id = 0
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(setTimeout(res, ms)))

    async function play() {
      while (!aborted) {
        setEntries([])
        await wait(400)
        for (const item of script) {
          if (aborted) return
          if (item.type === 'bot') {
            const tid = id++
            setEntries((e) => [...e, { id: tid, kind: 'typing' }])
            await wait(1100)
            if (aborted) return
            setEntries((e) => e.filter((x) => x.id !== tid))
          }
          const mid = id++
          setEntries((e) => [...e, { id: mid, kind: 'msg', item, show: false }])
          await wait(30) // permite que arranque la transición de entrada
          if (aborted) return
          setEntries((e) =>
            e.map((x) => (x.id === mid && x.kind === 'msg' ? { ...x, show: true } : x)),
          )
          await wait(item.type === 'user' ? 900 : 1700)
        }
        await wait(2600)
      }
    }

    play()
    return () => {
      aborted = true
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="hero__visual reveal" data-d="2">
      <div className="chip chip--doc" aria-hidden="true">
        <span className="ic">
          <FileText />
        </span>
        Manual_RRHH.pdf
      </div>
      <div className="chip chip--vec" aria-hidden="true">
        <span className="ic">
          <Cpu />
        </span>
        <span>
          Embeddings
          <br />
          <code>1.536 dims</code>
        </span>
      </div>

      <div
        className="chat"
        role="img"
        aria-label="Demostración de una conversación: el usuario pregunta cuántos días de vacaciones tiene un empleado nuevo y el asistente responde 15 días hábiles citando el manual de RRHH."
      >
        <div className="chat__top">
          <span className="chat__avatar" aria-hidden="true">
            <Bot />
          </span>
          <div className="chat__meta">
            <b>Asistente SmartSupport</b>
            <div className="chat__status">
              <span className="dot" /> En línea · Acme Corp
            </div>
          </div>
        </div>

        <div className="chat__body" aria-hidden="true">
          {entries.map((entry) =>
            entry.kind === 'typing' ? (
              <div className="typing show" key={entry.id}>
                <div className="msg__ava" style={{ background: 'var(--blue-50)', color: 'var(--primary)' }}>
                  AI
                </div>
                <div className="typing__bubble">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : (
              <MessageBubble item={entry.item} show={entry.show} key={entry.id} />
            ),
          )}
        </div>

        <div className="chat__input" aria-hidden="true">
          <div className="fake-field">Escribe tu pregunta…</div>
          <span className="send">
            <Send />
          </span>
        </div>
      </div>
    </div>
  )
}
