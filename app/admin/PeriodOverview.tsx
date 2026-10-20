"use client";

import { useState } from "react";
import styles from "./admin.module.css";
import VisitsChart from "./VisitsChart";
import type { Day } from "./chartAxis";

export type Period = "day" | "week" | "month" | "all";

export type PeriodData = {
  stats: { views: number; visitors: number; clicks: number; contacts: number };
  series: Day[];
  chartTitle: string;
};

const PERIODS: { id: Period; label: string; description: string }[] = [
  { id: "day", label: "Jour", description: "Aujourd'hui" },
  { id: "week", label: "Semaine", description: "7 derniers jours" },
  { id: "month", label: "Mois", description: "30 derniers jours" },
  { id: "all", label: "Total", description: "Depuis le début" },
];

export default function PeriodOverview({ data }: { data: Record<Period, PeriodData> }) {
  const [period, setPeriod] = useState<Period>("all");
  const current = data[period];
  const description = PERIODS.find((item) => item.id === period)?.description;
  const maxCount = Math.max(1, ...current.series.map((day) => day.count));

  return (
    <>
      <div className={styles.periodBar}>
        <h1 className={styles.pageTitle}>Tableau de bord</h1>
        <div className={styles.periodControls}>
          <span className={styles.periodDescription}>{description}</span>
          <div className={styles.chartToggle} role="group" aria-label="Période">
            {PERIODS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.chartToggleBtn} ${
                  period === item.id ? styles.chartToggleBtnActive : ""
                }`}
                aria-pressed={period === item.id}
                onClick={() => setPeriod(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Vues</span>
          <span className={styles.statValue}>{current.stats.views}</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Visiteurs uniques</span>
          <span className={styles.statValue}>{current.stats.visitors}</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Clics</span>
          <span className={styles.statValue}>{current.stats.clicks}</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statLabel}>Messages reçus</span>
          <span className={styles.statValue}>{current.stats.contacts}</span>
        </div>
      </div>

      <VisitsChart
        days={current.series}
        maxDailyCount={maxCount}
        title={current.chartTitle}
      />
    </>
  );
}
