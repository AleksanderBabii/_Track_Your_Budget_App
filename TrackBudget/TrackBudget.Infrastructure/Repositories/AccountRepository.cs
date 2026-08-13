using Microsoft.EntityFrameworkCore;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Domain.Entities;
using TrackBudget.Infrastructure.Data;

namespace TrackBudget.Infrastructure.Repositories;

public class AccountRepository(AppDbContext context) : IAccountRepository
{
    private readonly AppDbContext _dbContext = context;

    public Task<List<Account>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Accounts
            .AsNoTracking()
            .Where(account => account.UserId == userId)
            .OrderByDescending(account => account.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task<Account?> GetByIdAsync(
        Guid accountId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Accounts
            .AsNoTracking()
            .SingleOrDefaultAsync(
                account =>
                    account.Id == accountId &&
                    account.UserId == userId,
                cancellationToken
            );
    }

    public Task<Account?> GetTrackedByIdAsync(
        Guid accountId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Accounts
            .SingleOrDefaultAsync(
                account =>
                    account.Id == accountId &&
                    account.UserId == userId,
                cancellationToken
            );
    }

    public async Task AddAsync(
        Account account,
        CancellationToken cancellationToken = default
    )
    {
        await _dbContext.Accounts.AddAsync(
            account,
            cancellationToken
        );
    }

    public void Remove(Account account, CancellationToken cancellationToken = default)
    {
        _dbContext.Accounts.Remove(account);
    }

    public Task SaveChangesAsync(
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<bool> ExistsAsync(
        Guid accountId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Accounts
            .AnyAsync(
                account =>
                    account.Id == accountId &&
                    account.UserId == userId,
                cancellationToken
            );
    }
}