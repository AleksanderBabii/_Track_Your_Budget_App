import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ReportMonthly } from "../../../types/report";

import { ErrorState } from "../../common/ErrorState/ErrorState";

import styles from "./MonthlyReportChart.module.scss";

interface MonthlyReportChartProps {
  data: ReportMonthly[];
  currency?: string | null;
}

export function MonthlyReportChart({
  data,
  currency,
}: MonthlyReportChartProps) {
  const formatAmount = (amount: number) => {
    if (!currency) {
      return amount.toFixed(2);
    }

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  };

  if (!data || data.length === 0) {
    return <ErrorState message="No data available for the selected period." />;
  }

  return (
    <div className={styles.monthlyContainer}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => formatAmount(Number(value))} />
          <Legend />
          <Bar dataKey="totalIncome" fill="#82ca9d" name="Income" />
          <Bar dataKey="totalExpenses" fill="#8884d8" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
