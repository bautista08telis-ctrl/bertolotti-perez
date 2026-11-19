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
  Pause,
  Play,
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
  const [activeZoneId, setActiveZoneId] = useState('motor');
  const [checkedCount, setCheckedCount] = useState(0);
  const [mode, setMode] = useState('intro'); // 'intro' | 'patrol' | 'manual'
  const [paused, setPaused] = useState(false);
  const [sliderPct, setSliderPct] = useState(0);

  const stageRef = useRef(null);
  const rangeRef = useRef(null);
  const scanPctRef = useRef(0);
  const checkedRef = useRef(0);
  const draggingRef = useRef(false);
  const patrolDirRef = useRef(-1); // Después del intro en 100%, barre suavemente hacia la izquierda

  const activeZone = SCAN_ZONES.find((z) => z.id === activeZoneId) || SCAN_ZONES[0];

  const applyScanPosition = useCallback((pct, syncSlider = false) => {
    const clamped = Math.max(0, Math.min(100, pct));
    scanPctRef.current = clamped;
    if (stageRef.current) {
      stageRef.current.style.setProperty('--scan-num', clamped.toFixed(2));
      stageRef.current.style.setProperty('--scan-pct', `${clamped.toFixed(2)}%`);
    }
    if (rangeRef.current) {
      rangeRef.current.value = String(Math.round(clamped));
    }
    if (syncSlider) {
      setSliderPct(Math.round(clamped));
    }
  }, []);

  // Respetar preferencia de movimiento reducido al montar
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      applyScanPosition(56, true);
      checkedRef.current = SCAN_ZONES.length;
      setCheckedCount(SCAN_ZONES.length);
      setMode('manual');
      setPaused(true);
    }
  }, [applyScanPosition]);

  // Motor rAF sin re-renders por frame (solo actualiza CSS variables en el DOM)
  useEffect(() => {
    if (paused || mode === 'manual') return undefined;

    let rafId = 0;
    let lastTime = performance.now();

    const step = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (mode === 'intro') {
        const next = scanPctRef.current + dt * 24; // 0 -> 100% en ~4.15s
        if (next >= 100) {
          applyScanPosition(100, true);
          checkedRef.current = SCAN_ZONES.length;
          setCheckedCount(SCAN_ZONES.length);
          setActiveZoneId(SCAN_ZONES[SCAN_ZONES.length - 1].id);
          patrolDirRef.current = -1;
          setMode('patrol');
          return;
        }

        applyScanPosition(next);

        let passed = 0;
        for (let i = 0; i < SCAN_ZONES.length; i += 1) {
          if (next >= SCAN_ZONES[i].xPct) passed = i + 1;
        }
        if (passed > checkedRef.current) {
          checkedRef.current = passed;
          setCheckedCount(passed);
          setActiveZoneId(SCAN_ZONES[passed - 1].id);
        }
      } else if (mode === 'patrol') {
        let next = scanPctRef.current + patrolDirRef.current * dt * 15;
        if (next <= 12) {
          next = 12;
          patrolDirRef.current = 1;
        } else if (next >= 88) {
          next = 88;
          patrolDirRef.current = -1;
        }
        applyScanPosition(next);
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [applyScanPosition, mode, paused]);

  const handleRestartScan = () => {
    checkedRef.current = 0;
    setCheckedCount(0);
    setActiveZoneId('motor');
    applyScanPosition(0, true);
    setPaused(false);
    setMode('intro');
  };

  const handleTogglePause = () => {
    if (paused) {
      setPaused(false);
      if (mode === 'manual') {
        setMode('patrol');
      }
    } else {
      setPaused(true);
      setSliderPct(Math.round(scanPctRef.current));
    }
  };

  const handleSelectZone = (zone) => {
    setActiveZoneId(zone.id);
    checkedRef.current = SCAN_ZONES.length;
    setCheckedCount(SCAN_ZONES.length);
    setMode('manual');
    setPaused(true);
    applyScanPosition(Math.min(96, zone.xPct + 4), true);
  };

  const updateFromPointer = (clientX) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    if (!rect.width) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    checkedRef.current = SCAN_ZONES.length;
    setCheckedCount(SCAN_ZONES.length);
    setMode('manual');
    setPaused(true);
    applyScanPosition(pct, true);

    // Resalta el componente más cercano al puntero
    let nearest = SCAN_ZONES[0];
    let minDiff = Infinity;
    for (const z of SCAN_ZONES) {
      const diff = Math.abs(z.xPct - pct);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = z;
      }
    }
    if (nearest.id !== activeZoneId) {
      setActiveZoneId(nearest.id);
    }
  };

  const handleRangeChange = (e) => {
    const val = Number(e.target.value);
    checkedRef.current = SCAN_ZONES.length;
    setCheckedCount(SCAN_ZONES.length);
    setMode('manual');
    setPaused(true);
    applyScanPosition(val, true);
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

  const hudStatusText =
    mode === 'intro' && !paused
      ? `Escaneando ${activeZone.shortLabel.toLowerCase()}…`
      : mode === 'manual' || paused
        ? `Inspección manual · ${activeZone.shortLabel}`
        : 'Escaneo completo · Patrulla activa';

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
            {/* 2. Hero Section + Escáner Automotriz X-Ray de Inicio */}
            <section
              id="diagnostico"
              aria-labelledby="hero-title"
              className="pt-3 sm:pt-4 pb-12 sm:pb-16 scroll-mt-24"
            >
              <m.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`${GLASS_PANEL} rounded-[28px] p-3.5 sm:p-5 relative overflow-hidden`}
              >
                {/* Cabecera HUD del escáner */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        paused && mode === 'manual'
                          ? 'bg-[#22D3EE]'
                          : 'bg-[#06B6D4] shadow-[0_0_10px_#06B6D4]'
                      }`}
                    />
                    <p className="text-[11px] sm:text-xs font-medium tracking-[0.06em] uppercase text-[#A1A1A6] truncate">
                      Escáner Automotriz X-Ray · Maldonado
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden md:inline-block text-xs text-[#A1A1A6] tabular-nums mr-1">
                      {hudStatusText}
                    </span>

                    <button
                      type="button"
                      onClick={handleRestartScan}
                      className={`inline-flex items-center gap-1.5 min-h-[36px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 px-3 text-xs font-medium text-[#FBFBFD] transition-colors ${FOCUS_RING}`}
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-[#22D3EE]" aria-hidden="true" />
                      <span>Reescanear</span>
                    </button>

                    <button
                      type="button"
                      aria-pressed={paused}
                      onClick={handleTogglePause}
                      className={`inline-flex items-center gap-1.5 min-h-[36px] rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 px-3 text-xs font-medium text-[#FBFBFD] transition-colors ${FOCUS_RING}`}
                    >
                      {paused ? (
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

                {/* Escenario Dual-Layer X-Ray (arrastrable en desktop y táctil) */}
                <div
                  ref={stageRef}
                  style={{ '--scan-num': '0', '--scan-pct': '0%' }}
                  onPointerDown={(e) => {
                    if (e.target.closest('button')) return;
                    draggingRef.current = true;
                    e.currentTarget.setPointerCapture?.(e.pointerId);
                    updateFromPointer(e.clientX);
                  }}
                  onPointerMove={(e) => {
                    if (!draggingRef.current) return;
                    updateFromPointer(e.clientX);
                  }}
                  onPointerUp={() => {
                    draggingRef.current = false;
                  }}
                  onPointerCancel={() => {
                    draggingRef.current = false;
                  }}
                  className="relative w-full max-w-[820px] aspect-[18/7] mx-auto rounded-2xl overflow-hidden bg-[#050507] border border-white/10 cursor-ew-resize select-none touch-pan-y"
                >
                  {/* Capa base: fotografía de estudio exterior */}
                  <img
                    src={MEDIA.carExterior}
                    alt="Vehículo sedán deportivo en estudio oscuro de diagnóstico"
                    width={1440}
                    height={560}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
                  />

                  {/* Capa X-Ray revelada por la posición --scan-pct del láser */}
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
                      clipPath: 'inset(0 calc(100% - var(--scan-pct, 0%)) 0 0)',
                    }}
                    className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
                  />

                  {/* Resplandor ambiental sutil detrás de la línea de corte */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      transform: 'translate3d(calc(var(--scan-num, 0) * 1%), 0, 0)',
                    }}
                  >
                    <div className="absolute inset-y-0 left-0 w-24 -translate-x-full bg-gradient-to-l from-[#06B6D4]/25 via-[#3B82F6]/10 to-transparent" />
                    <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#22D3EE]/15 to-transparent" />
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

                  {/* Puntos interactivos sobre las zonas reales del vehículo */}
                  {SCAN_ZONES.map((zone, idx) => {
                    const checked = idx < checkedCount;
                    const selected = activeZoneId === zone.id;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        aria-label={`Inspeccionar ${zone.label}`}
                        aria-pressed={selected}
                        onClick={() => handleSelectZone(zone)}
                        style={{ left: `${zone.xPct}%`, top: `${zone.yPct}%` }}
                        className={`-translate-x-1/2 -translate-y-1/2 absolute z-20 group inline-flex items-center justify-center rounded-full p-2 transition-transform hover:scale-110 ${FOCUS_RING}`}
                      >
                        <span
                          className={`relative flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border transition-all ${
                            selected
                              ? 'bg-[#06B6D4]/30 border-[#22D3EE] shadow-[0_0_22px_rgba(34,211,238,0.85)] scale-110'
                              : checked
                                ? 'bg-[#06B6D4]/20 border-[#22D3EE]/80 shadow-[0_0_14px_rgba(6,182,212,0.55)]'
                                : 'bg-neutral-950/75 border-white/35'
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              selected || checked ? 'bg-[#FBFBFD]' : 'bg-white/60'
                            }`}
                          />
                        </span>
                        <span
                          className={`hidden md:inline-flex items-center gap-1.5 ml-2 rounded-full backdrop-blur-xl bg-neutral-950/85 border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-opacity ${
                            selected
                              ? 'border-[#22D3EE]/80 text-[#FBFBFD] opacity-100 shadow-[0_0_18px_rgba(6,182,212,0.3)]'
                              : checked
                                ? 'border-white/20 text-[#FBFBFD]/90 opacity-90'
                                : 'border-white/15 text-[#A1A1A6] opacity-75 group-hover:opacity-100'
                          }`}
                        >
                          {zone.shortLabel}
                        </span>
                      </button>
                    );
                  })}

                  {/* Indicador discreto de interacción */}
                  <div className="pointer-events-none absolute bottom-2.5 right-3 hidden sm:inline-flex items-center rounded-full backdrop-blur-md bg-neutral-950/70 border border-white/15 px-3 py-1 text-[11px] text-[#A1A1A6]">
                    Arrastrá sobre el vehículo para inspeccionar
                  </div>
                </div>

                {/* Deslizador accesible para dispositivos táctiles y teclado */}
                <div className="mt-2.5 flex items-center gap-3 px-1">
                  <label
                    htmlFor="bp-xray-range"
                    className="text-[11px] font-medium text-[#A1A1A6] whitespace-nowrap"
                  >
                    Barrido X-Ray
                  </label>
                  <input
                    ref={rangeRef}
                    id="bp-xray-range"
                    type="range"
                    min={0}
                    max={100}
                    defaultValue={0}
                    onChange={handleRangeChange}
                    aria-label="Control manual del escáner X-Ray sobre el vehículo"
                    className={`w-full h-1.5 rounded-full bg-white/15 accent-[#06B6D4] cursor-pointer ${FOCUS_RING}`}
                  />
                  <span className="text-[11px] font-medium text-[#22D3EE] tabular-nums w-10 text-right">
                    {mode !== 'manual' && !paused ? 'AUTO' : `${sliderPct}%`}
                  </span>
                </div>

                {/* Checklist HUD de 4 subsistemas escaneados */}
                <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {SCAN_ZONES.map((zone, idx) => {
                    const checked = idx < checkedCount;
                    const selected = activeZoneId === zone.id;
                    return (
                      <button
                        key={`hud-${zone.id}`}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => handleSelectZone(zone)}
                        className={`min-h-[44px] rounded-2xl border px-3 py-2 text-left transition-all flex items-center justify-between gap-2 ${
                          selected
                            ? 'bg-[#06B6D4]/15 border-[#22D3EE]/80 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                            : 'bg-white/[0.03] border-white/15 hover:bg-white/[0.07]'
                        } ${FOCUS_RING}`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span
                            aria-hidden="true"
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              checked
                                ? 'bg-[#22D3EE] shadow-[0_0_8px_#06B6D4]'
                                : 'bg-white/25'
                            }`}
                          />
                          <span className="text-xs font-medium text-[#FBFBFD] sm:hidden">
                            {zone.shortLabel}
                          </span>
                          <span className="text-xs font-medium text-[#FBFBFD] hidden sm:inline truncate">
                            {zone.label}
                          </span>
                        </span>
                        <span
                          className={`text-[11px] font-semibold shrink-0 ${
                            checked ? 'text-[#22D3EE]' : 'text-[#86868B]'
                          }`}
                        >
                          {checked ? zone.status : '—'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Lectura detallada del subsistema enfocado */}
                <div className="mt-2.5 pt-2.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[#FBFBFD]">
                    <span className="inline-flex items-center rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/40 px-2.5 py-0.5 text-[11px] font-semibold text-[#22D3EE]">
                      {activeZone.status}
                    </span>
                    <span className="font-semibold">{activeZone.label}</span>
                    <span className="hidden md:inline text-[#86868B]">—</span>
                    <span className="hidden md:inline text-[#A1A1A6]">{activeZone.subsystem}</span>
                  </div>
                  <p className="text-[#A1A1A6]">{activeZone.detail}</p>
                </div>
              </m.div>

              {/* Titular y CTAs estilo Apple debajo del Escáner X-Ray */}
              <m.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 sm:mt-7 max-w-3xl mx-auto text-center"
              >
                <h1
                  id="hero-title"
                  className="text-3xl sm:text-5xl md:text-[46px] font-semibold tracking-[-0.025em] leading-[1.06] text-[#FBFBFD]"
                >
                  Precisión tecnológica. Respaldo absoluto.
                </h1>
                <p className="mt-3 text-base sm:text-lg leading-relaxed text-[#86868B] max-w-2xl mx-auto">
                  Servicio integral de mecánica, chapa y pintura en Maldonado. Más de{' '}
                  <span className="text-[#FBFBFD] font-medium tabular-nums">290</span> clientes avalan
                  nuestra calidad.
                </p>

                <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
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
              </m.div>
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
                      className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"
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
                      className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-transparent"
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
                      className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-transparent"
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
