import styles from "./ExpenseCategoryChart.module.scss";

interface ExpenseCategoryPoint {
  category: string;
  total: number;
}

interface ExpenseCategoryChartProps {
  data: ExpenseCategoryPoint[];
}

const COLOR_COUNT = 6;

function toPoint(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = toPoint(cx, cy, radius, endAngle);
  const end = toPoint(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export function ExpenseCategoryChart({ data }: ExpenseCategoryChartProps) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  const arcState = data.reduce(
    (acc, item, index) => {
      const previousEndAngle = acc.endAngle;
      const sweep = total > 0 ? (item.total / total) * 360 : 0;
      const startAngle = previousEndAngle;
      const endAngle = previousEndAngle + sweep;

      acc.arcs.push({
        ...item,
        colorClass: styles[`c${index % COLOR_COUNT}` as keyof typeof styles],
        path: describeArc(120, 120, 84, startAngle, endAngle),
      });

      return {
        endAngle,
        arcs: acc.arcs,
      };
    },
    { endAngle: 0, arcs: [] as Array<ExpenseCategoryPoint & { colorClass: string; path: string }> }
  );

  const arcs = arcState.arcs;

  return (
    <div className={styles.chartRoot}>
      <svg viewBox="0 0 240 240" className={styles.donut} aria-label="Expense category donut chart">
        <circle cx="120" cy="120" r="84" className={styles.baseRing} />
        {arcs.map((arc) => (
          <path
            key={arc.category}
            d={arc.path}
            className={`${styles.arc} ${arc.colorClass}`}
          />
        ))}
      </svg>

      <div className={styles.legend}>
        {arcs.map((arc) => {
          const percentage = total > 0 ? Math.round((arc.total / total) * 100) : 0;
          return (
            <div key={arc.category} className={styles.legendRow}>
              <span className={styles.legendCategory}>
                <span className={`${styles.legendDot} ${arc.colorClass}`} />
                <span className={styles.categoryText}>{arc.category}</span>
              </span>
              <strong className={styles.percentage}>{percentage}%</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}
