"use client"

import { supabase } from "@/lib/supabase/client"
import { getSessionId } from "@/lib/session"

function parseUtm(): Record<string, string> | null {
  if (typeof window === "undefined") return null
  const p = new URLSearchParams(window.location.search)
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ]
  const obj: Record<string, string> = {}
  for (const k of keys) {
    const v = p.get(k)
    if (v) obj[k] = v
  }
  return Object.keys(obj).length ? obj : null
}

function baseFields() {
  return {
    page: "landing" as const,
    path:
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : null,
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
    utm: parseUtm(),
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  }
}

export async function trackPageView(meta?: Record<string, unknown>) {
  const session_id = getSessionId()
  const fields = baseFields()
  await supabase.from("landing_events").insert({
    event_type: "page_view",
    session_id,
    ...fields,
    meta: meta ?? null,
  })
}

export async function trackClick(params: {
  buttonId: string
  buttonText?: string
  variant?: string
  meta?: Record<string, unknown>
}) {
  const session_id = getSessionId()
  const fields = baseFields()
  await supabase.from("landing_events").insert({
    event_type: "click",
    session_id,
    ...fields,
    button_id: params.buttonId,
    button_text: params.buttonText ?? null,
    variant: params.variant ?? null,
    meta: params.meta ?? null,
  })
}

export async function trackChat(params: {
  message: string
  meta?: Record<string, unknown>
}) {
  const msg = params.message.trim().slice(0, 2000)
  if (!msg) return
  const session_id = getSessionId()
  const fields = baseFields()
  await supabase.from("landing_events").insert({
    event_type: "chat",
    session_id,
    ...fields,
    message: msg,
    meta: params.meta ?? null,
  })
}

export async function trackForm(params: {
  formId: string
  fields: Record<string, unknown>
  meta?: Record<string, unknown>
}) {
  const session_id = getSessionId()
  const base = baseFields()
  await supabase.from("landing_events").insert({
    event_type: "form",
    session_id,
    ...base,
    form_id: params.formId,
    fields: params.fields,
    meta: params.meta ?? null,
  })
}

