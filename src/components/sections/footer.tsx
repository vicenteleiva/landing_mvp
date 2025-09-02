import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-7xl px-6 md:px-16 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-display font-bold text-lg text-foreground">
              Broky
            </span>
          </div>
          <div className="text-center flex-1 md:flex-initial">
            <p className="text-sm text-muted-foreground">
              Broky — Beta privada — Próximamente.
            </p>
          </div>
          <div className="flex justify-center md:justify-end gap-6 text-center md:text-right">
            <Link
              href="/privacidad"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
              aria-label="Leer política de privacidad de Broky"
            >
              Política de privacidad
            </Link>
            <Link
              href="/contacto"
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
              aria-label="Ir a la página de contacto de Broky"
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