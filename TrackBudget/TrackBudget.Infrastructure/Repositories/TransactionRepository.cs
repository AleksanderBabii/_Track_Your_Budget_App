using Microsoft.EntityFrameworkCore;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Domain.Entities;
using TrackBudget.Infrastructure.Data;

namespace TrackBudget.Infrastructure.Repositories;

public class TransactionRepository(AppDbContext context) : ITransactionRepository
{
    private readonly AppDbContext _dbContext = context;

    public Task<List<Transaction>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Transactions
            .AsNoTracking()
            .Include(transaction => transaction.Account)
            .Include(transaction => transaction.Category)
            .Where(transaction => transaction.UserId == userId)
            .OrderByDescending(transaction => transaction.Date)
            .ThenByDescending(transaction => transaction.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task<Transaction?> GetByIdAsync(
        Guid transactionId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Transactions
            .AsNoTracking()
            .Include(transaction => transaction.Account)
            .Include(transaction => transaction.Category)
            .SingleOrDefaultAsync(
                transaction =>
                    transaction.Id == transactionId &&
                    transaction.UserId == userId,
                cancellationToken
            );
    }

    public async Task AddAsync(
        Transaction transaction,
        CancellationToken cancellationToken = default
    )
    {
        await _dbContext.Transactions.AddAsync(transaction, cancellationToken);
    }

    public void Remove(Transaction transaction)
    {
        _dbContext.Transactions.Remove(transaction);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}