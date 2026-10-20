import { sql } from "@/lib/db";

export const MAINTENANCE_MESSAGE_MAX_LENGTH = 1000;

export type MaintenanceSettings = {
  enabled: boolean;
  message: string;
};

type SettingRow = { key: string; value: string };

// A missing table or row means "site online": a settings problem must never take the site down.
export async function getMaintenanceSettings(): Promise<MaintenanceSettings> {
  try {
    const rows = (await sql`
      SELECT key, value FROM settings
      WHERE key IN ('maintenance_enabled', 'maintenance_message')
    `) as SettingRow[];
    const values = new Map(rows.map((row) => [row.key, row.value]));
    return {
      enabled: values.get("maintenance_enabled") === "true",
      message: values.get("maintenance_message") ?? "",
    };
  } catch {
    return { enabled: false, message: "" };
  }
}

export async function setSetting(key: string, value: string) {
  await sql`
    INSERT INTO settings (key, value, updated_at)
    VALUES (${key}, ${value}, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}
