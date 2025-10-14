"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "¿El servicio tiene algún costo?",
    answer: [
      "No. El servicio es completamente gratuito.",
      "Ayudamos a los corredores y propietarios a recibir visitas realmente interesadas, y ellos financian el servicio.",
      "Tú no pagas nada por usar Broky ni por recibir nuestras recomendaciones.",
    ],
  },
  {
    question: "¿Debo entregar mis datos personales?",
    answer: [
      "Solo te pediremos tu número de celular y correo electrónico para poder contactarte con las opciones que encontremos.",
      "En caso de que el corredor o propietario necesite más información, te lo informaremos antes.",
      "Tus datos están 100% protegidos y nunca se comparten sin tu consentimiento. Usamos la información únicamente para ayudarte a encontrar tu propiedad ideal de forma segura.",
    ],
  },
  {
    question: "¿Qué pasa si encuentro una propiedad antes?",
    answer: [
      "¡Genial! 🎉 Si encuentras una por tu cuenta, solo avísanos y dejaremos de buscar.",
      "Nuestro objetivo es que encuentres tu lugar ideal, sea con nosotros o no.",
    ],
  },
  {
    question: "¿Quién me contacta después de dejar mi búsqueda?",
    answer: [
      "Uno de los miembros del equipo Broky revisará lo que estás buscando y te contactará personalmente.",
      "Nosotros hacemos toda la búsqueda manual, validamos las opciones y te enviamos las mejores. No hay bots, ni mensajes automáticos.",
    ],
  },
  {
    question: "¿Cuánto se demoran en enviarme opciones?",
    answer: [
      "En general, entre 24 y 72 horas según lo que estés buscando y la disponibilidad en el mercado.",
      "Preferimos tomarnos el tiempo necesario para encontrar propiedades que realmente calcen contigo antes que enviarte resultados genéricos.",
    ],
  },
] as const;

const FrequentlyAskedQuestions = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 md:py-20">
      <div className="container max-w-5xl">
        <div className="mb-10 md:mb-12">
          <h2 className="text-3xl font-bold text-neutral-900">
            <span
              className="px-1"
              style={{
                boxShadow: "inset 0 -0.99em 0 #FDE68A",
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              Preguntas frecuentes
            </span>
          </h2>
        </div>

        <div className="border-t border-neutral-200 divide-y divide-neutral-200">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <article key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 py-5 md:py-6 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                >
                  <span className="text-base md:text-lg font-medium text-neutral-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-neutral-500 transition-transform ${
                      isOpen ? "rotate-180 text-neutral-900" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-hidden={!isOpen}
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "max-h-[800px]" : "max-h-0"
                  }`}
                >
                  <div className="pb-6 text-sm md:text-base leading-relaxed text-neutral-600 space-y-3">
                    {item.answer.map((paragraph, answerIndex) => (
                      <p key={`${item.question}-${answerIndex}`}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
