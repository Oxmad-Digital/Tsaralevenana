import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function userExists(id: number) {
  const rows = await sql`SELECT 1 FROM admin_users WHERE id = ${id} LIMIT 1`;
  return rows.length > 0;
}

const LAST_ADMIN_ERROR = "Impossible : il doit rester au moins un administrateur actif.";

export async function PATCH(request: Request, { params }: Params) {
  const { user, error } = await requireAdmin();
  if (error) return error;

  const id = parseId(params.id);
  if (!id) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }
  if (id === user.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas modifier votre propre rôle." },
      { status: 400 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const role = body.role;
  if (role !== "admin" && role !== "member") {
    return NextResponse.json({ error: "Rôle invalide." }, { status: 400 });
  }

  // One statement: the "another active admin remains" check and the update cannot be
  // separated by a concurrent change. FOR UPDATE serialises two admins demoting each other.
  const rows = await sql`
    WITH active_admins AS (
      SELECT id FROM admin_users
      WHERE role = 'admin' AND password_hash IS NOT NULL
      FOR UPDATE
    )
    UPDATE admin_users
    SET role = ${role}
    WHERE id = ${id}
      AND (
        ${role}::text = 'admin'
        OR role <> 'admin'
        OR password_hash IS NULL
        OR (SELECT COUNT(*) FROM active_admins WHERE active_admins.id <> ${id}) > 0
      )
    RETURNING id, role
  `;

  if (rows.length === 0) {
    return (await userExists(id))
      ? NextResponse.json({ error: LAST_ADMIN_ERROR }, { status: 409 })
      : NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }
  return NextResponse.json({ success: true, role: rows[0].role });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { user, error } = await requireAdmin();
  if (error) return error;

  const id = parseId(params.id);
  if (!id) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }
  if (id === user.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas supprimer votre propre compte." },
      { status: 400 }
    );
  }

  // Deleting a pending invitation cancels it. Same single-statement last-admin guard as PATCH.
  const rows = await sql`
    WITH active_admins AS (
      SELECT id FROM admin_users
      WHERE role = 'admin' AND password_hash IS NOT NULL
      FOR UPDATE
    )
    DELETE FROM admin_users
    WHERE id = ${id}
      AND (
        role <> 'admin'
        OR password_hash IS NULL
        OR (SELECT COUNT(*) FROM active_admins WHERE active_admins.id <> ${id}) > 0
      )
    RETURNING id
  `;

  if (rows.length === 0) {
    return (await userExists(id))
      ? NextResponse.json({ error: LAST_ADMIN_ERROR }, { status: 409 })
      : NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
