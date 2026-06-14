import { PageHeader, PendingNote } from '@/components/dashboard/ui'

const rows = [
  { chatbot: 'Soporte de Producto', session: 'sesión #a1b2', last: '¿Cómo restablezco mi contraseña?', date: 'Hoy, 10:24' },
  { chatbot: 'Asistente de RRHH', session: 'sesión #c3d4', last: '¿Cuántos días de vacaciones tengo este año?', date: 'Ayer, 16:02' },
  { chatbot: 'Soporte de Producto', session: 'sesión #e5f6', last: 'No me llega el correo de verificación', date: '12 jun, 09:41' },
]

export default function ConversationsPage() {
  return (
    <>
      <PageHeader
        title="Conversaciones"
        description="Historial de interacciones de tus usuarios con los chatbots."
      />

      <PendingNote>
        Datos de ejemplo. Se leerá de la tabla <code>messages</code> agrupada por sesión.
      </PendingNote>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Chatbot</th>
              <th className="px-4 py-3 font-medium">Sesión</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Último mensaje</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{r.chatbot}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.session}</td>
                <td className="hidden max-w-xs truncate px-4 py-3 text-muted-foreground sm:table-cell">
                  {r.last}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
