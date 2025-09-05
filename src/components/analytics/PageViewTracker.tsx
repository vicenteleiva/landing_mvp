"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackPageView } from "@/lib/analytics"

export default function PageViewTracker() {
  const pathname = usePathname()
  const search = useSearchParams()
  const seen = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!pathname) return
    const key = `${pathname}?${search?.toString() || ""}`
    if (seen.current.has(key)) return
    seen.current.add(key)
    trackPageView().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search])

  return null
}

