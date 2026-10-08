import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getVisitorId, setVisitorCookie } from "@/lib/visitor";
import { isBotUserAgent } from "@/lib/bot";
import { getDevice } from "@/lib/device";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 255) : "";
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 255) : null;
  const country = request.headers.get("x-vercel-ip-country")?.slice(0, 2) || null;

  if (!path) {
    return NextResponse.json({ error: "Path requis." }, { status: 400 });
  }

  if (isBotUserAgent(request.headers.get("user-agent"))) {
    return NextResponse.json({ success: true });
  }

  const device = getDevice(request.headers.get("user-agent"));
  const { id: visitorId, isNew } = getVisitorId(request);

  await sql`
    INSERT INTO page_views (path, referrer, country, visitor_id, device) VALUES (${path}, ${referrer}, ${country}, ${visitorId}, ${device})
  `;

  const response = NextResponse.json({ success: true });
  if (isNew) setVisitorCookie(response, visitorId);
  return response;
}
