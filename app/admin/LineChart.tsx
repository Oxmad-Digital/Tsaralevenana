"use client";

import { useState } from "react";
import styles from "./admin.module.css";

type Day = { label: string; count: number };

export default function LineChart({
  days,
  maxDailyCount,
  width = 280,
  height = 100,
  gradientId,
  unitLabel = "vue",
  ariaLabel,
}: {
  days: Day[];
  maxDailyCount: number;
  width?: number;
  height?: number;
  gradientId: string;
  unitLabel?: string;
  ariaLabel: string;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const stepX = days.length > 1 ? width / (days.length - 1) : 0;
  const points = days.map((day, index) => ({
    x: index * stepX,
    y: height - (day.count / maxDailyCount) * height,
    day,
  }));

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className={styles.lineChart}>
      <div className={styles.lineChartWrap}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={styles.lineChartSvg}
          role="img"
          aria-label={ariaLabel}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
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
            <g key={index}>
              <circle cx={point.x} cy={point.y} r="1.8" fill="var(--color-gold)" />
              <circle
                cx={point.x}
                cy={point.y}
                r="7"
                fill="transparent"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            </g>
          ))}
        </svg>
        {hovered && (
          <div
            className={styles.chartTooltip}
            style={{
              left: `${(hovered.x / width) * 100}%`,
              top: `${(hovered.y / height) * 100}%`,
            }}
          >
            <span className={styles.chartTooltipValue}>
              {hovered.day.count} {unitLabel}
              {hovered.day.count > 1 ? "s" : ""}
            </span>
            <span className={styles.chartTooltipLabel}>{hovered.day.label}</span>
          </div>
        )}
      </div>
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
