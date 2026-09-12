"use client";

import { useState } from "react";
import styles from "./admin.module.css";
import LineChart from "./LineChart";

type Day = { label: string; count: number };

export default function VisitsChart({
  days,
  maxDailyCount,
}: {
  days: Day[];
  maxDailyCount: number;
}) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Visites — 14 derniers jours</h2>
        <div className={styles.chartToggle} role="group" aria-label="Type de graphique">
          <button
            type="button"
            className={`${styles.chartToggleBtn} ${
              chartType === "line" ? styles.chartToggleBtnActive : ""
            }`}
            aria-pressed={chartType === "line"}
            onClick={() => setChartType("line")}
          >
            Courbe
          </button>
          <button
            type="button"
            className={`${styles.chartToggleBtn} ${
              chartType === "bar" ? styles.chartToggleBtnActive : ""
            }`}
            aria-pressed={chartType === "bar"}
            onClick={() => setChartType("bar")}
          >
            Barres
          </button>
        </div>
      </div>

      {chartType === "line" ? (
        <LineChart
          days={days}
          maxDailyCount={maxDailyCount}
          gradientId="visitsLineFill"
          unitLabel="visite"
          ariaLabel="Visites des 14 derniers jours"
        />
      ) : (
        <div className={styles.barChart}>
          {days.map((day) => (
            <div
              key={day.label}
              className={styles.barColumn}
              title={`${day.label} : ${day.count} vue${day.count > 1 ? "s" : ""}`}
            >
              <div
                className={styles.bar}
                style={{ height: `${(day.count / maxDailyCount) * 100}%` }}
                aria-label={`${day.label} : ${day.count} vues`}
              />
              <span className={styles.barLabel}>{day.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
