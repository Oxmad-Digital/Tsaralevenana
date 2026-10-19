import styles from "./admin.module.css";
import LineChart from "./LineChart";
import type { Day } from "./chartAxis";

export default function ViewsTrendChart({
  days,
  maxDailyCount,
}: {
  days: Day[];
  maxDailyCount: number;
}) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>Vues — depuis le début</h2>
      <LineChart
        days={days}
        maxDailyCount={maxDailyCount}
        gradientId="viewsLineFill"
        unitLabel="vue"
        ariaLabel="Vues depuis le début"
      />
    </section>
  );
}
