import styles from "./admin.module.css";
import LineChart from "./LineChart";

type Day = { label: string; count: number };

export default function ViewsTrendChart({
  days,
  maxDailyCount,
}: {
  days: Day[];
  maxDailyCount: number;
}) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Vues — 14 derniers jours</h2>
      <LineChart
        days={days}
        maxDailyCount={maxDailyCount}
        gradientId="viewsLineFill"
        unitLabel="vue"
        ariaLabel="Vues des 14 derniers jours"
      />
    </section>
  );
}
