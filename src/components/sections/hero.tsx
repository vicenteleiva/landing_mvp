"use client";

import { ArrowUp, Plus } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const ACCENT = "#8C0529";

const HeroSection = () => {
  // Typing carousel (mismo comportamiento que tenías)
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Valor real que escribe el usuario
  const [value, setValue] = useState("");
  const areaRef = useRef<HTMLTextAreaElement | null>(null);

  const examples = [
    "Busco departamento 2D en Providencia, $600.000 máx",
    "Quiero arrendar una casa en Santiago Centro con 3 dormitorios",
    "Necesito un estudio amoblado en Ñuñoa cerca del metro",
    "Busco comprar casa 4D en Las Condes con jardín",
    "Quiero arrendar departamento 1D en Vitacura, amoblado",
  ];

  // Auto-grow del textarea
  const autoGrow = () => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const h = Math.min(160, Math.max(56, el.scrollHeight));
    el.style.height = `${h}px`;
  };

  useEffect(() => {
    autoGrow();
  }, [value]);

  // Animación del placeholder
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
    if (!value.trim()) return;
    // Aquí puedes disparar tu acción (navigate, open modal, etc.)
    console.log("Query:", value.trim());
    // reset opcional
    // setValue("");
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <section className="bg-background py-20 px-6 md:px-16 lg:px-24 !w-full !h-[432px]">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-12 text-center">
          {/* Título */}
          <div className="space-y-6">
            <h1 className="text-4xl leading-tight text-primary !font-(family-name:--font-inter) !font-bold !tracking-[-3.5px] md:!text-[51px] lg:!text-6xl">
              Encuentra tu propiedad ideal en minutos con IA
            </h1>
          </div>

          {/* Composer estilo chat */}
          <div className="mx-auto max-w-3xl">
            <div
              className="
                relative rounded-2xl border border-neutral-200/70 bg-white
                shadow-[0_6px_30px_-12px_rgba(0,0,0,0.15)]
                transition focus-within:border-neutral-300
              "
            >
              {/* Botón + (izquierda) */}
              <button
                type="button"
                aria-label="Añadir"
                className="
                  absolute left-3 top-1/2 -translate-y-1/2
                  inline-flex items-center justify-center
                  w-9 h-9 rounded-lg border border-neutral-200 bg-neutral-50
                  text-neutral-600 hover:bg-neutral-100 active:scale-[0.98] transition
                "
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Textarea */}
              <textarea
                ref={areaRef}
                rows={2}
                onInput={autoGrow}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Describe qué propiedad buscas"
                placeholder={currentText}
                className="
                  block w-full resize-none
                  bg-transparent
                  pl-14 pr-14 py-4
                  text-[16px] md:text-[17px] leading-[1.35]
                  placeholder:text-neutral-400
                  outline-none
                  rounded-2xl
                "
              />

              {/* Botón enviar (derecha) */}
              <button
                type="button"
                onClick={onSubmit}
                aria-label="Enviar consulta"
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  inline-flex items-center justify-center
                  h-10 px-3 rounded-full text-white
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
    </section>
  );
};

export default HeroSection;
