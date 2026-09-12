import { randomUUID } from "node:crypto";
import type { NextResponse } from "next/server";

export const VISITOR_COOKIE = "visitor_id";

export function getVisitorId(request: Request): { id: string; isNew: boolean } {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)visitor_id=([^;]+)/);
  if (match) {
    return { id: decodeURIComponent(match[1]), isNew: false };
  }
  return { id: randomUUID(), isNew: true };
}

export function setVisitorCookie(response: NextResponse, id: string) {
  response.cookies.set(VISITOR_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 2,
  });
}
