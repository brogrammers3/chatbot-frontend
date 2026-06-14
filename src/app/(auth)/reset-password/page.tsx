'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CircleAlert, CircleCheckBig } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthShell, type AsideContent } from '@/components/auth/auth-shell'

const schema = z
  .object({
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
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
  headline: 'Una contraseña nueva y segura.',
  sub: 'Tras actualizarla, cerraremos las demás sesiones activas para mantener tu cuenta protegida.',
  trust: ['Cifrado en tránsito y en reposo', 'Aislamiento seguro por empresa'],
}

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
    // El cliente de navegador establece la sesión de recuperación al cargar la
    // página desde el enlace del correo (detectSessionInUrl). updateUser la usa.
    const { error } = await supabase.auth.updateUser({ password: data.password })

    if (error) {
      setError(
        'No se pudo actualizar la contraseña. El enlace puede haber caducado; solicita uno nuevo desde "¿Olvidaste tu contraseña?".',
      )
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <AuthShell aside={aside}>
        <div className="auth__success">
          <div className="auth__success-icon" aria-hidden="true">
            <CircleCheckBig />
          </div>
          <h1>Contraseña actualizada</h1>
          <p>Tu contraseña se cambió correctamente. Ya puedes iniciar sesión con tu nueva contraseña.</p>
          <Link
            href="/login"
            className="btn btn--primary btn--lg auth__submit"
            style={{ marginTop: 24 }}
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell aside={aside}>
      <div className="auth__head">
        <h1>Restablecer contraseña</h1>
        <p>Crea una nueva contraseña para tu cuenta. Asegúrate de que sea segura.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={`field${errors.password ? ' is-invalid' : ''}`}>
          <label htmlFor="password">Nueva contraseña</label>
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

        {error && (
          <div className="auth__error">
            <CircleAlert /> {error}
          </div>
        )}

        <button type="submit" className="btn btn--primary btn--lg auth__submit" disabled={loading}>
          {loading ? 'Actualizando…' : 'Actualizar contraseña'}
        </button>
      </form>
    </AuthShell>
  )
}
