import { neon } from "@neondatabase/serverless";

// Read by the Edge middleware, so this must not import lib/db (it pulls in node:dns).
// The neon() HTTP driver is fetch-based and runs on Edge.

const CACHE_TTL_MS = 5_000;
const QUERY_TIMEOUT_MS = 1_500;

let cached: { enabled: boolean; expiresAt: number } | null = null;
let pending: Promise<boolean> | null = null;

async function queryMaintenanceEnabled(): Promise<boolean> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return false;

  const sql = neon(databaseUrl);
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), QUERY_TIMEOUT_MS)
  );
  const rows = (await Promise.race([
    sql`SELECT value FROM settings WHERE key = 'maintenance_enabled' LIMIT 1`,
    timeout,
  ])) as { value: string }[];
  return rows[0]?.value === "true";
}

// Fails open: if the database is unreachable or the table is missing, the site stays online.
export async function isMaintenanceEnabled(): Promise<boolean> {
  if (cached && cached.expiresAt > Date.now()) return cached.enabled;

  pending ??= queryMaintenanceEnabled()
    .catch(() => false)
    .then((enabled) => {
      cached = { enabled, expiresAt: Date.now() + CACHE_TTL_MS };
      pending = null;
      return enabled;
    });
  return pending;
}
