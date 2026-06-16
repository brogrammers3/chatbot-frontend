'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Bot,
  MessagesSquare,
  Users,
  Settings,
  CircleUserRound,
  LogOut,
  MessageCircleMore,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import '@/app/dashboard/dashboard.css'

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }

const nav: NavItem[] = [
  { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/chatbots', label: 'Chatbots', icon: Bot },
  { href: '/dashboard/conversations', label: 'Conversaciones', icon: MessagesSquare },
  { href: '/dashboard/team', label: 'Equipo', icon: Users },
  { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
  { href: '/dashboard/account', label: 'Mi cuenta', icon: CircleUserRound },
]

export function AppShell({
  user,
  children,
}: {
  user: { name: string; email: string; initials: string }
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function onLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="ss-dash">
      <div className="app">
        <aside className="side">
          <Link href="/dashboard" className="brand side__brand" aria-label="SmartSupport, inicio">
            <span className="brand__mark" aria-hidden="true">
              <MessageCircleMore />
            </span>
            <span>
              <b>Smart</b>Support
            </span>
          </Link>

          <nav className="side__nav" aria-label="Navegación principal">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`side__link${active ? ' is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="side__spacer" />

          <div className="side__user">
            <div className="side__user-row">
              <span className="avatar" aria-hidden="true">
                {user.initials}
              </span>
              <span className="side__user-meta">
                <span className="name">{user.name}</span>
                <span className="email">{user.email}</span>
              </span>
            </div>
            <button type="button" className="side__logout" onClick={onLogout}>
              <LogOut />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="main">{children}</main>
      </div>
    </div>
  )
}
