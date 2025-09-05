"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function RealtimeViews() {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    let active = true

    async function bootstrap() {
      const { count: initial } = await supabase
        .from("landing_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "page_view")
      if (active) setCount(initial ?? 0)
    }

    const channel = supabase
      .channel("realtime:page_views")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "landing_events",
          filter: "event_type=eq.page_view",
        },
        () => setCount((c) => c + 1)
      )
      .subscribe()

    bootstrap()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [])

  return <span>{count}</span>
}

