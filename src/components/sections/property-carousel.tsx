"use client";

import React from "react";

const ACCENT = "#8C0529";

type Item = {
  price: string;
  type: string;
  title: string;
  location: string;
  imageAlt: string;
  imageSrc: string;
};

const ITEMS: Item[] = [
  {
    price: "UF 9.800",
    type: "Departamento en Venta",
    title: "Departamento En Venta De…",
    location: "Parque Arauco",
    imageAlt: "Departamento con áreas verdes",
    imageSrc:
      "https://images.unsplash.com/photo-1505691723518-36a8e2ef6970?auto=format&fit=crop&w=1600&q=60",
  },
  {
    price: "UF 27.990",
    type: "Casa en Venta",
    title: "Preciosa Casa En Venta De…",
    location: "La Dehesa",
    imageAlt: "Casa con piscina",
    imageSrc:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=60",
  },
  {
    price: "UF 24",
    type: "Departamento en Arriendo",
    title: "Arr 2 Dorm. Vitacura Areas…",
    location: "La Llavería",
    imageAlt: "Plaza con juegos infantiles",
    imageSrc:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=60",
  },
  {
    price: "UF 9.450",
    type: "Casa en Venta",
    title: "Ñuñoa Los Cerezos Townh…",
    location: "Parque Juan XXIII",
    imageAlt: "Living comedor luminoso",
    imageSrc:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=60",
  },
  {
    price: "UF 7.820",
    type: "Departamento en Venta",
    title: "UF 7.820 En Ñuñoa 3d/2b/…",
    location: "Diego de Almagro",
    imageAlt: "Living con plantas y balcón",
    imageSrc:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=60",
  },
];

// Presentational, non-interactive card
function Card({ item, priority, fallback }: { item: Item; priority?: boolean; fallback: string }) {
  const onError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const t = e.currentTarget as HTMLImageElement & { dataset: { fallbackSet?: string } };
    if (!t.dataset.fallbackSet) {
      t.src = fallback;
      t.dataset.fallbackSet = "1";
    }
  };
  return (
    <div
      className="select-none bg-white border border-neutral-200/70 rounded-2xl shadow-sm overflow-hidden max-h-[60svh] sm:max-h-none"
      tabIndex={-1}
      aria-hidden={true}
      role="presentation"
      style={{
        boxShadow: "0 10px 24px -16px rgba(0,0,0,0.18)",
      }}
    >
      <div className="w-full" aria-hidden>
        {/* Aspect ratio 4:3 to avoid CLS */}
        <div className="relative w-full pb-[66.666%] sm:pb-[75%]">
          <img
            src={item.imageSrc}
            alt={item.imageAlt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={onError}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="p-2.5 sm:p-4">
        <p className="text-[18px] sm:text-2xl font-semibold text-neutral-900 tracking-tight">{item.price}</p>
        <p className="text-[13px] sm:text-base text-neutral-700 mt-1 truncate">{item.type}</p>
        <p className="text-[13px] sm:text-base text-neutral-600 mt-0.5 truncate">{item.title}</p>
        <p className="text-[13px] sm:text-base text-neutral-500 mt-0.5 truncate">{item.location}</p>
      </div>
    </div>
  );
}

/*
  Infinite marquee-style carousel. We duplicate the items so the track wraps seamlessly.
  Pauses on hover (desktop). Decorative only: aria-hidden on the container.
*/
export default function PropertyCarousel() {
  // Duplicate items for seamless loop
  const doubled = [...ITEMS, ...ITEMS];
  const FALLBACKS = [
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=60",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=60",
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1600&q=60",
  ];

  return (
    <section aria-hidden="true" className="w-full mt-8 md:mt-12" id="property-carousel">
      <div className="mx-auto max-w-6xl px-6 md:px-16 lg:px-24">
        <div
          className="relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/40"
          style={{ backdropFilter: "saturate(1.05) blur(0px)" }}
        >
          {/* gradient masks at edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 from-white via-white/80 to-transparent bg-gradient-to-r z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 from-transparent via-white/80 to-white bg-gradient-to-r rotate-180 z-10" />

          <div className="group">
            <div
              className="flex gap-4 sm:gap-5 lg:gap-6 will-change-transform"
              style={{
                animation: "carousel-scroll 22s linear infinite",
              }}
            >
              {doubled.map((item, i) => (
                <div
                  key={i}
                  className="flex-none basis-[78%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
                >
                  <Card item={item} priority={i < 5} fallback={FALLBACKS[i % FALLBACKS.length]} />
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            /* Move full track width of the first set, then loop */
            @keyframes carousel-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            /* Pause on hover (desktop) */
            @media (hover: hover) and (pointer: fine) {
              #property-carousel .group > div { animation-play-state: running; }
              #property-carousel .group:hover > div { animation-play-state: paused; }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
