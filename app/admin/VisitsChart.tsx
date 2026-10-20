"use client";

import { useState, type PointerEvent } from "react";
import styles from "./admin.module.css";
import LineChart from "./LineChart";
import { edgeShift, getAxisLabelIndexes, type Day } from "./chartAxis";

export default function VisitsChart({
  days,
  maxDailyCount,
  title,
}: {
  days: Day[];
  maxDailyCount: number;
  title: string;
}) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [shownTitle, setShownTitle] = useState(title);

  // A new period swaps the data under the cursor, so drop the stale tooltip.
  if (title !== shownTitle) {
    setShownTitle(title);
    setHoverIndex(null);
  }

  const hovered = hoverIndex !== null ? days[hoverIndex] : null;
  const columnPercent = (index: number) => ((index + 0.5) / days.length) * 100;
  const hoveredPercent = hoverIndex !== null ? columnPercent(hoverIndex) : 0;
  const labelIndexes = getAxisLabelIndexes(days.length);

  function handlePointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const index = Math.floor(((event.clientX - rect.left) / rect.width) * days.length);
    setHoverIndex(Math.min(days.length - 1, Math.max(0, index)));
  }

  function selectChart(type: "line" | "bar") {
    setChartType(type);
    setHoverIndex(null);
  }

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>{title}</h2>
        <div className={styles.chartToggle} role="group" aria-label="Type de graphique">
          <button
            type="button"
            className={`${styles.chartToggleBtn} ${
              chartType === "line" ? styles.chartToggleBtnActive : ""
            }`}
            aria-pressed={chartType === "line"}
            onClick={() => selectChart("line")}
          >
            Courbe
          </button>
          <button
            type="button"
            className={`${styles.chartToggleBtn} ${
              chartType === "bar" ? styles.chartToggleBtnActive : ""
            }`}
            aria-pressed={chartType === "bar"}
            onClick={() => selectChart("bar")}
          >
            Barres
          </button>
        </div>
      </div>

      {chartType === "line" ? (
        <LineChart
          key={title}
          days={days}
          maxDailyCount={maxDailyCount}
          width={400}
          height={110}
          gradientId="visitsLineFill"
          unitLabel="vue"
          ariaLabel={title}
        />
      ) : (
        <div>
          <div className={styles.barChartWrap}>
            <div
              className={styles.barChart}
              onPointerDown={handlePointer}
              onPointerMove={handlePointer}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setHoverIndex(null);
              }}
            >
              {days.map((day, index) => (
                <div
                  key={day.key}
                  className={`${styles.barColumn} ${
                    index === hoverIndex ? styles.barColumnActive : ""
                  }`}
                >
                  <div
                    className={styles.bar}
                    style={{ height: `${(day.count / maxDailyCount) * 100}%` }}
                    aria-label={`${day.label} : ${day.count} vue${day.count > 1 ? "s" : ""}`}
                  />
                </div>
              ))}
            </div>
            {hovered && (
              <div
                className={styles.chartTooltip}
                style={{
                  left: `${hoveredPercent}%`,
                  top: `${(1 - hovered.count / maxDailyCount) * 100}%`,
                  transform: `translate(${edgeShift(hoveredPercent)}, -100%)`,
                }}
              >
                <span className={styles.chartTooltipValue}>
                  {hovered.count} vue{hovered.count > 1 ? "s" : ""}
                </span>
                <span className={styles.chartTooltipLabel}>{hovered.label}</span>
              </div>
            )}
          </div>
          <div className={styles.lineChartLabels}>
            {labelIndexes.map((index) => {
              const percent = columnPercent(index);
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
      )}
    </section>
  );
}
