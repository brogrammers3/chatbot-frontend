import { Building2, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CompanySettingsForm } from '@/components/dashboard/company-settings-form'

type Company = { id: string; name: string; plan: 'free' | 'pro' }

export default async function SettingsPage() {
  const supabase = await createClient()

  // RLS limita `companies` a la empresa del usuario, así que hay una sola fila.
  const { data } = await supabase.from('companies').select('id, name, plan').limit(1).single()
  const company = (data as Company | null) ?? null
  const isPro = company?.plan === 'pro'

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Configuración</h1>
          <p>Ajustes de tu empresa y plan.</p>
        </div>
      </header>

      <div className="panels">
        {/* Perfil de empresa */}
        <section className="panel">
          <div className="panel__head">
            <span className="panel__icon" aria-hidden="true">
              <Building2 />
            </span>
            <div>
              <h2>Perfil de empresa</h2>
              <p>Nombre de tu organización.</p>
            </div>
          </div>

          {company ? (
            <CompanySettingsForm companyId={company.id} initialName={company.name} />
          ) : (
            <p className="panel__foot">No se encontró la empresa asociada a tu cuenta.</p>
          )}
        </section>

        {/* Plan y facturación */}
        <section className="panel">
          <div className="panel__head">
            <span className="panel__icon" aria-hidden="true">
              <CreditCard />
            </span>
            <div>
              <h2>Plan y facturación</h2>
              <p>Tu plan actual y opciones de actualización.</p>
            </div>
          </div>

          <div className="plan-row">
            <div>
              <div className="plan-row__name">
                <b>{isPro ? 'Plan Pro' : 'Plan Base'}</b>
                <span className="badge--soft">Actual</span>
              </div>
              <p className="plan-row__desc">
                {isPro
                  ? 'Claude Sonnet 4.6 · respuestas de mayor calidad.'
                  : 'GPT-4o mini · soporte general de alto volumen.'}
              </p>
            </div>
            <button
              type="button"
              className="btn btn--outline"
              disabled
              title="La facturación llegará en un Sprint futuro"
            >
              {isPro ? 'Gestionar plan' : 'Cambiar a Pro'}
            </button>
          </div>

          <p className="panel__foot">La activación de pago aún no está disponible (placeholder).</p>
        </section>
      </div>
    </>
  )
}
