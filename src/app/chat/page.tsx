"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const ACCENT = "#8C0529";

function BrokyMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M32 10 L8 34 H56 Z" fill={ACCENT} />
      <rect x="16" y="38" width="32" height="4" rx="2" fill={ACCENT} />
      <path d="M32 54 L8 40 H56 Z" fill={ACCENT} />
    </svg>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageContent />
    </Suspense>
  );
}

type Message = { role: "user" | "broky"; content: string };

function ChatPageContent() {
  const params = useSearchParams();
  const initial = params.get("q")?.toString() ?? "";

  const [messages, setMessages] = useState<Message[]>(() =>
    initial ? [{ role: "user", content: initial }] : []
  );
  const [loading, setLoading] = useState(true);
  const [openWaitlist, setOpenWaitlist] = useState(false);
  const [justMounted, setJustMounted] = useState(true);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Aparición natural: breve tiempo para que baje el overlay y luego abrir el formulario
    const t = setTimeout(() => {
      setLoading(false);
      setOpenWaitlist(true);
    }, 1700);
    const m = setTimeout(() => setJustMounted(false), 300);
    return () => { clearTimeout(t); clearTimeout(m); };
  }, []);

  useEffect(() => {
    // autoscroll
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading, openWaitlist]);

  const onClose = () => {
    setOpenWaitlist(false);
  };

  return (
    <section className="fixed inset-0 bg-gradient-to-b from-blue-50 via-white to-white flex flex-col">
      {/* Header */}
      <header className="px-6 md:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/image/broky-logo-light.webp" alt="Broky" className="h-6 w-6" />
            <span className="font-semibold text-neutral-900">Broky</span>
          </div>
          <Link href="/contacto" className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
            Contacto
          </Link>
        </div>
      </header>

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} ${
              justMounted && i === 0 ? "opacity-0 animate-[fadeInUp_260ms_ease-out_forwards]" : ""
            }`}
          >
            {m.role === "broky" && (
              <div className="mr-3 mt-1 shrink-0 w-7 h-7 rounded-full bg-white border border-neutral-200 grid place-items-center">
                <BrokyMark className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                m.role === "user" ? "bg-neutral-100 text-neutral-900" : "bg-white border border-neutral-200 text-neutral-900"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start items-center">
            <div className="mr-3 mt-1 shrink-0 w-7 h-7 rounded-full bg-white border border-neutral-200 grid place-items-center">
              <BrokyMark className="w-4 h-4" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-white border border-neutral-200 shadow-sm text-neutral-700 opacity-0 animate-[fadeIn_160ms_ease-out_forwards]">
              <Dots />
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Input estilo ChatGPT (siempre visible) */}
      <ChatInput />

      {/* Waitlist Sheet */}
      {openWaitlist && (
        <div className="fixed inset-0 z-20 bg-neutral-900/25 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden max-h-[80svh] flex flex-col opacity-0 animate-[sheetIn_200ms_ease-out_forwards]">
            <div className="px-4 md:px-5 py-2.5 md:py-3 flex items-center justify-between" style={{ background: "linear-gradient(180deg, rgba(140,5,41,0.06), rgba(255,255,255,0))" }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-neutral-50 border border-neutral-200 grid place-items-center">
                  <BrokyMark className="w-3.5 h-3.5" />
                </div>
                <p className="font-semibold text-neutral-900 text-[15px] md:text-base">Lista de espera</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/contacto" className="text-[13px] md:text-sm text-neutral-700 hover:underline">Contacto</Link>
                <button onClick={onClose} className="text-[13px] md:text-sm text-neutral-600 hover:text-neutral-900">Cerrar</button>
              </div>
            </div>
            <div className="p-3.5 md:p-4 space-y-1.5 md:space-y-2 overflow-auto">
              <p className="text-[13px] md:text-[14px] leading-snug">
                Estamos lanzando la beta privada de Broky. Pronto podrás ver propiedades que calzan contigo en minutos.
              </p>
              <p className="text-[13px] md:text-[14px] leading-snug">
                Únete a la lista y sé de los primeros en acceder.
              </p>

              <WaitlistForm initialMessage={initial} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Dots() {
  return (
    <div className="inline-flex gap-1 items-center">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse [animation-delay:0ms]"></span>
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse [animation-delay:150ms]"></span>
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse [animation-delay:300ms]"></span>
    </div>
  );
}

function WaitlistForm({ initialMessage }: { initialMessage?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(() => {
    const okName = name.trim().length >= 2;
    const okEmail = /.+@.+\..+/.test(email);
    const okPhone = phone.trim().length >= 8;
    const okReason = reason.trim().length >= 10;
    return okName && okEmail && okPhone && okReason;
  }, [name, email, phone, reason]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, reason, initial_message: initialMessage }),
      });
      if (!res.ok) throw new Error("Error guardando");
      setDone(true);
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center space-y-3 py-4">
        <p className="text-[15px]">¡Gracias! Te avisaremos en breve.</p>
        <Link href="/#hero" className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-white" style={{ background: ACCENT }}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2.5 md:space-y-3">
      <div className="grid grid-cols-1 gap-1.5">
        <label className="text-[12px] md:text-[13px] font-medium" htmlFor="name">Nombre</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgba(140,5,41,0.20)]" placeholder="Tu nombre" />
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        <label className="text-[12px] md:text-[13px] font-medium" htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgba(140,5,41,0.20)]" placeholder="tu@email.com" />
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        <label className="text-[12px] md:text-[13px] font-medium" htmlFor="phone">Celular</label>
        <input id="phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgba(140,5,41,0.20)]" placeholder="+56 9 1234 5678" />
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        <label className="text-[12px] md:text-[13px] font-medium" htmlFor="reason">¿Qué te interesó de Broky?</label>
        <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="border border-neutral-200 rounded-lg px-3 py-2 min-h-[64px] md:min-h-[72px] focus:outline-none focus:ring-2 focus:ring-[rgba(140,5,41,0.20)]" maxLength={400} placeholder="Cuéntanos brevemente..." />
        <div className="text-right text-xs text-neutral-500">{reason.length}/400</div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={!valid || loading} className="w-full rounded-lg px-4 py-2 text-white disabled:opacity-60 shadow-sm" style={{ background: ACCENT }}>
        {loading ? "Enviando..." : "Unirme a la lista"}
      </button>
    </form>
  );
}

function ChatInput({ mountDelayMs = 0 }: { mountDelayMs?: number }) {
  const [val, setVal] = useState("");
  const [mounted, setMounted] = useState(mountDelayMs === 0);
  useEffect(() => {
    if (mountDelayMs === 0) return;
    const t = setTimeout(() => setMounted(true), mountDelayMs);
    return () => clearTimeout(t);
  }, [mountDelayMs]);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVal("");
  };
  return (
    <form onSubmit={onSubmit} className={`sticky bottom-0 inset-x-0 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 transition-all duration-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}` }>
      <div className="mx-auto max-w-3xl">
        <div className="rounded-full bg-white border border-neutral-200 shadow-[0_6px_24px_-12px_rgba(0,0,0,0.2)] flex items-center gap-2 px-4 py-2">
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Pregunta lo que quieras"
            className="flex-1 bg-transparent outline-none text-[15px] py-1 placeholder:text-neutral-400"
          />
          <button type="submit" className="inline-flex items-center justify-center rounded-full h-8 w-8 text-white hover:opacity-90" style={{ background: ACCENT }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[12px] text-neutral-500 mt-2">Broky está en beta.</p>
      </div>
    </form>
  );
}

/* Animaciones sutiles para una entrada más natural */
const styles = `
@keyframes fadeInUp { from { opacity: 0; transform: translateY(6px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes fadeIn { to { opacity: 1 } }
@keyframes sheetIn { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
`;

if (typeof document !== 'undefined' && !document.getElementById('chat-anim-styles')) {
  const style = document.createElement('style');
  style.id = 'chat-anim-styles';
  style.innerHTML = styles;
  document.head.appendChild(style);
}
