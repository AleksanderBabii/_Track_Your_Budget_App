using TrackBudget.Application.DTOs.Reports;
using TrackBudget.Application.Interfaces.Persistence;
using TrackBudget.Application.Interfaces.Services;
using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.Services;

public class ReportService(
    IUnitOfWork unitOfWork
) : IReportService
{
    public async Task<ReportDto> GetReportAsync(Guid userId, DateTime from, DateTime to, CancellationToken cancellationToken = default)
    {
        if (from > to)
        {
            throw new ArgumentException("The 'from' date must be earlier than or equal to the 'to' date.");
        }
        var transactions = await unitOfWork.TransactionRepository
            .GetAllByUserIdAsync(userId, cancellationToken);

        var transfers = await unitOfWork.TransferRepository
            .GetAllByUserIdAsync(userId, cancellationToken);

        var filteredTransactions = transactions
            .Where(t => t.Date >= from && t.Date <= to)
            .ToList();

        var filteredTransfers = transfers
            .Where(t => t.Date >= from && t.Date <= to)
            .ToList();

        var totalIncome = filteredTransactions
            .Where(t => t.Type == TransactionType.Income)
            .Sum(t => t.Amount);

        var totalExpenses = filteredTransactions
            .Where(t => t.Type == TransactionType.Expense)
            .Sum(t => t.Amount);

        var summary = new ReportSummaryDto
        {
            TotalIncome = totalIncome,
            TotalExpense = totalExpenses,
            TransactionsCount = filteredTransactions.Count,
            TotalTransfers = filteredTransfers.Sum(t => t.Amount),
            TransfersCount = filteredTransfers.Count
        };

            var expensesByCategory = filteredTransactions
            .Where(t => t.Type == TransactionType.Expense)
            .GroupBy(t => new { t.CategoryId, CategoryName = t.Category.Name })
            .Select(g => new ReportCategoryDto
            {
                CategoryId = g.Key.CategoryId,
                CategoryName = g.Key.CategoryName,
                Amount = g.Sum(t => t.Amount),
                TransactionsCount = g.Count()
            })
            .OrderByDescending(r => r.Amount)
            .ToList();

            var incomeByCategory = filteredTransactions
            .Where(t => t.Type == TransactionType.Income)
            .GroupBy(t => new { t.CategoryId, CategoryName = t.Category.Name })
            .Select(g => new ReportCategoryDto
            {
                CategoryId = g.Key.CategoryId,
                CategoryName = g.Key.CategoryName,
                Amount = g.Sum(t => t.Amount),
                TransactionsCount = g.Count()
            })
            .OrderByDescending(r => r.Amount)
            .ToList();

            var reportTransfers = filteredTransfers
            .OrderByDescending(t => t.Date)
            .ThenByDescending(t => t.Id)
            .Select(t => new ReportTransferDto
            {
                TransferId = t.Id,
                Amount = t.Amount,
                Date = t.Date,
                Notes = t.Notes,
                FromAccountId = t.FromAccountId,
                FromAccountName = t.FromAccount.Name,
                ToAccountId = t.ToAccountId,
                ToAccountName = t.ToAccount.Name
            })
            .ToList();

        return new ReportDto
        {
            From = from,
            To = to,
            Summary = summary,
            ExpensesByCategory = expensesByCategory,
            IncomeByCategory = incomeByCategory,
            Transfers = reportTransfers
        };
    }
}