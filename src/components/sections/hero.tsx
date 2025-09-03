"use client";

import { ArrowUp } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

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
    if (!value.trim()) return;
    console.log("Query:", value.trim());
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <section className="bg-background py-16 md:py-20 px-6 md:px-16 lg:px-24 w-full">
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
                onClick={onSubmit}
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
    </section>
  );
};

export default HeroSection;
