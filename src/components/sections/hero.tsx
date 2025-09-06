"use client";

import { ArrowUp } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trackChat, trackClick } from "@/lib/analytics";

const ACCENT = "#8C0529";

const HeroSection = () => {
  // Animación de placeholder
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Valor real que escribe el usuario
  const [value, setValue] = useState("");
  const areaRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);

  const examples = [
    "Busco departamento 2D en Providencia, $600.000 máx",
    "Quiero arrendar una casa en Santiago Centro con 3 dormitorios",
    "Necesito un estudio amoblado en Ñuñoa cerca del metro",
    "Busco comprar casa 4D en Las Condes con jardín",
    "Quiero arrendar departamento 1D en Vitacura, amoblado",
  ];

  // Auto-ajustar altura del textarea
  const autoGrow = () => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const h = Math.min(200, Math.max(100, el.scrollHeight)); // mínimo 100px, máximo 200px
    el.style.height = `${h}px`;
  };

  useEffect(() => {
    autoGrow();
  }, [value]);

  // Animación de typing del placeholder
  useEffect(() => {
    const currentExample = examples[currentIndex];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(pauseTimer);
    }

    if (isTyping) {
      if (currentText.length < currentExample.length) {
        const typingTimer = setTimeout(() => {
          setCurrentText(currentExample.slice(0, currentText.length + 1));
        }, 50);
        return () => clearTimeout(typingTimer);
      } else {
        setIsPaused(true);
      }
    } else {
      if (currentText.length > 0) {
        const deletingTimer = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 30);
        return () => clearTimeout(deletingTimer);
      } else {
        setCurrentIndex((prev) => (prev + 1) % examples.length);
        setIsTyping(true);
      }
    }
  }, [currentText, currentIndex, isTyping, isPaused, examples]);

  const onSubmit = () => {
    const q = value.trim();
    if (!q) return;
    try {
      // Track chat message (fire-and-forget)
      trackChat({ message: q }).catch(() => {});
      const url = `/chat?q=${encodeURIComponent(q)}`;
      setTransitioning(true);
      // Pequeño delay para permitir pintar el overlay antes de navegar
      setTimeout(() => router.push(url), 10);
    } catch (e) {
      console.error(e);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <section id="hero" className="relative min-h-[60svh] py-8 md:py-12 px-6 md:px-16 lg:px-24 w-full">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-12 text-center">
          {/* Título */}
          <div className="space-y-6">
            <h1
              className="text-4xl leading-tight text-primary !font-(family-name:--font-inter) !font-bold break-words whitespace-normal tracking-wide md:!text-[51px] lg:!text-6xl"
              style={{ wordBreak: 'break-word', hyphens: 'auto', letterSpacing: '0.01em' }}
            >
              Encuentra tu propiedad ideal en minutos con IA
            </h1>
          </div>

          {/* Cuadro estilo chat */}
          <div className="mx-auto max-w-3xl">
            <div
              className="
                relative rounded-2xl border border-neutral-200/70 bg-white
                shadow-[0_6px_30px_-12px_rgba(0,0,0,0.15)]
                transition focus-within:border-neutral-300
              "
            >
              <textarea
                ref={areaRef}
                rows={4}
                onInput={autoGrow}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Describe qué propiedad buscas"
                placeholder={currentText}
                className="
                  block w-full resize-none
                  bg-transparent
                  px-5 pr-14 py-6
                  text-[16px] md:text-[17px] leading-[1.5]
                  placeholder:text-neutral-400
                  outline-none
                  rounded-2xl
                "
              />

              {/* Botón enviar */}
              <button
                type="button"
                onClick={() => {
                  trackClick({ buttonId: "hero-send", buttonText: "Enviar" }).catch(() => {});
                  onSubmit();
                }}
                aria-label="Enviar consulta"
                className="
                  absolute right-4 bottom-4
                  inline-flex items-center justify-center
                  h-10 w-10 rounded-full text-white
                  hover:opacity-90 active:scale-[0.99] transition
                "
                style={{ backgroundColor: ACCENT }}
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subtítulo */}
          <div className="space-y-4">
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Escribe lo que buscas y deja que Broky haga el resto.
            </p>
          </div>
        </div>
      </div>

      {transitioning && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-blue-50 via-white to-white flex flex-col">
          {/* Header con logo a la izquierda y solo Contacto a la derecha */}
          <header className="px-6 md:px-8 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/image/broky-logo-light.webp" alt="Broky" className="h-6 w-6" />
                <span className="font-semibold text-neutral-900">Broky</span>
              </div>
              <Link href="/contacto" onClick={() => trackClick({ buttonId: 'overlay-contacto', buttonText: 'Contacto' }).catch(() => {})} className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Contacto</Link>
            </div>
          </header>

          {/* Hero replicado para animar: título/subtítulo se difuminan */}
          <div className="mx-auto max-w-4xl w-full px-6 md:px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 text-center opacity-100 animate-[fadeOut_420ms_ease-out_forwards] [animation-delay:40ms]">
              Encuentra tu propiedad ideal en minutos con IA
            </h1>
            <p className="text-center text-neutral-600 mt-6 opacity-100 animate-[fadeOut_420ms_ease-out_forwards] [animation-delay:60ms]">
              Escribe lo que buscas y deja que Broky haga el resto.
            </p>
          </div>

          {/* Card del chat que baja y reduce altura */}
          <div className="flex-1 w-full relative">
            <div className="mx-auto max-w-3xl px-6 md:px-8">
              <div className="relative">
                <div className="rounded-2xl border border-neutral-200 bg-white shadow-[0_6px_30px_-12px_rgba(0,0,0,0.15)] px-5 pr-14 py-6 overflow-hidden animate-[chatSlide_140ms_cubic-bezier(.22,.65,.3,1)_forwards] will-change-transform">
                  <div className="text-left text-neutral-400">{value ? value : ""}</div>
                </div>
                {/* Mensaje del usuario que vuela a la zona de mensajes */}
                {value.trim() && (
                  <div className="absolute right-4 -bottom-4 animate-[msgFly_140ms_cubic-bezier(.22,.65,.3,1)_forwards] will-change-transform">
                    <div className="bg-neutral-100 text-neutral-900 rounded-2xl px-4 py-3 shadow-sm max-w-[85vw] text-[15px]">
                      {value.trim()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input final en la parte inferior, simulando el chat */}
          <div className="sticky bottom-0 inset-x-0 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-full bg-white border border-neutral-200 shadow-[0_6px_24px_-12px_rgba(0,0,0,0.2)] flex items-center gap-2 px-4 py-2">
                <div className="flex-1 text-left text-neutral-400 text-[15px] py-1">Cargando…</div>
                <div className="inline-flex items-center justify-center rounded-full h-8 w-8 text-white" style={{ backgroundColor: ACCENT }}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v2" /><path d="M12 20v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M4.93 19.07l1.41-1.41" /><path d="M17.66 6.34l1.41-1.41" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-[12px] text-neutral-500 mt-2">Broky está en beta.</p>
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeOut { to { opacity: 0; transform: translateY(-6px); } }
            /* Calcula el destino para que el card coincida con la zona del chat */
            @keyframes chatSlide {
              0% { transform: translateY(0) scaleY(1); opacity: 1; }
              100% { transform: translateY(calc(100svh - 164px)) scaleY(0.62); opacity: 1; }
            }
            @keyframes msgFly {
              0% { transform: translate(0, 0); }
              100% { transform: translate(-4px, calc(-100svh + 164px)); }
            }
          `}</style>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
