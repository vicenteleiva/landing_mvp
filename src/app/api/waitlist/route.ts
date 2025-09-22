import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  // Always respond 200 for a smoother UX; include error info if any.
  return NextResponse.json({ ok: true, warning: lastError ? { message: lastError.message, code: lastError.code } : null });
}
