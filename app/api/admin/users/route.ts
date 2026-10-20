import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin, type Role } from "@/lib/admin-session";
import {
  generateInvitationToken,
  getSiteUrl,
  INVITATION_TTL_HOURS,
  sendInvitationEmail,
} from "@/lib/invitations";

export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UserRow = {
  id: number;
  email: string;
  role: Role;
  active: boolean;
  invitation_expires_at: Date | string | null;
};

export type UserListItem = {
  id: number;
  email: string;
  role: Role;
  status: "active" | "invited" | "expired";
  isCurrentUser: boolean;
};

export async function GET() {
  const { user, error } = await requireAdmin();
  if (error) return error;

  const rows = (await sql`
    SELECT id, email, role, password_hash IS NOT NULL AS active, invitation_expires_at
    FROM admin_users
    ORDER BY created_at ASC, id ASC
  `) as UserRow[];

  const now = Date.now();
  const users: UserListItem[] = rows.map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role,
    status: row.active
      ? "active"
      : row.invitation_expires_at && new Date(row.invitation_expires_at).getTime() > now
        ? "invited"
        : "expired",
    isCurrentUser: row.id === user.id,
  }));

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = body.role;
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }
  if (role !== "admin" && role !== "member") {
    return NextResponse.json({ error: "Rôle invalide." }, { status: 400 });
  }

  const existingRows = (await sql`
    SELECT id, role, password_hash IS NOT NULL AS active, invitation_token_hash, invitation_expires_at
    FROM admin_users WHERE email = ${email} LIMIT 1
  `) as {
    id: number;
    role: Role;
    active: boolean;
    invitation_token_hash: string | null;
    invitation_expires_at: Date | string | null;
  }[];
  const existing = existingRows[0];

  if (existing?.active) {
    return NextResponse.json({ error: "Ce compte existe déjà." }, { status: 409 });
  }

  const { token, tokenHash } = generateInvitationToken();

  // A pending invitation gets a fresh token (the previous link stops working) and the new role.
  const savedRows = existing
    ? await sql`
        UPDATE admin_users
        SET role = ${role},
            invitation_token_hash = ${tokenHash},
            invitation_expires_at = now() + make_interval(hours => ${INVITATION_TTL_HOURS})
        WHERE id = ${existing.id} AND password_hash IS NULL
        RETURNING id
      `
    : await sql`
        INSERT INTO admin_users (email, password_hash, role, invitation_token_hash, invitation_expires_at)
        VALUES (${email}, NULL, ${role}, ${tokenHash}, now() + make_interval(hours => ${INVITATION_TTL_HOURS}))
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `;
  if (savedRows.length === 0) {
    // The account was activated or created concurrently.
    return NextResponse.json({ error: "Ce compte existe déjà." }, { status: 409 });
  }

  const link = `${getSiteUrl(request)}/invitation?token=${token}`;
  try {
    await sendInvitationEmail({ to: email, role, link });
  } catch (sendError) {
    console.error("Invitation email error:", sendError);
    // Undo only what this request wrote: the token hash identifies it.
    if (existing) {
      await sql`
        UPDATE admin_users
        SET role = ${existing.role},
            invitation_token_hash = ${existing.invitation_token_hash},
            invitation_expires_at = ${existing.invitation_expires_at}
        WHERE id = ${existing.id} AND invitation_token_hash = ${tokenHash}
      `;
    } else {
      await sql`
        DELETE FROM admin_users
        WHERE email = ${email} AND invitation_token_hash = ${tokenHash} AND password_hash IS NULL
      `;
    }
    return NextResponse.json(
      { error: "L'email d'invitation n'a pas pu être envoyé. L'invitation a été annulée." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true }, { status: existing ? 200 : 201 });
}
