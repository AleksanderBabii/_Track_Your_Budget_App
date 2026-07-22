using TrackBudget.Domain.Entities;

namespace TrackBudget.Application.Interfaces.Repositories;

public interface ITransferRepository
{
    Task<List<Transfer>> GetAllByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );

    Task<Transfer?> GetByIdAsync(
        Guid transferId,
        Guid userId,
        CancellationToken cancellationToken = default
    );

    Task AddAsync(
        Transfer transfer,
        CancellationToken cancellationToken = default
    );

}