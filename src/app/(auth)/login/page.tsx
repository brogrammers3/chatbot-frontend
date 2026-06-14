'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Check, CircleAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthShell, type AsideContent } from '@/components/auth/auth-shell'

const schema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

type FormData = z.infer<typeof schema>

const aside: AsideContent = {
  headline: 'Tu asistente con IA, entrenado con los documentos de tu empresa.',
  sub: 'Respuestas precisas basadas en tus PDFs y manuales. Gestiónalo todo desde un solo panel.',
  chat: [
    { who: 'user', text: '¿Cuántos días de vacaciones tiene un empleado nuevo?' },
    {
      who: 'bot',
      text: (
        <>
          Un empleado nuevo acumula <strong>15 días hábiles</strong> durante su primer año.
        </>
      ),
      cite: 'Manual_RRHH.pdf · pág. 12',
    },
  ],
  trust: ['Aislamiento seguro por empresa', 'Listo en minutos'],
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const [resent, setResent] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)
    setNeedsConfirm(false)
    setResent(false)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      if (error.code === 'email_not_confirmed') {
        setError('Tu correo aún no está confirmado. Revisa tu bandeja de entrada y haz clic en el enlace de verificación.')
        setNeedsConfirm(true)
      } else if (error.code === 'invalid_credentials' || !error.code) {
        setError('Correo o contraseña incorrectos')
      } else {
        setError(error.message || 'No se pudo iniciar sesión. Inténtalo de nuevo.')
      }
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  async function resendConfirmation() {
    const email = getValues('email')
    if (!email) return
    const supabase = createClient()
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    if (!error) {
      setResent(true)
      setNeedsConfirm(false)
    }
  }

  return (
    <AuthShell aside={aside}>
      <div className="auth__head">
        <h1>Iniciar sesión</h1>
        <p>Accede a tu panel para gestionar tus chatbots.</p>
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

        <div className={`field${errors.password ? ' is-invalid' : ''}`}>
          <div className="field__label-row">
            <label htmlFor="password">Contraseña</label>
            <Link href="/forgot-password" className="field__hint-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="input-wrap">
            <Lock className="lead" />
            <input
              className="input has-toggle"
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              aria-invalid={errors.password ? 'true' : undefined}
              {...register('password')}
            />
            <button
              type="button"
              className="toggle-pw"
              aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={showPw}
              onClick={() => setShowPw((v) => !v)}
            >
              <Eye className="icon-on" />
              <EyeOff className="icon-off" />
            </button>
          </div>
          {errors.password && (
            <span className="field__error">
              <CircleAlert /> {errors.password.message}
            </span>
          )}
        </div>

        <label className="check">
          <input type="checkbox" id="remember" name="remember" />
          <span className="check__box" aria-hidden="true">
            <Check />
          </span>
          <span className="check__text">Mantener sesión iniciada en este dispositivo</span>
        </label>

        {error && (
          <div className="auth__error">
            <CircleAlert /> {error}
          </div>
        )}
        {needsConfirm && (
          <button type="button" className="auth__resend" onClick={resendConfirmation}>
            Reenviar correo de confirmación
          </button>
        )}
        {resent && <p className="auth__ok">Te reenviamos el correo de confirmación.</p>}

        <button type="submit" className="btn btn--primary btn--lg auth__submit" disabled={loading}>
          {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </button>

        <p className="auth__alt">
          ¿No tienes cuenta? <Link href="/register">Regístrate gratis</Link>
        </p>
      </form>
    </AuthShell>
  )
}
