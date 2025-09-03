"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  // Solo mostrar la imagen broky-logo-light.webp
  return (
    <header className="w-full border-b border-border bg-background">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="container mx-auto px-6 py-4 lg:px-16"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" aria-label="Back to homepage">
              <span className="inline-flex items-center gap-2">
                <Image
                  src="/image/broky-logo-light.webp"
                  alt="Broky logo"
                  width={28}
                  height={28}
                  className="h-6 w-6 md:h-7 md:w-7"
                  sizes="(max-width: 768px) 24px, 28px"
                  priority
                />
                <span className="font-display text-2xl font-bold text-primary">
                  Broky
                </span>
              </span>
            </Link>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="#"
              className="rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={e => e.preventDefault()}
            >
              Cómo funciona
            </Link>
            <Link
              href="#"
              className="rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={e => e.preventDefault()}
            >
              Acceder
            </Link>
            <button
              aria-label="Contactar con Broky"
              className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent hover:text-primary"
              onClick={e => e.preventDefault()}
            >
              Contacto
            </button>
          </div>

          <div className="md:hidden">
            <button
              aria-label="Abrir menú de navegación"
              aria-expanded={open}
              className="inline-flex h-8 items-center justify-center rounded-md p-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
              onClick={e => e.preventDefault()}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-border pt-4 mt-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="#"
                className="rounded-md px-2 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={e => e.preventDefault()}
              >
                Cómo funciona
              </Link>
              <Link
                href="#"
                className="rounded-md px-2 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={e => e.preventDefault()}
              >
                Acceder
              </Link>
              <button
                aria-label="Contactar con Broky"
                className="inline-flex h-8 w-full items-center justify-start whitespace-nowrap rounded-md px-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent hover:text-primary"
                onClick={e => e.preventDefault()}
              >
                Contacto
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
