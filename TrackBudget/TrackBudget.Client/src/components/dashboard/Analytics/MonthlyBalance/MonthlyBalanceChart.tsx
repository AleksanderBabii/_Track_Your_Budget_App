import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

import type { MonthlyBalanceAnalytics } from "../../../../types/dashboardAnalytics";

interface MonthlyBalanceChartProps {
    data: MonthlyBalanceAnalytics[];
}

export function MonthlyBalanceChart({ data }: MonthlyBalanceChartProps) {
    return (
        <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
                <Line type="monotone" dataKey="balance" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    );
}
