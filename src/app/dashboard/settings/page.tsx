import { Building2, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader, PendingNote, Badge } from '@/components/dashboard/ui'

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Configuración" description="Ajustes de tu empresa y plan." />

      <PendingNote>
        Vista preliminar. El perfil se guardará en la tabla <code>companies</code>.
      </PendingNote>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" />
              <CardTitle>Perfil de empresa</CardTitle>
            </div>
            <CardDescription>Nombre y URL pública de tu organización.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid max-w-md gap-5">
              <div className="grid gap-1.5">
                <Label htmlFor="company">Nombre de la empresa</Label>
                <Input id="company" defaultValue="Acme Corp" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="slug">URL (slug)</Label>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>smartsupport.app/</span>
                  <Input id="slug" defaultValue="acme" className="max-w-[180px]" />
                </div>
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
              <CreditCard className="size-4 text-muted-foreground" />
              <CardTitle>Plan y facturación</CardTitle>
            </div>
            <CardDescription>Tu plan actual y opciones de actualización.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Plan Base</span>
                  <Badge tone="info">Actual</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  GPT-5.4 mini · soporte general de alto volumen.
                </p>
              </div>
              <Button variant="outline" disabled title="La facturación llegará en un Sprint futuro">
                Cambiar a Pro
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              La activación de pago aún no está disponible (placeholder).
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
