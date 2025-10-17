import { NextResponse } from "next/server";
import { sendMetaConversionEvent } from "@/src/lib/meta/conversions";

export async function GET(req: Request) {
  const result = await sendMetaConversionEvent({
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_id: "capitest_" + Date.now(),
    action_source: "website",
    event_source_url: "http://localhost:3000/test",
    user_data: {
      em: ["973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b"],
      client_user_agent: req.headers.get("user-agent") ?? "local-test",
    },
  });
  console.log("[META][CAPI][TEST] status:", result?.status, "body:", result?.detail);
  return NextResponse.json({ ok: true });
}
