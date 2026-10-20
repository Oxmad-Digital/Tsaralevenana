import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { setSessionCookie } from "@/lib/admin-session";
import { hashInvitationToken, isWellFormedToken, PASSWORD_MIN_LENGTH } from "@/lib/invitations";

export const dynamic = "force-dynamic";

// bcrypt only uses the first 72 bytes of a password.
const PASSWORD_MAX_LENGTH = 72;

// Simple per-IP limit, kept in memory: enough to slow down guessing on one instance.
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const attemptsByIp = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  if (attemptsByIp.size > 5000) {
    attemptsByIp.forEach((entry, key) => {
      if (entry.resetAt <= now) attemptsByIp.delete(key);
    });
  }
  const entry = attemptsByIp.get(ip);
  if (!entry || entry.resetAt <= now) {
    attemptsByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_ATTEMPTS;
}

const INVALID_LINK = "Lien invalide ou expiré.";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { token, password, confirmation } = body;
  if (!isWellFormedToken(token)) {
    return NextResponse.json({ error: INVALID_LINK }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    return NextResponse.json(
      { error: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.` },
      { status: 400 }
    );
  }
  if (new TextEncoder().encode(password).length > PASSWORD_MAX_LENGTH) {
    return NextResponse.json(
      { error: `Le mot de passe ne doit pas dépasser ${PASSWORD_MAX_LENGTH} caractères.` },
      { status: 400 }
    );
  }
  if (password !== confirmation) {
    return NextResponse.json(
      { error: "Les deux mots de passe ne correspondent pas." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Single statement: the token is checked, consumed and the password set atomically,
  // so the same link can never be used twice.
  const rows = (await sql`
    UPDATE admin_users
    SET password_hash = ${passwordHash},
        invitation_token_hash = NULL,
        invitation_expires_at = NULL
    WHERE invitation_token_hash = ${hashInvitationToken(token)}
      AND invitation_expires_at > now()
      AND password_hash IS NULL
    RETURNING id, email
  `) as { id: number; email: string }[];

  const user = rows[0];
  if (!user) {
    return NextResponse.json({ error: INVALID_LINK }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  await setSessionCookie(response, user);
  return response;
}
