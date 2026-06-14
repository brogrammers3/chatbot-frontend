'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Mail, CircleAlert, ArrowLeft, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthShell, type AsideContent } from '@/components/auth/auth-shell'

const schema = z.object({
  email: z.string().email('Ingresa un email válido'),
})

type FormData = z.infer<typeof schema>

const aside: AsideContent = {
  headline: 'Recupera el acceso en segundos.',
  sub: 'Tu cuenta y los datos de tu empresa siguen protegidos con aislamiento seguro por tenant.',
  trust: ['Aislamiento seguro por empresa', 'Enlaces con caducidad'],
}

export default function ForgotPasswordPage() {
  const [sentEmail, setSentEmail] = useState<string | null>(null)
  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function sendLink(email: string) {
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  }

  async function onSubmit(data: FormData) {
    setLoading(true)
    await sendLink(data.email)
    setSentEmail(data.email)
    setLoading(false)
  }

  async function onResend() {
    if (!sentEmail) return
    await sendLink(sentEmail)
    setResent(true)
  }

  if (sentEmail) {
    return (
      <AuthShell aside={aside}>
        <div className="auth__success">
          <div className="auth__success-icon" aria-hidden="true">
            <Mail />
          </div>
          <h1>Revisa tu correo</h1>
          <p>
            Te enviamos un enlace para restablecer tu contraseña a{' '}
            <span className="sent-to">{sentEmail}</span>.
          </p>

          <div className="auth__success-note">
            <Info />
            <span>
              El enlace caduca en 30 minutos. Si no lo ves, revisa tu carpeta de spam o correo no
              deseado.
            </span>
          </div>

          <p className="auth__resend-row">
            ¿No recibiste el correo?{' '}
            <button type="button" onClick={onResend} disabled={resent}>
              {resent ? 'Enlace reenviado' : 'Reenviar enlace'}
            </button>
          </p>

          <p className="auth__alt auth__alt--back">
            <Link href="/login">
              <ArrowLeft /> Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell aside={aside}>
      <div className="auth__head">
        <h1>Recuperar contraseña</h1>
        <p>Introduce tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={`field${errors.email ? ' is-invalid' : ''}`}>
          <label htmlFor="email">Correo electrónico</label>
          <div className="input-wrap">
            <Mail className="lead" />
            <input
              className="input"
              id="email"
              type="email"
              placeholder="tu@empresa.com"
              autoComplete="email"
              aria-invalid={errors.email ? 'true' : undefined}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <span className="field__error">
              <CircleAlert /> {errors.email.message}
            </span>
          )}
        </div>

        <button type="submit" className="btn btn--primary btn--lg auth__submit" disabled={loading}>
          {loading ? 'Enviando…' : 'Enviar enlace'}
        </button>

        <p className="auth__alt auth__alt--back">
          <Link href="/login">
            <ArrowLeft /> Volver al inicio de sesión
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
