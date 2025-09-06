"use client"

import { useEffect, useRef, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackPageView } from "@/lib/analytics"

function PageViewTrackerInner() {
  const pathname = usePathname()
  const search = useSearchParams()
  const seen = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!pathname) return
    const key = `${pathname}?${search?.toString() || ""}`
    if (seen.current.has(key)) return
    seen.current.add(key)
    trackPageView().catch(() => {})
  }, [pathname, search])

  return null
}

export default function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  )
}

