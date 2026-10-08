import { sql } from "@/lib/db";
import { siteInfo } from "@/lib/data";

export type StatRow = { label: string; count: number };

const SITE_HOST = new URL(siteInfo.url).hostname.replace(/^www\./, "");

// Passed as a query parameter so the backslash survives the tagged template.
const REFERRER_HOST_PATTERN = "^https?://(?:www\\.)?([^/:?#]+)";

const DEVICE_LABELS: Record<string, string> = {
  desktop: "Ordinateur",
  mobile: "Mobile",
  tablet: "Tablette",
  unknown: "Inconnu",
};

export async function getTopPages(): Promise<StatRow[]> {
  const rows = await sql`
    SELECT path AS label, COUNT(*)::int AS count
    FROM page_views
    GROUP BY path
    ORDER BY count DESC
    LIMIT 10
  `;
  return rows as StatRow[];
}

export async function getTopSources(): Promise<StatRow[]> {
  const rows = await sql`
    SELECT
      CASE
        WHEN host IS NULL OR host = ${SITE_HOST} THEN 'Direct'
        WHEN host = 'facebook.com' OR host LIKE '%.facebook.com' THEN 'Facebook'
        ELSE host
      END AS label,
      COUNT(*)::int AS count
    FROM (
      SELECT lower(substring(referrer FROM ${REFERRER_HOST_PATTERN})) AS host
      FROM page_views
    ) AS sources
    GROUP BY label
    ORDER BY count DESC
    LIMIT 10
  `;
  return rows as StatRow[];
}

export async function getDevices(): Promise<StatRow[]> {
  const rows = (await sql`
    SELECT COALESCE(device, 'unknown') AS device, COUNT(*)::int AS count
    FROM page_views
    GROUP BY 1
  `) as { device: string; count: number }[];

  const counts = new Map(rows.map((row) => [row.device, row.count]));
  return ["desktop", "mobile", "tablet", "unknown"]
    .map((key) => ({ label: DEVICE_LABELS[key], count: counts.get(key) ?? 0 }))
    .filter((row) => row.label !== "Inconnu" || row.count > 0);
}
