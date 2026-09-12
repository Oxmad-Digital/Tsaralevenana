import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

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

  await sql`
    INSERT INTO page_views (path, referrer, country) VALUES (${path}, ${referrer}, ${country})
  `;

  return NextResponse.json({ success: true });
}
