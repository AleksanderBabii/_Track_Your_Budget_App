using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Interfaces.Repositories;

public interface IAccountRepository
{
    Task<List<Account>> GetAllByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<Account?> GetByIdAsync(Guid accountId, Guid userId, CancellationToken cancellationToken = default);

    Task<Account?> GetTrackedByIdAsync(Guid accountId, Guid userId, CancellationToken cancellationToken = default);
    
    Task AddAsync(Account account, CancellationToken cancellationToken = default);

    void Remove(Account account, CancellationToken cancellationToken = default);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(Guid accountId, Guid userId, CancellationToken cancellationToken = default);
}