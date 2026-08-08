using TrackBudget.Application.DTOs.Dashboard.Analytics;

namespace TrackBudget.Application.DTOs.Dashboard;

public class DashboardAnalyticsDto
{
    public List<IncomeExpenseAnalyticsDto> IncomeExpenseAnalytics { get; set; } = new();
    public List<CategoryAnalyticsDto> CategoryAnalytics { get; set; } = new();
    public List<MonthlyBalanceAnalyticsDto> MonthlyBalanceAnalytics { get; set; } = new();
}