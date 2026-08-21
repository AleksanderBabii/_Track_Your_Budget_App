using TrackBudget.Domain.Entities;
using TrackBudget.Domain.Enums;

namespace TrackBudget.Application.Interfaces.Repositories;

public interface ITransactionRepository
{
    Task<List<Transaction>> GetAllByUserIdAsync(
        Guid userId, 
        CancellationToken cancellationToken = default);

    Task<Transaction?> GetByIdAsync(
        Guid transactionId, 
        Guid userId, 
        CancellationToken cancellationToken = default);
        
    Task AddAsync(
        Transaction transaction, 
        CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(
        Guid userId,
        Guid accountId,
        DateTime date,
        decimal amount,
        TransactionType type,
        string title,
        CancellationToken cancellationToken = default
    );

    void Remove(Transaction transaction);

}