import styles from "./MonthlyBalanceChart.module.scss";

interface MonthlyBalancePoint {
  month: string;
  balance: number;
}

interface MonthlyBalanceChartProps {
  data: MonthlyBalancePoint[];
}

export function MonthlyBalanceChart({ data }: MonthlyBalanceChartProps) {
  const width = 560;
  const height = 220;
  const padding = 20;
  const max = Math.max(...data.map((d) => d.balance), 0);
  const min = Math.min(...data.map((d) => d.balance), 0);
  const range = Math.max(1, max - min);

  const points = data.map((point, index) => {
    const x =
      data.length <= 1
        ? width / 2
        : padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = padding + ((max - point.balance) / range) * (height - padding * 2);
    return { ...point, x, y };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className={styles.chartRoot}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg} aria-label="Monthly balance line chart">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className={styles.axis} />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} className={styles.axis} />
        <polyline points={polyline} className={styles.line} />
        {points.map((point) => (
          <circle key={point.month} cx={point.x} cy={point.y} r="3.5" className={styles.point} />
        ))}
      </svg>

      <div className={styles.labels}>
        {points.map((point) => (
          <span key={`${point.month}-label`} className={styles.label}>
            {point.month}
          </span>
        ))}
      </div>
    </div>
  );
}
