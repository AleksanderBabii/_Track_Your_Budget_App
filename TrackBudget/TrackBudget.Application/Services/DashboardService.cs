using MapsterMapper;
using TrackBudget.Application.DTOs.Transactions;
using TrackBudget.Application.DTOs.Dashboard;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Domain.Entities;
using TrackBudget.Domain.Enums;


namespace TrackBudget.Application.Services;

public class DashboardService(
    IAccountRepository accountRepository,
    ITransactionRepository transactionRepository,
    ICategoryRepository categoryRepository,
    IMapper mapper
) : IDashboardService
{
    private static decimal CalculateMonthlyAmount(
        IEnumerable<Transaction> transactions,
        TransactionType transactionType,
        int month,
        int year
    )
    {
        return transactions
            .Where(t => t.Type == transactionType &&
             t.Date.Month == month &&
             t.Date.Year == year)
            .Sum(t => t.Amount);
    }
    private static decimal CalculateTotalBalance(IEnumerable<Account> accounts)
    {
        return accounts.Sum(a => a.Balance);
    }
    private static decimal CalculateMonthlyIncome(IEnumerable<Transaction> transactions)
    {
        var now = DateTime.UtcNow;

        return CalculateMonthlyAmount(
            transactions,
            TransactionType.Income,
            now.Month,
            now.Year
        );
    }
    private static decimal CalculateMonthlyExpenses(IEnumerable<Transaction> transactions)
    {
        var now = DateTime.UtcNow;

        return CalculateMonthlyAmount(
            transactions,
            TransactionType.Expense,
            now.Month,
            now.Year
        );
    }
    private List<TransactionDto> GetRecentTransactions(IEnumerable<Transaction> transactions)
    {
        var recentTransactions = transactions
            .OrderByDescending(t => t.Date)
            .ThenByDescending(t => t.CreatedAt)
            .Take(5)
            .ToList();

            return mapper.Map<List<TransactionDto>>(recentTransactions);
    }

    public async Task<DashboardDto> GetDashboardDataAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        var accounts = await accountRepository.GetAllByUserIdAsync(
            userId,
            cancellationToken
        );

        var allTransactions = await transactionRepository.GetAllByUserIdAsync(
            userId,
            cancellationToken
        );

        var categories = await categoryRepository.GetAllByUserIdAsync(
            userId,
            cancellationToken
        );

        var totalBalance = CalculateTotalBalance(accounts);
        var monthlyIncome = CalculateMonthlyIncome(allTransactions);
        var monthlyExpenses = CalculateMonthlyExpenses(allTransactions);
        var recentTransactions = GetRecentTransactions(allTransactions);

        return new DashboardDto
        {
            AccountsCount = accounts.Count,
            CategoriesCount = categories.Count,
            TransactionsCount = allTransactions.Count,
            TotalBalance = totalBalance,
            MonthlyIncome = monthlyIncome,
            MonthlyExpenses = monthlyExpenses,
            MonthlySavings = monthlyIncome - monthlyExpenses,
            RecentTransactions = recentTransactions
        };
    }
}