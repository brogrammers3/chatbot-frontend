'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircleMore, ArrowRight } from 'lucide-react'

/**
 * Navbar de la landing: sombra al hacer scroll, menú móvil (hamburguesa)
 * y acciones conscientes de sesión. El estado de sesión llega desde el
 * Server Component (`authed`), que lo lee de Supabase.
 */
export function LandingNav({ authed }: { authed: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Sombra del navbar al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cerrar el menú con Escape y al pasar a desktop
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const mq = window.matchMedia('(min-width: 880px)')
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onChange)
    return () => {
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onChange)
    }
  }, [open])

  const brand = (
    <>
      <span className="brand__mark" aria-hidden="true">
        <MessageCircleMore />
      </span>
      <span>
        <b>Smart</b>Support
      </span>
    </>
  )

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`} id="nav">
      <div className="nav__inner">
        <Link href="/" className="brand" aria-label="SmartSupport, inicio">
          {brand}
        </Link>

        <nav className="nav__links" aria-label="Principal">
          <a href="#features">Características</a>
          <a href="#pricing">Precios</a>
          <a href="#how">Cómo funciona</a>
        </nav>

        {/* Acciones conscientes de sesión (desktop) */}
        {authed ? (
          <div className="nav__actions">
            <Link href="/dashboard" className="btn btn--primary">
              Ir al Dashboard
              <ArrowRight />
            </Link>
          </div>
        ) : (
          <div className="nav__actions">
            <Link href="/login" className="btn btn--ghost">
              Iniciar sesión
            </Link>
            <Link href="/register" className="btn btn--primary">
              Crear cuenta
            </Link>
          </div>
        )}

        <button
          className="nav__burger"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobileMenu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <svg className="icon-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* menú móvil */}
      <div className={`mobile-menu${open ? ' is-open' : ''}`} id="mobileMenu">
        <a href="#features" className="m-link" onClick={() => setOpen(false)}>
          Características
        </a>
        <a href="#pricing" className="m-link" onClick={() => setOpen(false)}>
          Precios
        </a>
        <a href="#how" className="m-link" onClick={() => setOpen(false)}>
          Cómo funciona
        </a>
        {authed ? (
          <div className="m-actions">
            <Link href="/dashboard" className="btn btn--primary btn--block btn--lg" onClick={() => setOpen(false)}>
              Ir al Dashboard
            </Link>
          </div>
        ) : (
          <div className="m-actions">
            <Link href="/login" className="btn btn--outline btn--block btn--lg" onClick={() => setOpen(false)}>
              Iniciar sesión
            </Link>
            <Link href="/register" className="btn btn--primary btn--block btn--lg" onClick={() => setOpen(false)}>
              Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
