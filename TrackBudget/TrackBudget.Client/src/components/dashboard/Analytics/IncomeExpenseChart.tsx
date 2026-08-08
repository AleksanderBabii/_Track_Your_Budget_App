import styles from "./IncomeExpenseChart.module.scss";

interface IncomeExpensePoint {
  month: string;
  income: number;
  expenses: number;
}

interface IncomeExpenseChartProps {
  data: IncomeExpensePoint[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [item.income, item.expenses])
  );

  const width = 560;
  const height = 220;
  const topPadding = 16;
  const bottomPadding = 36;
  const sidePadding = 20;
  const plotHeight = height - topPadding - bottomPadding;
  const groupWidth =
    data.length > 0 ? (width - sidePadding * 2) / data.length : 0;
  const singleBarWidth = Math.max(10, groupWidth * 0.32);

  return (
    <div className={styles.chartRoot}>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.incomeDot}`} /> Income
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.expenseDot}`} /> Expenses
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.chartSvg}
        aria-label="Income vs expenses bar chart"
      >
        <line
          x1={sidePadding}
          y1={height - bottomPadding}
          x2={width - sidePadding}
          y2={height - bottomPadding}
          className={styles.axis}
        />

        {data.map((point, index) => {
          const incomeHeight = (point.income / maxValue) * plotHeight;
          const expenseHeight = (point.expenses / maxValue) * plotHeight;
          const groupX = sidePadding + groupWidth * index;
          const groupCenter = groupX + groupWidth / 2;
          const incomeX = groupCenter - singleBarWidth - 2;
          const expenseX = groupCenter + 2;
          const baseY = height - bottomPadding;

          return (
            <g key={point.month}>
              <rect
                x={incomeX}
                y={baseY - incomeHeight}
                width={singleBarWidth}
                height={Math.max(2, incomeHeight)}
                rx={5}
                ry={5}
                className={styles.incomeBar}
              >
                <title>{`Income: ${point.income.toLocaleString()}`}</title>
              </rect>

              <rect
                x={expenseX}
                y={baseY - expenseHeight}
                width={singleBarWidth}
                height={Math.max(2, expenseHeight)}
                rx={5}
                ry={5}
                className={styles.expenseBar}
              >
                <title>{`Expenses: ${point.expenses.toLocaleString()}`}</title>
              </rect>

              <text x={groupCenter} y={height - 10} className={styles.barGroupLabel}>
                {point.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
