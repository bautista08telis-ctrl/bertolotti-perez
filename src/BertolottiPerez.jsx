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
    svgX: 196,
    svgY: 204,
    calloutLeft: '20.4%',
    calloutTop: '4px',
    animClass: 'bp-callout-1',
    sparkAnim: 'bp-spark-1',
    sparks: [
      { cx: 172, cy: 190, r: 2.1 },
      { cx: 188, cy: 178, r: 1.5 },
      { cx: 208, cy: 192, r: 2.4 },
      { cx: 218, cy: 214, r: 1.6 },
      { cx: 178, cy: 218, r: 1.8 },
    ],
  },
  {
    id: 'chasis',
    label: 'Chasis alineado',
    subsystem: 'Geometría & Frenos',
    detail: 'Verificación milimétrica de bastidor, tren delantero, suspensión y desgaste parejo.',
    status: 'En tolerancia',
    svgX: 480,
    svgY: 240,
    calloutLeft: '50%',
    calloutTop: '4px',
    animClass: 'bp-callout-2',
    sparkAnim: 'bp-spark-2',
    sparks: [
      { cx: 452, cy: 226, r: 1.7 },
      { cx: 470, cy: 244, r: 2.3 },
      { cx: 492, cy: 229, r: 1.9 },
      { cx: 508, cy: 245, r: 1.5 },
      { cx: 462, cy: 252, r: 1.6 },
    ],
  },
  {
    id: 'electronica',
    label: 'Electrónica OK',
    subsystem: 'Centralita & Red CAN',
    detail: 'Escaneo integral de sensores, módulos ABS/ESP, batería y gestión eléctrica en el día.',
    status: 'Sin fallas',
    svgX: 722,
    svgY: 184,
    calloutLeft: '75.2%',
    calloutTop: '4px',
    animClass: 'bp-callout-3',
    sparkAnim: 'bp-spark-3',
    sparks: [
      { cx: 696, cy: 174, r: 1.8 },
      { cx: 714, cy: 164, r: 2.2 },
      { cx: 736, cy: 178, r: 1.6 },
      { cx: 748, cy: 196, r: 2.0 },
      { cx: 704, cy: 198, r: 1.4 },
    ],
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

      <main id="contenido" className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        {/* 2. Escáner Automotriz 3D + Hero Section */}
        <section
          id="diagnostico"
          aria-labelledby="hero-title"
          className="pt-5 sm:pt-7 pb-14 sm:pb-20 scroll-mt-24"
        >
          {/* Marco Liquid Glass del Escáner 3D */}
          <div
            className={`bp-scanner-stage ${
              scannerPaused ? 'bp-scanner-paused' : ''
            } ${GLASS_PANEL} rounded-[28px] p-4 sm:p-5 md:p-6 relative overflow-hidden`}
          >
            {/* Cabecera HUD minimalista */}
            <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    scannerPaused ? 'bg-[#86868B]' : 'bg-[#06B6D4] shadow-[0_0_10px_#06B6D4]'
                  }`}
                />
                <p className="text-[11px] sm:text-xs font-medium tracking-[0.06em] uppercase text-[#A1A1A6] truncate">
                  Escáner 3D · Maldonado
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="hidden sm:inline-block text-xs text-[#A1A1A6] tabular-nums">
                  {scannerPaused ? 'Lectura pausada' : 'Barrido en tiempo real'}
                </span>
                <button
                  type="button"
                  aria-pressed={scannerPaused}
                  onClick={() => setScannerPaused((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 min-h-[36px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 px-3 text-xs font-medium text-[#FBFBFD] transition-colors ${FOCUS_RING}`}
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

            {/* Escenario del Vehículo Wireframe 3D + Línea Láser */}
            <div className="rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 px-2 sm:px-5 pt-3 sm:pt-4 pb-3.5">
              {/* Pista compartida para que etiquetas, líneas guía y vehículo compartan el mismo ancho exacto */}
              <div className="relative mx-auto max-w-[920px] sm:pt-11">
                {/* Etiquetas emergentes limpias sobre el vehículo en pantallas >= sm */}
                <div className="hidden sm:block absolute inset-x-0 top-0 h-11 pointer-events-none z-20">
                  {SCAN_POINTS.map((point) => {
                    const selected = activePointId === point.id;
                    return (
                      <button
                        key={point.id}
                        type="button"
                        onClick={() => setActivePointId(point.id)}
                        style={{ left: point.calloutLeft, top: point.calloutTop }}
                        className={`${point.animClass} pointer-events-auto -translate-x-1/2 absolute inline-flex items-center gap-2 rounded-full backdrop-blur-2xl bg-neutral-950/85 border px-3.5 py-1.5 text-xs font-medium text-[#FBFBFD] transition-transform hover:scale-[1.03] ${
                          selected
                            ? 'border-[#22D3EE]/80 shadow-[0_0_24px_rgba(6,182,212,0.3)]'
                            : 'border-white/20'
                        } ${FOCUS_RING}`}
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#06B6D4]"
                        />
                        <span className="whitespace-nowrap">{point.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Pista de escaneo del vehículo */}
                <div className="relative w-full aspect-[960/265]">
                  {/* Silueta Lateral Wireframe Holográfica (SVG puro) */}
                  <svg
                    viewBox="0 70 960 265"
                    role="img"
                    aria-label="Modelo wireframe 3D de un automóvil bajo escaneo láser con puntos de diagnóstico de motor, chasis y electrónica"
                    className="w-full h-full block select-none"
                  >
                  <defs>
                    <linearGradient id="bp-body-stroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.95" />
                      <stop offset="48%" stopColor="#FBFBFD" stopOpacity="0.92" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
                    </linearGradient>

                    <linearGradient id="bp-body-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.14" />
                      <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="#050507" stopOpacity="0.02" />
                    </linearGradient>

                    <linearGradient id="bp-glass-fill" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.04" />
                    </linearGradient>

                    <linearGradient id="bp-ground-glow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
                      <stop offset="22%" stopColor="#06B6D4" stopOpacity="0.45" />
                      <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.55" />
                      <stop offset="78%" stopColor="#06B6D4" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                    </linearGradient>

                    <pattern
                      id="bp-holo-grid"
                      width="18"
                      height="18"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(24)"
                    >
                      <path
                        d="M 18 0 L 0 0 0 18"
                        fill="none"
                        stroke="#06B6D4"
                        strokeOpacity="0.16"
                        strokeWidth="0.7"
                      />
                    </pattern>

                    <clipPath id="bp-car-clip">
                      <path d="M 94 252 C 84 246, 82 228, 92 212 C 102 195, 130 180, 178 172 C 226 164, 275 159, 314 156 C 360 122, 405 100, 456 98 C 535 96, 635 105, 745 138 C 788 150, 826 154, 858 158 C 872 160, 876 172, 872 192 C 868 214, 862 232, 850 246 L 832 254 L 774 258 A 62 62 0 0 0 650 258 L 310 258 A 62 62 0 0 0 186 258 L 110 256 C 100 256, 96 254, 94 252 Z" />
                    </clipPath>

                    <filter id="bp-neon-glow" x="-10%" y="-20%" width="120%" height="140%">
                      <feGaussianBlur stdDeviation="2.6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Suelo técnico calibrado */}
                  <line
                    x1="54"
                    y1="310"
                    x2="906"
                    y2="310"
                    stroke="url(#bp-ground-glow)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="100"
                    y1="326"
                    x2="860"
                    y2="326"
                    stroke="#3B82F6"
                    strokeOpacity="0.2"
                    strokeWidth="1"
                    strokeDasharray="6 10"
                  />
                  {[120, 248, 364, 480, 596, 712, 840].map((tickX) => (
                    <line
                      key={tickX}
                      x1={tickX}
                      y1="306"
                      x2={tickX}
                      y2="318"
                      stroke="#06B6D4"
                      strokeOpacity="0.45"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Malla holográfica interna recortada a la carrocería */}
                  <g clipPath="url(#bp-car-clip)">
                    <rect x="70" y="88" width="820" height="190" fill="url(#bp-body-fill)" />
                    <rect x="70" y="88" width="820" height="190" fill="url(#bp-holo-grid)" />

                    {/* Costillas transversales CAD 3D */}
                    {[165, 248, 345, 445, 545, 645, 745, 825].map((ribX) => (
                      <path
                        key={ribX}
                        d={`M ${ribX} 92 Q ${ribX + 18} 178 ${ribX - 8} 264`}
                        fill="none"
                        stroke="#22D3EE"
                        strokeOpacity="0.22"
                        strokeWidth="0.9"
                      />
                    ))}
                  </g>

                  {/* Silueta principal brillante */}
                  <path
                    d="M 94 252 C 84 246, 82 228, 92 212 C 102 195, 130 180, 178 172 C 226 164, 275 159, 314 156 C 360 122, 405 100, 456 98 C 535 96, 635 105, 745 138 C 788 150, 826 154, 858 158 C 872 160, 876 172, 872 192 C 868 214, 862 232, 850 246 L 832 254 L 774 258 A 62 62 0 0 0 650 258 L 310 258 A 62 62 0 0 0 186 258 L 110 256 C 100 256, 96 254, 94 252 Z"
                    fill="none"
                    stroke="url(#bp-body-stroke)"
                    strokeWidth="2.2"
                    filter="url(#bp-neon-glow)"
                  />

                  {/* Cristales laterales y pilares A / B / C */}
                  <path
                    d="M 332 154 C 374 124, 412 108, 456 106 C 526 104, 608 112, 706 144 C 668 150, 560 154, 332 154 Z"
                    fill="url(#bp-glass-fill)"
                    stroke="#22D3EE"
                    strokeOpacity="0.72"
                    strokeWidth="1.4"
                  />
                  <line x1="506" y1="107" x2="496" y2="153" stroke="#22D3EE" strokeOpacity="0.55" strokeWidth="1.3" />
                  <line x1="625" y1="123" x2="608" y2="150" stroke="#22D3EE" strokeOpacity="0.55" strokeWidth="1.3" />

                  {/* Espejo retrovisor */}
                  <path
                    d="M 340 154 L 358 148 C 365 148, 368 154, 362 160 L 340 160 Z"
                    fill="#050507"
                    fillOpacity="0.8"
                    stroke="#22D3EE"
                    strokeWidth="1.2"
                  />

                  {/* Líneas de carácter aerodinámico y puerta */}
                  <path
                    d="M 140 198 C 260 182, 420 174, 595 174 C 700 174, 792 172, 858 176"
                    fill="none"
                    stroke="#22D3EE"
                    strokeOpacity="0.48"
                    strokeWidth="1.15"
                  />
                  <path
                    d="M 326 234 C 440 238, 550 238, 636 232"
                    fill="none"
                    stroke="#3B82F6"
                    strokeOpacity="0.55"
                    strokeWidth="1.1"
                  />
                  <path
                    d="M 328 158 C 318 188, 322 222, 332 248"
                    fill="none"
                    stroke="#06B6D4"
                    strokeOpacity="0.32"
                    strokeWidth="1"
                  />
                  <path
                    d="M 500 154 C 504 190, 502 220, 496 248"
                    fill="none"
                    stroke="#06B6D4"
                    strokeOpacity="0.32"
                    strokeWidth="1"
                  />

                  {/* Óptica delantera LED y firma lumínica trasera */}
                  <path
                    d="M 102 204 L 152 192 L 160 198 L 108 212 Z"
                    fill="#22D3EE"
                    fillOpacity="0.35"
                    stroke="#22D3EE"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M 826 168 L 866 164 L 868 174 L 822 176 Z"
                    fill="#3B82F6"
                    fillOpacity="0.35"
                    stroke="#3B82F6"
                    strokeWidth="1.4"
                  />

                  {/* Sub-ensambles Rayos X: Bloque Motor, Chasis Central, Bus ECU */}
                  <g opacity="0.88">
                    {/* Bloque motor */}
                    <rect
                      x="146"
                      y="186"
                      width="76"
                      height="38"
                      rx="6"
                      fill="#06B6D4"
                      fillOpacity="0.08"
                      stroke="#22D3EE"
                      strokeOpacity="0.7"
                      strokeWidth="1.1"
                      strokeDasharray="3 2"
                    />
                    <path
                      d="M 156 196 H 212 M 156 205 H 212 M 156 214 H 204"
                      stroke="#22D3EE"
                      strokeOpacity="0.65"
                      strokeWidth="1"
                    />

                    {/* Eje y bastidor de chasis */}
                    <line
                      x1="248"
                      y1="240"
                      x2="712"
                      y2="240"
                      stroke="#3B82F6"
                      strokeOpacity="0.72"
                      strokeWidth="2"
                    />
                    <line
                      x1="340"
                      y1="246"
                      x2="620"
                      y2="246"
                      stroke="#22D3EE"
                      strokeOpacity="0.45"
                      strokeWidth="1"
                      strokeDasharray="6 4"
                    />

                    {/* Módulo ECU y telemetría trasera */}
                    <rect
                      x="676"
                      y="168"
                      width="84"
                      height="36"
                      rx="6"
                      fill="#3B82F6"
                      fillOpacity="0.08"
                      stroke="#3B82F6"
                      strokeOpacity="0.72"
                      strokeWidth="1.1"
                    />
                    <path
                      d="M 688 186 H 712 L 722 178 H 748 M 688 194 H 736"
                      fill="none"
                      stroke="#22D3EE"
                      strokeOpacity="0.7"
                      strokeWidth="1"
                    />
                  </g>

                  {/* Ruedas wireframe multirradio */}
                  <WheelWireframe cx={248} cy={258} idPrefix="front" />
                  <WheelWireframe cx={712} cy={258} idPrefix="rear" />

                  {/* Líneas guía discretas hacia etiquetas superiores (solo sm+) */}
                  {SCAN_POINTS.map((point) => (
                    <line
                      key={`leader-${point.id}`}
                      x1={point.svgX}
                      y1="72"
                      x2={point.svgX}
                      y2={point.svgY - 12}
                      stroke={activePointId === point.id ? '#22D3EE' : '#06B6D4'}
                      strokeOpacity={activePointId === point.id ? '0.65' : '0.28'}
                      strokeWidth="1"
                      strokeDasharray="3 4"
                      className="hidden sm:block"
                    />
                  ))}

                  {/* Destellos / Partículas SVG sincronizadas al paso del láser */}
                  {SCAN_POINTS.map((point) => (
                    <g key={`sparks-${point.id}`} className={point.sparkAnim}>
                      {point.sparks.map((spark, idx) => (
                        <circle
                          key={`${point.id}-spark-${idx}`}
                          cx={spark.cx}
                          cy={spark.cy}
                          r={spark.r}
                          fill={idx % 2 === 0 ? '#22D3EE' : '#FBFBFD'}
                        />
                      ))}
                    </g>
                  ))}

                  {/* Nodos de escaneo interactivos */}
                  {SCAN_POINTS.map((point) => {
                    const selected = activePointId === point.id;
                    return (
                      <g
                        key={`node-${point.id}`}
                        onClick={() => setActivePointId(point.id)}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={point.svgX}
                          cy={point.svgY}
                          r={selected ? 14 : 10}
                          fill="#06B6D4"
                          fillOpacity={selected ? '0.24' : '0.12'}
                          stroke="#22D3EE"
                          strokeOpacity={selected ? '0.9' : '0.45'}
                          strokeWidth="1.2"
                        />
                        <circle
                          cx={point.svgX}
                          cy={point.svgY}
                          r="4.2"
                          fill="#22D3EE"
                          stroke="#FBFBFD"
                          strokeWidth="1"
                        />
                      </g>
                    );
                  })}
                </svg>

                  {/* Línea Láser Cian animada de izquierda a derecha en bucle continuo */}
                  <div
                    aria-hidden="true"
                    style={{
                      WebkitMaskImage:
                        'linear-gradient(to bottom, transparent 0%, black 14%, black 88%, transparent 100%)',
                      maskImage:
                        'linear-gradient(to bottom, transparent 0%, black 14%, black 88%, transparent 100%)',
                    }}
                    className="pointer-events-none absolute top-0 bottom-0 left-[7%] right-[7%] overflow-hidden"
                  >
                    <div className="relative h-full w-full animate-[scan_3s_ease-in-out_infinite]">
                      {/* Estela luminosa detrás del haz */}
                      <div className="absolute top-0 bottom-0 left-0 w-24 -translate-x-full bg-gradient-to-l from-[#06B6D4]/25 via-[#3B82F6]/10 to-transparent" />
                      {/* Línea láser cian con box-shadow intenso */}
                      <div className="absolute top-0 bottom-0 left-0 w-[2px] rounded-full bg-[#FBFBFD] shadow-[0_0_10px_2px_#22D3EE,0_0_26px_6px_rgba(6,182,212,0.9),0_0_56px_12px_rgba(59,130,246,0.55)]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Etiquetas limpias debajo del vehículo en móvil (< sm) para cero solapamiento */}
              <div className="grid grid-cols-1 gap-2 mt-3 sm:hidden">
                {SCAN_POINTS.map((point) => {
                  const selected = activePointId === point.id;
                  return (
                    <button
                      key={`mob-${point.id}`}
                      type="button"
                      onClick={() => setActivePointId(point.id)}
                      className={`${point.animClass} min-h-[44px] flex items-center justify-between rounded-2xl backdrop-blur-xl bg-neutral-950/85 border px-3.5 py-2 text-left text-xs font-medium text-[#FBFBFD] ${
                        selected ? 'border-[#22D3EE]/80' : 'border-white/20'
                      } ${FOCUS_RING}`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#06B6D4]"
                        />
                        <span>{point.label}</span>
                      </span>
                      <span className="text-[11px] text-[#22D3EE]">{point.status}</span>
                    </button>
                  );
                })}
              </div>

              {/* Franja de telemetría activa del punto seleccionado */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#FBFBFD]">
                  <span className="inline-flex items-center rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/40 px-2.5 py-0.5 text-[11px] font-semibold text-[#22D3EE]">
                    {activePoint.status}
                  </span>
                  <span className="font-semibold">{activePoint.label}</span>
                  <span className="hidden md:inline text-[#86868B]">—</span>
                  <span className="hidden md:inline text-[#A1A1A6]">{activePoint.subsystem}</span>
                </div>
                <p className="text-[#A1A1A6]">{activePoint.detail}</p>
              </div>
            </div>
          </div>

          {/* Titular y CTAs estilo Apple debajo del Escáner 3D */}
          <div className="mt-7 sm:mt-9 max-w-3xl mx-auto text-center">
            <h1
              id="hero-title"
              className="text-3xl sm:text-5xl md:text-[50px] font-semibold tracking-[-0.025em] leading-[1.06] text-[#FBFBFD]"
            >
              Precisión tecnológica. Respaldo absoluto.
            </h1>
            <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-[#86868B] max-w-2xl mx-auto">
              Servicio integral de mecánica, chapa y pintura en Maldonado. Más de{' '}
              <span className="text-[#FBFBFD] font-medium tabular-nums">290</span> clientes avalan
              nuestra calidad.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
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
                className={`${GLASS_PANEL} inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full px-7 text-[15px] font-medium text-[#FBFBFD] hover:bg-white/[0.1] transition-colors ${FOCUS_RING}`}
              >
                <MessageCircle className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />
                <span>WhatsApp Directo</span>
              </a>
            </div>
          </div>
        </section>

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
