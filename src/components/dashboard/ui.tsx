import type { ReactNode } from 'react'
import { Wrench } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/** Encabezado de página con título, descripción opcional y acción a la derecha. */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/** Aviso de que la vista es preliminar y aún no está conectada al backend. */
export function PendingNote({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
      <Wrench className="mt-0.5 size-4 shrink-0" />
      <p>{children}</p>
    </div>
  )
}

/** Etiqueta de estado (placeholder visual). */
export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'info'
  className?: string
}) {
  const tones = {
    neutral: 'bg-muted text-muted-foreground',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    info: 'bg-blue-50 text-blue-700',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Tarjeta de métrica para el resumen. */
export function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode
  label: string
  value: ReactNode
  hint?: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 [&_svg]:size-5">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-semibold tracking-tight">{value}</div>
          <div className="truncate text-xs text-muted-foreground">{hint ?? label}</div>
        </div>
      </CardContent>
    </Card>
  )
}

/** Estado vacío reutilizable. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6">
        {icon}
      </div>
      <h3 className="mt-4 font-medium">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
