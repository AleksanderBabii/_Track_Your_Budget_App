using TrackBudget.Application.DTOs.Transactions;

namespace TrackBudget.Application.DTOs.Dashboard;

public class DashboardDto
{
    public int AccountsCount { get; set; }
    public int CategoriesCount { get; set; }
    public int TransactionsCount { get; set; }
    public decimal TotalBalance { get; set; }
    public decimal MonthlyIncome { get; set; }
    public decimal MonthlyExpenses { get; set; }
    public decimal MonthlySavings { get; set; }
    public List<TransactionDto> RecentTransactions { get; set; } = new();
}