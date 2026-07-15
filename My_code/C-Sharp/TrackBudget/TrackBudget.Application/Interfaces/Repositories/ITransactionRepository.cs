using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Interfaces.Repositories;

public interface ITransactionRepository
{
    Task<List<Transaction>> GetAllByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<Transaction?> GetByIdAsync(Guid transactionId, Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(Transaction transaction, CancellationToken cancellationToken = default);

    void Remove(Transaction transaction);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}