import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE, SESSION_DURATION_SECONDS } from "@/lib/auth";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis." },
      { status: 400 }
    );
  }

  const rows = await sql`
    SELECT id, email, password_hash FROM admin_users WHERE email = ${email} LIMIT 1
  `;
  const user = rows[0] as { id: number; email: string; password_hash: string } | undefined;

  // Hash factice pour éviter qu'un temps de réponse différent ne révèle si l'email existe.
  const DUMMY_HASH =
    "$2a$12$CwTycUXWue0Thq9StjUM0uJ8Y0X3kZ9m1z6nEXaLzS0.9M9J4Q4Ni";
  const passwordMatches = await bcrypt.compare(
    password,
    user?.password_hash ?? DUMMY_HASH
  );

  if (!user || !passwordMatches) {
    return NextResponse.json(
      { error: "Identifiants incorrects." },
      { status: 401 }
    );
  }

  const token = await createSessionToken({ sub: String(user.id), email: user.email });

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });

  return response;
}
