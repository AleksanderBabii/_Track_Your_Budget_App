using TrackBudget.Application.DTOs.Transactions;

namespace TrackBudget.Application.Interfaces.Services;

public interface ITransactionService
{
    Task<IReadOnlyCollection<TransactionDto>> GetAllAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<TransactionDto> GetByIdAsync(Guid transactionId, Guid userId, CancellationToken cancellationToken = default);

    Task<TransactionDto> CreateAsync(Guid userId, CreateTransactionDto createTransactionDto, CancellationToken cancellationToken = default);

    Task<TransactionDto> UpdateAsync(Guid transactionId, Guid userId, UpdateTransactionDto updateTransactionDto, CancellationToken cancellationToken = default);

    Task DeleteAsync(Guid transactionId, Guid userId, CancellationToken cancellationToken = default);
}