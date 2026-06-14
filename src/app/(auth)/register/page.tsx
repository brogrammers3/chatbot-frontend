'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff, Check, CircleAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthShell, type AsideContent } from '@/components/auth/auth-shell'

const schema = z
  .object({
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Ingresa un email válido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, 'Debes aceptar los términos y la política de privacidad'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

const levels = ['', 'Débil', 'Aceptable', 'Buena', 'Excelente']

function scorePassword(v: string) {
  if (!v) return 0
  let s = 0
  if (v.length >= 8) s++
  if (v.length >= 12) s++
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++
  if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) s++
  return Math.min(s, 4)
}

const aside: AsideContent = {
  headline: 'Crea tu chatbot empresarial en 3 pasos.',
  sub: 'Sube tus documentos, configura tu asistente y embébelo en tu sitio. Sin escribir código.',
  chat: [
    { who: 'user', text: '¿El plan Pro soporta contratos legales largos?' },
    {
      who: 'bot',
      text: (
        <>
          Sí. El plan Pro usa <strong>Claude Sonnet 4.6</strong>, ideal para documentos de +50 páginas.
        </>
      ),
      cite: 'Planes_SmartSupport.pdf',
    },
  ],
  trust: ['Sin tarjeta de crédito', 'Aislamiento seguro por empresa'],
}

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const passwordValue = watch('password') ?? ''
  const score = scorePassword(passwordValue)

  async function onSubmit(data: FormData) {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Si el proyecto exige confirmación de email, signUp no crea sesión.
    if (!result?.session) {
      setConfirmSent(true)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  if (confirmSent) {
    return (
      <AuthShell aside={aside}>
        <div className="auth__notice">
          <div className="auth__notice-icon">
            <Mail />
          </div>
          <div className="auth__head">
            <h1>Confirma tu correo</h1>
            <p>
              Te enviamos un enlace de verificación. Ábrelo para activar tu cuenta y luego inicia
              sesión.
            </p>
          </div>
          <p className="auth__alt">
            <Link href="/login">Volver al inicio de sesión</Link>
          </p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell aside={aside}>
      <div className="auth__head">
        <h1>Crear cuenta</h1>
        <p>Empieza a construir tu chatbot empresarial. Sin tarjeta de crédito.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={`field${errors.fullName ? ' is-invalid' : ''}`}>
          <label htmlFor="fullName">Nombre completo</label>
          <div className="input-wrap">
            <User className="lead" />
            <input
              className="input"
              id="fullName"
              type="text"
              placeholder="Juan Pérez"
              autoComplete="name"
              aria-invalid={errors.fullName ? 'true' : undefined}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <span className="field__error">
              <CircleAlert /> {errors.fullName.message}
            </span>
          )}
        </div>

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
          <label htmlFor="password">Contraseña</label>
          <div className="input-wrap">
            <Lock className="lead" />
            <input
              className="input has-toggle"
              id="password"
              type={showPw ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
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
          {passwordValue && (
            <div className="pw-strength show" data-level={score}>
              <div className="pw-strength__track">
                <span className="pw-strength__seg" />
                <span className="pw-strength__seg" />
                <span className="pw-strength__seg" />
                <span className="pw-strength__seg" />
              </div>
              <div className="pw-strength__label">
                {score ? `Seguridad: ${levels[score]}` : 'Seguridad de la contraseña'}
              </div>
            </div>
          )}
          {errors.password && (
            <span className="field__error">
              <CircleAlert /> {errors.password.message}
            </span>
          )}
        </div>

        <div className={`field${errors.confirmPassword ? ' is-invalid' : ''}`}>
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <div className="input-wrap">
            <Lock className="lead" />
            <input
              className="input has-toggle"
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              aria-invalid={errors.confirmPassword ? 'true' : undefined}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="toggle-pw"
              aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={showConfirm}
              onClick={() => setShowConfirm((v) => !v)}
            >
              <Eye className="icon-on" />
              <EyeOff className="icon-off" />
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="field__error">
              <CircleAlert /> {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <label className={`check${errors.terms ? ' is-invalid' : ''}`}>
          <input type="checkbox" id="terms" {...register('terms')} />
          <span className="check__box" aria-hidden="true">
            <Check />
          </span>
          <span className="check__text">
            Acepto los <Link href="#">Términos</Link> y la <Link href="#">Política de privacidad</Link>{' '}
            de SmartSupport.
          </span>
        </label>
        {errors.terms && (
          <span className="field__error" style={{ display: 'flex', marginTop: '-10px', marginBottom: '16px' }}>
            <CircleAlert /> {errors.terms.message}
          </span>
        )}

        {error && (
          <div className="auth__error">
            <CircleAlert /> {error}
          </div>
        )}

        <button type="submit" className="btn btn--primary btn--lg auth__submit" disabled={loading}>
          {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p className="auth__alt">
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
        </p>
      </form>
    </AuthShell>
  )
}
