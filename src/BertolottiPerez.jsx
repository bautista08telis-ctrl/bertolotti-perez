import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LazyMotion, MotionConfig, domAnimation, m } from 'framer-motion';
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
  RotateCcw,
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

const MEDIA = {
  carExterior: `${import.meta.env.BASE_URL}media/car-exterior.webp`,
  carXray: `${import.meta.env.BASE_URL}media/car-xray.webp`,
  mecanica: `${import.meta.env.BASE_URL}media/service-mecanica.webp`,
  chapa: `${import.meta.env.BASE_URL}media/service-chapa.webp`,
  diagnostico: `${import.meta.env.BASE_URL}media/service-diagnostico.webp`,
};

const NAV_LINKS = [
  { href: '#diagnostico', label: 'Diagnóstico' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#resenas', label: 'Reseñas' },
  { href: '#contacto', label: 'Contacto' },
];

const SCAN_ZONES = [
  {
    id: 'motor',
    label: 'Diagnóstico de motor',
    shortLabel: 'Motor',
    subsystem: 'Propulsión & Inyección',
    detail: 'Lectura de compresión, temperatura, sistema de inyección y kit de distribución.',
    status: 'OK',
    xPct: 16.5,
    yPct: 48,
  },
  {
    id: 'frenos',
    label: 'Frenos y suspensión',
    shortLabel: 'Frenos',
    subsystem: 'Discos, Pinzas & Tren Delantero',
    detail: 'Control de pastillas, discos ventilados, amortiguadores y respuesta ABS.',
    status: 'OK',
    xPct: 22.8,
    yPct: 71,
  },
  {
    id: 'chasis',
    label: 'Chasis alineado',
    shortLabel: 'Chasis',
    subsystem: 'Geometría & Transmisión',
    detail: 'Verificación milimétrica de bastidor, tren trasero y alineación sin vibraciones.',
    status: 'OK',
    xPct: 50,
    yPct: 68,
  },
  {
    id: 'electronica',
    label: 'Electrónica OK',
    shortLabel: 'Electrónica',
    subsystem: 'Centralita ECU & Red CAN',
    detail: 'Escaneo computarizado de sensores, batería, alternador y fallas eléctricas en el día.',
    status: 'OK',
    xPct: 86.2,
    yPct: 56,
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
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [introStage, setIntroStage] = useState('parking'); // 'parking' | 'scanning' | 'ready'
  const [passedCount, setPassedCount] = useState(0);
  const [scanCycle, setScanCycle] = useState(0);

  const stageRef = useRef(null);
  const passedRef = useRef(0);

  const applyScanWindow = useCallback((leadPct, trailPct) => {
    if (!stageRef.current) return;
    stageRef.current.style.setProperty('--scan-lead-num', leadPct.toFixed(2));
    stageRef.current.style.setProperty('--scan-lead', `${leadPct.toFixed(2)}%`);
    stageRef.current.style.setProperty('--scan-trail', `${trailPct.toFixed(2)}%`);
  }, []);

  // Secuencia única al cargar (o al pulsar "Repetir escaneo"):
  // Acto 1: Auto estaciona (~1.1s) -> Acto 2: Escaneo X-Ray único (~2.0s) -> Acto 3: Hero del taller
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      passedRef.current = SCAN_ZONES.length;
      setPassedCount(SCAN_ZONES.length);
      applyScanWindow(100, 100);
      setIntroStage('ready');
      return undefined;
    }

    passedRef.current = 0;
    setPassedCount(0);
    applyScanWindow(0, 0);
    setIntroStage('parking');

    let rafId = 0;
    const parkTimer = window.setTimeout(() => {
      setIntroStage('scanning');
      let progress = 0;
      let lastTime = performance.now();

      const step = (now) => {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;
        progress += dt * 64; // 0 -> 134 en ~2.1s

        const lead = Math.min(100, progress);
        const trail = Math.max(0, Math.min(100, progress - 34));
        applyScanWindow(lead, trail);

        let passed = 0;
        for (let i = 0; i < SCAN_ZONES.length; i += 1) {
          if (lead >= SCAN_ZONES[i].xPct) passed = i + 1;
        }
        if (passed > passedRef.current) {
          passedRef.current = passed;
          setPassedCount(passed);
        }

        if (progress >= 134) {
          applyScanWindow(100, 100);
          passedRef.current = SCAN_ZONES.length;
          setPassedCount(SCAN_ZONES.length);
          setIntroStage('ready');
          return;
        }

        rafId = requestAnimationFrame(step);
      };

      rafId = requestAnimationFrame(step);
    }, 1100);

    return () => {
      window.clearTimeout(parkTimer);
      cancelAnimationFrame(rafId);
    };
  }, [applyScanWindow, scanCycle]);

  const handleSkipIntro = () => {
    passedRef.current = SCAN_ZONES.length;
    setPassedCount(SCAN_ZONES.length);
    applyScanWindow(100, 100);
    setIntroStage('ready');
  };

  const handleReplayIntro = () => {
    setScanCycle((prev) => prev + 1);
  };

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
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
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

          {/* Iluminación de estudio ambiental */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 overflow-hidden z-0"
          >
            <div className="absolute -top-48 left-1/2 -translate-x-1/2 h-[540px] w-[920px] rounded-full bg-[#06B6D4]/[0.08] blur-[140px]" />
            <div className="absolute top-[38%] -right-40 h-[420px] w-[420px] rounded-full bg-[#3B82F6]/[0.06] blur-[130px]" />
          </div>

          <a
            href="#contenido"
            className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] rounded-full bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-[#FBFBFD] ${FOCUS_RING}`}
          >
            Saltar al contenido principal
          </a>

          {/* 1. Barra de Navegación Flotante (Liquid Glass) */}
          <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4 sm:px-6 pt-4">
            <nav
              aria-label="Navegación principal"
              className={`${GLASS_PANEL} rounded-full px-3 sm:px-5 py-2 flex items-center justify-between gap-3`}
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
                className={`${GLASS_PANEL} md:hidden mt-2.5 rounded-3xl p-4 flex flex-col gap-1`}
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
            {/* 2. Hero Section: Intro Única (Estaciona + Escaneo X-Ray) -> Taller Mecánico */}
            <section
              id="diagnostico"
              aria-labelledby="hero-title"
              className="pt-5 sm:pt-7 pb-10 sm:pb-14 scroll-mt-24"
            >
              {/* Zona superior de altura estable (grid stack -> cero saltos CLS al revelar el titular) */}
              <div className="grid place-items-center max-w-3xl mx-auto">
                {/* Capa A: Titular principal del Taller Mecánico (se revela tras el escaneo único) */}
                <div
                  aria-hidden={introStage !== 'ready'}
                  className={`col-start-1 row-start-1 w-full text-center transition-all duration-700 ease-out ${
                    introStage === 'ready'
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3 pointer-events-none select-none'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/15 px-3.5 py-1.5 text-xs font-medium text-[#22D3EE]">
                    <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Taller Mecánico · Chapa y Pintura · Maldonado</span>
                  </div>

                  <h1
                    id="hero-title"
                    className="mt-4 text-3xl sm:text-5xl md:text-[50px] font-semibold tracking-[-0.025em] leading-[1.06] text-[#FBFBFD]"
                  >
                    Precisión tecnológica. Respaldo absoluto.
                  </h1>

                  <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-[#86868B] max-w-2xl mx-auto">
                    Servicio integral de mecánica, chapa y pintura en Maldonado. Más de{' '}
                    <span className="text-[#FBFBFD] font-medium tabular-nums">290</span> clientes
                    avalan nuestra calidad.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
                    <a
                      href="#servicios"
                      tabIndex={introStage === 'ready' ? 0 : -1}
                      className={`inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] border border-[#3B82F6]/60 shadow-[0_0_28px_rgba(59,130,246,0.38)] px-7 text-[15px] font-medium text-[#FBFBFD] transition-colors ${FOCUS_RING}`}
                    >
                      <span>Diagnosticar mi vehículo</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>

                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={introStage === 'ready' ? 0 : -1}
                      className={`${GLASS_PANEL} inline-flex items-center justify-center gap-2 min-h-[48px] rounded-full px-7 text-[15px] font-medium text-[#FBFBFD] hover:bg-white/[0.1] transition-colors ${FOCUS_RING}`}
                    >
                      <MessageCircle className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />
                      <span>WhatsApp Directo</span>
                    </a>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-[#A1A1A6]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-[#FBBF24]" aria-hidden="true">
                        ★
                      </span>
                      <strong className="text-[#FBFBFD] font-medium tabular-nums">4.5</strong> en
                      Google (290 reseñas)
                    </span>
                    <span aria-hidden="true" className="hidden sm:inline text-white/20">
                      ·
                    </span>
                    <span>Mecánica Avanzada, Chapa y Pintura</span>
                    <span aria-hidden="true" className="hidden sm:inline text-white/20">
                      ·
                    </span>
                    <span>19 de Abril 1024, Maldonado</span>
                  </div>
                </div>

                {/* Capa B: Estado breve durante el ingreso y escaneo único de apertura */}
                <div
                  aria-hidden={introStage === 'ready'}
                  className={`col-start-1 row-start-1 w-full flex flex-col items-center justify-center text-center transition-all duration-500 ${
                    introStage === 'ready'
                      ? 'opacity-0 scale-[0.98] pointer-events-none select-none'
                      : 'opacity-100 scale-100'
                  }`}
                >
                  <div
                    className={`${GLASS_PANEL} rounded-full px-4 py-2 inline-flex items-center gap-2.5 text-xs font-medium text-[#FBFBFD]`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-[#06B6D4] shadow-[0_0_10px_#06B6D4]"
                    />
                    <span>
                      {introStage === 'parking'
                        ? 'Ingresando vehículo a bahía de servicio…'
                        : 'Escaneando motor, frenos, chasis y electrónica…'}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-xl">
                    {SCAN_ZONES.map((zone, idx) => {
                      const done = idx < passedCount;
                      return (
                        <div
                          key={`intro-${zone.id}`}
                          className={`rounded-2xl border px-3 py-2 text-xs font-medium flex items-center justify-between gap-2 transition-all duration-300 ${
                            done
                              ? 'bg-[#06B6D4]/15 border-[#22D3EE]/70 text-[#FBFBFD] shadow-[0_0_18px_rgba(6,182,212,0.22)]'
                              : 'bg-white/[0.03] border-white/10 text-[#86868B]'
                          }`}
                        >
                          <span className="truncate">{zone.shortLabel}</span>
                          {done ? (
                            <Check className="h-3.5 w-3.5 text-[#22D3EE] shrink-0" aria-hidden="true" />
                          ) : (
                            <span className="text-[10px]">…</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    tabIndex={introStage === 'ready' ? -1 : 0}
                    onClick={handleSkipIntro}
                    className={`mt-5 min-h-[36px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 px-4 text-xs font-medium text-[#A1A1A6] hover:text-[#FBFBFD] transition-colors ${FOCUS_RING}`}
                  >
                    Saltar intro
                  </button>
                </div>
              </div>

              {/* Bahía de servicio minimalista integrada al fondo oscuro */}
              <div className="mt-5 sm:mt-6 relative max-w-[780px] mx-auto">
                {/* Barra LED cenital sutil de bahía de taller */}
                <div
                  aria-hidden="true"
                  className="mx-auto mb-1 h-[1px] w-2/3 bg-gradient-to-r from-transparent via-[#22D3EE]/50 to-transparent shadow-[0_0_24px_rgba(6,182,212,0.4)]"
                />

                <div
                  ref={stageRef}
                  style={{ '--scan-lead-num': '0', '--scan-lead': '0%', '--scan-trail': '0%' }}
                  className="relative w-full aspect-[18/7] overflow-hidden select-none"
                >
                  {/* Vehículo estacionando una sola vez desde la derecha */}
                  <m.div
                    key={scanCycle}
                    initial={{ x: '24%', opacity: 0.25 }}
                    animate={{ x: '0%', opacity: 1 }}
                    transition={{ duration: 1.08, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-full w-full"
                  >
                    <img
                      src={MEDIA.carExterior}
                      alt="Vehículo en bahía de diagnóstico automotriz de Bertolotti & Pérez"
                      width={1440}
                      height={560}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                      className="h-full w-full object-cover object-center pointer-events-none"
                    />

                    {/* Destello breve de faro delantero y luz de freno durante el estacionamiento */}
                    {introStage === 'parking' && (
                      <>
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute left-0 top-[54%] h-[22%] w-[18%] bg-gradient-to-l from-[#E0F2FE]/25 via-[#22D3EE]/10 to-transparent blur-md"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute right-[5.4%] top-[46%] h-4 w-7 rounded-full bg-red-500/80 blur-md"
                        />
                      </>
                    )}
                  </m.div>

                  {/* Ventana X-Ray viajera (visible únicamente durante el barrido único) */}
                  <img
                    src={MEDIA.carXray}
                    alt=""
                    aria-hidden="true"
                    width={1440}
                    height={560}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    style={{
                      clipPath:
                        'inset(0 calc(100% - var(--scan-lead, 0%)) 0 var(--scan-trail, 0%))',
                    }}
                    className={`absolute inset-0 h-full w-full object-cover object-center pointer-events-none transition-opacity duration-300 ${
                      introStage === 'scanning' ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Puntos breves de escaneo durante la pasada */}
                  {introStage === 'scanning' &&
                    SCAN_ZONES.map((zone, idx) => {
                      const active = idx < passedCount;
                      return (
                        <div
                          key={`dot-${zone.id}`}
                          aria-hidden="true"
                          style={{ left: `${zone.xPct}%`, top: `${zone.yPct}%` }}
                          className={`-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute flex items-center gap-1.5 transition-opacity duration-300 ${
                            active ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <span className="h-2.5 w-2.5 rounded-full bg-[#22D3EE] shadow-[0_0_16px_#06B6D4] ring-4 ring-[#06B6D4]/25" />
                          <span className="hidden sm:inline-block rounded-full bg-neutral-950/85 border border-[#22D3EE]/50 px-2 py-0.5 text-[10px] font-medium text-[#FBFBFD] whitespace-nowrap">
                            {zone.shortLabel}
                          </span>
                        </div>
                      );
                    })}

                  {/* Haz láser cian (activo solo durante el escaneo único, luego desaparece) */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                      introStage === 'scanning' ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      transform: 'translate3d(calc(var(--scan-lead-num, 0) * 1%), 0, 0)',
                    }}
                  >
                    <div className="absolute inset-y-0 left-0 w-24 -translate-x-full bg-gradient-to-l from-[#06B6D4]/25 via-[#3B82F6]/10 to-transparent" />
                    <div
                      style={{
                        WebkitMaskImage:
                          'linear-gradient(to bottom, transparent 4%, black 18%, black 82%, transparent 96%)',
                        maskImage:
                          'linear-gradient(to bottom, transparent 4%, black 18%, black 82%, transparent 96%)',
                      }}
                      className="absolute inset-y-0 left-0 w-[2.5px] -translate-x-1/2 bg-[#FBFBFD] shadow-[0_0_12px_2px_#22D3EE,0_0_28px_7px_rgba(6,182,212,0.9),0_0_64px_14px_rgba(59,130,246,0.55)]"
                    />
                  </div>

                  {/* Viñeta sutil para fundir los bordes del estudio con #050507 */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_58%,#050507_98%)]"
                  />
                </div>

                {/* Suelo fino del estudio */}
                <div
                  aria-hidden="true"
                  className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />

                {/* Control discreto solo cuando finalizó la intro */}
                <div className="mt-2 flex justify-end min-h-[28px]">
                  {introStage === 'ready' && (
                    <button
                      type="button"
                      onClick={handleReplayIntro}
                      className={`inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 px-3 py-1 text-[11px] font-medium text-[#A1A1A6] hover:text-[#FBFBFD] transition-colors ${FOCUS_RING}`}
                    >
                      <RotateCcw className="h-3 w-3 text-[#22D3EE]" aria-hidden="true" />
                      <span>Repetir escaneo</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* 3. Bento Grid de Servicios Automotrices con Fotografía Studio */}
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
                {/* Mecánica Avanzada */}
                <m.article
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`${GLASS_PANEL} md:col-span-7 md:row-span-2 rounded-[26px] flex flex-col justify-between relative overflow-hidden group`}
                >
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                    <img
                      src={MEDIA.mecanica}
                      alt="Detalle de frenos ventilados de precisión y mecánica avanzada"
                      width={900}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent"
                    />
                    <div className="absolute top-5 left-6 right-6 flex items-center justify-between gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl backdrop-blur-xl bg-neutral-950/75 border border-white/20 text-[#22D3EE]">
                        <Wrench className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full backdrop-blur-xl bg-neutral-950/75 border border-white/20 px-3 py-1 text-xs font-medium text-[#FBFBFD]">
                        Taller integral
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 pt-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-[#FBFBFD]">
                        Mecánica Avanzada
                      </h3>
                      <p className="mt-2.5 text-base sm:text-[17px] leading-relaxed text-[#A1A1A6] max-w-xl">
                        Mantenimiento preventivo, frenos, distribución y diagnóstico computarizado.
                      </p>

                      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                    <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
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
                  </div>
                </m.article>

                {/* Chapa y Pintura Profesional */}
                <m.article
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.35, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className={`${GLASS_PANEL} md:col-span-5 rounded-[26px] flex flex-col justify-between overflow-hidden group`}
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={MEDIA.chapa}
                      alt="Cabina profesional de chapa y pintura con acabado espejo sobre carrocería"
                      width={900}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent"
                    />
                    <div className="absolute top-4 left-6 right-6 flex items-center justify-between gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl backdrop-blur-xl bg-neutral-950/75 border border-white/20 text-[#22D3EE]">
                        <Sparkles className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full backdrop-blur-xl bg-neutral-950/75 border border-white/20 px-3 py-1 text-xs font-medium text-[#FBFBFD]">
                        Terminación original
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 pt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#FBFBFD]">
                        Chapa y Pintura Profesional
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-[#A1A1A6]">
                        Restauración de carrocería con acabados de fábrica.
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs text-[#A1A1A6] mb-2">
                        <span>Colorimetría y sellado multicapa</span>
                        <span className="text-[#FBFBFD] font-medium">Acabado OEM</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-[#06B6D4] via-[#3B82F6] to-[#FBFBFD]/70" />
                      </div>
                    </div>
                  </div>
                </m.article>

                {/* Diagnóstico Express */}
                <m.article
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.35, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className={`${GLASS_PANEL} md:col-span-5 rounded-[26px] flex flex-col justify-between overflow-hidden group`}
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={MEDIA.diagnostico}
                      alt="Escáner computarizado con reporte digital en tiempo real"
                      width={900}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/45 to-transparent"
                    />
                    <div className="absolute top-4 left-6 right-6 flex items-center justify-between gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl backdrop-blur-xl bg-neutral-950/75 border border-white/20 text-[#22D3EE]">
                        <Cpu className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full backdrop-blur-xl bg-[#06B6D4]/20 border border-[#06B6D4]/50 px-3 py-1 text-xs font-medium text-[#22D3EE]">
                        En tiempo real
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 pt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#FBFBFD]">
                        Diagnóstico Express
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-[#A1A1A6]">
                        Reporte digital del estado de tu vehículo en tiempo real.
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {['Motor', 'Chasis', 'Electrónica'].map((label) => (
                        <div
                          key={label}
                          className={`${GLASS_SUBTLE} rounded-xl px-2.5 py-2 text-center`}
                        >
                          <span className="block text-[11px] text-[#A1A1A6]">{label}</span>
                          <span className="mt-0.5 block text-xs font-semibold text-[#22D3EE]">
                            OK
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </m.article>
              </div>
            </section>

            {/* 4. Tarjeta de Reputación en Google Maps */}
            <section id="resenas" aria-labelledby="resenas-title" className="py-12 sm:py-16 scroll-mt-24">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`${GLASS_PANEL} rounded-[28px] p-6 sm:p-9 md:p-10`}
              >
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
              </m.div>
            </section>

            {/* 5. Contacto y Horarios */}
            <section id="contacto" aria-labelledby="contacto-title" className="py-12 sm:py-16 scroll-mt-24">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`${GLASS_PANEL} rounded-[28px] p-6 sm:p-9 md:p-10`}
              >
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
                      {copiedPhone
                        ? `Número ${WHATSAPP_NUMBER_DISPLAY} copiado al portapapeles`
                        : ''}
                    </span>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className={`${GLASS_SUBTLE} rounded-2xl p-6 flex flex-col justify-between gap-4`}
                    >
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

                    <div
                      className={`${GLASS_SUBTLE} rounded-2xl p-6 flex flex-col justify-between gap-4`}
                    >
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
                        WhatsApp Directo:{' '}
                        <span className="text-[#FBFBFD] font-medium">
                          {WHATSAPP_NUMBER_DISPLAY}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </m.div>
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
      </LazyMotion>
    </MotionConfig>
  );
}
