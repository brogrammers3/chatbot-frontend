'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function AccountProfileForm({
  userId,
  initialName,
  email,
}: {
  userId: string
  initialName: string
  email: string
}) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setSaved(false)
    const supabase = createClient()

    // El nombre vive en dos lugares: el metadata de auth (saludo del dashboard,
    // esta página) y la columna `users.full_name` (página de Equipo).
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: name.trim() },
    })
    const { error: rowError } = await supabase
      .from('users')
      .update({ full_name: name.trim() })
      .eq('id', userId)

    setSaving(false)
    const error = authError ?? rowError
    if (error) {
      alert(`No se pudo guardar: ${error.message}`)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="ff">
        <label htmlFor="fullName">Nombre completo</label>
        <input
          className="ff__input"
          id="fullName"
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="ff">
        <label htmlFor="email">Correo electrónico</label>
        <input className="ff__input" id="email" type="email" defaultValue={email} readOnly />
        <span className="ff__hint">El correo no se puede cambiar por ahora.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="submit" className="btn btn--dark btn--lg" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {saved && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#15803d', fontSize: 14 }}>
            <Check style={{ width: 16, height: 16 }} />
            Guardado
          </span>
        )}
      </div>
    </form>
  )
}
