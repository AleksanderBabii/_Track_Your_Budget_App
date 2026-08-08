import {useQuery} from "@tanstack/react-query";

import {getDashboardAnalytics} from "../../api/dashboardAnalyticsApi";
import {getDashboardAnalyticsKeys} from "./dashboardAnalyticsKeys";

export function useDashboardAnalytics() {
    return useQuery({
        queryKey: getDashboardAnalyticsKeys.all,
        queryFn: getDashboardAnalytics,
    });
}