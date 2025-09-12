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

  const { name, email, phone, reason, property_details } = body ?? {};
  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!url || !(serviceKey || anonKey)) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const key = serviceKey || (anonKey as string);
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const attempts: Array<Record<string, unknown>> = [
    { name, email, phone, reason: reason ?? null, property_details: property_details ?? null },
    { name, email, phone },
    { name, email },
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
