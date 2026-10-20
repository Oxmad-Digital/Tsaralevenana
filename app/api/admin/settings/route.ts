import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-session";
import {
  getMaintenanceSettings,
  MAINTENANCE_MESSAGE_MAX_LENGTH,
  setSetting,
} from "@/lib/settings";

export const dynamic = "force-dynamic";

// The middleware does not cover /api, so this route checks the account and its role itself.
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if ("maintenanceEnabled" in body) {
    if (typeof body.maintenanceEnabled !== "boolean") {
      return NextResponse.json({ error: "Valeur invalide." }, { status: 400 });
    }
    await setSetting("maintenance_enabled", String(body.maintenanceEnabled));
  }

  if ("maintenanceMessage" in body) {
    if (typeof body.maintenanceMessage !== "string") {
      return NextResponse.json({ error: "Message invalide." }, { status: 400 });
    }
    const message = body.maintenanceMessage.trim();
    if (message.length > MAINTENANCE_MESSAGE_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Le message ne doit pas dépasser ${MAINTENANCE_MESSAGE_MAX_LENGTH} caractères.` },
        { status: 400 }
      );
    }
    await setSetting("maintenance_message", message);
  }

  return NextResponse.json(await getMaintenanceSettings());
}
