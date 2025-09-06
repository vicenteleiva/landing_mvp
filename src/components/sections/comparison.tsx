"use client";

import { useEffect, useRef, useState } from "react";
import { trackClick } from "@/lib/analytics";

export const ComparisonSection = () => {
  const pairs: { left: string; right: string }[] = [
    {
      left:
        "Entras a varios portales y pierdes horas abriendo y comparando páginas.",
      right: "Escribes lo que buscas en un chat simple y listo.",
    },
    {
      left:
        "Revisas decenas de anuncios y la información siempre es confusa o incompleta.",
      right:
        "Recibes opciones claras en minutos con precio, gastos y requisitos definidos.",
    },
    {
      left:
        "Contactas corredores o dueños y pasas días esperando respuestas para resolver tus dudas.",
      right: "Aclaras tus dudas al instante en un solo lugar.",
    },
    {
      left:
        "Intentas coordinar visitas y terminas en un proceso lento y lleno de idas y vueltas.",
      right: "Agendas tu visita en un clic y Broky se encarga del resto.",
    },
  ];

  // Animación al entrar en viewport
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [startAnim, setStartAnim] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setStartAnim(true);
        });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-20" ref={rootRef}>
      <div className="container">
        {/* Título centrado (como lo querías) */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-900 mb-3">
            La mejor forma de encontrar la propiedad que sueñas
          </h2>
          <p className="text-base text-neutral-600">
            Dos caminos, un resultado. Con Broky llegas antes.
          </p>
        </div>

        {/* Cabecera de comparación: etiquetas + VS */}
        <div className="mb-6">
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-red-200" />
              <span className="inline-flex items-center rounded-full bg-red-50 text-red-800 border border-red-100 px-4 py-2 text-sm font-medium">
                Búsqueda tradicional
              </span>
            </div>
            <div className="relative">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border bg-white shadow-sm text-xs font-semibold text-neutral-700 select-none">
                VS
              </span>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <span className="inline-flex items-center rounded-full bg-green-50 text-green-800 border border-green-100 px-4 py-2 text-sm font-medium">
                Con Broky
              </span>
              <div className="h-px flex-1 bg-green-200" />
            </div>
          </div>

          {/* Resultados headline arriba (solo desktop) */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
            <h3
              className={[
                "text-sm md:text-base font-semibold tracking-wide uppercase text-red-700 md:text-left text-center opacity-0",
                startAnim ? "animate-[headlineLeft_420ms_ease-out_forwards]" : "",
              ].join(" ")}
            >
              Semanas de búsqueda, cansancio e inseguridad
            </h3>
            <h3
              className={[
                "text-sm md:text-base font-semibold tracking-wide uppercase text-green-700 md:text-right text-center opacity-0",
                startAnim ? "animate-[headlineRight_420ms_ease-out_forwards]" : "",
              ].join(" ")}
            >
              Minutos para encontrar, resolver y agendar seguro
            </h3>
          </div>
        </div>

        {/* PARES DE BUBBLES - Desktop (vista original) */}
        <div className="hidden md:block space-y-3">
          {pairs.map((p, i) => {
            const delay = 120 * i; // cascada
            return (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 items-stretch">
                {/* Columna izquierda (negativa) */}
                <div className="h-full">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={[
                        "hidden md:inline-flex shrink-0 items-center justify-center rounded-full border border-red-200 text-red-600 bg-red-50 w-8 h-8 text-sm font-bold opacity-0",
                        startAnim ? "animate-[iconLeft_420ms_ease-out_forwards]" : "",
                      ].join(" ")}
                      style={{ animationDelay: startAnim ? `${delay}ms` : "0ms" }}
                      aria-hidden
                    >
                      ×
                    </span>
                    <div
                      className={[
                        "flex-1 flex justify-center opacity-0",
                        startAnim ? "animate-[bubbleLeft_420ms_ease-out_forwards]" : "",
                      ].join(" ")}
                      style={{ animationDelay: startAnim ? `${delay}ms` : "0ms" }}
                    >
                      <div className="w-full max-w-[520px] md:max-w-[480px] lg:max-w-[520px] rounded-2xl bg-red-50/90 border border-red-100 text-red-900 shadow-sm px-4 py-3">
                        <p className="text-[14px] leading-snug font-medium min-h-[48px] flex items-center">{p.left}</p>
                      </div>
                    </div>
                    <span className="md:w-8 md:h-8 md:inline-flex hidden" />
                  </div>
                </div>

                {/* Columna derecha (positiva) */}
                <div className="h-full">
                  <div className="flex items-center justify-between gap-3">
                    <span className="md:w-8 md:h-8 md:inline-flex hidden" />
                    <div
                      className={[
                        "flex-1 flex justify-center opacity-0",
                        startAnim ? "animate-[bubbleRight_420ms_ease-out_forwards]" : "",
                      ].join(" ")}
                      style={{ animationDelay: startAnim ? `${delay + 60}ms` : "0ms" }}
                    >
                      <div className="w-full max-w-[520px] md:max-w-[480px] lg:max-w-[520px] rounded-2xl bg-green-50/90 border border-green-100 text-green-900 shadow-sm px-4 py-3">
                        <p className="text-[14px] leading-snug font-medium min-h-[48px] flex items-center">{p.right}</p>
                      </div>
                    </div>
                    <span
                      className={[
                        "hidden md:inline-flex shrink-0 items-center justify-center rounded-full border border-green-200 text-green-600 bg-green-50 w-8 h-8 text-sm font-bold opacity-0",
                        startAnim ? "animate-[iconRight_420ms_ease-out_forwards]" : "",
                      ].join(" ")}
                      style={{ animationDelay: startAnim ? `${delay + 60}ms` : "0ms" }}
                      aria-hidden
                    >
                      ✓
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: agrupar por categoría */}
        <div className="md:hidden space-y-6">
          {/* Búsqueda tradicional */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-red-200" />
              <span className="inline-flex items-center rounded-full bg-red-50 text-red-800 border border-red-100 px-4 py-2 text-sm font-medium">Búsqueda tradicional</span>
              <div className="h-px flex-1 bg-red-200" />
            </div>
            <h3
              className={[
                "text-sm font-semibold tracking-wide uppercase text-red-700 text-center opacity-0 mb-2",
                startAnim ? "animate-[headlineLeft_420ms_ease-out_forwards]" : "",
              ].join(" ")}
            >
              Semanas de búsqueda, cansancio e inseguridad
            </h3>
            <div className="space-y-3">
              {pairs.map((p, i) => (
                <div
                  key={`m-left-${i}`}
                  className={["opacity-0", startAnim ? "animate-[bubbleLeft_420ms_ease-out_forwards]" : ""].join(" ")}
                  style={{ animationDelay: startAnim ? `${i * 120}ms` : "0ms" }}
                >
                  <div className="w-full rounded-2xl bg-red-50/90 border border-red-100 text-red-900 shadow-sm px-4 py-3">
                    <p className="text-[14px] leading-snug font-medium">{p.left}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Con Broky */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-green-200" />
              <span className="inline-flex items-center rounded-full bg-green-50 text-green-800 border border-green-100 px-4 py-2 text-sm font-medium">Con Broky</span>
              <div className="h-px flex-1 bg-green-200" />
            </div>
            <h3
              className={[
                "text-sm font-semibold tracking-wide uppercase text-green-700 text-center opacity-0 mb-2",
                startAnim ? "animate-[headlineRight_420ms_ease-out_forwards]" : "",
              ].join(" ")}
            >
              Minutos para encontrar, resolver y agendar seguro
            </h3>
            <div className="space-y-3">
              {pairs.map((p, i) => (
                <div
                  key={`m-right-${i}`}
                  className={["opacity-0", startAnim ? "animate-[bubbleRight_420ms_ease-out_forwards]" : ""].join(" ")}
                  style={{ animationDelay: startAnim ? `${i * 120 + 60}ms` : "0ms" }}
                >
                  <div className="w-full rounded-2xl bg-green-50/90 border border-green-100 text-green-900 shadow-sm px-4 py-3">
                    <p className="text-[14px] leading-snug font-medium">{p.right}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            className="bg-[#8C0529] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity duration-200 mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => {
              trackClick({ buttonId: 'cta-probar-broky-ahora', buttonText: 'Probar Broky ahora' }).catch(() => {})
              const el = document.getElementById('hero');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Ir al inicio para probar Broky"
          >
            Probar Broky ahora
          </button>
          <p className="text-neutral-600">Simple, seguro y gratis</p>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes headlineLeft {
          from {
            opacity: 0;
            transform: translate(-10px, -8px);
          }
          to {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
        @keyframes headlineRight {
          from {
            opacity: 0;
            transform: translate(10px, -8px);
          }
          to {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
        @keyframes bubbleLeft {
          from {
            opacity: 0;
            transform: translate(-14px, -10px);
          }
          to {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
        @keyframes bubbleRight {
          from {
            opacity: 0;
            transform: translate(14px, -10px);
          }
          to {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
        @keyframes iconLeft {
          from {
            opacity: 0;
            transform: translate(-10px, -8px) rotate(-8deg);
          }
          to {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg);
          }
        }
        @keyframes iconRight {
          from {
            opacity: 0;
            transform: translate(10px, -8px) rotate(8deg);
          }
          to {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg);
          }
        }
      `}</style>
    </section>
  );
};
