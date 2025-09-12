"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { trackForm, trackClick, trackChat } from "@/lib/analytics";

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
          <Link href="/" aria-label="Ir a la página principal" onClick={() => trackClick({ buttonId: 'chat-header-logo', buttonText: 'Logo' }).catch(() => {})} className="flex items-center gap-2">
            <img src="/image/broky-logo-light.webp" alt="Broky" className="h-6 w-6" />
            <span className="font-semibold text-neutral-900">Broky</span>
          </Link>
          <Link href="/contacto?src=chat" onClick={() => trackClick({ buttonId: 'chat-header-contacto', buttonText: 'Contacto' }).catch(() => {})} className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
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
        <div className="fixed inset-0 z-20 bg-neutral-900/25 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-xl md:max-w-1xl bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden h-[75svh] md:h-[80vh] flex flex-col opacity-0 animate-[sheetIn_200ms_ease-out_forwards]">
            <div className="px-4 md:px-5 py-2.5 md:py-3 flex items-center justify-between" style={{ background: "linear-gradient(180deg, rgba(140,5,41,0.06), rgba(255,255,255,0))" }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-neutral-50 border border-neutral-200 grid place-items-center">
                  <BrokyMark className="w-3.5 h-3.5" />
                </div>
                <p className="font-semibold text-neutral-900 text-[17px] md:text-xl">Lista de espera</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/contacto?src=chat" onClick={() => trackClick({ buttonId: 'waitlist-contacto', buttonText: 'Contacto' }).catch(() => {})} className="text-[13px] md:text-sm text-neutral-700 hover:underline">Contacto</Link>
                <button onClick={() => { trackClick({ buttonId: 'waitlist-close', buttonText: 'Cerrar' }).catch(() => {}); onClose(); }} className="text-[13px] md:text-sm text-neutral-600 hover:text-neutral-900">Cerrar</button>
              </div>
            </div>
            <div className="flex-1 p-4 md:p-5 space-y-1.5 md:space-y-2 overflow-hidden flex flex-col">
              <p className="text-[14px] md:text-[15px] leading-relaxed">Broky está en construcción 🚀</p>
              <p className="text-[14px] md:text-[15px] leading-relaxed">Pero no queremos dejarte esperando.</p>
              <p className="text-[14px] md:text-[15px] leading-relaxed">Regístrate y describe la propiedad que buscas.</p>
              <p className="text-[14px] md:text-[15px] leading-relaxed">En menos de 72 horas te contactaremos con las mejores opciones de todo el mercado, elegidas para ti.</p>

              <div className="flex-1 flex flex-col">
                <WaitlistForm initialMessage={initial} />
              </div>
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
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyDetails, setPropertyDetails] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [step1Logged, setStep1Logged] = useState(false);
  const [step2Logged, setStep2Logged] = useState(false);

  const { step1Valid, step2Valid, valid } = useMemo(() => {
    const okName = name.trim().length >= 2;
    const okEmail = /.+@.+\..+/.test(email);
    const okPhone = phone.trim().replace(/\D/g, "").length >= 8;
    const okPropertyDetails = propertyDetails.trim().length >= 1;
    const okReason = reason.trim().length >= 1;
    const step1Valid = okPropertyDetails && okReason;
    const step2Valid = okName && okEmail && okPhone;
    return { step1Valid, step2Valid, valid: step1Valid && step2Valid };
  }, [name, email, phone, propertyDetails, reason]);

  const onContinue = () => {
    if (loading || !step1Valid) return;
    trackClick({ buttonId: 'waitlist-continue', buttonText: 'Continuar' }).catch(() => {})
    // Guarda en Supabase los datos del paso 1
    trackForm({
      formId: 'waitlist-step1',
      fields: { property_details: propertyDetails, reason, initial_message: initialMessage }
    }).catch(() => {})
    setStep(2);
  };

  // Auto-guardado de Paso 1 si el usuario no continúa
  useEffect(() => {
    if (step1Logged) return;
    const pd = propertyDetails.trim();
    const rs = reason.trim();
    if (pd.length >= 3 || rs.length >= 3) {
      const t = setTimeout(() => {
        trackForm({
          formId: 'waitlist-step1-auto',
          fields: { property_details: propertyDetails, reason }
        }).catch(() => {})
        setStep1Logged(true);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [propertyDetails, reason, step1Logged]);

  // Auto-guardado de Paso 2 (datos parciales) si el usuario escribe pero no envía
  useEffect(() => {
    if (step !== 2 || step2Logged) return;
    const nameOk = name.trim().length > 0;
    const emailOk = email.trim().length > 0;
    const phoneOk = phone.trim().replace(/\D/g, "").length > 0;
    if (nameOk || emailOk || phoneOk) {
      const t = setTimeout(() => {
        trackForm({
          formId: 'waitlist-step2-auto',
          fields: { name, email, phone }
        }).catch(() => {})
        setStep2Logged(true);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [step, name, email, phone, step2Logged]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, reason, property_details: propertyDetails, initial_message: initialMessage }),
      });
      if (!res.ok) {
        let detail = "";
        try { const j = await res.json(); detail = j?.error || j?.message || "" } catch {}
        throw new Error(detail || "Error guardando");
      }
      // Update URL to reflect waitlist submission without triggering navigation
      const qParam = initialMessage ? `?q=${encodeURIComponent(initialMessage)}` : '';
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/chat/waitlist${qParam}`);
      }

      // Track form submission AFTER URL change so it reflects on Supabase
      trackForm({
        formId: 'waitlist',
        fields: { name, email, phone, reason, property_details: propertyDetails, initial_message: initialMessage }
      }).catch(() => {})
      // Mostrar tarjeta de agradecimiento en la misma vista
      trackClick({ buttonId: 'waitlist-thanks', buttonText: 'Gracias' }).catch(() => {})
      setDone(true);
    } catch (err: any) {
      setError(err?.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="py-8 md:py-10">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-6 md:p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-[rgba(140,5,41,0.08)] border border-[rgba(140,5,41,0.18)] grid place-items-center mb-5">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-2">Muchas gracias por registrarte!</h2>
          <p className="text-neutral-700 mb-6">Te contactaremos en breve.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/" onClick={() => trackClick({ buttonId: 'thanks-home', buttonText: 'Ir al inicio' }).catch(() => {})} className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-white" style={{ background: ACCENT }}>
              Ir al inicio
            </Link>
            <button onClick={() => { trackClick({ buttonId: 'thanks-close', buttonText: 'Cerrar' }).catch(() => {}); router.push('/'); }} className="inline-flex items-center justify-center rounded-lg px-4 py-2 border border-neutral-300 text-neutral-800 hover:bg-neutral-50">Cerrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col flex-1">
      {step === 1 ? (
        <>
          <div className="flex-1 space-y-2 md:space-y-3">
            <div className="grid grid-cols-1 gap-1.5">
              <label className="text-[11px] md:text-[13px] font-medium" htmlFor="property_details">Escribe todas las características de la propiedad que buscas</label>
              <textarea
                id="property_details"
                required
                value={propertyDetails}
                onChange={(e) => setPropertyDetails(e.target.value)}
                className="border border-neutral-200 bg-neutral-50 rounded-xl px-3.5 py-2 md:py-2.5 min-h-[72px] md:min-h-[90px] text-[15px] md:text-[16px] placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(140,5,41,0.20)]"
                maxLength={400}
                placeholder="Ej.: tipo, ubicación, presupuesto, dormitorios, baños, estacionamientos, metros, etc."
              />
              <div className="text-right text-[10px] md:text-xs text-neutral-500">{propertyDetails.length}/400</div>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              <label className="text-[11px] md:text-[13px] font-medium" htmlFor="reason">¿Qué te interesó de Broky?</label>
              <textarea id="reason" required value={reason} onChange={(e) => setReason(e.target.value)} className="border border-neutral-200 bg-neutral-50 rounded-xl px-3.5 py-2 md:py-2.5 min-h-[72px] md:min-h-[90px] text-[15px] md:text-[16px] placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(140,5,41,0.20)]" maxLength={400} placeholder="Cuéntanos brevemente..." />
              <div className="text-right text-[10px] md:text-xs text-neutral-500">{reason.length}/400</div>
            </div>
            {error && <p className="text-[12px] md:text-sm text-red-600">{error}</p>}
          </div>
          <div className="mt-auto pt-2">
            <button type="button" onClick={onContinue} disabled={!step1Valid || loading} className="w-full rounded-xl px-4 py-2.5 text-[15px] md:text-[16px] text-white disabled:opacity-60 shadow-sm" style={{ background: ACCENT }}>
              Continuar
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 space-y-2 md:space-y-3">
            <div className="flex items-center justify-between mb-1">
              <button
                type="button"
                onClick={() => {
                  trackClick({ buttonId: 'waitlist-back', buttonText: 'Volver', meta: { from: 2, to: 1 } }).catch(() => {})
                  // También guardamos snapshot de los datos al volver
                  trackForm({ formId: 'waitlist-back', fields: { name, email, phone, property_details: propertyDetails, reason } }).catch(() => {})
                  setStep(1)
                }}
                className="inline-flex items-center gap-1.5 text-[13px] md:text-sm text-neutral-600 hover:text-neutral-800"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                Volver
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              <label className="text-[11px] md:text-[13px] font-medium" htmlFor="name">Nombre</label>
              <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="border border-neutral-200 bg-neutral-50 rounded-xl px-3.5 py-2 md:py-2.5 text-[15px] md:text-[16px] placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(140,5,41,0.20)]" placeholder="Tu nombre" />
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              <label className="text-[11px] md:text-[13px] font-medium" htmlFor="email">Email</label>
              <input id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-neutral-200 bg-neutral-50 rounded-xl px-3.5 py-2 md:py-2.5 text-[15px] md:text-[16px] placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(140,5,41,0.20)]" placeholder="tu@email.com" />
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              <label className="text-[11px] md:text-[13px] font-medium" htmlFor="phone">Celular</label>
              <input id="phone" required inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-neutral-200 bg-neutral-50 rounded-xl px-3.5 py-2 md:py-2.5 text-[15px] md:text-[16px] placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(140,5,41,0.20)]" placeholder="+56 9 1234 5678" />
            </div>

            {error && <p className="text-[12px] md:text-sm text-red-600">{error}</p>}
          </div>
          <div className="mt-auto pt-2">
            <button type="submit" disabled={!valid || loading} className="w-full rounded-xl px-4 py-2.5 text-[15px] md:text-[16px] text-white disabled:opacity-60 shadow-sm" style={{ background: ACCENT }}>
              {loading ? "Enviando..." : "Unirme a la lista"}
            </button>
          </div>
        </>
      )}
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
    const q = val.trim();
    if (q) {
      trackChat({ message: q }).catch(() => {})
      trackClick({ buttonId: 'chat-send', buttonText: 'Enviar' }).catch(() => {})
    }
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
