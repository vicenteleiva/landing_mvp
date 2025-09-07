import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

type Body = {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  origin?: string | null; // e.g., "chat" | "waitlist" | "general" | "nav" | "footer"
  session_id?: string | null;
  path?: string | null;
  utm?: Record<string, unknown> | null;
};

export async function POST(req: Request) {
  let body: Body | null = null;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body?.name?.toString().trim();
  const email = body?.email?.toString().trim();
  const message = body?.message?.toString().trim();
  const phone = body?.phone ? String(body.phone).trim() : null;
  const origin = (body?.origin || "general").toString();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!url || !(serviceKey || anonKey)) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const key = serviceKey || (anonKey as string);
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const headers = Object.fromEntries(req.headers.entries());
  const referrer = headers["referer"] || null;
  const user_agent = headers["user-agent"] || null;

  const base = {
    name,
    email,
    phone: phone || null,
    message,
    origin,
    session_id: body?.session_id ?? null,
    path: body?.path ?? null,
    utm: body?.utm ?? null,
    referrer,
    user_agent,
  } as const;

  // Be resilient to schema differences: try with full, then progressively smaller payloads.
  const attempts: Array<Record<string, unknown>> = [
    base,
    { name, email, phone: phone || null, message, origin },
    { name, email, message, origin },
    { name, email, message },
  ];

  let lastError: any = null;
  for (const payload of attempts) {
    const { error } = await supabase.from("contact_submissions").insert(payload);
    if (!error || (error as any).code === "23505") {
      lastError = null;
      break;
    }
    lastError = error;
  }

  return NextResponse.json({ ok: true, warning: lastError ? { message: lastError.message, code: lastError.code } : null });
}

