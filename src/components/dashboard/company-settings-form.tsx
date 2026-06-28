'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function CompanySettingsForm({
  companyId,
  initialName,
}: {
  companyId: string
  initialName: string
}) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || saving) return
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    const { error } = await supabase
      .from('companies')
      .update({ name: name.trim() })
      .eq('id', companyId)
    setSaving(false)
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
        <label htmlFor="companyName">Nombre de la empresa</label>
        <input
          className="ff__input"
          id="companyName"
          type="text"
          placeholder="Nombre de tu empresa"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="submit" className="btn btn--dark btn--lg" disabled={saving || !name.trim()}>
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
