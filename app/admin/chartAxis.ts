export type Day = { key: string; label: string; count: number };

// Indexes of the days whose date is shown under a chart: the first, the last,
// and one every N in between, so labels never overlap however long the range.
export function getAxisLabelIndexes(count: number, maxLabels = 6): number[] {
  if (count <= maxLabels) return Array.from({ length: count }, (_, index) => index);

  const step = Math.ceil((count - 1) / (maxLabels - 1));
  const indexes: number[] = [];
  for (let index = 0; index < count - 1; index += step) indexes.push(index);
  if (count - 1 - indexes[indexes.length - 1] < step / 2) indexes.pop();
  indexes.push(count - 1);
  return indexes;
}

// Keeps a tooltip or label at the chart edges from overflowing the card.
export function edgeShift(percent: number) {
  if (percent < 15) return "0%";
  if (percent > 85) return "-100%";
  return "-50%";
}
