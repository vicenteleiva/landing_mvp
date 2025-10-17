import { NextResponse } from "next/server";
import { sendMetaConversionEvent } from "@/lib/meta/conversions";

type Body = {
  eventName?: string;
  eventId?: string;
  searchQuery?: string;
  eventTime?: number;
  fbc?: string;
  fbp?: string;
};

export async function POST(req: Request) {
  let body: Body | null = null;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const headers = Object.fromEntries(req.headers.entries());
  const forwarded = headers["x-forwarded-for"];
  const clientIp = forwarded ? forwarded.split(",")[0]?.trim() : null;
  const userAgent = headers["user-agent"] ?? null;
  const eventSourceUrl = headers["referer"] ?? undefined;
  const eventId = typeof body?.eventId === "string" ? body.eventId : undefined;
  const eventTime =
    typeof body?.eventTime === "number" ? Math.floor(body.eventTime) : undefined;

  try {
    console.log("[FLOW][CHAT] calling CAPI", {
      event_id: eventId,
      hasSearch: typeof body?.searchQuery === "string" && body.searchQuery.trim().length > 0,
    });
    const result = await sendMetaConversionEvent({
      event_name: "Contact",
      event_id: eventId,
      event_time: eventTime,
      event_source_url: typeof eventSourceUrl === "string" ? eventSourceUrl : undefined,
      user_data: {
        client_ip_address: clientIp ?? undefined,
        client_user_agent: userAgent ?? undefined,
        fbc: typeof body?.fbc === "string" ? body.fbc : undefined,
        fbp: typeof body?.fbp === "string" ? body.fbp : undefined,
      },
      custom_data:
        typeof body?.searchQuery === "string" && body.searchQuery.trim().length
          ? { search_string: body.searchQuery.trim() }
          : undefined,
    });
    console.log("[META][CAPI] Contact success", {
      status: result.status,
      event_id: eventId,
    });
  } catch (error) {
    console.error("[FLOW][CHAT] CAPI error", error);
    console.error("[META][CAPI] Contact conversion dispatch failed", error);
    return NextResponse.json(
      { ok: false, error: "Failed to dispatch conversion" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
