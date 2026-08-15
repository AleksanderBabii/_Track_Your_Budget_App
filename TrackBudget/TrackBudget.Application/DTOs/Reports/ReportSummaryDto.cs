namespace TrackBudget.Application.DTOs.Reports;

public class ReportSummaryDto
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal NetIncome => TotalIncome - TotalExpense;
    public int TransactionsCount { get; set; }
    public decimal TotalTransfers { get; set; }
    public int TransfersCount { get; set; }

}