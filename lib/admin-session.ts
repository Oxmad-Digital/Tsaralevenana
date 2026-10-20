import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_DURATION_SECONDS,
  verifySessionToken,
} from "@/lib/auth";

export type Role = "admin" | "member";

export type AdminUser = {
  id: number;
  email: string;
  role: Role;
};

// The JWT only proves who signed in. The account and its role are re-read from the
// database on every call, so a deleted account or a role change takes effect at once.
export async function getCurrentUser(): Promise<AdminUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const id = session ? Number(session.sub) : NaN;
  if (!Number.isInteger(id)) return null;

  const rows = (await sql`
    SELECT id, email, role FROM admin_users
    WHERE id = ${id} AND password_hash IS NOT NULL
    LIMIT 1
  `) as AdminUser[];
  return rows[0] ?? null;
}

type AdminCheck = { user: AdminUser; error?: never } | { user?: never; error: NextResponse };

export async function requireAdmin(): Promise<AdminCheck> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Non autorisé." }, { status: 401 }) };
  }
  if (user.role !== "admin") {
    return { error: NextResponse.json({ error: "Accès réservé aux administrateurs." }, { status: 403 }) };
  }
  return { user };
}

export async function setSessionCookie(response: NextResponse, user: { id: number; email: string }) {
  const token = await createSessionToken({ sub: String(user.id), email: user.email });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}
