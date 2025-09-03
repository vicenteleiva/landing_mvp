"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Target,
  FileText,
  MessageSquare,
  CalendarClock,
  Globe2,
} from "lucide-react";

type Icon = React.ElementType;

const ACCENT = "#8C0529";

const items: { icon: Icon; title: string }[] = [
  { icon: Target,        title: "Encuentras en minutos opciones que calzan contigo" },
  { icon: FileText,      title: "Obtienes información clara y completa de cada propiedad" },
  { icon: MessageSquare, title: "Recibes respuestas inmediatas, sin esperas" },
  { icon: CalendarClock, title: "Agendas visitas con total flexibilidad" },
  { icon: Globe2,        title: "Exploras el mercado completo en un solo lugar" },
];

const Features = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setStart(true)),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="relative py-16 lg:py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-6 lg:px-12">
        {/* Mini heading: ¿Por qué Broky? */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ background: ACCENT }}
            aria-hidden
          />
          <p className="text-neutral-900 text-lg font-medium">¿Por qué Broky?</p>
        </div>

        {/* Ribbon */}
        <div className="relative">
          {/* Línea central */}
          <div className="absolute left-0 right-0 top-9 lg:top-10 h-px bg-neutral-200/70" />

          {/* 5 hitos */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-6">
            {items.map(({ icon: Icon, title }, i) => (
              <li key={i} className="relative">
                {/* Nodo (icono) */}
                <div
                  className={[
                    "mx-auto w-max relative opacity-0",
                    start ? "animate-[nodeIn_520ms_ease-out_forwards]" : "",
                  ].join(" ")}
                  style={{ animationDelay: start ? `${i * 110}ms` : "0ms" }}
                >
                  <span
                    className="absolute inset-0 -z-10 rounded-full blur-md"
                    style={{ background: "rgba(140,5,41,0.10)" }}
                    aria-hidden
                  />
                  <div
                    className="rounded-full border bg-white shadow-sm grid place-items-center"
                    style={{
                      width: 56,
                      height: 56,
                      borderColor: "rgba(140,5,41,0.22)",
                    }}
                  >
                    <div
                      className="grid place-items-center rounded-full"
                      style={{
                        width: 40,
                        height: 40,
                        background: "rgba(140,5,41,0.08)",
                        border: "1px solid rgba(140,5,41,0.18)",
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: ACCENT }} />
                    </div>
                  </div>
                </div>

                {/* Texto */}
                <p
                  className={[
                    "mx-auto mt-4 max-w-[220px] text-center text-[14px] leading-snug",
                    "text-neutral-900 font-medium opacity-0",
                    start ? "animate-[copyIn_520ms_ease-out_forwards]" : "",
                  ].join(" ")}
                  style={{ animationDelay: start ? `${i * 110 + 80}ms` : "0ms" }}
                >
                  {title}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Microgradiente sutil (coherente con el resto) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(140,5,41,0.04) 0%, rgba(140,5,41,0) 70%)",
        }}
        aria-hidden
      />

      {/* Keyframes */}
      <style jsx>{`
        @keyframes nodeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes copyIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Features;
