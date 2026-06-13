import './landing.css'

import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Sparkle,
  Sparkles,
  ArrowRight,
  Play,
  Check,
  LayoutGrid,
  FileText,
  CodeXml,
  Cpu,
  LayoutDashboard,
  History,
  ShieldCheck,
  Loader,
  Clock,
  Bot,
  MessageCircleMore,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { LandingNav } from '@/components/landing/landing-nav'
import { HeroChat } from '@/components/landing/hero-chat'
import { RevealOnScroll } from '@/components/landing/reveal-on-scroll'

export const metadata: Metadata = {
  title: 'SmartSupport — Chatbots empresariales con IA, entrenados con tus documentos',
  description:
    'Crea tu chatbot empresarial con IA entrenado con tus PDFs y manuales. Respuestas precisas mediante RAG, integrable en tu sitio en minutos.',
}

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const authed = !!user

  return (
    <div className="ss-landing">
      <LandingNav authed={authed} />

      <main id="top">
        {/* ====================== HERO ====================== */}
        <section className="hero">
          <div className="hero__bg" aria-hidden="true">
            <div className="glow glow-1" />
            <div className="glow glow-2" />
            <div className="grid-mask" />
          </div>
          <div className="container hero__inner">
            <div className="hero__copy">
              <span className="eyebrow reveal">
                <Sparkle />
                Asistente con IA · RAG
              </span>
              <h1 className="reveal" data-d="1">
                Crea tu chatbot empresarial con IA,{' '}
                <span className="grad-text">entrenado con tus propios documentos.</span>
              </h1>
              <p className="hero__sub reveal" data-d="2">
                Sube tus PDFs y manuales y obtén un asistente virtual que responde con
                precisión sobre la información de tu empresa. Intégralo en tu sitio en minutos.
              </p>
              <div className="hero__cta reveal" data-d="3">
                <Link href="/register" className="btn btn--primary btn--lg">
                  Empezar gratis
                  <ArrowRight />
                </Link>
                <a href="#how" className="btn btn--outline btn--lg">
                  <Play />
                  Ver cómo funciona
                </a>
              </div>
              <ul className="hero__trust reveal" data-d="4">
                <li>
                  <span className="tick">
                    <Check />
                  </span>
                  Aislamiento seguro por empresa
                </li>
                <li>
                  <span className="tick">
                    <Check />
                  </span>
                  Sin tarjeta de crédito
                </li>
                <li>
                  <span className="tick">
                    <Check />
                  </span>
                  Listo en minutos
                </li>
              </ul>
            </div>

            <HeroChat />
          </div>
        </section>

        {/* ====================== PROOF STRIP ====================== */}
        <div className="proof container">
          <p className="reveal">Equipos que confían en su documentación</p>
          <div className="proof__row reveal" data-d="1" aria-hidden="true">
            <span>Acme Corp</span>
            <span>Nordhaven</span>
            <span>Vértice</span>
            <span>Lumio</span>
            <span>Datentro</span>
          </div>
        </div>

        {/* ====================== CARACTERÍSTICAS ====================== */}
        <section className="section section--alt" id="features">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow reveal">
                <LayoutGrid />
                Características
              </span>
              <h2 className="reveal" data-d="1">
                Todo lo que necesitas para un asistente que <em>sí</em> sabe de tu empresa
              </h2>
              <p className="reveal" data-d="2">
                Funcionalidades pensadas para administradores: configura, publica y mejora tu
                chatbot sin escribir código.
              </p>
            </div>

            <div className="features__grid">
              <article className="feature reveal">
                <div className="feature__icon">
                  <FileText />
                </div>
                <h3>Entrenado con tus documentos</h3>
                <p>El chatbot responde usando tus PDFs y manuales reales mediante búsqueda semántica (RAG).</p>
              </article>

              <article className="feature reveal" data-d="1">
                <div className="feature__icon">
                  <CodeXml />
                </div>
                <h3>Widget embebible</h3>
                <p>Intégralo en tu web con un link o un snippet de código. Sin desarrollo complejo.</p>
              </article>

              <article className="feature reveal" data-d="2">
                <div className="feature__icon">
                  <Cpu />
                </div>
                <h3>Dos modelos de IA según tu plan</h3>
                <p>GPT-5.4 mini para soporte general de alto volumen; Claude Sonnet 4.6 para documentos técnicos y legales extensos.</p>
              </article>

              <article className="feature reveal" data-d="1">
                <div className="feature__icon">
                  <LayoutDashboard />
                </div>
                <h3>Gestión sin código</h3>
                <p>Crea, configura y publica chatbots desde un panel simple.</p>
              </article>

              <article className="feature reveal" data-d="2">
                <div className="feature__icon">
                  <History />
                </div>
                <h3>Historial de conversaciones</h3>
                <p>Revisa cómo interactúan tus usuarios con el asistente.</p>
              </article>

              <article className="feature reveal" data-d="3">
                <div className="feature__icon">
                  <ShieldCheck />
                </div>
                <h3>Aislamiento seguro por empresa</h3>
                <p>Cada tenant está aislado: tus datos y los de tus usuarios nunca se cruzan con los de otra empresa.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ====================== CÓMO FUNCIONA ====================== */}
        <section className="section" id="how">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow reveal">
                <Loader />
                Cómo funciona
              </span>
              <h2 className="reveal" data-d="1">
                De tus documentos a un asistente en vivo, en 3 pasos
              </h2>
              <p className="reveal" data-d="2">
                Sin infraestructura, sin pipelines de datos. Tú subes, nosotros nos encargamos del resto.
              </p>
            </div>

            <div className="steps">
              <div className="step reveal">
                <div className="step__connector" aria-hidden="true" />
                <div className="step__num">1</div>
                <h3>Sube tus documentos</h3>
                <p>Arrastra tus PDFs, manuales y políticas. Generamos los embeddings automáticamente.</p>
              </div>
              <div className="step reveal" data-d="1">
                <div className="step__connector" aria-hidden="true" />
                <div className="step__num">2</div>
                <h3>Configura tu chatbot</h3>
                <p>Define nombre, tono, mensaje de bienvenida y el modelo de IA según tu plan.</p>
              </div>
              <div className="step reveal" data-d="2">
                <div className="step__num">3</div>
                <h3>Embébelo en tu sitio</h3>
                <p>Copia el snippet o comparte el link. Tu asistente queda activo en minutos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================== PRECIOS ====================== */}
        <section className="section section--alt" id="pricing">
          <div className="container">
            <div className="section-head">
              <span className="pricing__note reveal">
                <Clock />
                Precios referenciales · Próximamente
              </span>
              <h2 className="reveal" data-d="1">
                Planes pensados para cada tipo de documentación
              </h2>
              <p className="reveal" data-d="2">
                Estos precios son un marcador para Sprints futuros. La activación de pago aún no está disponible.
              </p>
            </div>

            <div className="plans">
              {/* Plan Base */}
              <article className="plan reveal">
                <div className="plan__name">Plan Base</div>
                <p className="plan__desc">Ideal para soporte general de alto volumen.</p>
                <span className="plan__model">
                  <Bot />
                  GPT-5.4 mini
                </span>
                <div className="plan__price">
                  <span className="soon">Próximamente</span>
                  <span className="tag">/ mes</span>
                </div>
                <ul className="plan__list">
                  <li>
                    <span className="tick">
                      <Check />
                    </span>
                    Chatbot entrenado con tus documentos
                  </li>
                  <li>
                    <span className="tick">
                      <Check />
                    </span>
                    Widget embebible (link + snippet)
                  </li>
                  <li>
                    <span className="tick">
                      <Check />
                    </span>
                    Respuestas de alto volumen
                  </li>
                  <li>
                    <span className="tick">
                      <Check />
                    </span>
                    Historial de conversaciones
                  </li>
                </ul>
                <button className="btn btn--outline btn--block btn--lg" disabled aria-disabled="true">
                  Empezar
                </button>
                <p className="plan__disabled-hint">Disponible en un Sprint futuro</p>
              </article>

              {/* Plan Pro */}
              <article className="plan plan--pro reveal" data-d="1">
                <span className="plan__badge">
                  <Sparkles />
                  Recomendado
                </span>
                <div className="plan__name">Plan Pro</div>
                <p className="plan__desc">Para manuales técnicos, contratos legales y políticas de +50 páginas.</p>
                <span className="plan__model">
                  <Bot />
                  Claude Sonnet 4.6
                </span>
                <div className="plan__price">
                  <span className="soon">Próximamente</span>
                  <span className="tag">/ mes</span>
                </div>
                <ul className="plan__list">
                  <li>
                    <span className="tick">
                      <Check />
                    </span>
                    Todo lo del Plan Base
                  </li>
                  <li>
                    <span className="tick">
                      <Check />
                    </span>
                    Razonamiento sobre documentos extensos
                  </li>
                  <li>
                    <span className="tick">
                      <Check />
                    </span>
                    Mayor precisión en textos legales y técnicos
                  </li>
                  <li>
                    <span className="tick">
                      <Check />
                    </span>
                    Citas a la fuente en cada respuesta
                  </li>
                  <li>
                    <span className="tick">
                      <Check />
                    </span>
                    Soporte prioritario
                  </li>
                </ul>
                <button className="btn btn--primary btn--block btn--lg" disabled aria-disabled="true">
                  Empezar
                </button>
                <p className="plan__disabled-hint">Disponible en un Sprint futuro</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* ====================== FOOTER ====================== */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <Link href="/" className="brand">
                <span className="brand__mark" aria-hidden="true">
                  <MessageCircleMore />
                </span>
                <span>
                  <b>Smart</b>Support
                </span>
              </Link>
              <p className="footer__tagline">
                Chatbots empresariales con IA, entrenados con los documentos de tu empresa.
                Precisos, seguros y listos en minutos.
              </p>
              <div className="footer__social">
                <a href="#" aria-label="X (Twitter)">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                  </svg>
                </a>
                <a href="#" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              </div>
            </div>

            <nav className="footer__col" aria-label="Producto">
              <h4>Producto</h4>
              <ul>
                <li><a href="#features">Características</a></li>
                <li><a href="#pricing">Precios</a></li>
                <li><a href="#how">Cómo funciona</a></li>
              </ul>
            </nav>

            <nav className="footer__col" aria-label="Empresa">
              <h4>Empresa</h4>
              <ul>
                <li><a href="#">Sobre nosotros</a></li>
                <li><a href="#">Contacto</a></li>
              </ul>
            </nav>

            <nav className="footer__col" aria-label="Legal">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacidad</a></li>
                <li><a href="#">Términos</a></li>
              </ul>
            </nav>
          </div>

          <div className="footer__bottom">
            <span>© 2026 SmartSupport. Todos los derechos reservados.</span>
            <span className="made">Hecho para equipos que viven de su documentación.</span>
          </div>
        </div>
      </footer>

      <RevealOnScroll />
    </div>
  )
}
