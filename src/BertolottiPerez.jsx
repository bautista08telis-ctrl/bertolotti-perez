import React, { useState } from 'react';
import AutomotiveScanner3D from './AutomotiveScanner3D.jsx';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Cpu,
  ExternalLink,
  Gauge,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Helvetica Neue", sans-serif';

const GLASS_PANEL =
  'backdrop-blur-2xl bg-neutral-950/80 border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_20px_50px_rgba(0,0,0,0.55)]';

const GLASS_SUBTLE =
  'backdrop-blur-xl bg-white/[0.04] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507]';

const WHATSAPP_NUMBER_DISPLAY = '098 900 969';
const WHATSAPP_URL = `https://wa.me/59898900969?text=${encodeURIComponent(
  'Hola, necesito agendar un servicio para mi auto...'
)}`;
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=19+de+Abril+1024,+20000+Maldonado,+Uruguay';

const NAV_LINKS = [
  { href: '#diagnostico', label: 'Diagnóstico' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#resenas', label: 'Reseñas' },
  { href: '#contacto', label: 'Contacto' },
];

const SCAN_POINTS = [
  {
    id: 'motor',
    label: 'Diagnóstico de motor',
    subsystem: 'Propulsión & Inyección',
    detail: 'Lectura electrónica de parámetros, compresión, refrigeración y kit de distribución.',
    status: 'Óptimo',
  },
  {
    id: 'chasis',
    label: 'Chasis alineado',
    subsystem: 'Geometría & Frenos',
    detail: 'Verificación milimétrica de bastidor, tren delantero, suspensión y desgaste parejo.',
    status: 'En tolerancia',
  },
  {
    id: 'electronica',
    label: 'Electrónica OK',
    subsystem: 'Centralita & Red CAN',
    detail: 'Escaneo integral de sensores, módulos ABS/ESP, batería y gestión eléctrica en el día.',
    status: 'Sin fallas',
  },
];

const REVIEWS = [
  {
    id: 'review-electrico',
    quote: 'Excelente atención, solucionaron el problema eléctrico en el día.',
    category: 'Diagnóstico y electricidad',
  },
  {
    id: 'review-chapa',
    quote: 'El mejor taller de chapa y pintura de Maldonado, quedó como nuevo.',
    category: 'Chapa y pintura',
  },
];

const MECHANIC_PILLARS = [
  'Mantenimiento preventivo',
  'Frenos y seguridad activa',
  'Distribución de precisión',
  'Diagnóstico computarizado',
];

function GoogleRatingStars() {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label="Calificación de 4.5 sobre 5 estrellas en Google"
    >
      {[0, 1, 2, 3].map((idx) => (
        <svg key={idx} viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 2.4l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.3l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.4z"
            fill="#FBBF24"
          />
        </svg>
      ))}
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <defs>
          <linearGradient id="bp-half-star" x1="0" y1="0" x2="1" y2="0">
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.16)" />
          </linearGradient>
        </defs>
        <path
          d="M12 2.4l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.3l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.4z"
          fill="url(#bp-half-star)"
        />
      </svg>
    </div>
  );
}

export default function BertolottiPerez() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scannerPaused, setScannerPaused] = useState(false);
  const [activePointId, setActivePointId] = useState('motor');
  const [copiedPhone, setCopiedPhone] = useState(false);

  const activePoint =
    SCAN_POINTS.find((point) => point.id === activePointId) || SCAN_POINTS[0];

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_NUMBER_DISPLAY);
      setCopiedPhone(true);
      window.setTimeout(() => setCopiedPhone(false), 2400);
    } catch {
      setCopiedPhone(false);
    }
  };

  return (
    <div
      style={{ fontFamily: FONT_STACK }}
      className="min-h-screen bg-[#050507] text-[#FBFBFD] overflow-x-clip relative selection:bg-[#06B6D4]/30 selection:text-[#FBFBFD]"
    >
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>

      {/* Iluminación de estudio ambiental muy sutil (cian / azul eléctrico) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 h-[540px] w-[900px] rounded-full bg-[#06B6D4]/[0.07] blur-[140px]" />
        <div className="absolute top-[38%] -right-40 h-[420px] w-[420px] rounded-full bg-[#3B82F6]/[0.06] blur-[130px]" />
      </div>

      <a
        href="#contenido"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] rounded-full bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-[#FBFBFD] ${FOCUS_RING}`}
      >
        Saltar al contenido principal
      </a>

      {/* 1. Barra de Navegación Flotante (Liquid Glass) */}
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none mx-auto max-w-6xl px-4 sm:px-6 pt-4">
        <nav
          aria-label="Navegación principal"
          className={`${GLASS_PANEL} pointer-events-auto rounded-full px-3 sm:px-5 py-2 flex items-center justify-between gap-3`}
        >
          <a
            href="#diagnostico"
            className={`flex items-center gap-2.5 min-h-[44px] rounded-full px-2 text-[#FBFBFD] transition-opacity hover:opacity-90 ${FOCUS_RING}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] border border-white/20 text-[#22D3EE]">
              <Gauge className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm sm:text-[15px] font-semibold tracking-tight whitespace-nowrap">
              Bertolotti &amp; Pérez
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`min-h-[44px] inline-flex items-center rounded-full px-3.5 text-[13px] font-medium text-[#A1A1A6] hover:text-[#FBFBFD] hover:bg-white/[0.06] transition-colors ${FOCUS_RING}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center justify-center gap-1.5 min-h-[40px] rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] border border-[#3B82F6]/60 shadow-[0_0_24px_rgba(59,130,246,0.35)] px-4 text-[13px] font-medium text-[#FBFBFD] transition-colors whitespace-nowrap ${FOCUS_RING}`}
            >
              Solicitar Turno
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="bp-mobile-nav"
              aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.06] border border-white/15 text-[#FBFBFD] hover:bg-white/[0.12] transition-colors ${FOCUS_RING}`}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div
            id="bp-mobile-nav"
            className={`${GLASS_PANEL} pointer-events-auto md:hidden mt-2.5 rounded-3xl p-4 flex flex-col gap-1`}
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`min-h-[44px] flex items-center justify-between rounded-2xl px-4 text-sm font-medium text-[#FBFBFD] hover:bg-white/[0.08] transition-colors ${FOCUS_RING}`}
              >
                <span>{item.label}</span>
                <ArrowRight className="h-4 w-4 text-[#86868B]" aria-hidden="true" />
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className={`mt-2 min-h-[44px] flex items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] border border-[#3B82F6]/60 px-5 text-sm font-medium text-[#FBFBFD] ${FOCUS_RING}`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Solicitar Turno por WhatsApp
            </a>
          </div>
        )}
      </header>

      <main id="contenido" className="relative z-10">
        {/* 2. Escáner Automotriz 3D en WebGL (Hero Section a pantalla completa) */}
        <section
          id="diagnostico"
          aria-labelledby="hero-title"
          className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-12 scroll-mt-0"
        >
          {/* Canvas WebGL transparente en posición absolute por detrás de la UI Liquid Glass */}
          <div
            role="img"
            aria-label="Modelo 3D interactivo de automóvil bajo escáner láser volumétrico con diagnóstico de motor, chasis y electrónica"
            className="absolute inset-0 z-0 h-full w-full"
          >
            <AutomotiveScanner3D paused={scannerPaused} activePointId={activePointId} />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 z-[1] bg-gradient-to-t from-[#050507] via-[#050507]/50 to-transparent"
          />

          {/* Interfaz Liquid Glass en primer plano */}
          <div className="relative z-10 pointer-events-none mx-auto w-full max-w-6xl flex-1 flex flex-col justify-between px-4 sm:px-6">
            {/* Cabecera HUD minimalista */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className={`${GLASS_PANEL} pointer-events-auto rounded-full px-4 py-2 flex items-center gap-2.5`}>
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    scannerPaused ? 'bg-[#86868B]' : 'bg-[#06B6D4] shadow-[0_0_10px_#06B6D4]'
                  }`}
                />
                <p className="text-[11px] sm:text-xs font-medium tracking-[0.06em] uppercase text-[#FBFBFD]">
                  Escáner Automotriz 3D · Maldonado
                </p>
              </div>

              <div className="pointer-events-auto flex items-center gap-2">
                <span
                  className={`${GLASS_SUBTLE} hidden md:inline-flex items-center rounded-full px-3.5 py-2 text-xs text-[#A1A1A6]`}
                >
                  Arrastrá el modelo 3D para rotar
                </span>
                <button
                  type="button"
                  aria-pressed={scannerPaused}
                  onClick={() => setScannerPaused((prev) => !prev)}
                  className={`${GLASS_PANEL} inline-flex items-center gap-1.5 min-h-[40px] rounded-full px-4 text-xs font-medium text-[#FBFBFD] hover:bg-white/[0.08] transition-colors ${FOCUS_RING}`}
                >
                  {scannerPaused ? (
                    <>
                      <Play className="h-3.5 w-3.5 text-[#22D3EE]" aria-hidden="true" />
                      <span>Reanudar</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-3.5 w-3.5 text-[#22D3EE]" aria-hidden="true" />
                      <span>Pausar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Ventana central despejada para visualizar y rotar el vehículo 3D */}
            <div aria-hidden="true" className="flex-1 min-h-[260px] sm:min-h-[340px]" />

            {/* Dock inferior Liquid Glass: Titular + Panel de puntos de escaneo 3D */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className={`${GLASS_PANEL} lg:col-span-7 pointer-events-auto rounded-[28px] p-6 sm:p-8`}>
                <h1
                  id="hero-title"
                  className="text-3xl sm:text-5xl md:text-[50px] font-semibold tracking-[-0.025em] leading-[1.06] text-[#FBFBFD]"
                >
                  Precisión tecnológica. Respaldo absoluto.
                </h1>
                <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-[#A1A1A6] max-w-2xl">
                  Servicio integral de mecánica, chapa y pintura en Maldonado. Más de{' '}
                  <span className="text-[#FBFBFD] font-medium tabular-nums">290</span> clientes avalan
                  nuestra calidad.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <a
                    href="#servicios"
                    className={`inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] border border-[#3B82F6]/60 shadow-[0_0_28px_rgba(59,130,246,0.38)] px-7 text-[15px] font-medium text-[#FBFBFD] transition-colors ${FOCUS_RING}`}
                  >
                    <span>Diagnosticar mi vehículo</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${GLASS_SUBTLE} inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full px-7 text-[15px] font-medium text-[#FBFBFD] hover:bg-white/[0.1] transition-colors ${FOCUS_RING}`}
                  >
                    <MessageCircle className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />
                    <span>WhatsApp Directo</span>
                  </a>
                </div>
              </div>

              <div className={`${GLASS_PANEL} lg:col-span-5 pointer-events-auto rounded-[28px] p-5 sm:p-6`}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#A1A1A6]">
                    Puntos de escaneo 3D
                  </p>
                  <span className="inline-flex items-center rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/40 px-2.5 py-0.5 text-[11px] font-semibold text-[#22D3EE]">
                    {activePoint.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                  {SCAN_POINTS.map((point) => {
                    const selected = activePointId === point.id;
                    return (
                      <button
                        key={point.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setActivePointId(point.id)}
                        className={`min-h-[44px] flex items-center justify-between rounded-2xl border px-3.5 py-2 text-left text-xs font-medium transition-colors ${
                          selected
                            ? 'bg-[#06B6D4]/15 border-[#22D3EE]/80 text-[#FBFBFD] shadow-[0_0_20px_rgba(6,182,212,0.22)]'
                            : 'bg-white/[0.04] border-white/15 text-[#A1A1A6] hover:text-[#FBFBFD] hover:bg-white/[0.08]'
                        } ${FOCUS_RING}`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={`h-2 w-2 rounded-full ${
                              selected
                                ? 'bg-[#22D3EE] shadow-[0_0_8px_#06B6D4]'
                                : 'bg-white/30'
                            }`}
                          />
                          <span>{point.label}</span>
                        </span>
                        <span className="text-[11px] text-[#22D3EE]">{point.status}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-white/10 text-xs">
                  <p className="font-semibold text-[#FBFBFD]">{activePoint.subsystem}</p>
                  <p className="mt-1 text-[#A1A1A6] leading-relaxed">{activePoint.detail}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        {/* 3. Bento Grid de Servicios Automotrices */}
        <section id="servicios" aria-labelledby="servicios-title" className="py-12 sm:py-16 scroll-mt-24">
          <div className="mb-8 sm:mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#22D3EE]">
              Áreas de especialidad
            </p>
            <h2
              id="servicios-title"
              className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[#FBFBFD]"
            >
              Ingeniería de taller en cada intervención.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Mecánica Avanzada — Tarjeta protagonista asimétrica */}
            <article
              className={`${GLASS_PANEL} md:col-span-7 md:row-span-2 rounded-[26px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[#3B82F6]/12 blur-3xl"
              />
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/15 text-[#22D3EE]">
                    <Wrench className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-white/[0.06] border border-white/15 px-3 py-1 text-xs font-medium text-[#A1A1A6]">
                    Taller integral
                  </span>
                </div>

                <h3 className="mt-6 text-2xl sm:text-[28px] font-semibold tracking-tight text-[#FBFBFD]">
                  Mecánica Avanzada
                </h3>
                <p className="mt-3 text-base sm:text-[17px] leading-relaxed text-[#86868B] max-w-xl">
                  Mantenimiento preventivo, frenos, distribución y diagnóstico computarizado.
                </p>

                <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MECHANIC_PILLARS.map((item) => (
                    <li
                      key={item}
                      className={`${GLASS_SUBTLE} rounded-2xl px-4 py-3 flex items-center gap-2.5 text-sm text-[#FBFBFD]`}
                    >
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-[#22D3EE]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#A1A1A6]">
                  Atención programada en Maldonado · Diagnóstico preciso antes de intervenir
                </span>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-sm font-medium text-[#22D3EE] hover:text-[#FBFBFD] transition-colors ${FOCUS_RING} rounded-full px-2 py-1`}
                >
                  <span>Consultar servicio</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </article>

            {/* Chapa y Pintura Profesional */}
            <article
              className={`${GLASS_PANEL} md:col-span-5 rounded-[26px] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/15 text-[#22D3EE]">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-white/[0.06] border border-white/15 px-3 py-1 text-xs font-medium text-[#A1A1A6]">
                    Terminación original
                  </span>
                </div>

                <h3 className="mt-5 text-xl sm:text-2xl font-semibold tracking-tight text-[#FBFBFD]">
                  Chapa y Pintura Profesional
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-[#86868B]">
                  Restauración de carrocería con acabados de fábrica.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-[#A1A1A6] mb-2">
                  <span>Colorimetría y sellado multicapa</span>
                  <span className="text-[#FBFBFD] font-medium">Acabado OEM</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-[#06B6D4] via-[#3B82F6] to-[#FBFBFD]/70" />
                </div>
              </div>
            </article>

            {/* Diagnóstico Express */}
            <article
              className={`${GLASS_PANEL} md:col-span-5 rounded-[26px] p-6 sm:p-7 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/15 text-[#22D3EE]">
                    <Cpu className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/40 px-3 py-1 text-xs font-medium text-[#22D3EE]">
                    En tiempo real
                  </span>
                </div>

                <h3 className="mt-5 text-xl sm:text-2xl font-semibold tracking-tight text-[#FBFBFD]">
                  Diagnóstico Express
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-[#86868B]">
                  Reporte digital del estado de tu vehículo en tiempo real.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {['Motor', 'Chasis', 'Electrónica'].map((label) => (
                  <div
                    key={label}
                    className={`${GLASS_SUBTLE} rounded-xl px-2.5 py-2 text-center`}
                  >
                    <span className="block text-[11px] text-[#A1A1A6]">{label}</span>
                    <span className="mt-0.5 block text-xs font-semibold text-[#22D3EE]">OK</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* 4. Tarjeta de Reputación en Google Maps */}
        <section id="resenas" aria-labelledby="resenas-title" className="py-12 sm:py-16 scroll-mt-24">
          <div className={`${GLASS_PANEL} rounded-[28px] p-6 sm:p-9 md:p-10`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#22D3EE]">
                  Reputación verificada en Google Maps
                </p>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-5xl sm:text-6xl font-semibold tracking-tight text-[#FBFBFD] tabular-nums">
                    4.5
                  </span>
                  <div className="space-y-1.5">
                    <GoogleRatingStars />
                    <p className="text-sm text-[#A1A1A6]">
                      <strong className="text-[#FBFBFD] font-semibold">4.5 estrellas</strong>{' '}
                      basadas en{' '}
                      <strong className="text-[#FBFBFD] font-semibold tabular-nums">
                        290 reseñas
                      </strong>{' '}
                      en Google
                    </p>
                  </div>
                </div>

                <h2
                  id="resenas-title"
                  className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight text-[#FBFBFD]"
                >
                  La confianza de cientos de conductores en Maldonado.
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#86868B]">
                  Cada entrega refleja puntualidad en diagnóstico eléctrico, mecánica de precisión y
                  acabado impecable en chapa y pintura.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {REVIEWS.map((review) => (
                  <blockquote
                    key={review.id}
                    className={`${GLASS_SUBTLE} rounded-2xl p-6 flex flex-col justify-between gap-5`}
                  >
                    <div>
                      <GoogleRatingStars />
                      <p className="mt-4 text-base leading-relaxed text-[#FBFBFD]">
                        “{review.quote}”
                      </p>
                    </div>
                    <footer className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#A1A1A6]">
                      <span>{review.category}</span>
                      <span className="text-[#22D3EE] font-medium">Google Maps</span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Contacto y Horarios */}
        <section id="contacto" aria-labelledby="contacto-title" className="py-12 sm:py-16 scroll-mt-24">
          <div className={`${GLASS_PANEL} rounded-[28px] p-6 sm:p-9 md:p-10`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#22D3EE]">
                  Contacto &amp; Atención en Taller
                </p>
                <h2
                  id="contacto-title"
                  className="mt-2.5 text-3xl sm:text-4xl font-semibold tracking-tight text-[#FBFBFD]"
                >
                  Agendá tu vehículo en minutos.
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#86868B]">
                  Escribinos directo por WhatsApp para coordinar diagnóstico, mantenimiento o
                  presupuesto de chapa y pintura en Maldonado.
                </p>

                <div className="mt-7 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] border border-[#3B82F6]/60 shadow-[0_0_24px_rgba(59,130,246,0.35)] px-6 text-[15px] font-medium text-[#FBFBFD] transition-colors ${FOCUS_RING}`}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>WhatsApp {WHATSAPP_NUMBER_DISPLAY}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className={`${GLASS_SUBTLE} inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full px-5 text-sm font-medium text-[#FBFBFD] hover:bg-white/[0.08] transition-colors ${FOCUS_RING}`}
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-[#A1A1A6]" aria-hidden="true" />
                        <span>Copiar número</span>
                      </>
                    )}
                  </button>
                </div>
                <span className="sr-only" aria-live="polite">
                  {copiedPhone ? `Número ${WHATSAPP_NUMBER_DISPLAY} copiado al portapapeles` : ''}
                </span>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`${GLASS_SUBTLE} rounded-2xl p-6 flex flex-col justify-between gap-4`}>
                  <div>
                    <div className="flex items-center gap-2.5 text-[#22D3EE]">
                      <MapPin className="h-5 w-5" aria-hidden="true" />
                      <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-[#FBFBFD]">
                        Dirección
                      </h3>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#FBFBFD]">
                      19 de Abril 1024, CP 20000, Maldonado, Departamento de Maldonado.
                    </p>
                  </div>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#22D3EE] hover:text-[#FBFBFD] transition-colors w-fit ${FOCUS_RING} rounded-full px-1 py-1`}
                  >
                    <span>Ver ubicación en Google Maps</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>

                <div className={`${GLASS_SUBTLE} rounded-2xl p-6 flex flex-col justify-between gap-4`}>
                  <div>
                    <div className="flex items-center gap-2.5 text-[#22D3EE]">
                      <Clock className="h-5 w-5" aria-hidden="true" />
                      <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-[#FBFBFD]">
                        Horarios de Atención
                      </h3>
                    </div>
                    <dl className="mt-3 space-y-2 text-sm tabular-nums">
                      <div className="flex flex-col">
                        <dt className="text-[#A1A1A6] text-xs">Lunes a Viernes</dt>
                        <dd className="text-[#FBFBFD] font-medium">
                          08:00 a 12:00 y de 13:00 a 18:00
                        </dd>
                      </div>
                      <div className="flex flex-col pt-1 border-t border-white/10">
                        <dt className="text-[#A1A1A6] text-xs">Fines de semana</dt>
                        <dd className="text-[#86868B]">Sábados y Domingos cerrado</dd>
                      </div>
                    </dl>
                  </div>
                  <p className="text-xs text-[#A1A1A6] tabular-nums">
                    WhatsApp Directo: <span className="text-[#FBFBFD] font-medium">{WHATSAPP_NUMBER_DISPLAY}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
      </main>

      {/* Footer con Sello de Seguridad HTTPS */}
      <footer className="relative z-10 border-t border-white/10 bg-neutral-950/60 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-[#FBFBFD]">Bertolotti &amp; Pérez</p>
            <p className="mt-1 text-xs text-[#86868B]">
              19 de Abril 1024, CP 20000 · Maldonado, Uruguay
            </p>
          </div>

          <div
            className={`${GLASS_SUBTLE} inline-flex flex-wrap sm:flex-nowrap items-center gap-2 rounded-2xl sm:rounded-full px-4 py-2 text-xs`}
          >
            <ShieldCheck className="h-4 w-4 text-[#22D3EE] shrink-0" aria-hidden="true" />
            <Lock className="h-3.5 w-3.5 text-[#FBFBFD] shrink-0" aria-hidden="true" />
            <span className="font-medium text-[#FBFBFD] whitespace-nowrap">
              Conexión Segura HTTPS
            </span>
            <span className="hidden sm:inline text-[#A1A1A6] whitespace-nowrap">
              · Migración moderna desde http://bertolottiperez.com
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
