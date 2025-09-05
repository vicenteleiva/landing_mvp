"use client"

const KEY = "landing_session_id"

function genId(): string {
  // Prefer UUID if available
  // Fallback: random base36 string
  const uuid = (globalThis as any).crypto?.randomUUID?.()
  if (uuid) return uuid
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function getSessionId(): string {
  if (typeof window === "undefined") return ""
  try {
    let id = window.localStorage.getItem(KEY)
    if (!id) {
      id = genId()
      window.localStorage.setItem(KEY, id)
    }
    return id
  } catch {
    // If storage is blocked, fallback to in-memory per tab
    // Note: this resets on reload, but still allows tracking
    const g = (window as any)
    if (!g.__mem_session_id) g.__mem_session_id = genId()
    return g.__mem_session_id as string
  }
}

