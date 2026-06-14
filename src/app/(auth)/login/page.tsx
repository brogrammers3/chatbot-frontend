'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const schema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
          <CardDescription>Accede a tu panel de chatbots</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@empresa.com" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" type="password" placeholder="Tu contraseña" {...register('password')} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            {needsConfirm && (
              <button
                type="button"
                onClick={resendConfirmation}
                className="mx-auto block text-sm text-blue-600 hover:underline"
              >
                Reenviar correo de confirmación
              </button>
            )}
            {resent && (
              <p className="text-sm text-green-600 text-center">
                Te reenviamos el correo de confirmación.
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
