namespace TrackBudget.Application.DTOs.Reports;

public class ReportDto
{
    public DateTime From { get; set; }
    public DateTime To { get; set; }
    public ReportSummaryDto Summary { get; set; } = new();
    public List<ReportCategoryDto> ExpensesByCategory { get; set; } = new();
    public List<ReportCategoryDto> IncomeByCategory { get; set; } = new();
    public List<ReportMonthlyDto> MonthlyReports { get; set; } = new();
    public List<ReportTransferDto> Transfers { get; set; } = new();
}