import { Link as LinkIcon, Search, Bot } from 'lucide-react'

type Status = 'live' | 'open' | 'warn'

const rows: {
  initials: string
  name: string
  contact: string
  msg: string
  bot: string
  status: Status
  statusLabel: string
  time: string
}[] = [
  { initials: 'MR', name: 'María Robles', contact: 'maria.robles@correo.com', msg: '¿Cómo solicito vacaciones desde la plataforma de RRHH?', bot: 'Asistente de RRHH', status: 'live', statusLabel: 'Resuelta', time: 'hace 4 min' },
  { initials: 'JC', name: 'Javier Cano', contact: 'j.cano@empresa.mx', msg: 'El producto no sincroniza con mi cuenta, ¿hay algún error conocido?', bot: 'Soporte de Producto', status: 'open', statusLabel: 'Abierta', time: 'hace 18 min' },
  { initials: 'AL', name: 'Ana López', contact: 'ana.lopez@correo.com', msg: 'Necesito hablar con un agente humano sobre un reembolso urgente.', bot: 'Soporte de Producto', status: 'warn', statusLabel: 'Escalada', time: 'hace 1 h' },
  { initials: 'DT', name: 'Diego Torres', contact: 'diego.torres@correo.com', msg: '¿Cuál es el horario de atención y qué planes incluyen soporte premium?', bot: 'Soporte de Producto', status: 'live', statusLabel: 'Resuelta', time: 'hace 3 h' },
  { initials: 'PG', name: 'Paola Guzmán', contact: 'paola.g@empresa.mx', msg: '¿Puedo descargar mi recibo de nómina del mes pasado?', bot: 'Asistente de RRHH', status: 'live', statusLabel: 'Resuelta', time: 'ayer' },
]

const filters = ['Todas', 'Abiertas', 'Resueltas', 'Escaladas']

export default function ConversationsPage() {
  return (
    <>
      <header className="page-head">
        <div>
          <h1>Conversaciones</h1>
          <p>Revisa los chats que tus usuarios tuvieron con tus asistentes.</p>
        </div>
      </header>

      <div className="notice">
        <LinkIcon />
        <span>
          <b>Datos de ejemplo.</b> Las conversaciones reales se cargarán desde la tabla{' '}
          <code>messages</code> (filtrada por empresa vía RLS).
        </span>
      </div>

      <div className="toolbar">
        <label className="search">
          <Search />
          <input type="search" placeholder="Buscar por usuario o mensaje…" aria-label="Buscar conversaciones" />
        </label>
        <div className="segmented" role="group" aria-label="Filtrar por estado">
          {filters.map((f, i) => (
            <button type="button" key={f} className={i === 0 ? 'is-active' : undefined}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <section className="conv-list" aria-label="Lista de conversaciones">
        {rows.map((r, i) => (
          <div className="conv" key={i}>
            <div className="conv__user">
              <span className="conv__ava" aria-hidden="true">
                {r.initials}
              </span>
              <span className="conv__who">
                <span className="n">{r.name}</span>
                <span className="c">{r.contact}</span>
              </span>
            </div>
            <div className="conv__msg">{r.msg}</div>
            <span className="conv__bot">
              <Bot />
              {r.bot}
            </span>
            <span className={`badge badge--${r.status}`}>
              <span className="dot" />
              {r.statusLabel}
            </span>
            <span className="conv__time">{r.time}</span>
          </div>
        ))}
      </section>
    </>
  )
}
