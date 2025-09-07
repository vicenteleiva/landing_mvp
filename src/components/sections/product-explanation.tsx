"use client";

import { useEffect, useRef, useState } from "react";
import { trackClick } from "@/lib/analytics";
import {
  Search,
  CheckSquare,
  FileText,
  Calendar as CalendarIcon,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

type Role = "user" | "broky";
const ACCENT = "#8C0529";

/* ============ Utilidades ============ */
function useTimeoutBag() {
  const bag = useRef<number[]>([]);
  const schedule = (ms: number, cb: () => void) => {
    const id = window.setTimeout(cb, ms);
    bag.current.push(id);
    return id;
  };
  const clearAll = () => {
    bag.current.forEach((id) => window.clearTimeout(id));
    bag.current = [];
  };
  return { schedule, clearAll };
}

/* ============ Logo ============ */
function BrokyMark({ className = "w-3.5 h-3.5", color = "#111" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="Broky">
      <path d="M32 10 L8 34 H56 Z" fill={color} />
      <rect x="16" y="38" width="32" height="4" rx="2" fill={color} />
      <path d="M32 54 L8 40 H56 Z" fill={color} />
    </svg>
  );
}

/* ============ Bubble ============ */
function ChatBubble({
  role,
  children,
  delay = 0,
  incoming = true,
  extraClass = "",
  size = "base", // "base" | "compact" | "mini"
}: {
  role: Role;
  children: React.ReactNode;
  delay?: number;
  incoming?: boolean;
  extraClass?: string;
  size?: "base" | "compact" | "mini";
}) {
  const isBroky = role === "broky";
  const sizeCls =
    size === "mini"
      ? "px-2 py-1 text-[8px]" // muy compacto
      : size === "compact"
      ? "px-2 py-1.5 text-[10px]"
      : "px-3 py-2 text-[13px]";

  return (
    <div
      className={`w-full flex ${isBroky ? "justify-start" : "justify-end"} ${extraClass}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {isBroky && (
        <div className="mr-2 mt-1 shrink-0 w-5 h-5 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
          <BrokyMark className="w-3.5 h-3.5" color={ACCENT} />
        </div>
      )}

      <div
        className={[
          "max-w-[85%] rounded-2xl leading-relaxed shadow-sm",
          sizeCls,
          isBroky ? "bg-white border border-neutral-200" : "bg-neutral-100 text-neutral-900",
          incoming ? "opacity-0 translate-y-2 animate-[in_240ms_ease-out_forwards]" : "",
        ].join(" ")}
      >
        {children}
      </div>

      {role === "user" && (
        <div className="ml-2 mt-1 shrink-0 w-5 h-5 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-500" />
        </div>
      )}

      <style jsx>{`
        @keyframes in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* ============ Foto minimalista ============ */
function PhotoPlaceholder({ className = "w-20 h-14" }: { className?: string }) {
  return (
    <div
      className={`${className} rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-center`}
      aria-label="Foto de departamento"
    >
      <svg viewBox="0 0 64 48" className="w-[70%] h-[70%]">
        <rect x="10" y="12" width="44" height="28" rx="4" fill="#E5E5E5" />
        {[0, 1, 2].map((c) =>
          [0, 1].map((r) => (
            <rect
              key={`${r}-${c}`}
              x={15 + c * 12}
              y={16 + r * 12}
              width="8"
              height="8"
              rx="1.5"
              fill="#D4D4D4"
            />
          ))
        )}
        <rect x="43" y="26" width="8" height="14" rx="1.5" fill="#D4D4D4" />
      </svg>
    </div>
  );
}

/* ============ Mini tarjeta compacta (results) ============ */
function MiniListingCompact({
  title,
  price,
  subtitle,
  selected = false,
  onClick,
  delay = 0,
  imgSrc,
}: {
  title: string;
  price: string;
  subtitle: string;
  selected?: boolean;
  onClick?: () => void;
  delay?: number;
  imgSrc?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        // Reduce padding on mobile to free up vertical space
        "w-full text-left bg-white border border-neutral-200 rounded-xl shadow-sm p-1.5 md:p-2 transition-all duration-200",
        selected ? "ring-2 ring-[rgba(140,5,41,0.25)]" : "ring-0",
        "opacity-0 translate-y-1 animate-[in_200ms_ease-out_forwards]",
      ].join(" ")}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-1.5 md:gap-2">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-neutral-200 shrink-0 overflow-hidden">
          {imgSrc ? (
            <img src={imgSrc} alt="Foto del departamento" className="w-full h-full object-contain p-0.5" />
          ) : null}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] md:text-[11px] font-medium text-neutral-900 truncate">{title}</p>
            <p className="text-[9.5px] md:text-[10.5px] font-semibold shrink-0" style={{ color: ACCENT }}>
              {price}
            </p>
          </div>
          <p className="text-[9px] md:text-[10px] text-neutral-500 truncate">{subtitle}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </button>
  );
}

/* ============ Typing (Card 1) ============ */
function Typing({ text, speed = 22, keySeed = 0 }: { text: string; speed?: number; keySeed?: number }) {
  const [t, setT] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setT(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, keySeed]);
  return (
    <span>
      {t}
      <span
        className="inline-block w-[2px] h-[1.1em] align-[-2px] ml-0.5"
        style={{ background: ACCENT }}
      />
    </span>
  );
}

/* ============ Bullet ============ */
function Bullet({ text }: { text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5" style={{ color: ACCENT }} />
      <p className="text-[11px]">{text}</p>
    </div>
  );
}

const FRAME =
  "w-[88%] max-w-[520px] mx-auto bg-white rounded-2xl border border-neutral-200 p-3 shadow-sm flex flex-col gap-2 relative min-h-[220px] md:min-h-[240px] lg:min-h-[260px] overflow-hidden";

/* ============ Principal ============ */
const ProductExplanation = () => {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ----- CARD 1 typing (loop) ----- */
  const typingExample =
    "Departamento 2D en Providencia, $650.000 máx, admite mascotas";
  const [typingText, setTypingText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    const c = setInterval(() => setShowCaret((p) => !p), 600);
    return () => clearInterval(c);
  }, []);

  useEffect(() => {
    if (!visibleCards.has(0)) return;
    let t: number | undefined;
    if (!deleting && typingText.length < typingExample.length) {
      t = window.setTimeout(
        () => setTypingText(typingExample.slice(0, typingText.length + 1)),
        35
      );
    } else if (!deleting && typingText.length === typingExample.length) {
      t = window.setTimeout(() => setDeleting(true), 900);
    } else if (deleting && typingText.length > 10) {
      t = window.setTimeout(
        () => setTypingText(typingExample.slice(0, typingText.length - 1)),
        16
      );
    } else if (deleting && typingText.length === 10) {
      setDeleting(false);
    }
    return () => (t ? clearTimeout(t) : undefined);
  }, [typingText, deleting, visibleCards]);

  /* ----- Reveal por scroll ----- */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.cardIndex || 0);
            setTimeout(
              () => setVisibleCards((prev) => new Set([...prev, idx])),
              idx * 120
            );
          }
        }
      },
      { threshold: 0.28 }
    );
    cardRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ----- Animación 2 (Resultados) LOOP ----- */
  const [showResultCards, setShowResultCards] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const resultsTimers = useTimeoutBag();

  useEffect(() => {
    if (!visibleCards.has(1)) return;
    resultsTimers.clearAll();

    const cycle = () => {
      setExpandedIndex(null);
      setShowResultCards(false);

      resultsTimers.schedule(250, () => setShowResultCards(true));
      resultsTimers.schedule(900, () => setExpandedIndex(0));
      resultsTimers.schedule(2600, () => setExpandedIndex(null));
      resultsTimers.schedule(3000, () => setShowResultCards(false));
      resultsTimers.schedule(3600, cycle);
    };

    cycle();
    return () => resultsTimers.clearAll();
  }, [visibleCards]);

  /* ----- Animación 3 (Document) LOOP ----- */
  const [docCycle, setDocCycle] = useState(0);
  const docTimers = useTimeoutBag();

  useEffect(() => {
    if (!visibleCards.has(2)) return;
    docTimers.clearAll();
    const cycle = () => {
      setDocCycle((k) => k + 1);
      docTimers.schedule(2400, cycle);
    };
    cycle();
    return () => docTimers.clearAll();
  }, [visibleCards]);

  /* ----- Animación 4 (Calendar) LOOP ----- */
  const [calMsgKey, setCalMsgKey] = useState(0);
  const [calShow, setCalShow] = useState(false);
  const [pickedDay, setPickedDay] = useState<number | null>(null);
  const [showAgent, setShowAgent] = useState(false);
  const calTimers = useTimeoutBag();

  useEffect(() => {
    if (!visibleCards.has(3)) return;
    calTimers.clearAll();

    const cycle = () => {
      setCalMsgKey((k) => k + 1);
      setCalShow(false);
      setPickedDay(null);
      setShowAgent(false);

      calTimers.schedule(40, () => setCalShow(true));
      calTimers.schedule(540, () => setPickedDay(12));
      calTimers.schedule(1040, () => setShowAgent(true));
      calTimers.schedule(3000, cycle);
    };

    cycle();
    return () => calTimers.clearAll();
  }, [visibleCards]);

  const cards = [
    {
      number: "01",
      title: "Cuéntale a Broky qué buscas",
      icon: Search,
      visual: "search",
      desc: 'Solo escribe el tipo de propiedad que necesitas (ej: "Departamento 2D en Providencia, $650.000 máx, admite mascotas").',
    },
    {
      number: "02",
      title: "Te mostramos las mejores opciones",
      icon: CheckSquare,
      visual: "results",
      desc: "En segundos recibes propiedades que realmente calzan contigo. Olvídate de filtrar en decenas de portales.",
    },
    {
      number: "03",
      title: "Resuelve todas tus dudas al momento",
      icon: FileText,
      visual: "document",
      desc: "Broky te entrega la info completa: gastos comunes, requisitos, ubicación exacta y más. Sin esperar respuestas.",
    },
    {
      number: "04",
      title: "Agenda visitas de inmediato",
      icon: CalendarIcon,
      visual: "calendar",
      desc: "Elige horarios y confirma en un clic. Broky coordina por ti, sin idas y vueltas.",
    },
  ] as const;

  const renderVisual = (visual: (typeof cards)[number]["visual"]) => {
    switch (visual) {
      /* —— CARD 1 —— */
      case "search":
        return (
          <div className={FRAME}>
            <ChatBubble role="broky" incoming delay={0}>
              Hola 👋 ¿qué propiedad estás buscando? Escríbeme y te ayudo.
            </ChatBubble>
            <ChatBubble role="user" incoming delay={120}>
              <span className="text-[14px]">
                {typingText}
                <span
                  className="inline-block w-[2px] h-[1.1em] align-[-2px] ml-0.5"
                  style={{
                    background: ACCENT,
                    opacity: showCaret ? 1 : 0,
                    transition: "opacity 120ms",
                  }}
                />
              </span>
            </ChatBubble>
          </div>
        );

      /* —— CARD 2 (RESULTS) ——  mensajes MINI */
      case "results": {
        const items = [
          {
            title: "Depto 2D/1B — Providencia",
            price: "$645.000",
            subtitle: "Av. Holanda 123 · 48 m² · Piso 7",
            desc: "Luminoso 48 m², balcón y cocina integrada. Conserjería 24/7, gimnasio y quincho. A pasos del metro y ciclovías…",
          },
          {
            title: "Depto 2D/1B — Providencia",
            price: "$630.000",
            subtitle: "Los Leones 456 · 46 m² · Piso 9",
            desc: "Departamento con balcón y buena luz natural. Edificio con lavandería y bicicletero…",
          },
          {
            title: "Depto 2D/2B — Providencia",
            price: "$650.000",
            subtitle: "Pedro de Valdivia 890 · 52 m² · Piso 5",
            desc: "Amplio, con bodega y logia. Excelente conectividad y servicios a pasos…",
          },
        ];

        return (
          <div className={`${FRAME} h-[220px] md:h-[240px] lg:h-[260px] gap-0 md:gap-2`}>
            {/* Compact bubbles on mobile to avoid clipping during animation */}
            <ChatBubble role="user" incoming delay={0} size="mini" extraClass="scale-[0.88] md:scale-100 leading-tight md:leading-relaxed">
              Departamento 2D en Providencia, $650.000 máx
            </ChatBubble>

            <ChatBubble
              role="broky"
              incoming
              delay={120}
              size="mini"
              extraClass="animate-[slideInLeft_320ms_ease-out_forwards] opacity-0 scale-[0.88] md:scale-100 leading-tight md:leading-relaxed"
            >
              Estas son 3 opciones que calzan con tu búsqueda:
            </ChatBubble>

            <div className="w-[85%] mx-auto space-y-1">
              {items.map((it, i) => {
                const selected = expandedIndex === i;
                return (
                  <div key={i} className="relative">
                    <MiniListingCompact
                      title={it.title}
                      price={it.price}
                      subtitle={it.subtitle}
                      selected={selected}
                      onClick={() => setExpandedIndex(i)}
                      delay={showResultCards ? i * 120 : 0}
                      imgSrc={
                        i === 0
                          ? "/image/living-room.svg"
                          : i === 1
                          ? "/image/studio-room.svg"
                          : i === 2
                          ? "/image/living-lounge.svg"
                          : undefined
                      }
                    />

                    <div
                      className={[
                        "overflow-hidden transition-all duration-350",
                        selected ? "max-h-32 md:max-h-36 opacity-100" : "max-h-0 opacity-0",
                      ].join(" ")}
                    >
                      <div className="pt-1.5 md:pt-2 px-2">
                        <p className="text-[10px] md:text-[10.5px] text-neutral-600 mb-1.5 md:mb-2">{it.desc}</p>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {i === 0 ? (
                            <div className="w-[68px] h-[48px] md:w-[80px] md:h-[56px] rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden">
                              <img src="/image/living-room.svg" alt="Foto principal Av. Holanda" className="w-full h-full object-contain p-1.5" />
                            </div>
                          ) : i === 1 ? (
                            <div className="w-[68px] h-[48px] md:w-[80px] md:h-[56px] rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden">
                              <img src="/image/studio-room.svg" alt="Foto principal Los Leones" className="w-full h-full object-contain p-1.5" />
                            </div>
                          ) : i === 2 ? (
                            <div className="w-[68px] h-[48px] md:w-[80px] md:h-[56px] rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden">
                              <img src="/image/living-lounge.svg" alt="Foto principal Pedro de Valdivia" className="w-full h-full object-contain p-1.5" />
                            </div>
                          ) : (
                            <PhotoPlaceholder className="w-[68px] h-[48px] md:w-[80px] md:h-[56px]" />
                          )}
                          {i === 0 ? (
                            <div className="w-[68px] h-[48px] md:w-[80px] md:h-[56px] rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden">
                              <img src="/image/bathroom.svg" alt="Baño Av. Holanda" className="w-full h-full object-contain p-1.5" />
                            </div>
                          ) : (
                            <PhotoPlaceholder className="w-[68px] h-[48px] md:w-[80px] md:h-[56px]" />
                          )}
                          {i === 0 ? (
                            <div className="w-[68px] h-[48px] md:w-[80px] md:h-[56px] rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden">
                              <img src="/image/garden.svg" alt="Áreas verdes / quincho Av. Holanda" className="w-full h-full object-contain p-1.5" />
                            </div>
                          ) : (
                            <PhotoPlaceholder className="w-[68px] h-[48px] md:w-[80px] md:h-[56px]" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <style jsx>{`
              @keyframes slideInLeft {
                from {
                  opacity: 0;
                  transform: translateX(-12px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
            `}</style>
          </div>
        );
      }

      /* —— CARD 3 ——  (compact) */
      case "document":
        return (
          <div className={FRAME}>
            <ChatBubble role="user" incoming={false} size="compact">
              ¿Aceptan mascotas medianas? ¿Cuánto son los gastos comunes? ¿Tiene bodega y cuál es la orientación?
            </ChatBubble>

            <ChatBubble
              key={docCycle}
              role="broky"
              incoming={false}
              size="compact"
              extraClass="opacity-0 animate-[slideInLeft_320ms_ease-out_forwards]"
            >
              <div className="space-y-1 text-[11px]">
                <Bullet text={<><b>Mascotas:</b> Sí, hasta 15&nbsp;kg (requiere garantía adicional).</>} />
                <Bullet text={<><b>Gastos comunes:</b> $90.000 aprox. (incluye agua caliente).</>} />
                <Bullet text={<><b>Bodega:</b> 1 unidad en subterráneo.</>} />
                <Bullet text={<><b>Orientación:</b> nororiente.</>} />
              </div>
            </ChatBubble>

            <style jsx>{`
              @keyframes slideInLeft {
                from {
                  opacity: 0;
                  transform: translateX(-12px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
            `}</style>
          </div>
        );

      /* —— CARD 4 ——  (calendario reducido 50% REAL + bubble acorde) */
      case "calendar":
        const CELL = 14; // px
        return (
          <div className={`${FRAME} h-[220px] md:h-[240px] lg:h-[260px] gap-0 md:gap-2`}>
            {/* Primer mensaje + calendario */}
            <ChatBubble
              key={`calmsg-${calMsgKey}`}
              role="broky"
              incoming
              delay={0}
              size="mini"
              extraClass="origin-top-left scale-[0.7] md:scale-100 leading-tight md:leading-relaxed"
            >
              <div className="text-left">
                <p className="mb-0.5 md:mb-1.5">
                  Estos son los horarios disponibles para visitar. Elige el que te acomode:
                </p>

                <div className="mx-auto inline-block rounded-xl border border-neutral-200 p-1.5 md:p-2 bg-white shadow-sm">
                  <div className="grid grid-cols-7 gap-[2px] text-[8px] md:text-[9px] text-neutral-500 mb-0.5 md:mb-1 text-center">
                    {["D", "L", "M", "M", "J", "V", "S"].map((d) => (
                      <div key={d} className="py-[2px]">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-[2px]">
                    {Array.from({ length: 28 }, (_, i) => {
                      const day = i + 1;
                      const picked = pickedDay === day;
                      return (
                        <div
                          key={day}
                          className={[
                            "rounded-[3px] flex items-center justify-center transition-all mx-auto text-[8px] md:text-[9px]",
                            picked ? "text-white" : "text-neutral-700",
                          ].join(" ")}
                          style={{
                            width: `${CELL}px`,
                            height: `${CELL}px`,
                            background: picked ? ACCENT : "transparent",
                            boxShadow: picked ? "0 0 0 4px rgba(140,5,41,0.10)" : "none",
                          }}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ChatBubble>

            {/* Confirmación */}
            {showAgent && (
              <ChatBubble
                role="broky"
                incoming={false}
                size="mini"
                extraClass="opacity-0 animate-[slideInLeft_320ms_ease-out_forwards] origin-top-left -mt-10 md:mt-0 scale-[0.7] md:scale-100 leading-tight md:leading-relaxed"
              >
                <span>
                  ¡Listo! Agendado para <b>jueves 12 a las 18:30</b>. Te atenderá:
                </span>
                <div className="mt-0 flex items-center gap-2 md:gap-2.5">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center">
                    <span className="text-[8px] md:text-[10px] font-semibold text-neutral-700">MR</span>
                  </div>
                  <div className="text-[8px] md:text-[10px]">
                    <p className="font-medium text-neutral-900">María Rojas</p>
                    <p className="text-[8px] md:text-[9.5px] text-neutral-500">Corredora asociada</p>
                    <p className="flex items-center gap-1 text-[8px] md:text-[9.5px] text-neutral-700 mt-0.5">
                      <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" /> +56 9 1234 5678
                    </p>
                  </div>
                </div>
                <p className="mt-0.5 text-[8px] md:text-[10px]">Se contactará contigo enseguida para confirmar detalles.</p>
              </ChatBubble>
            )}

            <style jsx>{`
              @keyframes slideInLeft {
                from {
                  opacity: 0;
                  transform: translateX(-12px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
            `}</style>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="product" className="mt-4 lg:mt-2 py-6 lg:py-8 w-full">
      <div className="container">
        {/* Título pequeño centrado: ¿Cómo funciona? */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ background: ACCENT }}
            aria-hidden
          />
          <p className="text-neutral-900 text-lg font-medium">¿Cómo funciona?</p>
        </div>

        <div className="space-y-10">
          {[0, 1, 2, 3].map((index) => {
            const defs = [
              {
                number: "01",
                title: "Cuéntale a Broky qué buscas",
                desc: 'Solo escribe el tipo de propiedad que necesitas (ej: "Departamento 2D en Providencia, $650.000 máx, admite mascotas").',
                icon: Search,
                visual: "search",
              },
              {
                number: "02",
                title: "Te mostramos las mejores opciones",
                desc: "En segundos recibes propiedades que realmente calzan contigo. Olvídate de filtrar en decenas de portales.",
                icon: CheckSquare,
                visual: "results",
              },
              {
                number: "03",
                title: "Resuelve todas tus dudas al momento",
                desc: "Broky te entrega la info completa: gastos comunes, requisitos, ubicación exacta y más. Sin esperar respuestas.",
                icon: FileText,
                visual: "document",
              },
              {
                number: "04",
                title: "Agenda visitas de inmediato",
                desc: "Elige horarios y confirma en un clic. Broky coordina por ti, sin idas y vueltas.",
                icon: CalendarIcon,
                visual: "calendar",
              },
            ] as const;

            const item = defs[index];
            const isEven = index % 2 === 0;
            const isVisible = visibleCards.has(index);

            return (
              <div
                key={index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                data-card-index={index}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-500 ease-out ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : isEven
                    ? "-translate-x-12 opacity-0"
                    : "translate-x-12 opacity-0"
                }`}
              >
                <div className="lg:grid lg:grid-cols-2 lg:gap-0">
                  {/* Visual */}
                  <div
                    className={`${isEven ? "lg:order-1" : "lg:order-2"} p-8 lg:p-10 flex items-center justify-center bg-neutral-50 min-h-[220px] md:min-h-[260px] lg:min-h-[300px]`}
                  >
                    {renderVisual(item.visual as any)}
                  </div>

                  {/* Texto */}
                  <div
                    className={`${isEven ? "lg:order-2" : "lg:order-1"} p-8 lg:p-10 flex flex-col justify-center min-h-[220px] md:min-h-[260px] lg:min-h-[300px]`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span
                        className="w-11 h-11 text-white rounded-xl font-bold text-lg flex items-center justify-center"
                        style={{ background: ACCENT }}
                      >
                        {item.number}
                      </span>
                      <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-neutral-600 text-[15px] leading-relaxed mb-5">{item.desc}</p>
                    <a
                      href="#hero"
                      onClick={(e) => {
                        e.preventDefault();
                        trackClick({ buttonId: 'probar-ahora', buttonText: 'Probar ahora' }).catch(() => {})
                        const el = document.getElementById('hero');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center font-semibold"
                      style={{ color: ACCENT }}
                    >
                      Probar ahora
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductExplanation;
