import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

import type { IncomeExpenseAnalytics } from "../../../../types/dashboardAnalytics";

interface IncomeExpenseChartProps {
    data: IncomeExpenseAnalytics[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#8884d8" />
                <Bar dataKey="expenses" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
}