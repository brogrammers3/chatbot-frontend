'use client'

import { useEffect } from 'react'

/**
 * Aplica la clase `.in` a los elementos `.reveal` cuando entran al viewport,
 * disparando la animación de aparición. No renderiza nada.
 */
export function RevealOnScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = Array.from(document.querySelectorAll<HTMLElement>('.ss-landing .reveal'))

    if (reduce) {
      els.forEach((el) => el.classList.add('in'))
      return
    }

    let pending = els
    const check = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight
      pending = pending.filter((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < vh * 0.92 && r.bottom > 0) {
          el.classList.add('in')
          return false
        }
        return true
      })
    }

    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check, { passive: true })
    // Fallback: revelar todo si algo impide el cálculo.
    const fallback = setTimeout(() => els.forEach((el) => el.classList.add('in')), 2500)

    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      clearTimeout(fallback)
    }
  }, [])

  return null
}
