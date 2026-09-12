import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getVisitorId, setVisitorCookie } from "@/lib/visitor";
import { isBotUserAgent } from "@/lib/bot";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 255) : "";

  if (!path) {
    return NextResponse.json({ error: "Path requis." }, { status: 400 });
  }

  if (isBotUserAgent(request.headers.get("user-agent"))) {
    return NextResponse.json({ success: true });
  }

  const { id: visitorId, isNew } = getVisitorId(request);

  await sql`
    INSERT INTO click_events (path, visitor_id) VALUES (${path}, ${visitorId})
  `;

  const response = NextResponse.json({ success: true });
  if (isNew) setVisitorCookie(response, visitorId);
  return response;
}
