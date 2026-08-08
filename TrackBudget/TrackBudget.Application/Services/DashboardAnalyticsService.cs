using TrackBudget.Domain.Entities;
using TrackBudget.Application.DTOs.Dashboard.Analytics;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Application.DTOs.Dashboard;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.Services;

public class DashboardAnalyticsService(ITransactionRepository transactionRepository) : IDashboardAnalyticsService
{
    public async Task<DashboardAnalyticsDto> GetDashboardAnalyticsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var transactions = await transactionRepository.GetAllByUserIdAsync(userId, cancellationToken);

        return new DashboardAnalyticsDto
        {
            IncomeExpenseAnalytics = CalculateIncomeExpenseAnalytics(transactions),

            CategoryAnalytics = CalculateCategoryAnalytics(transactions),

            MonthlyBalanceAnalytics = CalculateMonthlyBalanceAnalytics(transactions)
        };
    }

    private static List<IncomeExpenseAnalyticsDto> CalculateIncomeExpenseAnalytics(List<Transaction> transactions)
    {
        return
        [
            .. transactions
            .GroupBy(t => t.Date.ToString("yyyy-MM"))
            .OrderBy(g => g.Key)
            .Select(g => new IncomeExpenseAnalyticsDto
            {
                Month = g.Key,
                Income = g.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount),
                Expenses = g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount)
            })
        ];
    }

    private static List<CategoryAnalyticsDto> CalculateCategoryAnalytics(List<Transaction> transactions)
    {
        return
        [
            .. transactions
            .Where(t => t.Type == TransactionType.Expense)
            .GroupBy(t => t.Category.Name)
            .OrderByDescending(g => g.Sum(t => t.Amount))
            .Select(g => new CategoryAnalyticsDto
            {
                Category = string.IsNullOrWhiteSpace(g.Key) ? "Uncategorized" : g.Key,
                Total = g.Sum(t => t.Amount)
            })
        ];
    }

    private static List<MonthlyBalanceAnalyticsDto> CalculateMonthlyBalanceAnalytics(List<Transaction> transactions)
    {
        return
        [
            .. transactions
            .GroupBy(t => t.Date.ToString("yyyy-MM"))
            .OrderBy(g => g.Key)
            .Select(g => new MonthlyBalanceAnalyticsDto
            {
                Date = g.Key,
                Balance =
                    g.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount) -
                    g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount)
            })
        ];
    }
   
}