import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, reason, initial_message } = body ?? {};
    if (!name || !email || !phone || !reason) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!url || !(serviceKey || anonKey)) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const key = serviceKey || (anonKey as string);
    const supabase = createClient(url, key, { auth: { persistSession: false } });

    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ name, email, phone, reason, initial_message });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 });
  }
}

