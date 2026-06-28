import Link from 'next/link'
import { Key } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AccountProfileForm } from '@/components/dashboard/account-profile-form'

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

      <div className="panels">
        {/* Perfil */}
        <section className="panel">
          <div className="panel__head">
            <div>
              <h2>Perfil</h2>
              <p>Tu información personal.</p>
            </div>
          </div>

          <AccountProfileForm userId={user?.id ?? ''} initialName={fullName} email={email} />
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
