"use client";

import Navigation from "@/components/sections/navigation";
import Footer from "@/components/sections/footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { trackForm, trackClick } from "@/lib/analytics";
import { getSessionId } from "@/lib/session";

const ACCENT = "#8C0529"; // rojo acento usado en la landing

export default function ContactoPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const fields = Object.fromEntries(data.entries());
    try {
      setLoading(true);
      // Fire-and-forget analytics for the contact form
      trackForm({ formId: "contacto", fields }).catch(() => {});
      // Compose metadata for Supabase insert
      const session_id = getSessionId();
      const originParam = (search.get("src") || "").toLowerCase();
      const origin = ["chat", "waitlist", "nav", "footer", "hero"].includes(originParam)
        ? (originParam as "chat" | "waitlist" | "nav" | "footer" | "hero")
        : "general";
      const urlPath = typeof window !== "undefined" ? window.location.pathname + window.location.search : null;
      const utm = (() => {
        if (typeof window === "undefined") return null;
        const params = new URLSearchParams(window.location.search);
        const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
        const obj: Record<string, string> = {};
        for (const k of keys) { const v = params.get(k); if (v) obj[k] = v; }
        return Object.keys(obj).length ? obj : null;
      })();
      // Persist in Supabase
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields["nombre"],
          email: fields["email"],
          phone: fields["telefono"] || null,
          message: fields["mensaje"],
          origin,
          session_id,
          path: urlPath,
          utm,
        }),
      }).catch(() => {});
      router.push("/thanksyou");
    } finally {
      // keep loading state until navigation
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="px-6 md:px-16 lg:px-24 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
              Contacto
            </h1>
            <p className="mt-3 text-muted-foreground max-w-prose">
              Cuéntanos qué necesitas y nuestro equipo te responderá a la brevedad.
            </p>
          </header>

          <section className="bg-white/60 backdrop-blur-sm border border-neutral-200 rounded-2xl shadow-sm">
            <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Tu nombre"
                    required
                    className="bg-white/70 border-neutral-200 focus-visible:border-neutral-300 focus-visible:ring-neutral-300/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tucorreo@dominio.com"
                    required
                    className="bg-white/70 border-neutral-200 focus-visible:border-neutral-300 focus-visible:ring-neutral-300/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono (opcional)</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  className="bg-white/70 border-neutral-200 focus-visible:border-neutral-300 focus-visible:ring-neutral-300/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensaje">Mensaje</Label>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="¿Cómo podemos ayudarte?"
                  required
                  rows={5}
                  className="bg-white/70 border-neutral-200 focus-visible:border-neutral-300 focus-visible:ring-neutral-300/40"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  onClick={() => trackClick({ buttonId: "contacto-submit", buttonText: "Enviar" }).catch(() => {})}
                  className="text-white hover:opacity-90 active:scale-[0.99]"
                  style={{ background: ACCENT }}
                >
                  {loading ? "Enviando…" : "Enviar"}
                </Button>
                <span className="text-xs text-muted-foreground">Respuesta en menos de 24 h</span>
              </div>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
