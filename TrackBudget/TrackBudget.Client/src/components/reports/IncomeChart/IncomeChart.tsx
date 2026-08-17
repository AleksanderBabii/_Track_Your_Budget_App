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

import styles from "./IncomeChart.module.scss";

interface IncomeChartProps {
  data: ReportCategory[];
  currency?: string | null;
}

const COLORS = [
  "#22c55e",
  "#6366f1",
  "#06b6d4",
  "#84cc16",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export function IncomeChart({ data, currency }: IncomeChartProps) {

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
        message=" No income recorded for this period. "
        description=" try again later. "
      />
    );
  }

  return (
    <div className={styles.incomeContainer}>
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
                key={`income-cell-${index}`}
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
