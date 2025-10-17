"use client";

import { ArrowUp } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { trackChat, trackClick, trackForm } from "@/lib/analytics";
import { safeFbqTrack } from "@/lib/meta";
import {
  createMetaEventId,
  getMetaBrowserIdentifiers,
} from "@/lib/meta/client";

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
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState<"query" | "contact" | "done">("query");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  useEffect(() => {
    if (step === "contact" && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [step]);

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
    if (step !== "query") return;
    const q = value.trim();
    if (!q) return;
    try {
      // Track chat message (fire-and-forget)
      trackChat({ message: q }).catch(() => {});
      setSearchQuery(q);
      setStep("contact");
      setValue("");
    } catch (e) {
      console.error(e);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (step !== "query") return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const submitContact = async () => {
    if (step !== "contact" || submitting) return;
    const trimmedName = contactName.trim();
    const trimmedPhone = contactPhone.trim();
    if (!trimmedName || !trimmedPhone) {
      setErrorMessage("Por favor ingresa tu nombre y número de contacto.");
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);
    trackClick({ buttonId: "hero-contact-submit", buttonText: "Enviar contacto" }).catch(() => {});
    try {
      const eventId = createMetaEventId("landing-lead");
      const eventTime = Math.floor(Date.now() / 1000);
      const { fbp, fbc } = getMetaBrowserIdentifiers();
      const eventSourceUrl =
        typeof window !== "undefined" ? window.location.href : undefined;
      const result = await trackForm({
        formId: "hero-contact",
        fields: {
          query: searchQuery,
          name: trimmedName,
          phone: trimmedPhone,
        },
      });
      if (result?.status && result.status >= 300) {
        throw new Error("Failed to record form submission");
      }
      console.log("[FLOW][LANDING] fetch /api/meta/landing", {
        eventId,
        hasFbp: Boolean(fbp),
        hasFbc: Boolean(fbc),
      });
      try {
        const res = await fetch("/api/meta/landing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            eventTime,
            phone: trimmedPhone,
            searchQuery,
            fbp,
            fbc,
            eventSourceUrl,
          }),
        });
        if (!res.ok) {
          console.warn("[FLOW][LANDING] fetch failed", { status: res.status });
        }
      } catch (error) {
        console.warn("[FLOW][LANDING] fetch error", error);
      }
      await safeFbqTrack(
        "Lead",
        { content_name: "landing_contact" },
        { dedupeKey: "Lead:landing_contact", maxWaitMs: 4000, eventId },
      );
      setStep("done");
      setContactName("");
      setContactPhone("");
    } catch (e) {
      console.error(e);
      setErrorMessage("No pudimos registrar tu contacto. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
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
              Encontramos tu propiedad ideal{" "}
              <span
                className="font-bold text-black px-1"
                style={{
                  boxShadow: "inset 0 -0.99em 0 #FDE68A",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                cueste lo que cueste
              </span>
            </h1>
          </div>

          {/* Cuadro estilo chat */}
          <div className="mx-auto max-w-3xl">
            {step === "query" && (
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
            )}

            {step === "contact" && (
              <div className="rounded-2xl border border-neutral-200/70 bg-white shadow-[0_6px_30px_-12px_rgba(0,0,0,0.15)] px-6 py-8 md:px-8 md:py-10 text-left space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">Tu búsqueda</p>
                  <div className="mt-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm md:text-base text-neutral-700">
                    {searchQuery}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="hero-name" className="text-sm font-medium text-neutral-700">
                      Nombre
                    </label>
                    <input
                      id="hero-name"
                      ref={nameInputRef}
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      type="text"
                      autoComplete="name"
                      placeholder="Escribe tu nombre"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm md:text-base text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="hero-phone" className="text-sm font-medium text-neutral-700">
                      Número de contacto
                    </label>
                    <input
                      id="hero-phone"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          submitContact();
                        }
                      }}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+56 9 1234 5678"
                      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm md:text-base text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    />
                  </div>
                </div>
                {errorMessage ? (
                  <p className="text-sm text-red-600">{errorMessage}</p>
                ) : (
                  <p className="text-sm text-neutral-500">
                    Usamos estos datos solo para enviarte las opciones perfectas para ti.
                  </p>
                )}
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Paso final</p>
                  <button
                    type="button"
                    onClick={submitContact}
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ backgroundColor: ACCENT }}
                  >
                    {submitting ? "Enviando…" : "Enviar"}
                  </button>
                </div>
              </div>
            )}

            {step === "done" && (
              <div className="rounded-2xl border border-neutral-200/70 bg-white shadow-[0_6px_30px_-12px_rgba(0,0,0,0.15)] px-6 py-10 md:px-8 md:py-12 text-center space-y-5">
                <h3 className="text-2xl font-semibold text-neutral-900">¡Gracias por confiar en nosotros!</h3>
                <p className="text-sm md:text-base text-neutral-600">
                  Te contactaremos en menos de 48 horas con propiedades que calzan con tu búsqueda:
                </p>
                <div className="mx-auto max-w-md rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                  “{searchQuery}”
                </div>
                <p className="text-xs text-neutral-400 uppercase tracking-[0.2em]">Equipo Broky</p>
              </div>
            )}
          </div>

          {/* Subtítulo */}
          <div className="space-y-4">
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Escribe en detalle lo que necesitas y te contactaremos con las mejores opciones.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
