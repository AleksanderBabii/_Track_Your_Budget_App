import { api } from "./axios";
import type { DashboardAnalytics } from "../types/dashboardAnalytics";

export const getDashboardAnalytics = async (): Promise<DashboardAnalytics> => {
    const response = await api.get<DashboardAnalytics>("/dashboard/analytics");
    return response.data;
};