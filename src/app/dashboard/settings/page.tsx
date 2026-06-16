import { Link as LinkIcon, Building2, CreditCard } from 'lucide-react'

export default function SettingsPage() {
  return (
    <>
      <header className="page-head">
        <div>
          <h1>Configuración</h1>
          <p>Ajustes de tu empresa y plan.</p>
        </div>
      </header>

      <div className="notice">
        <LinkIcon />
        <span>
          <b>Vista preliminar.</b> El perfil se guardará en la tabla <code>companies</code>.
        </span>
      </div>

      <div className="panels">
        {/* Perfil de empresa */}
        <section className="panel">
          <div className="panel__head">
            <span className="panel__icon" aria-hidden="true">
              <Building2 />
            </span>
            <div>
              <h2>Perfil de empresa</h2>
              <p>Nombre y URL pública de tu organización.</p>
            </div>
          </div>

          <form>
            <div className="ff">
              <label htmlFor="companyName">Nombre de la empresa</label>
              <input className="ff__input" id="companyName" type="text" defaultValue="Acme Corp" />
            </div>

            <div className="ff">
              <label htmlFor="slug">URL (slug)</label>
              <div className="ff__slug">
                <span className="prefix">smartsupport.app/</span>
                <input className="ff__input" id="slug" type="text" defaultValue="acme" />
              </div>
            </div>

            <button
              type="button"
              className="btn btn--muted btn--lg"
              disabled
              title="Se habilitará al conectar el backend"
            >
              Guardar cambios
            </button>
          </form>
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
                <b>Plan Base</b>
                <span className="badge--soft">Actual</span>
              </div>
              <p className="plan-row__desc">GPT-5.4 mini · soporte general de alto volumen.</p>
            </div>
            <button
              type="button"
              className="btn btn--outline"
              disabled
              title="La facturación llegará en un Sprint futuro"
            >
              Cambiar a Pro
            </button>
          </div>

          <p className="panel__foot">La activación de pago aún no está disponible (placeholder).</p>
        </section>
      </div>
    </>
  )
}
