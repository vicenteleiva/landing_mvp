import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendMetaConversionEvent } from "@/lib/meta/conversions";

type Body = {
  eventId?: string;
  eventTime?: number;
  phone?: string;
  email?: string;
  searchQuery?: string;
  eventSourceUrl?: string;
  fbp?: string;
  fbc?: string;
};

export async function POST(req: Request) {
  let body: Body | null = null;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventId = typeof body?.eventId === "string" ? body.eventId : undefined;
  const eventTime =
    typeof body?.eventTime === "number"
      ? Math.floor(body.eventTime)
      : Math.floor(Date.now() / 1000);
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const searchQuery =
    typeof body?.searchQuery === "string" ? body.searchQuery.trim() : "";

  const headers = Object.fromEntries(req.headers.entries());
  const forwarded = headers["x-forwarded-for"];
  const clientIp = forwarded ? forwarded.split(",")[0]?.trim() : null;
  const userAgent = headers["user-agent"] ?? null;
  const eventSourceUrl =
    typeof body?.eventSourceUrl === "string" && body.eventSourceUrl.length
      ? body.eventSourceUrl
      : headers["referer"] ?? undefined;

  const hashedPhone = hashPhone(phone);
  const hashedEmail = hashEmail(email);

  try {
    console.log("[FLOW][LANDING] calling CAPI", {
      event_id: eventId,
      hasPhone: Boolean(hashedPhone),
      hasEmail: Boolean(hashedEmail),
    });
    const result = await sendMetaConversionEvent({
      event_name: "Lead",
      event_id: eventId,
      event_time: eventTime,
      action_source: "website",
      event_source_url:
        typeof eventSourceUrl === "string" ? eventSourceUrl : undefined,
      user_data: {
        ph: hashedPhone ? [hashedPhone] : undefined,
        em: hashedEmail ? [hashedEmail] : undefined,
        client_ip_address: clientIp ?? undefined,
        client_user_agent: userAgent ?? undefined,
        fbp: typeof body?.fbp === "string" ? body.fbp : undefined,
        fbc: typeof body?.fbc === "string" ? body.fbc : undefined,
      },
      custom_data: {
        lead_type: "landing",
        search_string: searchQuery ? searchQuery.slice(0, 200) : undefined,
      },
    });
    console.log("[META][CAPI] Lead success", {
      status: result.status,
      event_id: eventId,
    });
  } catch (error) {
    console.error("[FLOW][LANDING] CAPI error", error);
    console.error("[META][CAPI] Landing conversion dispatch failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

type Hashable = string | null | undefined;

function hashEmail(value: Hashable) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return sha256(normalized);
}

function hashPhone(value: Hashable) {
  if (!value) return undefined;
  const normalized = value.replace(/\D/g, "");
  if (!normalized) return undefined;
  return sha256(normalized);
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
