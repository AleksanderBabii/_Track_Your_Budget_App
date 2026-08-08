namespace TrackBudget.Application.DTOs.Dashboard.Analytics;

public class MonthlyBalanceAnalyticsDto
{
    public string Date { get; set; } = string.Empty;
    public decimal Balance { get; set; }
}