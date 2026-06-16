import Link from 'next/link'
import { Link as LinkIcon, Key } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? ''
  const email = user?.email ?? ''

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Mi cuenta</h1>
          <p>Tu perfil personal y seguridad.</p>
        </div>
      </header>

      <div className="notice">
        <LinkIcon />
        <span>
          El correo proviene de tu sesión real de Supabase. <b>Guardar cambios</b> se habilitará al
          conectar el backend.
        </span>
      </div>

      <div className="panels">
        {/* Perfil */}
        <section className="panel">
          <div className="panel__head">
            <div>
              <h2>Perfil</h2>
              <p>Tu información personal.</p>
            </div>
          </div>

          <form>
            <div className="ff">
              <label htmlFor="fullName">Nombre completo</label>
              <input
                className="ff__input"
                id="fullName"
                type="text"
                defaultValue={fullName}
                placeholder="Tu nombre"
              />
            </div>

            <div className="ff">
              <label htmlFor="email">Correo electrónico</label>
              <input className="ff__input" id="email" type="email" defaultValue={email} readOnly />
              <span className="ff__hint">El correo no se puede cambiar por ahora.</span>
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

        {/* Seguridad */}
        <section className="panel">
          <div className="panel__head">
            <span className="panel__icon" aria-hidden="true">
              <Key />
            </span>
            <div>
              <h2>Seguridad</h2>
              <p>Gestiona el acceso a tu cuenta.</p>
            </div>
          </div>

          <Link href="/reset-password" className="btn btn--outline">
            Cambiar contraseña
          </Link>
        </section>
      </div>
    </>
  )
}
