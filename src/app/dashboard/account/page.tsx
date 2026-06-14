import { KeyRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader, PendingNote } from '@/components/dashboard/ui'

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? ''
  const email = user?.email ?? ''

  return (
    <>
      <PageHeader title="Mi cuenta" description="Tu perfil personal y seguridad." />

      <PendingNote>
        El correo proviene de tu sesión real de Supabase. Guardar cambios se habilitará al conectar el
        backend.
      </PendingNote>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Tu información personal.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid max-w-md gap-5">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" defaultValue={fullName} placeholder="Tu nombre" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" defaultValue={email} readOnly className="bg-muted/40" />
                <p className="text-xs text-muted-foreground">El correo no se puede cambiar por ahora.</p>
              </div>
              <div>
                <Button type="button" disabled title="Se habilitará al conectar el backend">
                  Guardar cambios
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="size-4 text-muted-foreground" />
              <CardTitle>Seguridad</CardTitle>
            </div>
            <CardDescription>Gestiona el acceso a tu cuenta.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" disabled title="Se habilitará al conectar el backend">
              Cambiar contraseña
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
