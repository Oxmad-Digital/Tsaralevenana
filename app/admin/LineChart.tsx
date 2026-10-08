"use client";

import { useState, type PointerEvent } from "react";
import styles from "./admin.module.css";
import { edgeShift, getAxisLabelIndexes, type Day } from "./chartAxis";

// Beyond this many days the per-day dots merge into a thick line, so only the line is drawn.
const MAX_DOTS = 60;

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
  const hoveredPercent = hovered ? (hovered.x / width) * 100 : 0;
  const showDots = days.length <= MAX_DOTS;
  const labelIndexes = getAxisLabelIndexes(days.length);

  function handlePointer(event: PointerEvent<SVGRectElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * (days.length - 1));
    setHoverIndex(Math.min(days.length - 1, Math.max(0, index)));
  }

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
          {showDots &&
            points.map((point) => (
              <circle
                key={point.day.key}
                cx={point.x}
                cy={point.y}
                r="1.8"
                fill="var(--color-gold)"
              />
            ))}
          {hovered && (
            <circle
              cx={hovered.x}
              cy={hovered.y}
              r="3"
              fill="var(--color-gold)"
              pointerEvents="none"
            />
          )}
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="transparent"
            style={{ touchAction: "pan-y" }}
            onPointerDown={handlePointer}
            onPointerMove={handlePointer}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") setHoverIndex(null);
            }}
          />
        </svg>
        {hovered && (
          <div
            className={styles.chartTooltip}
            style={{
              left: `${hoveredPercent}%`,
              top: `${(hovered.y / height) * 100}%`,
              transform: `translate(${edgeShift(hoveredPercent)}, -100%)`,
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
        {labelIndexes.map((index) => {
          const percent = (points[index].x / width) * 100;
          return (
            <span
              key={days[index].key}
              className={styles.lineChartLabel}
              style={{ left: `${percent}%`, transform: `translateX(${edgeShift(percent)})` }}
            >
              {days[index].label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
