"use client";

import Link from "next/link";
import React from "react";
import { trackClick } from "@/lib/analytics";

const ACCENT = "#8C0529";

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start mx-auto max-w-6xl">
          {/* Columna izquierda: logo, slogan, CTA secundario */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/image/broky-logo-light.webp"
                alt="Logotipo de Broky"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="text-lg font-bold text-neutral-900">Broky</span>
            </div>
            <p className="text-neutral-600 max-w-xs leading-relaxed mb-4">
              Sell & Rent Properties Without Humans
            </p>
            <Link
              href="#hero"
              aria-label="Quiero probarlo"
              onClick={(e) => {
                e.preventDefault();
                trackClick({ buttonId: 'footer-quiero-probarlo', buttonText: 'Quiero probarlo' }).catch(() => {})
                const el = document.getElementById('hero');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: ACCENT }}
            >
              Quiero probarlo
            </Link>
          </div>

          {/* Navegación + Social */}
          <div className="grid grid-cols-2 gap-6 md:contents">
            {/* Columna central: navegación */}
            <div>
              <h4 className="text-neutral-900 font-semibold mb-3">Entra</h4>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <Link href="#hero" className="hover:text-neutral-900 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      trackClick({ buttonId: 'footer-home', buttonText: 'Home' }).catch(() => {})
                      const el = document.getElementById('hero');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >Home</Link>
                </li>
                <li>
                  <Link href="#product" className="hover:text-neutral-900 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      trackClick({ buttonId: 'footer-product', buttonText: 'Product' }).catch(() => {})
                      const el = document.getElementById('product');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >Product</Link>
                </li>
                <li className="text-neutral-400">Contact</li>
              </ul>
            </div>

            {/* Columna derecha: social */}
            <div>
              <h4 className="text-neutral-900 font-semibold mb-3">Síguenos</h4>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <a
                    href="https://www.instagram.com/broky.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-900 transition-colors"
                    aria-label="Instagram de Broky"
                    onClick={() => { trackClick({ buttonId: 'footer-instagram', buttonText: 'Instagram' }).catch(() => {}) }}
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/broky-ai/?viewAsMember=true"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-900 transition-colors"
                    aria-label="LinkedIn de Broky"
                    onClick={() => { trackClick({ buttonId: 'footer-linkedin', buttonText: 'LinkedIn' }).catch(() => {}) }}
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Línea y marca pequeña */}
        <div className="mx-auto max-w-6xl mt-10 pt-8 border-t border-neutral-200 text-sm text-neutral-500 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <p>Broky Spa. 2025</p>
          <div className="flex gap-6">
            <Link
              href="/privacidad"
              className="hover:text-neutral-800 transition-colors"
              aria-label="Leer política de privacidad de Broky"
            >
              Política de privacidad
            </Link>
            <Link
              href="/contacto"
              className="hover:text-neutral-800 transition-colors"
              aria-label="Ir a la página de contacto de Broky"
              onClick={() => trackClick({ buttonId: 'footer-contacto', buttonText: 'Contacto' }).catch(() => {})}
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
