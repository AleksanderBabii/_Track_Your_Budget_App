import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import type { ReportCategory } from "../../../types/report";

import { ErrorState } from "../../../components/common/ErrorState/ErrorState";

import styles from "./ExpenseChart.module.scss";

interface ExpenseChartProps {
  data: ReportCategory[];
  currency?: string | null;
}

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

export function ExpenseChart({ data, currency }: ExpenseChartProps) {
  
  const formatAmount = (amount: number) => {
    if (!currency) {
      return amount.toFixed(2);
    }

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  };

  const chartData = data.map((category) => ({
    name: category.categoryName,
    value: category.amount,
  }));

  if (chartData.length === 0) {
    return (
      <ErrorState
        message=" No Expenses recorded for this period."
        description=" Try again later."
      />
    );
  }
  return (
    <div className={styles.expenseContainer}>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            innerRadius="45%"
            paddingAngle={2}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`expense-cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip formatter={(value) => formatAmount(Number(value))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
