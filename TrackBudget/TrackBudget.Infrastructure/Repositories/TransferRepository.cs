using Microsoft.EntityFrameworkCore;
using TrackBudget.Application.Interfaces.Repositories;
using TrackBudget.Domain.Entities;
using TrackBudget.Infrastructure.Data;

namespace TrackBudget.Infrastructure.Repositories;

public class TransferRepository(AppDbContext context ) : ITransferRepository
{
    private readonly AppDbContext _dbContext = context;

    public Task<List<Transfer>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Transfers
            .AsNoTracking()
            .Include(transfer => transfer.FromAccount)
            .Include(transfer => transfer.ToAccount)
            .Where(transfer => transfer.UserId == userId)
            .OrderByDescending(transfer => transfer.Date)
            .ThenByDescending(transfer => transfer.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task<Transfer?> GetByIdAsync(
        Guid transferId,
        Guid userId,
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.Transfers
            .AsNoTracking()
            .Include(transfer => transfer.FromAccount)
            .Include(transfer => transfer.ToAccount)
            .SingleOrDefaultAsync(
                transfer =>
                    transfer.Id == transferId &&
                    transfer.UserId == userId,
                cancellationToken
            );
    }

    public async Task AddAsync(
        Transfer transfer,
        CancellationToken cancellationToken = default
    )
    {
        await _dbContext.Transfers.AddAsync(
            transfer,
            cancellationToken
        );
    }

    public Task SaveChangesAsync(
        CancellationToken cancellationToken = default
    )
    {
        return _dbContext.SaveChangesAsync(cancellationToken);
    }
}