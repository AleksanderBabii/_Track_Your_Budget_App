namespace TrackBudget.Application.DTOs.Reports
{
    public class ReportMonthlyDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
    }
}