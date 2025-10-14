"use client";

import Image from "next/image";

const TEAM = [
  {
    name: "Jorge Riquelme",
    role: "CEO",
    image:
      "https://xmwdicawzhhadqbhpdla.supabase.co/storage/v1/object/public/whatsapp-campain/WhatsApp%20Image%202025-10-13%20at%203.41.41%20PM.jpeg",
    alt: "Jorge Riquelme sonriente frente al Golden Gate Bridge",
  },
  {
    name: "Matías Burgos",
    role: "CTO",
    image:
      "https://xmwdicawzhhadqbhpdla.supabase.co/storage/v1/object/public/whatsapp-campain/WhatsApp%20Image%202025-10-13%20at%203.41.41%20PM%20(1).jpeg",
    alt: "Matías Burgos tomándose una selfie en un ascensor con espejos",
  },
  {
    name: "Felipe Carvallo",
    role: "CMO",
    image:
      "https://xmwdicawzhhadqbhpdla.supabase.co/storage/v1/object/public/whatsapp-campain/WhatsApp%20Image%202025-10-13%20at%203.41.41%20PM%20(3).jpeg",
    alt: "Felipe Carvallo sonriendo con los brazos cruzados",
  },
  {
    name: "Esteban Pastore",
    role: "COO",
    image:
      "https://xmwdicawzhhadqbhpdla.supabase.co/storage/v1/object/public/whatsapp-campain/WhatsApp%20Image%202025-10-13%20at%203.41.41%20PM%20(2).jpeg",
    alt: "Esteban Pastore sonriendo a la cámara",
  },
];

const labelAccent = "#F6CF4A";
const headingAccent = "#8C0529";

const QuienesSomos = () => {
  return (
    <section id="team" className="py-14 md:py-25">
      <div className="container">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ background: headingAccent }}
              aria-hidden
            />
            <p className="text-neutral-900 text-3xl font-bold">
              <span
                className="px-1"
                style={{
                  boxShadow: "inset 0 -0.99em 0 #FDE68A",
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                ¿Quiénes somos?
              </span>
            </p>
          </div>
          <p className="text-sm md:text-base text-neutral-600 max-w-2xl">
            Somos un grupo de jóvenes que se cansó de lo difícil que es buscar una propiedad y decidió hacerlo más simple,
            rápido y seguro.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-14 lg:grid-cols-4">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="flex flex-col items-center text-center gap-4 md:gap-6"
            >
              <div className="relative">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 sm:-top-8">
                  <div
                    className="relative inline-flex px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold text-neutral-900 shadow-md shadow-[rgba(0,0,0,0.18)]"
                    style={{ background: labelAccent }}
                  >
                    {member.name}
                    <span
                      className="absolute left-1/2 top-full -translate-x-1/2 -mt-[2px] block h-2.5 w-3 sm:h-3 sm:w-4"
                      style={{
                        background: labelAccent,
                        clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)",
                      }}
                      aria-hidden
                    />
                  </div>
                </div>

                <div className="overflow-hidden rounded-[24px] sm:rounded-[36px] border border-white/60 shadow-[0_22px_40px_rgba(15,23,42,0.18)] bg-neutral-200">
                  <Image
                    src={member.image}
                    alt={member.alt}
                    width={280}
                    height={280}
                    className="h-[150px] w-[150px] sm:h-[200px] sm:w-[200px] lg:h-[220px] lg:w-[220px] object-cover"
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm md:text-base font-medium tracking-[0.16em] uppercase text-neutral-900">
                {member.role}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuienesSomos;
