'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NewChatbotPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [model, setModel] = useState('gpt')
  const [welcome, setWelcome] = useState('')
  const [prompt, setPrompt] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Setup empresa + usuario via RPC (SECURITY DEFINER, bypasses RLS)
      const { data: companyId, error: setupError } = await supabase
        .rpc('setup_user_company', { user_email: user.email ?? '' })

      if (setupError || !companyId) {
        alert(`Error al configurar la empresa: ${setupError?.message}`)
        return
      }

      const { data: chatbot, error } = await supabase
        .from('chatbots')
        .insert({
          name: name.trim(),
          model,
          description: welcome.trim() || null,
          company_id: companyId,
        })
        .select('id')
        .single()

      if (error || !chatbot) {
        alert(`Error al crear el chatbot: ${error?.message}`)
        return
      }

      router.push(`/dashboard/chatbots/${chatbot.id}`)
    } finally {
      setLoading(false)
    }
  }

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

      <section className="panel">
        <form onSubmit={handleSubmit}>
          <div className="ff">
            <label htmlFor="name">Nombre del chatbot</label>
            <input
              className="ff__input"
              id="name"
              type="text"
              placeholder="Asistente de RRHH"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="ff">
            <label htmlFor="model">Modelo de IA</label>
            <select
              className="ff__input"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="gpt">GPT-4o mini — soporte general (Plan Base)</option>
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
              value={welcome}
              onChange={(e) => setWelcome(e.target.value)}
            />
          </div>

          <div className="ff">
            <label htmlFor="prompt">Instrucciones del sistema</label>
            <textarea
              className="ff__input"
              id="prompt"
              rows={4}
              placeholder="Responde con tono profesional usando solo la información de los documentos…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <Link href="/dashboard/chatbots" className="btn btn--outline">
              Cancelar
            </Link>
            <button
              type="submit"
              className="btn btn--dark btn--lg"
              disabled={loading || !name.trim()}
            >
              {loading ? 'Creando…' : 'Crear chatbot'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
