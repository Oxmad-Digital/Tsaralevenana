import { getDevices, getTopPages, getTopSources, type StatRow } from "@/lib/admin-stats";
import styles from "./StatsCards.module.css";

function StatCard({ title, rows }: { title: string; rows: StatRow[] }) {
  const maxCount = Math.max(1, ...rows.map((row) => row.count));

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      {rows.length === 0 ? (
        <p className={styles.emptyState}>Pas encore de données.</p>
      ) : (
        <ul className={styles.list}>
          {rows.map((row) => (
            <li key={row.label} className={styles.row}>
              <div className={styles.meta}>
                <span className={styles.label}>{row.label}</span>
                <span className={styles.count}>{row.count}</span>
              </div>
              <div className={styles.track}>
                <div
                  className={styles.fill}
                  style={{ width: `${(row.count / maxCount) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function StatsCards() {
  const [topPages, topSources, devices] = await Promise.all([
    getTopPages(),
    getTopSources(),
    getDevices(),
  ]);

  return (
    <div className={styles.grid}>
      <StatCard title="Pages les plus vues" rows={topPages} />
      <StatCard title="Provenance" rows={topSources} />
      <StatCard title="Appareils" rows={devices} />
    </div>
  );
}
