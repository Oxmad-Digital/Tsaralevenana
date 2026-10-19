import { unstable_noStore as noStore } from "next/cache";
import { sql } from "@/lib/db";
import { getCountryName } from "@/lib/countries";
import styles from "./admin.module.css";
import VisitsChart from "./VisitsChart";
import ViewsTrendChart from "./ViewsTrendChart";
import WorldMap from "./WorldMap";
import StatsCards from "./StatsCards";
import type { Day } from "./chartAxis";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MIN_DAYS_IN_CHART = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

type CountRow = { count: number };
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

  const [
    totalViewsRows,
    uniqueVisitorsRows,
    totalClicksRows,
    dailyRows,
    countryRows,
    totalContactsRows,
    recentContactsRows,
  ] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM page_views`,
    sql`SELECT COUNT(DISTINCT visitor_id)::int AS count FROM page_views WHERE visitor_id IS NOT NULL`,
    sql`SELECT COUNT(*)::int AS count FROM click_events`,
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
    sql`SELECT COUNT(*)::int AS count FROM contact_submissions`,
    sql`
      SELECT name, email, type, created_at
      FROM contact_submissions
      ORDER BY created_at DESC
      LIMIT 8
    `,
  ]);

  const totalViews = (totalViewsRows as CountRow[])[0]?.count ?? 0;
  const uniqueVisitors = (uniqueVisitorsRows as CountRow[])[0]?.count ?? 0;
  const totalClicks = (totalClicksRows as CountRow[])[0]?.count ?? 0;
  const totalContacts = (totalContactsRows as CountRow[])[0]?.count ?? 0;
  const recentContacts = recentContactsRows as ContactRow[];
  const countries = (countryRows as CountryRow[])
    .filter((row): row is { country: string; count: number } => Boolean(row.country))
    .map((row) => ({ code: row.country, name: getCountryName(row.country), count: row.count }));
  const maxCountryCount = Math.max(1, ...countries.map((c) => c.count));

  const dailyMap = new Map((dailyRows as DailyRow[]).map((row) => [row.day, row.count]));

  // The chart covers every day from the first recorded view up to today,
  // falling back to the last MIN_DAYS_IN_CHART days when there is little data.
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const earliestKey = [...dailyMap.keys()].sort()[0];
  const earliestUtc = earliestKey ? Date.parse(`${earliestKey}T00:00:00Z`) : todayUtc;
  const dayCount = Math.max(
    MIN_DAYS_IN_CHART,
    Math.round((todayUtc - earliestUtc) / DAY_MS) + 1
  );
  const dayKeys = Array.from({ length: dayCount }, (_, index) =>
    new Date(todayUtc - (dayCount - 1 - index) * DAY_MS).toISOString().slice(0, 10)
  );
  const spansYears = dayKeys[0].slice(0, 4) !== dayKeys[dayKeys.length - 1].slice(0, 4);

  const days: Day[] = dayKeys.map((key) => ({
    key,
    label: formatDayLabel(key, spansYears),
    count: dailyMap.get(key) ?? 0,
  }));
  const maxDailyCount = Math.max(1, ...days.map((day) => day.count));

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>Tableau de bord</h1>

      <div className={styles.statGrid}>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Vues totales</span>
          <span className={styles.statValue}>{totalViews}</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Visiteurs uniques</span>
          <span className={styles.statValue}>{uniqueVisitors}</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Clics</span>
          <span className={styles.statValue}>{totalClicks}</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Messages reçus</span>
          <span className={styles.statValue}>{totalContacts}</span>
        </div>
      </div>

      <div className={styles.panelGrid}>
        <VisitsChart days={days} maxDailyCount={maxDailyCount} />
        <ViewsTrendChart days={days} maxDailyCount={maxDailyCount} />
      </div>

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
