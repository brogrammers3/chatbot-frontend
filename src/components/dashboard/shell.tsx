'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Bot,
  MessagesSquare,
  Users,
  Settings,
  CircleUser,
  MessageCircleMore,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { LogoutButton } from './logout-button'

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }

const nav: NavItem[] = [
  { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/chatbots', label: 'Chatbots', icon: Bot },
  { href: '/dashboard/conversations', label: 'Conversaciones', icon: MessagesSquare },
  { href: '/dashboard/team', label: 'Equipo', icon: Users },
  { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
  { href: '/dashboard/account', label: 'Mi cuenta', icon: CircleUser },
]

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1 tracking-tight">
      <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
        <MessageCircleMore className="size-[18px]" />
      </span>
      <span className="text-[15px]">
        <span className="font-bold">Smart</span>Support
      </span>
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
      {nav.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-blue-50 text-blue-700'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function UserFooter({ user }: { user: { name: string; email: string } }) {
  return (
    <div className="border-t p-2">
      <div className="flex items-center gap-2 px-2 py-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground uppercase">
          {user.name.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{user.name}</div>
          <div className="truncate text-xs text-muted-foreground">{user.email}</div>
        </div>
      </div>
      <LogoutButton />
    </div>
  )
}

export function DashboardShell({
  user,
  children,
}: {
  user: { name: string; email: string }
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Cerrar el drawer al navegar
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="min-h-svh bg-background">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-muted/20 md:flex">
        <div className="px-3 py-3">
          <Brand />
        </div>
        <NavLinks />
        <UserFooter user={user} />
      </aside>

      {/* Drawer (móvil) */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r bg-background shadow-xl">
            <div className="flex items-center justify-between px-3 py-3">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <UserFooter user={user} />
          </aside>
        </div>
      )}

      {/* Topbar (móvil) */}
      <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur md:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
        >
          <Menu className="size-5" />
        </button>
        <Brand />
      </header>

      {/* Contenido */}
      <main className="md:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  )
}
