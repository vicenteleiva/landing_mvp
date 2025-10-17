import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { sendMetaConversionEvent } from "@/lib/meta/conversions";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export async function POST(req: Request) {
  // Parse JSON body safely
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawName = typeof body?.name === "string" ? body.name.trim() : "";
  const rawPhone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const rawEmail = typeof body?.email === "string" ? body.email.trim() : "";
  const rawReason = typeof body?.reason === "string" ? body.reason.trim() : "";
  const rawPropertyDetails = typeof body?.property_details === "string" ? body.property_details.trim() : "";

  if (!rawName || !rawPhone) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!url || !(serviceKey || anonKey)) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const key = serviceKey || (anonKey as string);
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const payload = {
    name: rawName,
    phone: rawPhone,
    email: rawEmail ? rawEmail : null,
    reason: rawReason ? rawReason : null,
    property_details: rawPropertyDetails ? rawPropertyDetails : null,
  };

  const attempts: Array<Record<string, unknown>> = [
    payload,
    { name: payload.name, phone: payload.phone, email: payload.email },
    { name: payload.name, phone: payload.phone },
  ];

  let lastError: any = null;
  for (const p of attempts) {
    const { error } = await supabase.from("waitlist_signups").insert(p);
    if (!error || (error as any).code === "23505") {
      lastError = null;
      break;
    }
    lastError = error;
  }

  const headers = Object.fromEntries(req.headers.entries());
  const forwarded = headers["x-forwarded-for"];
  const clientIp = forwarded ? forwarded.split(",")[0]?.trim() : null;
  const userAgent = headers["user-agent"] ?? null;
  const eventSourceUrl = headers["referer"] ?? undefined;

  const conversionEventId =
    typeof body?.conversionEventId === "string" ? body.conversionEventId : undefined;
  const fbp = typeof body?.fbp === "string" ? body.fbp : undefined;
  const fbc = typeof body?.fbc === "string" ? body.fbc : undefined;

  const hashedPhone = hashPhone(rawPhone);
  const hashedEmail = hashEmail(rawEmail);
  const eventTime =
    typeof body?.eventTime === "number"
      ? Math.floor(body.eventTime)
      : undefined;

  if (!lastError) {
    try {
      console.log("[FLOW][WAITLIST] calling CAPI", {
        event_id: conversionEventId,
        hasEmail: Boolean(hashedEmail),
        hasPhone: Boolean(hashedPhone),
      });
      const result = await sendMetaConversionEvent({
        event_name: "Lead",
        event_id: conversionEventId,
        event_time: eventTime,
        event_source_url: typeof eventSourceUrl === "string" ? eventSourceUrl : undefined,
        user_data: {
          ph: hashedPhone ? [hashedPhone] : undefined,
          em: hashedEmail ? [hashedEmail] : undefined,
          client_ip_address: clientIp ?? undefined,
          client_user_agent: userAgent ?? undefined,
          fbp,
          fbc,
        },
        custom_data: {
          lead_type: "waitlist",
          search_string:
            typeof body?.initial_message === "string"
              ? body.initial_message.slice(0, 200)
              : undefined,
        },
      });
      console.log("[META][CAPI] Lead success", {
        status: result.status,
        event_id: conversionEventId,
      });
    } catch (error) {
      console.error("[FLOW][WAITLIST] CAPI error", error);
      console.error("[META][CAPI] Waitlist conversion dispatch failed", error);
    }
  }

  // Always respond 200 for a smoother UX; include error info if any.
  return NextResponse.json({
    ok: true,
    warning: lastError ? { message: lastError.message, code: lastError.code } : null,
  });
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
