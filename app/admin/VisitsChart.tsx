"use client";

import { useState } from "react";
import styles from "./admin.module.css";

type Day = { label: string; count: number };

const CHART_WIDTH = 280;
const CHART_HEIGHT = 100;

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
        <LineChart days={days} maxDailyCount={maxDailyCount} />
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

function LineChart({ days, maxDailyCount }: { days: Day[]; maxDailyCount: number }) {
  const stepX = days.length > 1 ? CHART_WIDTH / (days.length - 1) : 0;

  const points = days.map((day, index) => ({
    x: index * stepX,
    y: CHART_HEIGHT - (day.count / maxDailyCount) * CHART_HEIGHT,
    day,
  }));

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L${CHART_WIDTH},${CHART_HEIGHT} L0,${CHART_HEIGHT} Z`;

  return (
    <div className={styles.lineChart}>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className={styles.lineChartSvg}
        role="img"
        aria-label="Visites des 14 derniers jours"
      >
        <defs>
          <linearGradient id="visitsLineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#visitsLineFill)" stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="1.8" fill="var(--color-gold)">
            <title>{`${point.day.label} : ${point.day.count} vue${
              point.day.count > 1 ? "s" : ""
            }`}</title>
          </circle>
        ))}
      </svg>
      <div className={styles.lineChartLabels}>
        {days.map((day) => (
          <span key={day.label} className={styles.lineChartLabel}>
            {day.label}
          </span>
        ))}
      </div>
    </div>
  );
}
