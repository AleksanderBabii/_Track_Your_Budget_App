namespace TrackBudget.Application.DTOs.Reports;

public class ReportCategoryDto
{
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public int TransactionsCount { get; set; }
}