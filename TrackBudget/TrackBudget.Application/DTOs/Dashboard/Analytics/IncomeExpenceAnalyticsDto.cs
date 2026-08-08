namespace TrackBudget.Application.DTOs.Dashboard.Analytics;

public class IncomeExpenseAnalyticsDto
{
    public decimal Income { get; set; }
    public decimal Expenses { get; set; }
    public string Month { get; set; } = string.Empty;
}