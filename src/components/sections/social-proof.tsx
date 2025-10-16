"use client";

import type { CSSProperties, MouseEventHandler } from "react";
import { Quote } from "lucide-react";
import { trackClick } from "@/lib/analytics";

const ACCENT = "#8C0529";

const TESTIMONIALS = [
  {
    id: "francisca-caroca",
    name: "Francisca Caroca",
    role: "Arrendó departamento en Ñuñoa",
    quote:
      "Llevaba literal 3 semanas tratando de encontrar departamento en Ñuñoa y no pude, luego vi el anuncio de los chicos de Broky y les envié los detalles del departamento que buscaba. No se demoraron nada en enviarme opciones increíbles las cuales me gustaron y gestionaron todo para la visita con el corredor, luego me acompañaron para el proceso de arriendo. Fue increíble se pasaron!!!",
    ctaId: "probar-ahora-social-proof-francisca",
  },
  {
    id: "juan-carlos-herrera",
    name: "Juan Carlos Herrera",
    role: "Arrendó departamento en Santiago centro",
    quote:
      "Estaba agotado de escribirle a corredores que ni siquiera respondían. Envié mi búsqueda a Broky y al día siguiente ya tenía tres departamentos que realmente encajaban con lo que necesitaba. Me ayudaron a resolver dudas sobre gastos comunes y requisitos, y cuando decidí arrendar uno, me acompañaron en todo el proceso hasta firmar el contrato. 100% recomendado, me ahorraron muchísimo tiempo, estrés y todo lo hicieron gratis gracias",
    ctaId: "probar-ahora-social-proof-juan-carlos",
  },
] as const;

const highlightStyle: CSSProperties = {
  boxShadow: "inset 0 -0.99em 0 #FDE68A",
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
};

const SocialProof = () => {
  const handleCtaClick =
    (buttonId: string): MouseEventHandler<HTMLAnchorElement> =>
    (event) => {
      event.preventDefault();
      trackClick({ buttonId, buttonText: "Probar ahora" }).catch(() => {});
      const el = document.getElementById("hero");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };

  return (
    <section id="social-proof" className="py-16 md:py-20">
      <div className="container max-w-5xl">
        <div className="flex flex-col items-center text-center gap-4 mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900">
            +200 personas les hemos ayudado a{" "}
            <span className="px-1 font-semibold" style={highlightStyle}>
              encontrar su propiedad
            </span>
          </h2>
          <p className="text-sm md:text-base text-neutral-600 max-w-2xl">
            Queremos que tu experienca de arrendar o comprar una propiedad sea la mejor posible.
          </p>
        </div>

        <div className="grid gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.id}
              className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.12)] px-8 py-10 md:px-12"
            >
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                      Testimonio
                    </p>
                    <p className="mt-1 text-lg md:text-xl font-semibold text-neutral-900">
                      {testimonial.name}
                    </p>
                    {testimonial.role ? (
                      <p className="text-xs md:text-sm text-neutral-500">{testimonial.role}</p>
                    ) : null}
                  </div>
                  <div
                    className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full"
                    style={{
                      background: "rgba(140,5,41,0.08)",
                      border: "1px solid rgba(140,5,41,0.24)",
                    }}
                  >
                    <Quote className="h-5 w-5" style={{ color: ACCENT }} />
                  </div>
                </div>

                <blockquote className="text-base md:text-lg leading-relaxed text-neutral-700">
                  “{testimonial.quote}”
                </blockquote>

                <a
                  href="#hero"
                  onClick={handleCtaClick(testimonial.ctaId)}
                  className="inline-flex items-center font-semibold"
                  style={{ color: ACCENT }}
                >
                  Probar ahora
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              <div
                className="pointer-events-none absolute -right-20 top-1/2 hidden h-40 w-40 -translate-y-1/2 rounded-full blur-3xl sm:block"
                style={{ background: "rgba(140,5,41,0.18)" }}
                aria-hidden
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
