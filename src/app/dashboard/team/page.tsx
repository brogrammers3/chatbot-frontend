import { UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { PageHeader, PendingNote, Badge } from '@/components/dashboard/ui'

export default async function TeamPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const myName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'Tú'
  const myEmail = user?.email ?? ''

  const members = [
    { name: myName, email: myEmail, role: 'Propietario', tone: 'info' as const, you: true },
    { name: 'María González', email: 'maria@empresa.com', role: 'Administrador', tone: 'neutral' as const, you: false },
    { name: 'Carlos Ruiz', email: 'carlos@empresa.com', role: 'Miembro', tone: 'neutral' as const, you: false },
  ]

  return (
    <>
      <PageHeader
        title="Equipo"
        description="Gestiona quién tiene acceso a tu empresa en SmartSupport."
        action={
          <Button disabled title="Se habilitará al conectar el backend">
            <UserPlus /> Invitar miembro
          </Button>
        }
      />

      <PendingNote>
        Datos de ejemplo (excepto tu usuario). Los miembros se leerán de <code>users</code> filtrados
        por <code>company_id</code>.
      </PendingNote>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Miembro</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {members.map((m, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground uppercase">
                      {(m.name || '??').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {m.name} {m.you && <span className="text-xs text-muted-foreground">(tú)</span>}
                      </div>
                      <div className="text-xs text-muted-foreground sm:hidden">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{m.email}</td>
                <td className="px-4 py-3">
                  <Badge tone={m.tone}>{m.role}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
