import { unstable_noStore as noStore } from "next/cache";
import { sql } from "@/lib/db";
import { getCountryName } from "@/lib/countries";
import styles from "./admin.module.css";
import PeriodOverview, { type Period, type PeriodData } from "./PeriodOverview";
import WorldMap from "./WorldMap";
import StatsCards from "./StatsCards";
import type { Day } from "./chartAxis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MIN_DAYS_IN_CHART = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

type WindowRow = { day: number; week: number; month: number; all: number };
type ViewWindowRow = WindowRow & {
  visitors_day: number;
  visitors_week: number;
  visitors_month: number;
  visitors_all: number;
};
type HourlyRow = { hour: number; count: number };
type DailyRow = { day: string; count: number };
type CountryRow = { country: string | null; count: number };
type ContactRow = {
  name: string;
  email: string;
  type: string | null;
  created_at: string;
};

function formatDayLabel(key: string, withYear: boolean) {
  const label = `${key.slice(8, 10)}/${key.slice(5, 7)}`;
  return withYear ? `${label}/${key.slice(2, 4)}` : label;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminDashboard() {
  noStore();

  // Periods are rolling windows ending today (UTC), matching the daily chart buckets.
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dayStart = new Date(todayUtc).toISOString();
  const weekStart = new Date(todayUtc - 6 * DAY_MS).toISOString();
  const monthStart = new Date(todayUtc - 29 * DAY_MS).toISOString();

  const [
    viewWindowRows,
    clickWindowRows,
    contactWindowRows,
    hourlyRows,
    dailyRows,
    countryRows,
    recentContactsRows,
  ] = await Promise.all([
    sql`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= ${dayStart}::timestamptz)::int AS day,
        COUNT(*) FILTER (WHERE created_at >= ${weekStart}::timestamptz)::int AS week,
        COUNT(*) FILTER (WHERE created_at >= ${monthStart}::timestamptz)::int AS month,
        COUNT(*)::int AS all,
        COUNT(DISTINCT visitor_id) FILTER (WHERE created_at >= ${dayStart}::timestamptz)::int AS visitors_day,
        COUNT(DISTINCT visitor_id) FILTER (WHERE created_at >= ${weekStart}::timestamptz)::int AS visitors_week,
        COUNT(DISTINCT visitor_id) FILTER (WHERE created_at >= ${monthStart}::timestamptz)::int AS visitors_month,
        COUNT(DISTINCT visitor_id)::int AS visitors_all
      FROM page_views
    `,
    sql`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= ${dayStart}::timestamptz)::int AS day,
        COUNT(*) FILTER (WHERE created_at >= ${weekStart}::timestamptz)::int AS week,
        COUNT(*) FILTER (WHERE created_at >= ${monthStart}::timestamptz)::int AS month,
        COUNT(*)::int AS all
      FROM click_events
    `,
    sql`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= ${dayStart}::timestamptz)::int AS day,
        COUNT(*) FILTER (WHERE created_at >= ${weekStart}::timestamptz)::int AS week,
        COUNT(*) FILTER (WHERE created_at >= ${monthStart}::timestamptz)::int AS month,
        COUNT(*)::int AS all
      FROM contact_submissions
    `,
    sql`
      SELECT EXTRACT(HOUR FROM created_at AT TIME ZONE 'UTC')::int AS hour, COUNT(*)::int AS count
      FROM page_views
      WHERE created_at >= ${dayStart}::timestamptz
      GROUP BY hour
    `,
    sql`
      SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day, COUNT(*)::int AS count
      FROM page_views
      GROUP BY day
    `,
    sql`
      SELECT country, COUNT(*)::int AS count
      FROM page_views
      WHERE country IS NOT NULL
      GROUP BY country
      ORDER BY count DESC
    `,
    sql`
      SELECT name, email, type, created_at
      FROM contact_submissions
      ORDER BY created_at DESC
      LIMIT 8
    `,
  ]);

  const recentContacts = recentContactsRows as ContactRow[];
  const countries = (countryRows as CountryRow[])
    .filter((row): row is { country: string; count: number } => Boolean(row.country))
    .map((row) => ({ code: row.country, name: getCountryName(row.country), count: row.count }));
  const maxCountryCount = Math.max(1, ...countries.map((c) => c.count));

  const dailyMap = new Map((dailyRows as DailyRow[]).map((row) => [row.day, row.count]));

  // The "Total" chart covers every day from the first recorded view up to today,
  // falling back to the last MIN_DAYS_IN_CHART days when there is little data.
  const earliestKey = [...dailyMap.keys()].sort()[0];
  const earliestUtc = earliestKey ? Date.parse(`${earliestKey}T00:00:00Z`) : todayUtc;
  const dayCount = Math.max(
    MIN_DAYS_IN_CHART,
    Math.round((todayUtc - earliestUtc) / DAY_MS) + 1
  );
  const lastDays = (count: number): Day[] => {
    const keys = Array.from({ length: count }, (_, index) =>
      new Date(todayUtc - (count - 1 - index) * DAY_MS).toISOString().slice(0, 10)
    );
    const spansYears = keys[0].slice(0, 4) !== keys[keys.length - 1].slice(0, 4);
    return keys.map((key) => ({
      key,
      label: formatDayLabel(key, spansYears),
      count: dailyMap.get(key) ?? 0,
    }));
  };

  const hourlyMap = new Map((hourlyRows as HourlyRow[]).map((row) => [row.hour, row.count]));
  const hours: Day[] = Array.from({ length: 24 }, (_, hour) => ({
    key: `h${hour}`,
    label: `${String(hour).padStart(2, "0")}h`,
    count: hourlyMap.get(hour) ?? 0,
  }));

  const views = (viewWindowRows as ViewWindowRow[])[0];
  const clicks = (clickWindowRows as WindowRow[])[0];
  const contacts = (contactWindowRows as WindowRow[])[0];
  const statsFor = (period: Period) => ({
    views: views[period],
    visitors: views[`visitors_${period}`],
    clicks: clicks[period],
    contacts: contacts[period],
  });

  const periods: Record<Period, PeriodData> = {
    day: { stats: statsFor("day"), series: hours, chartTitle: "Vues par heure — aujourd'hui (UTC)" },
    week: { stats: statsFor("week"), series: lastDays(7), chartTitle: "Vues par jour — 7 derniers jours" },
    month: { stats: statsFor("month"), series: lastDays(30), chartTitle: "Vues par jour — 30 derniers jours" },
    all: { stats: statsFor("all"), series: lastDays(dayCount), chartTitle: "Vues par jour — depuis le début" },
  };

  return (
    <div className={styles.dashboard}>
      <PeriodOverview data={periods} />

      <StatsCards />

      <WorldMap countries={countries} />

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Origine des visiteurs</h2>
        {countries.length === 0 ? (
          <p className={styles.emptyState}>Pas encore de données.</p>
        ) : (
          <ul className={styles.topPagesList}>
            {countries.slice(0, 8).map((country) => (
              <li key={country.code} className={styles.topPagesRow}>
                <div className={styles.topPagesMeta}>
                  <span className={styles.topPagesPath}>{country.name}</span>
                  <span className={styles.topPagesCount}>{country.count}</span>
                </div>
                <div className={styles.topPagesTrack}>
                  <div
                    className={styles.topPagesFill}
                    style={{ width: `${(country.count / maxCountryCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Derniers messages de contact</h2>
        {recentContacts.length === 0 ? (
          <p className={styles.emptyState}>Aucun message reçu pour le moment.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Objet</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((contact, index) => (
                  <tr key={index}>
                    <td data-label="Nom">{contact.name}</td>
                    <td data-label="Email">{contact.email}</td>
                    <td data-label="Objet">{contact.type || "—"}</td>
                    <td data-label="Date">{formatDateTime(contact.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
