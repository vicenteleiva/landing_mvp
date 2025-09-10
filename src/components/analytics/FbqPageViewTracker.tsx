"use client"

import { useEffect, useRef, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
  }
}

function Inner() {
  const pathname = usePathname()
  const search = useSearchParams()
  const isFirstLoad = useRef(true)

  useEffect(() => {
    // Avoid double-tracking on first load; base snippet already tracked once.
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }
    try {
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "PageView")
      }
    } catch {}
  }, [pathname, search])

  return null
}

export default function FbqPageViewTracker() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  )
}

