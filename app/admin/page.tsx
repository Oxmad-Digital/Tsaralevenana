import { unstable_noStore as noStore } from "next/cache";
import { sql } from "@/lib/db";
import { getCountryName } from "@/lib/countries";
import styles from "./admin.module.css";
import VisitsChart from "./VisitsChart";
import WorldMap from "./WorldMap";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CountRow = { count: number };
type TopPageRow = { path: string; count: number };
type DailyRow = { day: string; count: number };
type CountryRow = { country: string | null; count: number };
type ContactRow = {
  name: string;
  email: string;
  type: string | null;
  created_at: string;
};

function formatDay(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
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
    viewsTodayRows,
    views7dRows,
    views30dRows,
    dailyRows,
    topPagesRows,
    countryRows,
    totalContactsRows,
    recentContactsRows,
  ] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM page_views`,
    sql`SELECT COUNT(*)::int AS count FROM page_views WHERE created_at >= date_trunc('day', now())`,
    sql`SELECT COUNT(*)::int AS count FROM page_views WHERE created_at >= now() - interval '7 days'`,
    sql`SELECT COUNT(*)::int AS count FROM page_views WHERE created_at >= now() - interval '30 days'`,
    sql`
      SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day, COUNT(*)::int AS count
      FROM page_views
      WHERE created_at >= now() - interval '13 days'
      GROUP BY day
    `,
    sql`
      SELECT path, COUNT(*)::int AS count
      FROM page_views
      GROUP BY path
      ORDER BY count DESC
      LIMIT 5
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
  const viewsToday = (viewsTodayRows as CountRow[])[0]?.count ?? 0;
  const views7d = (views7dRows as CountRow[])[0]?.count ?? 0;
  const views30d = (views30dRows as CountRow[])[0]?.count ?? 0;
  const totalContacts = (totalContactsRows as CountRow[])[0]?.count ?? 0;
  const topPages = topPagesRows as TopPageRow[];
  const recentContacts = recentContactsRows as ContactRow[];
  const countries = (countryRows as CountryRow[])
    .filter((row): row is { country: string; count: number } => Boolean(row.country))
    .map((row) => ({ code: row.country, name: getCountryName(row.country), count: row.count }));
  const maxCountryCount = Math.max(1, ...countries.map((c) => c.count));

  const dailyMap = new Map(
    (dailyRows as DailyRow[]).map((row) => [row.day, row.count])
  );
  const days = Array.from({ length: 14 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - index));
    const key = date.toISOString().slice(0, 10);
    return { label: formatDay(date), count: dailyMap.get(key) ?? 0 };
  });
  const maxDailyCount = Math.max(1, ...days.map((day) => day.count));
  const maxTopPageCount = Math.max(1, ...topPages.map((page) => page.count));

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>Tableau de bord</h1>

      <div className={styles.statGrid}>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Vues aujourd&apos;hui</span>
          <span className={styles.statValue}>{viewsToday}</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Vues (7 jours)</span>
          <span className={styles.statValue}>{views7d}</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Vues (30 jours)</span>
          <span className={styles.statValue}>{views30d}</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Vues totales</span>
          <span className={styles.statValue}>{totalViews}</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Messages reçus</span>
          <span className={styles.statValue}>{totalContacts}</span>
        </div>
      </div>

      <div className={styles.panelGrid}>
        <VisitsChart days={days} maxDailyCount={maxDailyCount} />

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Pages les plus visitées</h2>
          {topPages.length === 0 ? (
            <p className={styles.emptyState}>Pas encore de données.</p>
          ) : (
            <ul className={styles.topPagesList}>
              {topPages.map((page) => (
                <li key={page.path} className={styles.topPagesRow}>
                  <div className={styles.topPagesMeta}>
                    <span className={styles.topPagesPath}>{page.path}</span>
                    <span className={styles.topPagesCount}>{page.count}</span>
                  </div>
                  <div className={styles.topPagesTrack}>
                    <div
                      className={styles.topPagesFill}
                      style={{ width: `${(page.count / maxTopPageCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className={styles.panelGrid}>
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
      </div>

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
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.type || "—"}</td>
                    <td>{formatDateTime(contact.created_at)}</td>
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
