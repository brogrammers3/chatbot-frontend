import Link from 'next/link'
import { ArrowLeft, Link as LinkIcon } from 'lucide-react'

export default function NewChatbotPage() {
  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/dashboard/chatbots" className="back-link">
        <ArrowLeft />
        Volver a chatbots
      </Link>

      <header className="page-head">
        <div>
          <h1>Nuevo chatbot</h1>
          <p>Define lo básico; luego podrás subir documentos y publicarlo.</p>
        </div>
      </header>

      <div className="notice">
        <LinkIcon />
        <span>
          <b>Formulario de muestra.</b> Al conectar el backend, esto creará un registro en{' '}
          <code>chatbots</code>.
        </span>
      </div>

      <section className="panel">
        <form>
          <div className="ff">
            <label htmlFor="name">Nombre del chatbot</label>
            <input className="ff__input" id="name" type="text" placeholder="Asistente de RRHH" />
          </div>

          <div className="ff">
            <label htmlFor="model">Modelo de IA</label>
            <select className="ff__input" id="model" defaultValue="gpt">
              <option value="gpt">GPT-5.4 mini — soporte general (Plan Base)</option>
              <option value="claude">Claude Sonnet 4.6 — documentos técnicos/legales (Plan Pro)</option>
            </select>
          </div>

          <div className="ff">
            <label htmlFor="welcome">Mensaje de bienvenida</label>
            <textarea
              className="ff__input"
              id="welcome"
              rows={2}
              placeholder="¡Hola! Soy el asistente de… ¿En qué puedo ayudarte?"
            />
          </div>

          <div className="ff">
            <label htmlFor="prompt">Instrucciones del sistema</label>
            <textarea
              className="ff__input"
              id="prompt"
              rows={4}
              placeholder="Responde con tono profesional usando solo la información de los documentos…"
            />
          </div>

          <div className="form-actions">
            <Link href="/dashboard/chatbots" className="btn btn--outline">
              Cancelar
            </Link>
            <button type="button" className="btn btn--muted btn--lg" disabled title="Se habilitará al conectar el backend">
              Crear chatbot
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
