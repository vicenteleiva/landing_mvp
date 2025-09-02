import Link from 'next/link';
import { Menu } from 'lucide-react';

export default function Navigation() {
  return (
    <header className="w-full border-b border-border bg-background">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="container mx-auto px-6 py-4 lg:px-16"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" aria-label="Back to homepage">
              <span className="font-display text-2xl font-bold text-primary">
                Broky
              </span>
            </Link>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/como-funciona"
              className="rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Cómo funciona
            </Link>
            <Link
              href="/acceder"
              className="rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Acceder
            </Link>
            <button
              aria-label="Contactar con Broky"
              className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent hover:text-primary"
            >
              Contacto
            </button>
          </div>

          <div className="md:hidden">
            <button
              aria-label="Abrir menú de navegación"
              className="inline-flex h-8 items-center justify-center rounded-md p-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="hidden border-t border-border pt-4 mt-4 md:hidden">
          <div className="flex flex-col space-y-3">
            <Link
              href="/como-funciona"
              className="rounded-md px-2 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Cómo funciona
            </Link>
            <Link
              href="/acceder"
              className="rounded-md px-2 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Acceder
            </Link>
            <button
              aria-label="Contactar con Broky"
              className="inline-flex h-8 w-full items-center justify-start whitespace-nowrap rounded-md px-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent hover:text-primary"
            >
              Contacto
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}