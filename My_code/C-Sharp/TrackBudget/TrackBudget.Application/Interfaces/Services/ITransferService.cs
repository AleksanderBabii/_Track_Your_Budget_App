using TrackBudget.Application.DTOs.Transfers;

namespace TrackBudget.Application.Interfaces.Services;

public interface ITransferService
{
    Task<IReadOnlyCollection<TransferDto>> GetAllAsync(
        Guid userId,
        CancellationToken cancellationToken = default
    );

    Task<TransferDto> GetByIdAsync(
        Guid transferId,
        Guid userId,
        CancellationToken cancellationToken = default
    );

    Task<TransferDto> CreateAsync(
        Guid userId,
        CreateTransferDto dto,
        CancellationToken cancellationToken = default
    );
}